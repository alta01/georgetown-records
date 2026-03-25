import { DEPTS, PLANNING } from './data/directory.js';
import { MEETINGS } from './data/meetings.js';
import { VOTES, MEMBERS_FULL } from './data/votes.js';
import { ORDINANCES } from './data/ordinances.js';

// ═══════════════════════════════════════════════════════
// FACT-CHECK AGENT — multi-source verification
// ═══════════════════════════════════════════════════════

/**
 * Build a comprehensive context string from ALL ingested data.
 * This is the primary evidence base the LLM uses to verify claims.
 */
export function buildCtx() {
  // ── People ─────────────────────────────────────────────────────────────
  const people = [];
  [...DEPTS, ...PLANNING].forEach(d => d.members.forEach(m => {
    const parts = [m.name];
    if (m.title) parts.push(`title: ${m.title}`);
    if (m.notes) parts.push(m.notes.slice(0, 120));
    if (m.bio)   parts.push(m.bio.slice(0, 200));
    people.push(parts.join(' | '));
  }));

  // ── Votes (last 30) ───────────────────────────────────────────────────
  const voteSummaries = VOTES.slice(0, 30).map(v => {
    const voters = Object.entries(v.votes)
      .map(([k, code]) => `${MEMBERS_FULL[k]?.full || k}:${code}`)
      .join(', ');
    return `${v.date}: "${v.motion}" → ${v.result} [${voters}]${v.sig ? ' — ' + v.sig.slice(0, 150) : ''}`;
  });

  // ── Meetings (last 15) ────────────────────────────────────────────────
  const meetSummaries = MEETINGS.slice(0, 15).map(m =>
    `${m.mo} ${m.dy} ${m.yr} (${m.type}): ${m.title} — ${(m.sum || '').slice(0, 200)}`
  );

  // ── Ordinances (last 20) ──────────────────────────────────────────────
  const ordSummaries = ORDINANCES.slice(0, 20).map(o =>
    `Ord. ${o.num} (${o.year}): ${o.title} [${o.type}] — ${(o.summary || '').slice(0, 150)}`
  );

  return `=== GEORGETOWN KY PUBLIC RECORDS — VERIFIED DATASET (as of Mar 2026) ===

This dataset is the PRIMARY source of truth. It is compiled from official city government records, council meeting minutes, and public documents. If a claim can be verified or refuted using this data, DO SO — do not say "Insufficient Data" when the answer is here.

── OFFICIALS & STAFF (${people.length} records) ──
${people.join('\n')}

── COUNCIL VOTES (${voteSummaries.length} most recent) ──
${voteSummaries.join('\n')}

── MEETING MINUTES (${meetSummaries.length} most recent) ──
${meetSummaries.join('\n')}

── ORDINANCES (${ordSummaries.length} most recent) ──
${ordSummaries.join('\n')}

── KEY FACTS ──
Mayor: Burney Jenkins (elected Nov 2022, first Black mayor, 58.7% of vote, defeated David Lusby). Took office Jan 2023.
CAO: Devon Golden (promoted from City Attorney Mar 2023, Georgetown College 2013, NKU Chase Law 2016).
City Attorney: Emilee A. Buttrum (succeeded Golden).
Police Chief: Darin Allgood (appointed Jan 13 2023, GPD since 2012, FBI Academy Class 284).
Fire Chief: Seth Johnson (confirmed Dec 2025).
Council (8 at-large): Sonja Wilkins Brent, Michael Crisp (new Jan 2025), Willow Hambrick, Greg Hampton, Kim Menke (new Jan 2025), Tammy Lusby Mitchell, Karen Tingle Sames, Todd Stone.
Budget: ~$44M general fund; $23.6M fund balance Jun 30 2025; ~$1.5M actual deficit (vs $7.2M budgeted); 245 FT employees.
Toyota TMMK: $11B+ total investment, ~10,000 employees, 550K vehicles/yr, $204.4M hybrid expansion Nov 2025, $922M paint facility Dec 2024, $1.3B BEV SUV 2026.
Scott County pop: ~37,086 (2020 Census).`;
}

export function pfill(t) { document.getElementById('fc-input').value = t; document.getElementById('fc-input').focus(); }

