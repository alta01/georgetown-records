# Georgetown KY Public Records — Data Pipeline & Developer Reference

> **Audience:** Developers deploying or maintaining the live data pipeline.  
> This document is intentionally **not linked** from the public-facing app.

---

## Architecture Overview

```
georgetownky.gov/AgendaCenter/RSS?CID=N   ← 7 committee feeds
gmwss.com/board.htm                        ← GMWSS board minutes (scraped, not RSS)
gmwss.com/rates.htm                        ← Water rate data (scraped annually)
          │
          ▼ (every 30 min for RSS; daily for GMWSS scrape)
┌─────────────────────────────────────────┐
│  Cloudflare Worker          (worker.js) │
│  ┌──────────────────────┐              │
│  │ RSS Fetch & Dedup    │  KV: seen GUIDs (1-yr TTL)
│  │ GMWSS Board Scraper  │  KV: seen PDF URLs (1-yr TTL)
│  │ XML → Structured Rec │              │
│  │ AI Summarizer (opt.) │  Haiku: ~$0.001/meeting
│  │ Enrichment Stage     │              │
│  └──────────────────────┘              │
│           │                            │
│           ▼                            │
│   R2: new-records.json   ← city meetings + GMWSS board items
│   R2: water-rates.json   ← current + historical rate data
└─────────────────────────────────────────┘
          │
          ▼ (page load)
 index.html  ←  loadPipeline()  →  merges + re-indexes
                                →  GMWSS water section updated
```

---

## Data Sources — Full Reference

### Live RSS (7 feeds, polled every 30 minutes)

| CID | Committee | Cadence | Base URL |
|-----|-----------|---------|----------|
| 1 | City Council | 2×/month | `georgetownky.gov/AgendaCenter/RSS?CID=1` |
| 2 | Finance Committee | Monthly | `georgetownky.gov/AgendaCenter/RSS?CID=2` |
| 3 | Fire Committee | Monthly | `georgetownky.gov/AgendaCenter/RSS?CID=3` |
| 4 | Interlocal Committee | Quarterly | `georgetownky.gov/AgendaCenter/RSS?CID=4` |
| 5 | Police Committee | Monthly | `georgetownky.gov/AgendaCenter/RSS?CID=5` |
| 6 | Public Works Committee | Monthly | `georgetownky.gov/AgendaCenter/RSS?CID=6` |
| 7 | Traffic Committee | Monthly | `georgetownky.gov/AgendaCenter/RSS?CID=7` |

### Manual / Scraped (4 sources, polled daily by Worker)

| Source | URL | Cadence | Notes |
|--------|-----|---------|-------|
| GMWSS Board of Commissioners | `gmwss.com/board.htm` | Monthly | PDF links only, no RSS. Scrape HTML, extract PDF hrefs, archive each new PDF. Meeting: 3rd Tuesday of each month. |
| GMWSS Water Rates | `gmwss.com/rates.htm` | Annual (March) | Rates change March 1 each year per the 2023 rate ordinance. Scrape current rate table; compare against stored rates; alert if changed. |
| GMWSS Rate Study docs | `georgetownky.gov/DocumentCenter/View/1794/` | As published | 2022 Rate Study PDF — source of the approved 2023–2028 schedule. Archive permanently. |
| Georgetown-Scott County Planning Commission | `gscplanning.com/meetingrecords` | Monthly | No RSS. HTML scrape for meeting minute links. |

### Secondary / Journalism (context only, not ingested automatically)

| Source | URL | Used for |
|--------|-----|----------|
| Georgetown News-Graphic | `news-graphic.com` | Corroborating public official statements |
| FOX 56 | `fox56news.com` | Breaking local news, GMWSS billing complaints |
| Lex18 | `lex18.com` | 2022 rate increase coverage |
| WEKU Public Radio | `weku.org` | 2022 rate increase coverage |
| WTVQ | `wtvq.com` | 2023 rate ordinance coverage |
| Citizen Portal | `citizenportal.ai` | AI-summarized council meeting transcripts |

---

## Cloudflare Worker Setup

### wrangler.toml

