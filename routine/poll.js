#!/usr/bin/env node
/**
 * Georgetown Records — Claude Polling Routine
 *
 * Polls all public record sources, prints a formatted report of new items,
 * and optionally pushes them to the live Cloudflare KV store.
 *
 * Usage:
 *   node poll.js               # poll and print report (no writes)
 *   node poll.js --apply       # poll, print, and push to Cloudflare KV
 *
 * Required env vars:
 *   ANTHROPIC_KEY              # Claude API key (Haiku)
 *
 * Required for --apply:
 *   CLOUDFLARE_ACCOUNT_ID      # Cloudflare account ID
 *   CLOUDFLARE_API_TOKEN       # Cloudflare API token with KV Write permission
 *   CLOUDFLARE_KV_NAMESPACE_ID # KV namespace ID from wrangler.toml
 *
 * Optional:
 *   WORKER_URL                 # Worker base URL for idempotency check
 *                              # (default: https://gtky-pipeline.altanetworks.workers.dev)
 *   MAX_API_CALLS              # Max Claude API calls per run (default: 15, cost guardrail)
 */

import Anthropic from '@anthropic-ai/sdk';

// ── Config ────────────────────────────────────────────────────────────────────

const APPLY      = process.argv.includes('--apply');
const WORKER_URL = process.env.WORKER_URL || 'https://gtky-pipeline.altanetworks.workers.dev';
const MAX_CALLS  = parseInt(process.env.MAX_API_CALLS || '15', 10);

if (!process.env.ANTHROPIC_KEY) {
  console.error('Error: ANTHROPIC_KEY environment variable is required.');
  process.exit(1);
}

if (APPLY) {
  for (const v of ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_KV_NAMESPACE_ID']) {
    if (!process.env[v]) {
      console.error(`Error: ${v} is required when running with --apply.`);
      process.exit(1);
    }
  }
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_KEY });
let apiCallCount = 0;

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

// Domains that are valid sources. Any URL not matching these is rejected before
// being stored or passed to Claude.
const ALLOWED_DOMAINS = [
  'georgetownky.gov',
  'gmwss.com',
  'gscplanning.com',
  'scottky.gov',
];

// ── Guardrail: cost cap ───────────────────────────────────────────────────────

async function callHaiku(systemText, userContent) {
  if (apiCallCount >= MAX_CALLS) {
    console.warn(`  [cost-cap] Reached MAX_API_CALLS=${MAX_CALLS} — skipping further Claude calls`);
    return null;
  }
  apiCallCount++;
  const msg = await client.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    // Cache the system prompt to avoid re-tokenising it across back-to-back calls.
    system: [{ type: 'text', text: systemText, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userContent }],
  });
  return msg.content[0]?.text?.trim() || '';
}

// ── Guardrail: JSON schema validation ─────────────────────────────────────────

function safeParseJSON(text, fallback) {
  if (!text) return fallback;
  try {
    const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
    return JSON.parse(clean);
  } catch {
    return fallback;
  }
}

// ── Guardrail: URL domain allowlist ───────────────────────────────────────────

function isAllowedUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== 'https:' && protocol !== 'http:') return false;
    return ALLOWED_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
  } catch { return false; }
}

// ── Fetch with timeout + content cap ─────────────────────────────────────────
// maxChars caps what we store in memory and pass to Claude.

