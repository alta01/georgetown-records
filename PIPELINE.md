# Georgetown KY Public Records — Data Pipeline & Developer Reference

> **Audience:** Developers deploying or maintaining the live data pipeline.  
> This document is intentionally **not linked** from the public-facing app.

---

## Architecture Overview

```
georgetownky.gov/AgendaCenter/RSS?CID=N
          │
          ▼ (every 30 min)
┌─────────────────────────────┐
│  Cloudflare Worker          │  ← src/worker.js
│  ┌──────────────────────┐   │
│  │ RSS Fetch & Dedup    │   │  KV: seen GUIDs (1-yr TTL)
│  │ XML → Structured Rec │   │
│  │ AI Summarizer (opt.) │   │  Haiku: ~$0.001/meeting
│  │ Enrichment Stage     │   │
│  └──────────────────────┘   │
│           │                 │
│           ▼                 │
│      R2: new-records.json   │  served via Worker HTTP
└─────────────────────────────┘
          │
          ▼ (page load)
 index.html  ←  loadPipeline()  →  merges + re-indexes
```

---

## Cloudflare Worker Setup

### wrangler.toml

```toml
name = "gtky-pipeline"
main = "src/worker.js"
compatibility_date = "2024-01-01"

[[triggers.crons]]
crons = ["*/30 * * * *", "0 * * * *"]

[[kv_namespaces]]
binding = "KV"
id = "YOUR_KV_NAMESPACE_ID"

[[r2_buckets]]
binding = "R2"
bucket_name = "gtky-records"

[vars]
# Set secrets via: wrangler secret put ANTHROPIC_KEY
# Never commit API keys to config files
```

### Deployment Steps

```bash
npm install -g wrangler
wrangler login
wrangler kv:namespace create KV
wrangler r2 bucket create gtky-records
wrangler secret put ANTHROPIC_KEY     # optional — enables AI summaries
wrangler deploy
```

After deployment, replace `R2_URL` in `index.html`:

```js
const R2_URL = 'https://YOUR-WORKER.workers.dev/records';
```

---

## RSS Feed Sources

RSS feed listing: `https://www.georgetownky.gov/rss.aspx#agendaCenter`

| CID | Committee | Cadence |
|-----|-----------|---------|
| 1 | City Council | 2×/month |
| 2 | Finance | Monthly |
| 3 | Fire | Monthly |
| 4 | Traffic | Monthly |
| 5 | Police | Monthly |
| 6 | Public Works | Monthly |
| 7 | Interlocal | Quarterly |
| 10 | Miscellaneous | As needed |

Base URL: `https://www.georgetownky.gov/AgendaCenter/RSS?CID={N}`

---

## src/worker.js — Core Poller

```js
const FEEDS = [
  { cat: 'City Council',  cid: 1  },
  { cat: 'Finance',       cid: 2  },
  { cat: 'Fire',          cid: 3  },
  { cat: 'Traffic',       cid: 4  },
  { cat: 'Police',        cid: 5  },
  { cat: 'Public Works',  cid: 6  },
  { cat: 'Interlocal',    cid: 7  },
  { cat: 'Miscellaneous', cid: 10 },
];
const BASE = 'https://www.georgetownky.gov/AgendaCenter/RSS?CID=';

export default {
  async scheduled(event, env, ctx) {
    const newItems = [];
    for (const feed of FEEDS) {
      try {
        const res  = await fetch(BASE + feed.cid, { cf: { cacheEverything: false } });
        const xml  = await res.text();
        const items = parseRSS(xml, feed.cat);
        for (const item of items) {
          const key = 'seen:' + item.guid;
          if (await env.KV.get(key)) continue;
          await env.KV.put(key, '1', { expirationTtl: 31536000 });
          newItems.push({ ...item, freshness: 'Live', pipeline: true, fetchedAt: new Date().toISOString() });
        }
      } catch(e) { console.error(feed.cat, e); }
    }
    if (newItems.length > 0) {
      const obj    = await env.R2.get('new-records.json');
      const prev   = obj ? JSON.parse(await obj.text()) : [];
      const merged = [...newItems, ...prev].slice(0, 500);
      await env.R2.put('new-records.json', JSON.stringify(merged), {
        httpMetadata: { contentType: 'application/json', cacheControl: 'public,max-age=900' }
      });
      if (env.ANTHROPIC_KEY) ctx.waitUntil(summarizeNewItems(newItems, env));
    }
  },

  async fetch(request, env) {
    if (!request.url.includes('/records')) return new Response('Not found', { status: 404 });
    const obj = await env.R2.get('new-records.json');
    const body = obj ? await obj.text() : '[]';
    return new Response(body, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public,max-age=900' }
    });
  }
};
```