```toml
name = "gtky-pipeline"
main = "src/worker.js"
compatibility_date = "2024-01-01"

[[triggers.crons]]
crons = ["*/30 * * * *", "0 6 * * *"]
# */30 * * * *  → RSS feeds every 30 minutes
# 0 6 * * *     → GMWSS scrape + rate check daily at 6am ET

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

## src/worker.js — Core Poller (Updated)

```js
const FEEDS = [
  { cat: 'City Council',  cid: 1 },
  { cat: 'Finance',       cid: 2 },
  { cat: 'Fire',          cid: 3 },
  { cat: 'Interlocal',    cid: 4 },
  { cat: 'Police',        cid: 5 },
  { cat: 'Public Works',  cid: 6 },
  { cat: 'Traffic',       cid: 7 },
];
const BASE = 'https://www.georgetownky.gov/AgendaCenter/RSS?CID=';

// GMWSS board meeting page — no RSS, scrape HTML for PDF links
const GMWSS_BOARD_URL  = 'https://gmwss.com/board.htm';
const GMWSS_RATES_URL  = 'https://gmwss.com/rates.htm';

export default {
  async scheduled(event, env, ctx) {
    const cron = event.cron;

    // Every 30 minutes: poll city RSS feeds
    ctx.waitUntil(pollCityFeeds(env));

    // Daily at 6am: scrape GMWSS board minutes + check rates
    if (cron === '0 6 * * *') {
      ctx.waitUntil(pollGMWSSBoard(env));
      ctx.waitUntil(checkWaterRates(env));
    }
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public,max-age=900',
    };

    if (url.pathname === '/records') {
      const obj  = await env.R2.get('new-records.json');
      const body = obj ? await obj.text() : '[]';
      return new Response(body, { headers });
    }

    if (url.pathname === '/water-rates') {
      const obj  = await env.R2.get('water-rates.json');
      const body = obj ? await obj.text() : 'null';
      return new Response(body, { headers });
    }

    if (url.pathname.startsWith('/archive/')) {
      const key = url.pathname.replace('/archive/', '');
      const obj = await env.R2.get('archive/' + key);
      if (!obj) return new Response('Not found', { status: 404 });
      return new Response(obj.body, {
        headers: { 'Content-Type': obj.httpMetadata?.contentType || 'application/pdf' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};

// ── City RSS feeds ──────────────────────────────────────────────────────────
async function pollCityFeeds(env) {
  const newItems = [];
  for (const feed of FEEDS) {
    try {
      const res   = await fetch(BASE + feed.cid, { cf: { cacheEverything: false } });
      const xml   = await res.text();
      const items = parseRSS(xml, feed.cat);
      for (const item of items) {
        const key = 'seen:' + item.guid;
        if (await env.KV.get(key)) continue;
        await env.KV.put(key, '1', { expirationTtl: 31536000 });
        newItems.push({ ...item, freshness: 'Live', pipeline: true, fetchedAt: new Date().toISOString() });
      }
    } catch(e) { console.error('RSS feed error:', feed.cat, e.message); }
  }
  if (newItems.length > 0) {
    const obj    = await env.R2.get('new-records.json');
    const prev   = obj ? JSON.parse(await obj.text()) : [];
    const merged = [...newItems, ...prev].slice(0, 500);
    await env.R2.put('new-records.json', JSON.stringify(merged), {
      httpMetadata: { contentType: 'application/json', cacheControl: 'public,max-age=900' }
    });
    if (env.ANTHROPIC_KEY) await summarizeNewItems(newItems, env);
  }
}

// ── GMWSS Board minutes scraper ────────────────────────────────────────────
// gmwss.com/board.htm lists PDFs in format: /board/minutes/YYYY/M-DD-YYYY.pdf
// No RSS — must parse HTML and extract anchor hrefs ending in .pdf
async function pollGMWSSBoard(env) {
  try {
    const res  = await fetch(GMWSS_BOARD_URL, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return;
    const html = await res.text();

    // Extract all PDF links from the board page
    const pdfPattern = /href="([^"]*board\/minutes\/[^"]+\.pdf)"/gi;
    const newItems   = [];
    let match;

    while ((match = pdfPattern.exec(html)) !== null) {
      const path    = match[1];
      const fullUrl = path.startsWith('http') ? path : 'https://gmwss.com' + path;
      const key     = 'gmwss-seen:' + fullUrl;

      if (await env.KV.get(key)) continue;
      await env.KV.put(key, '1', { expirationTtl: 31536000 });

      // Parse date from path like /board/minutes/2025/2-18-2025.pdf
      const dateMatch = path.match(/(\d+)-(\d+)-(\d{4})\.pdf$/);
      const MONTHS    = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      let mo = '—', dy = '—', yr = new Date().getFullYear().toString();
      if (dateMatch) {
        const d = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[1])-1, parseInt(dateMatch[2]));
        mo = MONTHS[d.getMonth()];
        dy = String(d.getDate()).padStart(2, '0');
        yr = String(d.getFullYear());
      }

      newItems.push({
        guid:     fullUrl,
        title:    `GMWSS Board of Commissioners Meeting — ${mo} ${dy}, ${yr}`,
        sum:      'Monthly meeting of the Georgetown Municipal Water & Sewer Service Board of Commissioners. Board approves rates, capital projects, and operational decisions. Source: gmwss.com/board.htm',
        url:      fullUrl,
        mo, dy, yr,
        type:     'Minutes',
        topics:   ['water', 'gmwss', 'utility'],
        category: 'GMWSS',
        freshness:'Live',
        pipeline: true,
        fetchedAt: new Date().toISOString(),
      });

      // Archive the PDF to R2 to prevent link rot
      try {
        const pdfRes = await fetch(fullUrl, { signal: AbortSignal.timeout(15000) });
        if (pdfRes.ok) {
          const archiveKey = 'archive/gmwss-' + fullUrl.split('/').pop();
          const existing   = await env.R2.head(archiveKey);
          if (!existing) {
            await env.R2.put(archiveKey, await pdfRes.arrayBuffer(), {
              httpMetadata: { contentType: 'application/pdf' }
            });
          }
        }
      } catch(archiveErr) {
        console.error('GMWSS PDF archive failed:', fullUrl, archiveErr.message);
      }
    }

    if (newItems.length > 0) {
      const obj    = await env.R2.get('new-records.json');
      const prev   = obj ? JSON.parse(await obj.text()) : [];
      const merged = [...newItems, ...prev].slice(0, 500);
      await env.R2.put('new-records.json', JSON.stringify(merged), {
        httpMetadata: { contentType: 'application/json', cacheControl: 'public,max-age=900' }
      });
      console.log('GMWSS board: added', newItems.length, 'new meeting records');
    }
  } catch(e) {
    console.error('GMWSS board scrape failed:', e.message);
  }
}

// ── Water rate change detector ─────────────────────────────────────────────
// Scrapes gmwss.com/rates.htm, extracts the current rate table,
// compares to last stored snapshot, and alerts if rates have changed.
// Rate changes are announced each March 1 per the 2023 ordinance schedule.
async function checkWaterRates(env) {
  try {
    const res  = await fetch(GMWSS_RATES_URL, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return;
    const html = await res.text();

    // Extract the current rate table values
    // Pattern: "First 2,000 Gallons | $XX.XX"
    const waterFixed = html.match(/First 2,000 Gallons[\s\S]{0,30}\$(\d+\.\d+)/)?.[1];
    const sewerFixed = html.match(/First 2,000 Gallons[\s\S]{0,30}\$(\d+\.\d+)[\s\S]{0,200}Sewer/)?.[1];
    const effectiveDate = html.match(/Effective\s+([\w\s,]+\d{4})/i)?.[1]?.trim();

    if (!waterFixed) {
      console.warn('Water rate scrape: could not parse fixed rate');
      return;
    }

    const snapshot = {
      waterFixed:    parseFloat(waterFixed),
      sewerFixed:    sewerFixed ? parseFloat(sewerFixed) : null,
      effectiveDate: effectiveDate || null,
      fetchedAt:     new Date().toISOString(),
      // Full approved schedule (source: georgetownky.gov/DocumentCenter/View/1794/)
      approvedSchedule: {
        'Mar-2023': { waterFixed: 15.78, sewerFixed: 14.53, combined: 30.31 },
        'Mar-2024': { waterFixed: 18.47, sewerFixed: 17.00, combined: 35.47 },
        'Mar-2025': { waterFixed: 21.61, sewerFixed: 19.89, combined: 41.50 },
        'Mar-2026': { waterFixed: 22.90, sewerFixed: 21.09, combined: 43.99 },
        'Mar-2027': { waterFixed: 24.28, sewerFixed: 22.35, combined: 46.63 }, // projected
        'Mar-2028': { waterFixed: 25.73, sewerFixed: 23.69, combined: 49.42 }, // projected
      },
      // Historical actuals (source: gmwss.com/docs/Water-Sewer-Rate-Comparisons-2022.pdf)
      history: [
        { year: 2007, waterFixed: 7.59,  sewerFixed: 7.49,  combined: 16.36, source: 'gmwss.com/docs/Water-Sewer-Rate-Comparisons-2022.pdf' },
        { year: 2019, waterFixed: 13.49, sewerFixed: 12.42, combined: 25.91, source: 'gmwss.com/docs/Water-Sewer-Rate-Comparisons-2022.pdf' },
        { year: 2023, waterFixed: 15.78, sewerFixed: 14.53, combined: 30.31, source: 'gmwss.com/rates.htm' },
        { year: 2024, waterFixed: 18.47, sewerFixed: 17.00, combined: 35.47, source: 'gmwss.com/rates.htm' },
        { year: 2025, waterFixed: 21.61, sewerFixed: 19.89, combined: 41.50, source: 'gmwss.com/rates.htm' },
        { year: 2026, waterFixed: 22.90, sewerFixed: 21.09, combined: 43.99, source: 'gmwss.com/rates.htm' },
      ],
    };

    // Load previous snapshot
    const prevObj  = await env.R2.get('water-rates.json');
    const prevSnap = prevObj ? JSON.parse(await prevObj.text()) : null;

    // Detect rate change
    if (prevSnap && prevSnap.waterFixed !== snapshot.waterFixed) {
      console.log(
        `WATER RATE CHANGED: $${prevSnap.waterFixed} → $${snapshot.waterFixed}`,
        'Effective:', snapshot.effectiveDate
      );
      // Flag as a new pipeline record for visibility in the app
      const changeItem = {
        guid:     'water-rate-change-' + Date.now(),
        title:    `GMWSS Water Rate Change Detected — ${snapshot.effectiveDate || 'March ' + new Date().getFullYear()}`,
        sum:      `Water fixed rate changed from $${prevSnap.waterFixed} to $${snapshot.waterFixed} per month (first 2,000 gallons). Source: gmwss.com/rates.htm`,
        url:      'https://gmwss.com/rates.htm',
        mo:       ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][new Date().getMonth()],
        dy:       String(new Date().getDate()).padStart(2, '0'),
        yr:       String(new Date().getFullYear()),
        type:     'Rate Change',
        topics:   ['water', 'gmwss', 'rates', 'utility'],
        category: 'GMWSS',
        freshness:'Live',
        pipeline: true,
        fetchedAt: new Date().toISOString(),
      };
      const obj    = await env.R2.get('new-records.json');
      const prev   = obj ? JSON.parse(await obj.text()) : [];
      await env.R2.put('new-records.json', JSON.stringify([changeItem, ...prev].slice(0, 500)), {
        httpMetadata: { contentType: 'application/json', cacheControl: 'public,max-age=900' }
      });
    }

    // Always update the rates snapshot
    await env.R2.put('water-rates.json', JSON.stringify(snapshot), {
      httpMetadata: { contentType: 'application/json', cacheControl: 'public,max-age=3600' }
    });

  } catch(e) {
    console.error('Water rate check failed:', e.message);
  }
}
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
  return ({
    'City Council': ['motion'],
    Finance:        ['finance', 'budget'],
    Fire:           ['fire'],
    Police:         ['police'],
    'Public Works': ['pw'],
    Traffic:        ['pw'],
    GMWSS:          ['water', 'gmwss', 'utility'],
  })[cat] || ['motion'];
}
```

---

## AI Minutes Summarizer (Phase 2 — Optional)

Requires `ANTHROPIC_KEY` secret. Cost: ~$0.001 per meeting PDF.

```js
async function summarizeNewItems(items, env) {
  for (const item of items) {
    if (!item.url?.endsWith('.pdf')) continue;
    try {
      const pdfText  = await fetchAndExtractPDF(item.url);
      const isGMWSS  = item.category === 'GMWSS';
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: isGMWSS
            ? `Summarize this Georgetown Municipal Water & Sewer Service (GMWSS) board meeting in JSON.
Only include facts stated in the document. Do not infer or extrapolate.
{"summary":"2-3 sentence overview","topics":["water","rates","capital"],"decisions":[{"text":"...","result":"approved|tabled|discussed"}],"amounts":["$X for Y"],"rateChanges":["any rate changes mentioned"]}
Return raw JSON only.`
            : `Summarize this Georgetown KY city council meeting in JSON:
{"summary":"2-3 sentence overview","topics":["motion","finance"],"motions":[{"text":"...","result":"..."}],"amounts":["$X for Y"]}
Return raw JSON only.`,
          messages: [{ role: 'user', content: pdfText.slice(0, 8000) }]
        })
      });
      const data   = await response.json();
      const parsed = JSON.parse((data.content[0]?.text || '{}').replace(/```json|```/g, '').trim());
      item.sum          = parsed.summary || item.sum;
      item.topics       = parsed.topics  || item.topics;
      item.aiSummarized = true;
      if (parsed.rateChanges?.length) item.rateChanges = parsed.rateChanges;
    } catch(e) { console.error('Summarizer:', e); }
  }
  await updateR2Records(items, env);
}
```

---

## Water Oversight Data — Static Reference

All rate figures below are from official published sources. This section is the authoritative reference for the Water Oversight panel in `index.html`. Update these values if GMWSS publishes new rates.

### Current Rates (March 1, 2026 – February 28, 2027)
Source: [gmwss.com/rates.htm](https://gmwss.com/rates.htm)

| Service | Fixed (first 2,000 gal/mo) | Variable (per add'l 1,000 gal) |
|---------|---------------------------|-------------------------------|
| Water   | $22.90                    | $12.3593                      |
| Sewer   | $21.09                    | $13.3780                      |
| **Combined fixed** | **$43.99** |                          |

**Additional charges (city residents only):** Garbage $17.65/mo (Republic Services) · 911 Fee $8.00/mo  
**Senior discount (65+):** 10% off water and sewer portions only. [Ordinance PDF](https://gmwss.com/misc/2023-05-08-Senior-Discount.pdf)

### Average Monthly Bills by Household Size
Based on 60 gal/person/day (national average). Source: gmwss.com/rates.htm

| Household | Water + Sewer | With Garbage + 911 |
|-----------|--------------|---------------------|
| 1 person  | $43.99       | $69.64              |
| 2 persons | $85.17       | $110.82             |
| 3 persons | $131.50      | $157.15             |
| 4 persons | $177.82      | $203.47             |

### Approved Rate Schedule 2023–2028
Source: [2022 Rate Study — georgetownky.gov/DocumentCenter/View/1794/2022-Rate-Study-12122022-v3](https://www.georgetownky.gov/DocumentCenter/View/1794/2022-Rate-Study-12122022-v3)  
Scenario 5.1B approved by City Council, February 2023.

| Effective | Water Fixed | Water Variable | Sewer Fixed | Sewer Variable | Combined Fixed | vs 2022 |
|-----------|------------|----------------|------------|----------------|---------------|---------|
| 2022 (pre-hike) | $13.49 | $7.28 | $12.42 | $7.84 | $25.91 | baseline |
| Mar 2023 | $15.78 | $8.52 | $14.53 | $9.22 | $30.31 | +17% |
| Mar 2024 | $18.47 | $9.97 | $17.00 | $10.79 | $35.47 | +37% |
| Mar 2025 | $21.61 | $11.66 | $19.89 | $12.62 | $41.50 | +60% |
| Mar 2026 | $22.90 | $12.36 | $21.09 | $13.38 | $43.99 | +70% |
| Mar 2027 (proj) | $24.28 | $13.10 | $22.35 | $14.18 | $46.63 | +80% |
| Mar 2028 (proj) | $25.73 | $13.89 | $23.69 | $15.03 | $49.42 | +91% |

### Historical Rate Context
Source: [gmwss.com/docs/Water-Sewer-Rate-Comparisons-2022.pdf](https://gmwss.com/docs/Water-Sewer-Rate-Comparisons-2022.pdf)

| Period | Combined Fixed (2,000 gal) | Notes |
|--------|---------------------------|-------|
| 1998   | $14.54 | Decreased from $14.94 — county water line investment era |
| 2004   | $14.87 | First increase since 1998 |
| 2007   | $16.36 | Last increase before 2019 |
| 2007–2019 | $16.36 | **12-year freeze** |
| 2019   | Stepped structure begins | 5-year plan, later superseded |

### FY2026 GMWSS Budget
Source: [Georgetown City Council, June 9, 2025](https://citizenportal.ai/articles/6529296/Kentucky/Scott-County/Georgetown-City/Georgetown-council-adopts-2536-million-FY26-water-and-sewer-budget-stresses-plant-upgrades-and-conservative-growth-assumptions)

| Item | Amount |
|------|--------|
| Total Revenue | $25,359,991 (+18.59% vs FY25) |
| Fund 1 Revenue | $22,730,279 |
| Fund 2 Revenue | $2,629,007 |
| Operating Expenses | $24,289,856 |
| Interest Expense | ~$3,100,000 |
| FY26 Departmental Capital | $1,794,697 |
| Toyota-Reimbursed Capital (Fund 2) | $2,650,000 |
| New Connections Budgeted | 150 (conservative estimate) |
| Staff COLA | 2.9% + up to 1% merit |
| ARPA Deadline | December 2026 (DeShaix/Water St interceptor) |

### Key Claims — Source Ledger

Every factual claim in the Water Oversight panel is sourced to one of the following. This ledger is the single source of truth for fact-checking.

| Claim | Source | URL | Type |
|-------|--------|-----|------|
| 61.5% rate increase proposed | Georgetown News-Graphic, Nov. 25, 2022 | news-graphic.com/news/how-did-we-get-here... | Journalism |
| Two vendor mistakes totaling ~$50M | Mayor Tom Prather, public statement | Corroborated: Lex18 Nov. 2022, WEKU Dec. 2022, Spectrum News Dec. 2022 | On-record official statement |
| WWTP1 engineering flaw — insufficient concrete/rebar | News-Graphic Nov. 2022 + Lex18 Nov. 2022 | news-graphic.com/news/how-did-we-get-here... | Journalism |
| $64.2M WWTP1 total cost | FOX 56, June 7, 2024 + GMWSS General Manager Chase Azevedo statement | fox56news.com/news/local/georgetown/georgetown-water-treatment-plant... | Journalism + official statement |
| WWTP1 capacity: 4.5M → 9M gal/day | FOX 56, June 7, 2024 | fox56news.com/news/local/georgetown/georgetown-water-treatment-plant... | Official statement via journalism |
| 2019 interest calculation error | Mayor Prather, Nov. 2022 | Lex18: lex18.com/news/explaining-georgetowns-water-and-sewer-rate-increase | On-record official statement |
| ~$11M savings from bank draw note vs bonds | News-Graphic, Feb. 7, 2023 | news-graphic.com/news/lower-2023-rate-hike... | Journalism citing GMWSS GM memo |
| Scott County invested ~$25M in water infrastructure | News-Graphic, Nov. 25, 2022 | news-graphic.com/news/how-did-we-get-here... | Journalism |
| 12-year rate freeze 2007–2019 | GMWSS published rate sheets | gmwss.com/docs/Water-Sewer-Rate-Comparisons-2022.pdf | Official utility records |
| State auditor declined special exam | Councilmember Alonzo Allen at council meeting, Feb. 28, 2023 | WTVQ: wtvq.com/georgetown-city-council-approved-increase-in-water-and-sewer-rates/ | On-record official statement |
| 15,404 active water customers | GMWSS written statement to FOX 56, Mar. 2026 | fox56news.com/news/local/georgetown/georgetown-residents-raise-concerns... | Official utility statement |
| 91 leak checks Feb. 2026 / 36 of 91 showed flow | GMWSS written statement to FOX 56, Mar. 2026 | fox56news.com/news/local/georgetown/georgetown-residents-raise-concerns... | Official utility statement |
| 5.7% water / 11% sewer consumption increase since FY22 | City staff presentation, City Council June 9, 2025 | citizenportal.ai/articles/6529296... | AI-summarized meeting transcript |
| $106.4M capital plan 2024–2028 | 2022 Rate Study (Scenario 4A.1) | georgetownky.gov/DocumentCenter/View/1781/2022-GMWSS-Rate-Study- | Official government document |
| GMWSS not regulated by KY PSC | Dan Holman, public statement; gmwss.com/about.htm | fox56news.com/news/local/georgetown/georgetown-residents-raise-concerns... | Public statement + official |
| System pressure >80 PSI concern | Dan Holman, public statement | FOX 56, Mar. 2026 | Public statement (attributed) |
| Oct. 7, 2025 open-meetings incident | News-Graphic, Oct. 14, 2025 | news-graphic.com/news/gmwss-acknowledges-inadvertent-illegal-meeting... | Journalism + GMWSS written acknowledgment |
| Jason Baird reappointed unanimously | Georgetown City Council minutes, Nov. 24, 2025 | georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293 | Official government minutes |
| Jeff Klocke reappointment tabled then approved | Georgetown City Council minutes, Nov. 24, 2025 | georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293 | Official government minutes |
| GMWSS board: 5 members appointed by Mayor | GMWSS About page | gmwss.com/about.htm | Official utility page |
| Board meets 3rd Tuesday monthly | GMWSS About page | gmwss.com/about.htm | Official utility page |
| $25.36M FY26 budget approved | City Council voice vote, June 9, 2025 | citizenportal.ai/articles/6529296... | AI-summarized meeting transcript |
| Holman urged council to change GMWSS structure | News-Graphic, Dec. 12, 2025 | news-graphic.com/news/council-pledges-funds-to-proposed-recovery-initiative... | Journalism |
| Hambrick responded defending council input | News-Graphic, Dec. 12, 2025 | news-graphic.com/news/council-pledges-funds-to-proposed-recovery-initiative... | Journalism |

---

## Enrichment Stage (Phase 2 — Optional)

```js
// src/enricher.js
const SOURCES = [
  { name: 'City Minutes',    base: 'https://www.georgetownky.gov/AgendaCenter', priority: 1 },
  { name: 'City Directory',  base: 'https://www.georgetownky.gov/Directory.aspx', priority: 1 },
  { name: 'Doc Center',      base: 'https://www.georgetownky.gov/DocumentCenter', priority: 1 },
  { name: 'GMWSS',           base: 'https://gmwss.com', priority: 1 },
  { name: 'Planning Comm.',  base: 'https://www.gscplanning.com', priority: 2 },
  { name: 'Scott County',    base: 'https://scottky.gov', priority: 2 },
  { name: 'News-Graphic',    base: 'https://www.news-graphic.com', priority: 3 },
];