async function safeFetch(url, maxChars = 200_000) {
  const res = await fetch(url, {
    signal:  AbortSignal.timeout(12_000),
    headers: { 'User-Agent': 'GTKYRecords/1.0 (public records research; contact: alta01)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  const text = await res.text();
  return text.slice(0, maxChars);
}

// ── Rate-limit helper: pause between same-domain requests ────────────────────

const _lastFetch = {};
async function throttledFetch(url, maxChars) {
  const host = new URL(url).hostname;
  const last = _lastFetch[host] || 0;
  const wait = 300 - (Date.now() - last); // 300 ms minimum between same-domain hits
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  _lastFetch[host] = Date.now();
  return safeFetch(url, maxChars);
}

// ── Idempotency: load already-known URLs from the live worker ─────────────────

async function loadKnownUrls() {
  try {
    const res  = await fetch(`${WORKER_URL}/records`, { signal: AbortSignal.timeout(8_000) });
    if (!res.ok) return new Set();
    const items = await res.json();
    return new Set(Array.isArray(items) ? items.map(i => i.url).filter(Boolean) : []);
  } catch(e) {
    console.warn('  [idempotency] Could not reach worker — deduplication skipped:', e.message);
    return new Set();
  }
}

// ── RSS parser ────────────────────────────────────────────────────────────────

function parseRSS(xml, category) {
  const items = [];
  for (const [, block] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const get = tag => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
             || block.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`));
      return m ? m[1].trim() : '';
    };
    const pubDate = new Date(get('pubDate'));
    if (isNaN(pubDate)) continue; // guardrail: skip items with bad dates
    const url = get('link');
    if (!isAllowedUrl(url)) continue; // guardrail: domain allowlist
    items.push({
      guid:     get('guid') || url,
      title:    get('title').slice(0, 200),
      sum:      get('description').replace(/<[^>]+>/g, '').trim().slice(0, 300),
      url,
      mo:       MONTHS[pubDate.getMonth()],
      dy:       String(pubDate.getDate()).padStart(2, '0'),
      yr:       String(pubDate.getFullYear()),
      type:     get('title').includes('Special') ? 'Special' : 'Regular',
      topics:   inferTopics(category),
      category,
      freshness: 'Live',
      pipeline:  true,
      fetchedAt: new Date().toISOString(),
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
  })[cat] || ['motion'];
}

// ── 1. City RSS feeds ─────────────────────────────────────────────────────────

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
const BASE = 'https://www.georgetownky.gov/RSSFeed.aspx?ModID=65&CID=';

async function pollCityFeeds(knownUrls) {
  const found = [];
  for (const feed of FEEDS) {
    try {
      const xml   = await throttledFetch(BASE + feed.cid, 500_000);
      const items = parseRSS(xml, feed.cat);
      for (const item of items) {
        if (knownUrls.has(item.url)) continue;
        found.push(item);
      }
    } catch(e) {
      console.error(`  [rss] ${feed.cat}: ${e.message}`);
    }
  }
  return found;
}

// ── 2. GMWSS board minutes ────────────────────────────────────────────────────

async function pollGMWSS(knownUrls) {
  const found = [];
  try {
    const html       = await throttledFetch('https://gmwss.com/board.htm', 300_000);
    const pdfPattern = /href="([^"]*board\/minutes\/[^"]+\.pdf)"/gi;
    let match;
    while ((match = pdfPattern.exec(html)) !== null) {
      const path    = match[1];
      const fullUrl = path.startsWith('http') ? path : 'https://gmwss.com' + path;

      if (!isAllowedUrl(fullUrl)) continue;
      if (knownUrls.has(fullUrl)) continue;

      // Guardrail: reject filenames that don't parse to a valid date
      const dateMatch = path.match(/(\d{1,2})-(\d{1,2})-(\d{4})\.pdf$/);
      if (!dateMatch) continue;
      const d = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[1]) - 1, parseInt(dateMatch[2]));
      if (isNaN(d)) continue;

      found.push({
        guid:      fullUrl,
        title:     `GMWSS Board of Commissioners — ${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}, ${d.getFullYear()}`,
        sum:       'Monthly meeting of the Georgetown Municipal Water & Sewer Service Board of Commissioners. Source: gmwss.com/board.htm',
        url:       fullUrl,
        mo:        MONTHS[d.getMonth()],
        dy:        String(d.getDate()).padStart(2, '0'),
        yr:        String(d.getFullYear()),
        type:      'Minutes',
        topics:    ['water', 'gmwss', 'utility'],
        category:  'GMWSS',
        freshness: 'Live',
        pipeline:  true,
        fetchedAt: new Date().toISOString(),
      });
    }
  } catch(e) {
    console.error('  [gmwss]', e.message);
  }
  return found;
}

// ── 3. Water rate check ───────────────────────────────────────────────────────

async function checkWaterRates() {
  try {
    const html = await throttledFetch('https://gmwss.com/rates.htm', 100_000);

    // Use Claude to extract current rates from the HTML — the rates page layout
    // may change, so we rely on semantic understanding rather than a fragile regex.
    const raw = await callHaiku(
      'You extract utility rate data from HTML pages. Return ONLY raw JSON matching this schema exactly: ' +
      '{"waterFixed":number,"sewerFixed":number,"effectiveDate":"string or null"} ' +
      'where waterFixed and sewerFixed are the monthly fixed charges (in dollars) for the first 2,000 gallons. ' +
      'If you cannot confidently determine a value, use null. No markdown, no explanation.',
      `Extract the current fixed monthly rates from this Georgetown Municipal Water & Sewer Service rates page HTML:\n\n${html.slice(0, 8000)}`,
    );

    const rates = safeParseJSON(raw, null);

    // Guardrail: validate shape and plausible dollar range ($10–$100)
    if (
      !rates ||
      typeof rates.waterFixed !== 'number' ||
      rates.waterFixed < 10 ||
      rates.waterFixed > 100
    ) {
      console.warn('  [water] Claude could not extract valid rate data — skipping');
      return null;
    }
    return rates;
  } catch(e) {
    console.error('  [water]', e.message);
    return null;
  }
}

// ── 4. Planning commission ────────────────────────────────────────────────────

async function pollPlanning(knownUrls) {
  const found = [];
  try {
    const html = await throttledFetch('https://www.gscplanning.com/meetingrecords', 300_000);

    const raw = await callHaiku(
      'You extract meeting record links from HTML pages for a planning commission website. ' +
      'Return ONLY a raw JSON array (no markdown) of up to 10 objects matching: ' +
      '[{"title":"string","url":"string","date":"YYYY-MM-DD or null"}]. ' +
      'Only include direct links to agendas or meeting minutes (PDFs or HTML pages). ' +
      'URLs must be absolute (https://). Do not invent or guess URLs.',
      `Extract meeting record links from this Georgetown-Scott County Planning Commission page:\n\n${html.slice(0, 8000)}`,
    );

    const links = safeParseJSON(raw, []);
    if (!Array.isArray(links)) return found;

    for (const link of links.slice(0, 10)) {
      // Guardrail: validate URL is from an allowed domain
      if (!isAllowedUrl(link.url)) continue;
      if (knownUrls.has(link.url)) continue;

      const d     = link.date ? new Date(link.date) : null;
      const valid = d instanceof Date && !isNaN(d) && d.getFullYear() > 2000;
      found.push({
        guid:      link.url,
        title:     (link.title || 'Planning Commission Meeting').slice(0, 200),
        sum:       'Georgetown-Scott County Planning Commission meeting record. Source: gscplanning.com',
        url:       link.url,
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
  } catch(e) {
    console.error('  [planning]', e.message);
  }
  return found;
}

// ── Cloudflare KV push (--apply mode) ─────────────────────────────────────────

async function pushToKV(newItems) {
  const accountId   = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken    = process.env.CLOUDFLARE_API_TOKEN;
  const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;

  // Fetch current KV records to merge
  const kvRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/records`,
    { headers: { Authorization: `Bearer ${apiToken}` } },
  );
  let existing = [];
  if (kvRes.ok) {
    try { existing = await kvRes.json(); } catch { existing = []; }
  }
  if (!Array.isArray(existing)) existing = [];

  const map = new Map(existing.map(r => [r.guid, r]));
  for (const item of newItems) map.set(item.guid, item);
  const merged = [...map.values()].slice(0, 500);

  const putRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/records`,
    {
      method:  'PUT',
      headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(merged),
    },
  );
  if (!putRes.ok) {
    const body = await putRes.text();
    throw new Error(`KV PUT failed (${putRes.status}): ${body}`);
  }
}

// ── Output formatter ──────────────────────────────────────────────────────────

function printReport(rss, gmwss, planning, waterRates) {
  const total = rss.length + gmwss.length + planning.length;
  const hr    = '─'.repeat(52);

  console.log(`\n${hr}`);
  console.log('Georgetown Records — Poll Report');
  console.log(`Run: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET`);
  console.log(hr);

  if (total === 0 && !waterRates) {
    console.log('\nNo new records found. All sources are up to date.');
  }

  if (rss.length > 0) {
    console.log(`\nCity RSS Feeds  (${rss.length} new)`);
    for (const item of rss) {
      console.log(`  [${item.category.padEnd(14)}] ${item.mo} ${item.dy} ${item.yr}  ${item.title.slice(0, 55)}`);
    }
  }

  if (gmwss.length > 0) {
    console.log(`\nGMWSS Board Minutes  (${gmwss.length} new)`);
    for (const item of gmwss) {
      console.log(`  ${item.mo} ${item.dy} ${item.yr}  ${item.title.slice(0, 55)}`);
      console.log(`    ${item.url}`);
    }
  }

  if (planning.length > 0) {
    console.log(`\nPlanning Commission  (${planning.length} new)`);
    for (const item of planning) {
      console.log(`  ${item.mo} ${item.dy} ${item.yr}  ${item.title.slice(0, 55)}`);
    }
  }

  if (waterRates) {
    console.log('\nWater Rates (current)');
    console.log(`  Water fixed (first 2,000 gal): $${waterRates.waterFixed}/mo`);
    if (waterRates.sewerFixed != null) {
      console.log(`  Sewer fixed (first 2,000 gal): $${waterRates.sewerFixed}/mo`);
    }
    if (waterRates.effectiveDate) {
      console.log(`  Effective: ${waterRates.effectiveDate}`);
    }
  }

  console.log(`\n${hr}`);
  console.log(`Total new records: ${total}`);
  console.log(`Claude API calls used: ${apiCallCount}/${MAX_CALLS}`);
  if (!APPLY && total > 0) {
    console.log('\nRe-run with --apply to push these records to Cloudflare KV.');
  }
  console.log(hr + '\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nGeorgetown Records — Claude Polling Routine`);
  console.log(`Mode: ${APPLY ? 'APPLY (will push to Cloudflare KV)' : 'report-only (no writes)'}`);
  console.log(`API call budget: ${MAX_CALLS} Claude calls\n`);

  console.log('Loading known URLs from worker...');
  const knownUrls = await loadKnownUrls();
  console.log(`  ${knownUrls.size} URLs already in KV\n`);

  // Poll all sources — each in its own try/catch so one failure can't abort others.
  console.log('Polling city RSS feeds (8 committees)...');
  const rss = await pollCityFeeds(knownUrls);
  console.log(`  → ${rss.length} new items`);

  console.log('Polling GMWSS board minutes...');
  const gmwss = await pollGMWSS(knownUrls);
  console.log(`  → ${gmwss.length} new items`);

  console.log('Checking GMWSS water rates...');
  const waterRates = await checkWaterRates();
  console.log(`  → ${waterRates ? `$${waterRates.waterFixed} water / $${waterRates.sewerFixed ?? '?'} sewer` : 'could not parse'}`);

  console.log('Polling planning commission...');
  const planning = await pollPlanning(knownUrls);
  console.log(`  → ${planning.length} new items`);

  printReport(rss, gmwss, planning, waterRates);

  const allNew = [...rss, ...gmwss, ...planning];
  if (!APPLY || allNew.length === 0) return;

  console.log(`Pushing ${allNew.length} new records to Cloudflare KV...`);
  try {
    await pushToKV(allNew);
    console.log('  Done.\n');
  } catch(e) {
    console.error('  KV push failed:', e.message);
    process.exit(1);
  }
}

main().catch(e => {
  console.error('\nFatal error:', e.message);
  process.exit(1);
});