---

## XML → Structured Record Parser

```js
function parseRSS(xml, category) {
  const items = [];
  for (const [, block] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const get = tag => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
             || block.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`));
      return m ? m[1].trim() : '';
    };
    const pubDate = new Date(get('pubDate'));
    const MONTHS  = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    items.push({
      guid:     get('guid') || get('link'),
      title:    get('title'),
      sum:      get('description').replace(/<[^>]+>/g, '').trim().slice(0, 300),
      url:      get('link'),
      mo:       MONTHS[pubDate.getMonth()],
      dy:       String(pubDate.getDate()).padStart(2, '0'),
      yr:       String(pubDate.getFullYear()),
      type:     get('title').includes('Special') ? 'Special' : 'Regular',
      topics:   inferTopics(category),
      category,
    });
  }
  return items;
}

function inferTopics(cat) {
  return ({ 'City Council':['motion'], Finance:['finance','budget'], Fire:['fire'],
             Police:['police'], 'Public Works':['pw'], Traffic:['pw'] })[cat] || ['motion'];
}
```

---

## AI Minutes Summarizer (Phase 2 — Optional)

Requires `ANTHROPIC_KEY` secret set via `wrangler secret put`.  
Cost: ~$0.001 per meeting PDF.

```js
async function summarizeNewItems(items, env) {
  for (const item of items) {
    if (!item.url?.endsWith('.pdf')) continue;
    try {
      const pdfText  = await fetchAndExtractPDF(item.url);
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': env.ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001', max_tokens: 600,
          system: `Summarize this Georgetown KY city council meeting in JSON:
{"summary":"2-3 sentence overview","topics":["motion","finance"],"motions":[{"text":"...","result":"..."}],"amounts":["$X for Y"]}
Return raw JSON only.`,
          messages: [{ role: 'user', content: pdfText.slice(0, 8000) }]
        })
      });
      const data   = await response.json();
      const parsed = JSON.parse((data.content[0]?.text || '{}').replace(/```json|```/g, '').trim());
      item.sum         = parsed.summary || item.sum;
      item.topics      = parsed.topics  || item.topics;
      item.aiSummarized = true;
    } catch(e) { console.error('Summarizer:', e); }
  }
  await updateR2Records(items, env);
}
```

---

## Enrichment Stage (Phase 2 — Optional)

```js
// src/enricher.js
const SOURCES = [
  { name: 'City Minutes',   base: 'https://www.georgetownky.gov/AgendaCenter', priority: 1 },
  { name: 'City Directory', base: 'https://www.georgetownky.gov/Directory.aspx', priority: 1 },
  { name: 'Doc Center',     base: 'https://www.georgetownky.gov/DocumentCenter', priority: 1 },
  { name: 'Planning Comm.', base: 'https://www.gscplanning.com', priority: 2 },
  { name: 'Scott County',   base: 'https://scottky.gov', priority: 2 },
  { name: 'News-Graphic',   base: 'https://www.news-graphic.com', priority: 3 },
];