export async function enrichItem(item, env) {
  const sourceText  = await fetchSourceText(item.url);
  const officialCtx = await buildOfficialContext(item, env);
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
Rules:
- Official government sources always override secondary sources
- If sources conflict → note in accuracy_notes, use official version
- Missing source text → confidence: "low"
- Dollar amounts require official document confirmation
- Vote/rate results require meeting minutes or official rate sheet confirmation
- Never invent facts; never extrapolate beyond stated information`;

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
  category   TEXT,        -- 'City Council' | 'Finance' | 'GMWSS' | etc.
  url        TEXT,
  ai_summary TEXT,
  created_at TEXT
);
CREATE TABLE water_rates (
  effective_date TEXT PRIMARY KEY,
  water_fixed    REAL,
  sewer_fixed    REAL,
  water_variable REAL,
  sewer_variable REAL,
  source_url     TEXT,
  is_projected   INTEGER DEFAULT 0
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

---

## PDF Archiving Worker

Prevents link rot for both city documents and GMWSS board minutes.

```js
// Daily cron job — runs for all categories including GMWSS
export async function archivePDFs(env) {
  const records = await getR2Records(env);
  for (const rec of records) {
    const isGovURL  = rec.url?.includes('georgetownky.gov');
    const isGMWSS   = rec.url?.includes('gmwss.com');
    if (!isGovURL && !isGMWSS) continue;

    const key = btoa(rec.url).replace(/[+/=]/g, c => c==='+'?'-':c==='/'?'_':'');
    const existing = await env.R2.head('archive/' + key);
    if (existing) continue;
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

Archive URL: `https://YOUR-WORKER.workers.dev/archive/{base64url-encoded-original-url}`

---

## Cost Estimate (Monthly)

| Item | Cost |
|------|------|
| CF Pages / GitHub Pages hosting | $0.00 |
| CF R2 storage (<1 GB) | $0.00 |
| CF KV reads (10M/day free tier) | $0.00 |
| CF Worker requests (10M/mo free) | $0.00 |
| RSS polling (48×/day × 7 feeds) | $0.00 |
| GMWSS board scrape (1×/day) | $0.00 |
| Water rate check (1×/day) | $0.00 |
| PDF summarizer — 30 meetings/mo (Haiku) | ~$0.03 |
| GMWSS board summarizer — 12 PDFs/yr (Haiku) | ~$0.01 |
| Fact-check — 100 checks/day (Haiku) | ~$3.00 |
| Fact-check — 1,000 checks/day (Haiku) | ~$30.00 |
| **Total at launch scale** | **~$0–5/mo** |

---

## Silent Error Logging

The frontend uses a ring-buffer logger (`_LOG`) invisible to users.

```js
// DevTools access:
window.gtky.log()          // full log array
window.__GTKY_LOG          // alias
window.gtky.last(20)       // last 20 entries
window.__GTKY_DEBUG = true // mirror to console (dev only)
window.gtky.clear()        // clear buffer

// Log entry shape:
{ t: 1234, lvl: 'WARN', ctx: 'pipeline', msg: 'Non-OK response', det: { status: 404 } }
```

Functions wrapped with `_LOG.warn`:
`rebuildIndex`, `renderDir`, `renderMeet`, `renderPlan`, `renderVotes`, `renderOrds`,
`initCIPChart`, `goToMeeting`, `goToVote`, `goToOrdinance`, `goToElection`, `goToPerson`,
`openDrawer`, `updateElectionCountdown`, `lookupAddress`, `initSchoolCharts`,
`renderSchoolChart`, `toggleOrdRow`, `toggleEconItem`, `toggleRace`, `loadPipeline`,
`renderWaterRateChart`

---

## Repository Structure (GitHub)

```
/
├── index.html              ← The entire app (single file, ~600 KB)
├── README.md               ← Public-facing project description
├── PIPELINE.md             ← This document (developer only)
├── CONTRIBUTING.md         ← How to contribute data corrections
└── worker/
    ├── src/
    │   ├── worker.js       ← Main RSS poller + GMWSS scraper + R2 server
    │   └── enricher.js     ← AI enrichment stage (Phase 2)
    └── wrangler.toml       ← CF Worker config (no secrets)
```

---

## All Data Sources Reference

| Source | URL | Auth | Notes |
|--------|-----|------|-------|
| City Agendas/Minutes | georgetownky.gov/AgendaCenter | No | RSS CID=1–7 |
| City Directory | georgetownky.gov/Directory.aspx | No | |
| City Ordinances | georgetownky.gov/DocumentCenter | No | |
| **GMWSS Board Minutes** | **gmwss.com/board.htm** | **No** | **Scrape HTML, extract PDF links** |
| **GMWSS Current Rates** | **gmwss.com/rates.htm** | **No** | **Scrape annually; alert on change** |
| **GMWSS 2022 Rate Study** | **georgetownky.gov/DocumentCenter/View/1794/** | **No** | **Archive permanently** |
| **GMWSS Capital Plan** | **georgetownky.gov/DocumentCenter/View/1781/** | **No** | **Archive permanently** |
| Planning Commission | gscplanning.com | No | HTML scrape |
| Scott County | scottky.gov | No | |
| Property Assessment | scottkypva.com | No | |
| Revenue Commission | gscrevenueky.gov | No | |
| KY School Report Card | reportcard.kyschools.us | No | JS app, no direct API |
| KY Dept. of Education | education.ky.gov/Open-House | No | |

---

*Last updated: March 2026 · v24*
