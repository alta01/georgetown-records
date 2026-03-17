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
  const officialCtx = await buildOfficialContext(item, env);
  return callHaiku(item, sourceText, officialCtx, env);
}

async function fetchSourceText(url) {
  if (!url) return '';
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return '';
    const text = await res.text();
    return text.replace(/<[^>]+>/g, ' ').replace(/\s{3,}/g, ' ').trim().slice(0, 5000);
  } catch {
    return '';
  }
}

async function buildOfficialContext(item, env) {
  // Pull any previously stored context from KV
  const key = 'ctx:' + (item.guid || item.url || '');
  const cached = await env.KV.get(key);
  if (cached) return cached;
  // Attempt to fetch a brief blurb from the highest-priority matching source
  for (const src of SOURCES.filter(s => s.priority === 1)) {
    try {
      const res = await fetch(src.base, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const snippet = (await res.text()).slice(0, 1000);
        return `[${src.name}] ${snippet}`;
      }
    } catch { /* skip */ }
  }
  return '';
}

async function callHaiku(item, sourceText, ctx, env) {
  const prompt = `Enrich this Georgetown KY public record entry.
Item: ${JSON.stringify({ date: `${item.mo} ${item.dy} ${item.yr}`, title: item.title, text: item.sum })}
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
    sources_used:   parsed.sources_used   || [],
    accuracy_notes: parsed.accuracy_notes || '',
    enriched:       true,
    enriched_at:    new Date().toISOString(),
  };
}