export async function enrichItem(item, env) {
  const sourceText   = await fetchSourceText(item.url);
  const officialCtx  = await buildOfficialContext(item, env);
  return callHaiku(item, sourceText, officialCtx, env);
}

async function callHaiku(item, sourceText, ctx, env) {
  const prompt = `Enrich this Georgetown KY public record entry.
Item: ${JSON.stringify({ date: item.date, title: item.title, text: item.sum })}
Source text: ${sourceText.slice(0, 3000)}
Context: ${ctx}

Return ONLY raw JSON:
{
  "summary": "2-4 sentence plain-English explanation for residents",
  "confidence": "high|medium|low",
  "sources_used": ["source name"],
  "accuracy_notes": "any discrepancies or empty string"
}
Rules: official sources override secondary; never invent facts; missing source = confidence low`;

  const res    = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': env.ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 400, messages: [{ role: 'user', content: prompt }] })
  });
  const data   = await res.json();
  const parsed = JSON.parse((data.content?.[0]?.text || '{}').replace(/```json|```/g, '').trim());
  return {
    summary:        parsed.summary        || item.sum,
    confidence:     parsed.confidence     || 'low',
    sources_used:   parsed.sources_used   || [],
    accuracy_notes: parsed.accuracy_notes || '',
    enriched:       true,
    enriched_at:    new Date().toISOString(),
  };
}
```

---

## Structured Store + RAG (Phase 3 — When Needed)

When records exceed ~500 entries or search precision needs improvement.

### Option A: Cloudflare D1 (SQLite, free tier)

```sql
CREATE TABLE meetings (
  id         TEXT PRIMARY KEY,
  title      TEXT,
  summary    TEXT,
  date       TEXT,
  year       INTEGER,
  topics     TEXT,        -- JSON array
  url        TEXT,
  ai_summary TEXT,
  created_at TEXT
);
-- Free: 5M row reads/day, 100K writes/day
```

### Option B: pgvector on Neon (semantic search, free tier)

```sql
CREATE EXTENSION vector;
CREATE TABLE chunks (
  id         SERIAL PRIMARY KEY,
  meeting_id TEXT,
  content    TEXT,
  embedding  vector(1536)   -- text-embedding-3-small
);
-- RAG query (cosine similarity)
SELECT content FROM chunks ORDER BY embedding <-> $1::vector LIMIT 5;
-- Cost: $0.02/1M tokens to embed
```

### Option C: Typesense Cloud (typo-tolerant full-text)

```
$10/mo → scales to 100k+ records
REST API + faceted filtering + typo tolerance built-in
```

---

## Confidence Scoring & Flagging

Every AI-enriched record carries a confidence level. The frontend can use this to display verification status badges.

```js
function confidenceBadge(item) {
  if (!item.enriched) return '';
  const map = {
    high:   { cls: 'gs-active',  label: '✓ Verified' },
    medium: { cls: 'gs-pending', label: '~ Cross-checked' },
    low:    { cls: 'gs-exhaust', label: '⚠ Unverified' },
  };
  const b    = map[item.confidence] || map.low;
  const srcs = (item.sources_used || []).join(', ');
  return `<span class="grant-status ${b.cls}" title="Sources: ${srcs}">${b.label}</span>`;
}
```

**Accuracy enforcement rules (in enricher prompt):**
1. Official government sources always override secondary sources
2. If sources conflict → note it in `accuracy_notes` and use the official version
3. Missing source text → `confidence: "low"`
4. Dollar amounts require official document confirmation
5. Vote results require meeting minutes confirmation

---

## PDF Archiving Worker

Prevents link rot if georgetownky.gov removes documents.

```js
// Daily cron job — separate from RSS poller
export async function archivePDFs(env) {
  const records = await getR2Records(env);
  for (const rec of records) {
    if (!rec.url?.includes('georgetownky.gov')) continue;
    const key = btoa(rec.url).replace(/[+/=]/g, c => c==='+'?'-':c==='/'?'_':'');
    const existing = await env.R2.head('archive/' + key);
    if (existing) continue;  // already archived
    try {
      const res = await fetch(rec.url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      await env.R2.put('archive/' + key, await res.arrayBuffer(), {
        httpMetadata: { contentType: res.headers.get('content-type') || 'application/pdf' }
      });
    } catch(e) { console.error('Archive failed:', rec.url, e.message); }
  }
}
```

Archive URL format: `https://YOUR-WORKER.workers.dev/archive/{base64url-encoded-original-url}`

---

## Cost Estimate (Monthly)

| Item | Cost |
|------|------|
| CF Pages / GitHub Pages hosting | $0.00 |
| CF R2 storage (<1 GB) | $0.00 |
| CF KV reads (10M/day free tier) | $0.00 |
| CF Worker requests (10M/mo free) | $0.00 |
| RSS polling (48×/day × 8 feeds) | $0.00 |
| PDF summarizer — 30 meetings/mo (Haiku) | ~$0.03 |
| Fact-check — 100 checks/day (Haiku) | ~$3.00 |
| Fact-check — 1,000 checks/day (Haiku) | ~$30.00 |
| **Total at launch scale** | **~$0–5/mo** |

---

## Silent Error Logging

The frontend app uses a ring-buffer logger (`_LOG`) that is completely invisible to end users. All errors are caught, timestamped, and stored in memory.

**Access in DevTools:**
```js
// Full log
window.gtky.log()
// or
window.__GTKY_LOG

// Last 20 entries
window.gtky.last(20)

// Enable console mirroring (development only)
window.__GTKY_DEBUG = true

// Clear log
window.gtky.clear()
```

**Log entry shape:**
```js
{
  t:   1234,          // ms since page load
  lvl: 'WARN',        // INFO | WARN | ERROR
  ctx: 'pipeline',    // originating function/module
  msg: 'Non-OK response',
  det: { status: 404, url: '...' }  // optional detail object
}
```

Functions wrapped with `_LOG.warn` in catch blocks:
`rebuildIndex`, `renderDir`, `renderMeet`, `renderPlan`, `renderVotes`, `renderOrds`,
`initCIPChart`, `goToMeeting`, `goToVote`, `goToOrdinance`, `goToElection`, `goToPerson`,
`openDrawer`, `updateElectionCountdown`, `lookupAddress`, `initSchoolCharts`,
`renderSchoolChart`, `toggleOrdRow`, `toggleEconItem`, `toggleRace`, `loadPipeline`

Global traps catch any errors that escape individual try/catch blocks:
- `window.onerror` — uncaught synchronous errors
- `unhandledrejection` — uncaught Promise rejections

---

## Repository Structure (GitHub)

```
/
├── index.html              ← The entire app (single file)
├── README.md               ← Public-facing project description
├── PIPELINE.md             ← This document (developer only)
├── CONTRIBUTING.md         ← How to contribute data corrections
└── worker/
    ├── src/
    │   ├── worker.js       ← Main RSS poller + R2 server
    │   └── enricher.js     ← AI enrichment stage (Phase 2)
    └── wrangler.toml       ← CF Worker config (no secrets)
```

---

## Data Sources Reference

| Source | URL | Auth Required |
|--------|-----|---------------|
| City Agendas/Minutes | georgetownky.gov/AgendaCenter | No |
| City Directory | georgetownky.gov/Directory.aspx | No |
| City Ordinances | georgetownky.gov/DocumentCenter | No |
| Planning Commission | gscplanning.com | No |
| Scott County | scottky.gov | No |
| Property Assessment | scottkypva.com | No |
| Revenue Commission | gscrevenueky.gov | No |
| KY School Report Card | reportcard.kyschools.us | No (JS app, no direct API) |
| KY Dept. of Education | education.ky.gov/Open-House | No |

---

*Last updated: March 2026*