export async function runFC() {
  const stmt = document.getElementById('fc-input').value.trim(); if (!stmt) return;
  const btn = document.getElementById('fc-btn'), loading = document.getElementById('fc-loading'), result = document.getElementById('fc-result');
  btn.disabled = true; loading.classList.add('show'); result.classList.remove('show');
  try {
    // Route through Cloudflare Worker proxy to avoid exposing API keys client-side.
    // SECURITY: Never put API keys in client-side JavaScript — they are visible in
    // DevTools, browser history, and cached responses. The worker holds the key as a secret.
    const FC_PROXY = 'https://gtky-pipeline.altanetworks.workers.dev/factcheck';
    const res = await fetch(FC_PROXY, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ statement: stmt, context: buildCtx() }) });
    const p = await res.json();
    // Worker now returns parsed fact-check JSON directly.
    // If it has a verdict field, it's already clean. If not, something went wrong.
    if (!p.verdict) {
      // Fallback: handle raw Anthropic envelope (old worker version)
      let raw = (p.content||[]).map(c=>c.text||'').join('').trim();
      raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
      try { Object.assign(p, JSON.parse(raw)); }
      catch { p.verdict = 'Insufficient Data'; p.confidence = 'Low'; p.summary = (p.error || raw || 'Unknown error').slice(0, 500); p.evidence = []; p.discrepancies = []; p.sources = []; p.source_tier = 'unknown'; }
    }

    // ── Client-side confidence overlay ──────────────────────────────────
    // The LLM returns a source_tier. We use it to validate/adjust the
    // confidence score and add a visual indicator of source quality.
    const tierLabels = {
      'dataset':  '📊 Verified from city records dataset',
      'dataset+external': '📊+🌐 Dataset confirmed by external sources',
      'external': '🌐 Based on external/general knowledge',
      'mixed':    '📊+🌐 Partial dataset match, supplemented externally',
      'unknown':  '❓ Source basis unclear',
    };
    const tierKey = p.source_tier || 'unknown';
    const tierLabel = tierLabels[tierKey] || tierLabels['unknown'];

    const vm = {
      'Supported':            {v:'v-sup',  b:'vb-sup',  i:'✅'},
      'Partially Supported':  {v:'v-part', b:'vb-part', i:'⚠️'},
      'Unsupported':          {v:'v-uns',  b:'vb-uns',  i:'❌'},
      'Insufficient Data':    {v:'v-unk',  b:'vb-unk',  i:'❓'},
    };
    const v = vm[p.verdict]||vm['Insufficient Data'];
    const _esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

    document.getElementById('fc-verdict').innerHTML = `<span class="${v.v}">${v.i} ${_esc(p.verdict)}</span>&nbsp;<span class="vbadge ${v.b}">${_esc(p.confidence||'')} confidence</span>`;

    let body = `<p>${_esc(p.summary||'')}</p>`;
    body += `<div style="margin-top:8px;padding:6px 10px;background:var(--bg-2);border-radius:var(--r-sm);font-size:11px;color:var(--ink-3)">${tierLabel}</div>`;
    if (p.evidence?.length)      body += `<p style="margin-top:8px"><strong>Evidence:</strong></p><ul style="padding-left:16px;margin-top:3px">${p.evidence.map(e=>`<li style="font-size:12px;margin-bottom:2px">${_esc(e)}</li>`).join('')}</ul>`;
    if (p.discrepancies?.length) body += `<p style="margin-top:8px"><strong>Discrepancies:</strong></p><ul style="padding-left:16px;margin-top:3px">${p.discrepancies.map(d=>`<li style="font-size:12px;color:var(--red-2);margin-bottom:2px">${_esc(d)}</li>`).join('')}</ul>`;

    document.getElementById('fc-body').innerHTML = body;
    document.getElementById('fc-sources').innerHTML = p.sources?.length ? `<strong>Sources:</strong> ${p.sources.map(s => _esc(s)).join('; ')}` : '';
    result.classList.add('show');
  } catch(err) {
    document.getElementById('fc-verdict').innerHTML = '<span class="v-unk">⚠️ Error</span>';
    const _e = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    document.getElementById('fc-body').innerHTML = `<p>Fact-check requires the Cloudflare Worker proxy with an <code>ANTHROPIC_KEY</code> secret configured. See the Pipeline tab for deployment instructions. Error: ${_e(err.message)}</p>`;
    document.getElementById('fc-sources').innerHTML = ''; result.classList.add('show');
  }
  btn.disabled = false; loading.classList.remove('show');
}
