const SOURCES = [
  { name: 'City Minutes',   base: 'https://www.georgetownky.gov/AgendaCenter', priority: 1 },
  { name: 'City Directory', base: 'https://www.georgetownky.gov/Directory.aspx', priority: 1 },
  { name: 'Doc Center',     base: 'https://www.georgetownky.gov/DocumentCenter', priority: 1 },
  { name: 'Planning Comm.', base: 'https://www.gscplanning.com', priority: 2 },
  { name: 'Scott County',   base: 'https://scottky.gov', priority: 2 },
  { name: 'News-Graphic',   base: 'https://www.news-graphic.com', priority: 3 },
];

export async function enrichItem(item, env) {
  const sourceText  = await fetchSourceText(item.url);
  const officialCtx = await getCachedContext(item, env);
  const result      = await callHaiku(item, sourceText, officialCtx, env);
  // Cache the enriched context so future runs don't re-fetch
  if (result.enriched) {
    await env.KV.put('ctx:' + (item.guid || item.url), result.summary, { expirationTtl: 2592000 }); // 30 days
  }
  return result;
}

async function fetchSourceText(url) {
  if (!url) return '';
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GTKYRecords/1.0)' },
    });
    if (!res.ok) return '';
    const text = await res.text();
    return text.replace(/<[^>]+>/g, ' ').replace(/\s{3,}/g, ' ').trim().slice(0, 5000);
  } catch {
    return '';
  }
}

async function getCachedContext(item, env) {
  const key = 'ctx:' + (item.guid || item.url || '');
  return (await env.KV.get(key)) || '';
}

function identifySource(url) {
  if (!url) return 'Unknown';
  for (const src of SOURCES) {
    if (url.includes(new URL(src.base).hostname)) return src.name;
  }
  return 'Unknown';
}

async function callHaiku(item, sourceText, ctx, env) {
  const sourceName = identifySource(item.url);
  const prompt = `Enrich this Georgetown KY public record entry.
Item: ${JSON.stringify({ date: `${item.mo} ${item.dy} ${item.yr}`, title: item.title, text: item.sum })}
Source: ${sourceName}
Source text: ${sourceText.slice(0, 3000)}
${ctx ? `Prior context: ${ctx}` : ''}

Return ONLY raw JSON:
{
  "summary": "2-4 sentence plain-English explanation for residents",
  "confidence": "high|medium|low",
  "sources_used": ["${sourceName}"],
  "accuracy_notes": "any discrepancies or empty string"
}
Rules: official sources override secondary; never invent facts; if source text is empty set confidence to low`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data   = await res.json();
    const parsed = JSON.parse((data.content?.[0]?.text || '{}').replace(/```json|```/g, '').trim());
    return {
      summary:        parsed.summary        || item.sum,
      confidence:     parsed.confidence     || 'low',
      sources_used:   parsed.sources_used   || [sourceName],
      accuracy_notes: parsed.accuracy_notes || '',
      enriched:       true,
      enriched_at:    new Date().toISOString(),
    };
  } catch(e) {
    console.error('callHaiku:', e);
    return { summary: item.sum, confidence: 'low', sources_used: [], accuracy_notes: '', enriched: false };
  }
}
