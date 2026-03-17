const FEEDS = [
  { cat: 'City Council',  cid: 'City-Council-1'           },
  { cat: 'Finance',       cid: 'Finance-Committee-2'       },
  { cat: 'Fire',          cid: 'Fire-Committee-3'          },
  { cat: 'Traffic',       cid: 'Traffic-Committee-4'       },
  { cat: 'Police',        cid: 'Police-Committee-5'        },
  { cat: 'Public Works',  cid: 'Public-Works-Committee-6'  },
  { cat: 'Interlocal',    cid: 'Interlocal-Committee-7'    },
  { cat: 'Miscellaneous', cid: 'Miscellaneous-Committees-10' },
];
const BASE = 'https://www.georgetownky.gov/RSSFeed.aspx?ModID=65&CID=';

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
      const prev   = await getKVRecords(env);
      const merged = [...newItems, ...prev].slice(0, 500);
      await env.KV.put('records', JSON.stringify(merged));
      if (env.ANTHROPIC_KEY) ctx.waitUntil(summarizeNewItems(newItems, env));
    }
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    if (url.pathname === '/records') {
      const body = (await env.KV.get('records')) || '[]';
      return new Response(body, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public,max-age=900',
        }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};

// ── KV helpers ───────────────────────────────────────────────────────────────

async function getKVRecords(env) {
  try {
    const raw = await env.KV.get('records');
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

// ── RSS Parser ──────────────────────────────────────────────────────────────

function parseRSS(xml, category) {
  const items = [];
  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  for (const [, block] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const get = tag => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
             || block.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`));
      return m ? m[1].trim() : '';
    };
    const pubDate = new Date(get('pubDate'));
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

// ── AI Summarizer (Phase 2, requires ANTHROPIC_KEY) ─────────────────────────

async function summarizeNewItems(items, env) {
  for (const item of items) {
    if (!item.url?.endsWith('.pdf')) continue;
    try {
      const pdfText  = await fetchAndExtractPDF(item.url);
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: `Summarize this Georgetown KY city council meeting in JSON:
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
    } catch(e) { console.error('Summarizer:', e); }
  }
  await updateKVRecords(items, env);
}

async function fetchAndExtractPDF(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`);
  const buf  = await res.arrayBuffer();
  const text = new TextDecoder('utf-8', { fatal: false }).decode(buf);
  return text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{3,}/g, ' ');
}

async function updateKVRecords(updatedItems, env) {
  const all  = await getKVRecords(env);
  const map  = new Map(all.map(r => [r.guid, r]));
  for (const item of updatedItems) map.set(item.guid, item);
  const merged = [...map.values()].slice(0, 500);
  await env.KV.put('records', JSON.stringify(merged));
}
