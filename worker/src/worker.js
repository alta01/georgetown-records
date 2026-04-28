import { enrichItem } from './enricher.js';

const FEEDS = [
  { cat: 'City Council',  cid: 'City-Council-1'             },
  { cat: 'Finance',       cid: 'Finance-Committee-2'         },
  { cat: 'Fire',          cid: 'Fire-Committee-3'            },
  { cat: 'Traffic',       cid: 'Traffic-Committee-4'         },
  { cat: 'Police',        cid: 'Police-Committee-5'          },
  { cat: 'Public Works',  cid: 'Public-Works-Committee-6'    },
  { cat: 'Interlocal',    cid: 'Interlocal-Committee-7'      },
  { cat: 'Miscellaneous', cid: 'Miscellaneous-Committees-10' },
];
const BASE            = 'https://www.georgetownky.gov/RSSFeed.aspx?ModID=65&CID=';
const GMWSS_BOARD_URL = 'https://gmwss.com/board.htm';
const GMWSS_RATES_URL = 'https://gmwss.com/rates.htm';
const PLANNING_URL    = 'https://www.gscplanning.com/meetingrecords';

// Approved rate schedule from the 2022 Rate Study (Scenario 5.1B).
// Source: georgetownky.gov/DocumentCenter/View/1794/
const APPROVED_SCHEDULE = {
  'Mar-2023': { waterFixed: 15.78, sewerFixed: 14.53 },
  'Mar-2024': { waterFixed: 18.47, sewerFixed: 17.00 },
  'Mar-2025': { waterFixed: 21.61, sewerFixed: 19.89 },
  'Mar-2026': { waterFixed: 22.90, sewerFixed: 21.09 },
  'Mar-2027': { waterFixed: 24.28, sewerFixed: 22.35 },
  'Mar-2028': { waterFixed: 25.73, sewerFixed: 23.69 },
};

export default {
  async scheduled(event, env, ctx) {
    // Every 30 minutes: poll all city RSS committee feeds.
    ctx.waitUntil(pollCityFeeds(env));

    // Daily at 10:00 UTC (~6am ET): scrape GMWSS board minutes, check water
    // rates, and poll the planning commission (no RSS, HTML only).
    if (event.cron === '0 10 * * *') {
      ctx.waitUntil(pollGMWSS(env));
      ctx.waitUntil(checkWaterRates(env));
      ctx.waitUntil(pollPlanning(env));
    }
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    const CORS = {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age':       '86400',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    // ── /records — all pipeline records stored in KV ─────────────────────────
    if (url.pathname === '/records') {
      const body = (await env.KV.get('records')) || '[]';
      return new Response(body, {
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control':               'public,max-age=900',
        },
      });
    }

    // ── /water-rates — latest scraped rate snapshot ───────────────────────────
    if (url.pathname === '/water-rates') {
      const body = (await env.KV.get('water-rates')) || 'null';
      return new Response(body, {
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control':               'public,max-age=3600',
        },
      });
    }

    // ── /status — last-run summary for the Claude Routine ────────────────────
    if (url.pathname === '/status') {
      const body = (await env.KV.get('poll-status')) || '{}';
      return new Response(body, {
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control':               'no-cache',
        },
      });
    }

    // ── /factcheck — keeps ANTHROPIC_KEY server-side ──────────────────────────
    if (url.pathname === '/factcheck' && request.method === 'POST') {
      if (!env.ANTHROPIC_KEY) {
        return new Response(JSON.stringify({ error: 'ANTHROPIC_KEY not configured' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      try {
        const { statement, context } = await request.json();
        if (!statement || typeof statement !== 'string' || statement.length > 2000) {
          return new Response(JSON.stringify({ error: 'Invalid statement' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        }
        const systemPrompt = `You are a fact-checking agent for Georgetown, Kentucky public records.

## VERIFICATION ALGORITHM — follow these steps in order:

STEP 1 — DATASET CHECK: Search the PROVIDED DATASET below for evidence. The dataset contains verified city records, council votes, meeting minutes, ordinances, and official staff data. If the claim is directly stated or clearly implied by the dataset, verdict is "Supported" with "High" confidence and source_tier is "dataset".

STEP 2 — GENERAL KNOWLEDGE: If the dataset does not contain enough information, use your general knowledge about Georgetown KY, Kentucky government, Toyota TMMK, and public affairs. If supported by general knowledge alone, confidence is "Medium" and source_tier is "external".

STEP 3 — CROSS-REFERENCE: If both dataset AND general knowledge support the claim, confidence is "High" and source_tier is "dataset+external". If they partially agree, source_tier is "mixed".

STEP 4 — VERDICT: Only use "Insufficient Data" if NEITHER the dataset NOR your knowledge contains relevant information. A simple factual claim like "The mayor's last name is Jenkins" that appears in the dataset is "Supported" / "High" / "dataset" — not "Insufficient Data".

## CONFIDENCE SCORING:
- High: Claim directly matches dataset records, or is well-established public fact
- Medium: Claim is consistent with dataset but not explicitly stated, OR supported only by external knowledge
- Low: Weak or indirect evidence only

## RESPONSE FORMAT — return ONLY raw JSON, no markdown:
{"verdict":"Supported"|"Partially Supported"|"Unsupported"|"Insufficient Data","confidence":"High"|"Medium"|"Low","summary":"2-3 sentences explaining your reasoning","evidence":["specific facts from dataset or knowledge that support/refute"],"discrepancies":["any errors in the claim — wrong names, dates, numbers"],"sources":["which records you checked: e.g. 'Dataset: Officials list', 'Dataset: Vote record Nov 24 2025', 'General knowledge: Toyota TMMK'],"source_tier":"dataset"|"dataset+external"|"external"|"mixed"|"unknown"}

## PROVIDED DATASET:
${(context || '').slice(0, 12000)}`;

        const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key':          env.ANTHROPIC_KEY,
            'anthropic-version':  '2023-06-01',
            'Content-Type':       'application/json',
          },
          body: JSON.stringify({
            model:      'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            system:     systemPrompt,
            messages:   [{ role: 'user', content: `Fact-check this statement: "${statement}"` }],
          }),
        });
        const data = await apiRes.json();
        let raw = (data.content || []).map(c => c.text || '').join('').trim();
        raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
        let parsed;
        try { parsed = JSON.parse(raw); }
        catch {
          parsed = {
            verdict: 'Insufficient Data', confidence: 'Low',
            summary: raw.slice(0, 500), evidence: [], discrepancies: [], sources: [], source_tier: 'unknown',
          };
        }
        return new Response(JSON.stringify(parsed), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }

    return new Response('Not found', { status: 404 });
  },
};

// ── KV helpers ────────────────────────────────────────────────────────────────

async function getKVRecords(env) {
  try {
    const raw = await env.KV.get('records');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function updateKVRecords(updatedItems, env) {
  const all  = await getKVRecords(env);
  const map  = new Map(all.map(r => [r.guid, r]));
  for (const item of updatedItems) map.set(item.guid, item);
  await env.KV.put('records', JSON.stringify([...map.values()].slice(0, 500)));
}

// ── RSS Parser ────────────────────────────────────────────────────────────────

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function parseRSS(xml, category) {
  const items = [];
  for (const [, block] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const get = tag => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
             || block.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`));
      return m ? m[1].trim() : '';
    };
    const pubDate = new Date(get('pubDate'));
    const valid   = pubDate instanceof Date && !isNaN(pubDate);
    if (!valid) continue; // guardrail: skip items with unparseable dates
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
    Planning:       ['planning', 'zoning'],
  })[cat] || ['motion'];
}

// ── 1. City RSS feeds (every 30 min) ─────────────────────────────────────────

async function pollCityFeeds(env) {
  const newItems = [];
  for (const feed of FEEDS) {
    try {
      const res   = await fetch(BASE + feed.cid, { cf: { cacheEverything: false } });
      const xml   = await res.text();
      const items = parseRSS(xml, feed.cat);
      for (const item of items) {
        if (!item.guid || !item.url) continue;
        const key = 'seen:' + item.guid;
        if (await env.KV.get(key)) continue;
        await env.KV.put(key, '1', { expirationTtl: 31536000 });
        newItems.push({ ...item, freshness: 'Live', pipeline: true, fetchedAt: new Date().toISOString() });
      }
    } catch(e) { console.error('[rss]', feed.cat, e.message); }
  }

  if (newItems.length > 0) {
    const prev   = await getKVRecords(env);
    const merged = [...newItems, ...prev].slice(0, 500);
    await env.KV.put('records', JSON.stringify(merged));
    if (env.ANTHROPIC_KEY) await processNewItems(newItems, env);
  }

  await writeStatus(env, 'lastRssRun', newItems.length, 'rssNew');
  console.log('[rss] done — new:', newItems.length);
}

// ── 2. GMWSS board minutes (daily) ───────────────────────────────────────────

async function pollGMWSS(env) {
  const newItems = [];
  try {
    const res  = await fetch(GMWSS_BOARD_URL, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // Board minutes live at paths like: /board/minutes/2025/2-18-2025.pdf
    const pdfPattern = /href="([^"]*board\/minutes\/[^"]+\.pdf)"/gi;
    let match;
    while ((match = pdfPattern.exec(html)) !== null) {
      const path    = match[1];
      const fullUrl = path.startsWith('http') ? path : 'https://gmwss.com' + path;

      // Guardrail: only accept URLs from gmwss.com
      if (!fullUrl.startsWith('https://gmwss.com/')) continue;

      const key = 'gmwss-seen:' + fullUrl;
      if (await env.KV.get(key)) continue;
      await env.KV.put(key, '1', { expirationTtl: 31536000 });

      // Parse date from filename: M-DD-YYYY.pdf
      const dateMatch = path.match(/(\d{1,2})-(\d{1,2})-(\d{4})\.pdf$/);
      if (!dateMatch) continue; // guardrail: skip unparseable filenames
      const d  = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[1]) - 1, parseInt(dateMatch[2]));
      const mo = MONTHS[d.getMonth()];
      const dy = String(d.getDate()).padStart(2, '0');
      const yr = String(d.getFullYear());

      newItems.push({
        guid:      fullUrl,
        title:     `GMWSS Board of Commissioners — ${mo} ${dy}, ${yr}`,
        sum:       'Monthly meeting of the Georgetown Municipal Water & Sewer Service Board of Commissioners. Source: gmwss.com/board.htm',
        url:       fullUrl,
        mo, dy, yr,
        type:      'Minutes',
        topics:    ['water', 'gmwss', 'utility'],
        category:  'GMWSS',
        freshness: 'Live',
        pipeline:  true,
        fetchedAt: new Date().toISOString(),
      });
    }
  } catch(e) { console.error('[gmwss] board scrape failed:', e.message); }

  if (newItems.length > 0) await updateKVRecords(newItems, env);
  await writeStatus(env, 'lastGmwssRun', newItems.length, 'gmwssNew');
  console.log('[gmwss] done — new:', newItems.length);
}

// ── 3. Water rate change detector (daily) ────────────────────────────────────

async function checkWaterRates(env) {
  try {
    const res  = await fetch(GMWSS_RATES_URL, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // Extract the fixed rate for the first 2,000 gallons.
    // Pattern seen on gmwss.com/rates.htm: "First 2,000 Gallons ... $XX.XX"
    const waterMatch = html.match(/First\s+2,000\s+Gallons[\s\S]{0,60}\$(\d+\.\d{2})/i);
    if (!waterMatch) {
      console.warn('[water] Could not parse fixed rate from gmwss.com/rates.htm');
      return;
    }
    const waterFixed      = parseFloat(waterMatch[1]);
    const effectiveMatch  = html.match(/Effective\s+([\w\s,]+\d{4})/i);
    const effectiveDate   = effectiveMatch?.[1]?.trim() || null;

    const snapshot = {
      waterFixed,
      effectiveDate,
      approvedSchedule: APPROVED_SCHEDULE,
      fetchedAt: new Date().toISOString(),
    };

    // Load previous snapshot to detect changes.
    let prevSnap = null;
    try {
      const raw = await env.KV.get('water-rates');
      if (raw) prevSnap = JSON.parse(raw);
    } catch { /* first run */ }

    if (prevSnap && prevSnap.waterFixed !== waterFixed) {
      console.log(`[water] RATE CHANGED $${prevSnap.waterFixed} → $${waterFixed} (${effectiveDate})`);
      const changeItem = {
        guid:      'water-rate-change-' + Date.now(),
        title:     `GMWSS Water Rate Change — ${effectiveDate || new Date().getFullYear()}`,
        sum:       `Water fixed rate changed from $${prevSnap.waterFixed} to $${waterFixed}/mo (first 2,000 gal). Source: gmwss.com/rates.htm`,
        url:       'https://gmwss.com/rates.htm',
        mo:        MONTHS[new Date().getMonth()],
        dy:        String(new Date().getDate()).padStart(2, '0'),
        yr:        String(new Date().getFullYear()),
        type:      'Rate Change',
        topics:    ['water', 'gmwss', 'rates', 'utility'],
        category:  'GMWSS',
        freshness: 'Live',
        pipeline:  true,
        fetchedAt: new Date().toISOString(),
      };
      await updateKVRecords([changeItem], env);
    }

    await env.KV.put('water-rates', JSON.stringify(snapshot));
    await writeStatus(env, 'lastWaterCheck', waterFixed, 'currentWaterRate');
    console.log('[water] done — fixed rate:', waterFixed);
  } catch(e) { console.error('[water] check failed:', e.message); }
}

// ── 4. Planning commission (daily) ───────────────────────────────────────────

async function pollPlanning(env) {
  const newItems = [];
  try {
    const res  = await fetch(PLANNING_URL, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // Extract PDF/document links from the planning commission meeting records page.
    // Pattern: hrefs ending in .pdf or containing "minutes" from gscplanning.com
    const linkPattern = /href="(https?:\/\/(?:www\.)?gscplanning\.com\/[^"]+(?:\.pdf|minutes[^"]*))"[^>]*>([^<]{5,80})/gi;
    let match;
    while ((match = linkPattern.exec(html)) !== null) {
      const fullUrl = match[1];
      const linkText = match[2].trim();

      // Guardrail: only accept gscplanning.com URLs
      if (!fullUrl.includes('gscplanning.com')) continue;

      const key = 'plan-seen:' + fullUrl;
      if (await env.KV.get(key)) continue;
      await env.KV.put(key, '1', { expirationTtl: 31536000 });

      // Try to parse a date from the link text (e.g. "January 14, 2025 Minutes")
      const d     = new Date(linkText);
      const valid = d instanceof Date && !isNaN(d) && d.getFullYear() > 2000;
      newItems.push({
        guid:      fullUrl,
        title:     linkText || 'Planning Commission Meeting',
        sum:       'Georgetown-Scott County Planning Commission meeting record. Source: gscplanning.com',
        url:       fullUrl,
        mo:        valid ? MONTHS[d.getMonth()] : MONTHS[new Date().getMonth()],
        dy:        valid ? String(d.getDate()).padStart(2, '0') : String(new Date().getDate()).padStart(2, '0'),
        yr:        valid ? String(d.getFullYear()) : String(new Date().getFullYear()),
        type:      'Minutes',
        topics:    ['planning', 'zoning'],
        category:  'Planning Commission',
        freshness: 'Live',
        pipeline:  true,
        fetchedAt: new Date().toISOString(),
      });
    }
  } catch(e) { console.error('[planning] scrape failed:', e.message); }

  if (newItems.length > 0) await updateKVRecords(newItems, env);
  await writeStatus(env, 'lastPlanningRun', newItems.length, 'planningNew');
  console.log('[planning] done — new:', newItems.length);
}

// ── Status writer ─────────────────────────────────────────────────────────────
// Merges a single key into the poll-status KV object so each poller updates
// its own slice without overwriting the others.

async function writeStatus(env, tsKey, value, countKey) {
  try {
    const prev   = JSON.parse((await env.KV.get('poll-status')) || '{}');
    const update = { ...prev, [tsKey]: new Date().toISOString(), [countKey]: value };
    await env.KV.put('poll-status', JSON.stringify(update), { expirationTtl: 604800 }); // 7 days
  } catch(e) { console.error('[status]', e.message); }
}

// ── AI Processing: PDF summarization + enrichment ────────────────────────────

async function processNewItems(items, env) {
  // Phase 1: deep summarization for PDF agenda/minutes files
  for (const item of items) {
    if (!item.url?.endsWith('.pdf')) continue;
    try {
      const pdfText  = await fetchAndExtractPDF(item.url);
      const isGMWSS  = item.category === 'GMWSS';
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key':         env.ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type':      'application/json',
        },
        body: JSON.stringify({
          model:      'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: isGMWSS
            ? `Summarize this GMWSS board meeting in JSON. Only include facts stated in the document.
{"summary":"2-3 sentence overview","topics":["water","rates","capital"],"decisions":[{"text":"...","result":"approved|tabled|discussed"}],"amounts":["$X for Y"],"rateChanges":["any rate changes mentioned"]}
Return raw JSON only.`
            : `Summarize this Georgetown KY city council meeting in JSON:
{"summary":"2-3 sentence overview","topics":["motion","finance"],"motions":[{"text":"...","result":"..."}],"amounts":["$X for Y"]}
Return raw JSON only.`,
          messages: [{ role: 'user', content: pdfText.slice(0, 8000) }],
        }),
      });
      const data   = await response.json();
      const parsed = JSON.parse((data.content[0]?.text || '{}').replace(/```json|```/g, '').trim());
      item.sum          = parsed.summary    || item.sum;
      item.topics       = parsed.topics     || item.topics;
      item.aiSummarized = true;
      if (parsed.rateChanges?.length) item.rateChanges = parsed.rateChanges;
    } catch(e) { console.error('[summarizer]', e.message); }
  }

  // Phase 2: enrich all items via enricher.js
  for (const item of items) {
    try {
      const enriched = await enrichItem(item, env);
      Object.assign(item, enriched);
    } catch(e) { console.error('[enricher]', item.guid, e.message); }
  }

  await updateKVRecords(items, env);
}

async function fetchAndExtractPDF(url) {
  const res  = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`);
  const buf  = await res.arrayBuffer();
  const text = new TextDecoder('utf-8', { fatal: false }).decode(buf);
  return text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{3,}/g, ' ');
}
