import { DEPTS, PLANNING } from './data/directory.js';

// ═══════════════════════════════════════════════════════
// FACT-CHECK AGENT
// ═══════════════════════════════════════════════════════
export function buildCtx() {
  // Build dynamic context from live data arrays for maximum coverage
  const people = [];
  [...DEPTS, ...PLANNING].forEach(d => d.members.forEach(m => {
    if (m.name && !m.name.includes('Division') && !m.name.includes('Department') && !m.name.includes('Committee') && !m.name.includes('Board') && !m.name.includes('Commission') && m.ini && m.ini.length === 2) {
      people.push(`${m.name} (${m.title}${m.notes ? '; ' + m.notes.slice(0,80) : ''})`);
    }
  }));
  return `GEORGETOWN KY PUBLIC RECORDS CONTEXT (Mar 2026)
KEY OFFICIALS: Mayor Burney Jenkins (elected 2022, first Black mayor in Georgetown history); CAO Devon Golden (City Attorney→CAO Mar 2023, Georgetown College 2013, NKU Chase Law 2016); City Clerk-Treasurer Tracie Hoffman; City Attorney Emilee Buttrum; Police Chief Darin Allgood (appointed Jan 13 2023; GPD since 2012; FBI Academy Class 284); Asst Chief Josh Nash (promoted Feb 14 2023; GPD since 2011; FBI Academy Class 286); Fire Chief Seth Johnson (confirmed Dec 2025); Finance Director Stacey Clark CPA; Tourism Exec Dir Lori Cooper Saunders (2025 KACVB President); Planning Commission Director Joe Kane; GSCPC (502-867-3701, 230 E Main St).
COUNCIL (8 at-large): Sonja Wilkins Brent, Michael Crisp (new Jan 2025), Willow Hambrick, Greg Hampton, Kim Menke (new Jan 2025), Tammy Lusby Mitchell, Karen Tingle Sames, Todd Stone.
COUNCIL COMMITTEES: Finance Committee, Traffic Committee, Public Works Committee — standing sub-committees with separate meeting agendas.
BOARDS & COMMISSIONS: GMWSS Board (Baird, Chandler reappointed Nov 2025; Klocke tabled Dec 8); Board of Adjustment (Frank Allen, Virginia Teague reappointed Nov 2025); Board of Ethics (Causey-Upton, Cozzi reappointed Nov 2025); Housing Authority (Patricia Harman reappointed Nov 2025); Human Rights Commission (April Baker reappointed Nov 2025, 7-0/1 recusal); Georgetown Arts & Cultural Commission (GACC, gtownacc.com, A-Tax/H-Tax funded); Sister City Committee (est. 1986, Toyota groundbreaking); Board of Assessment Appeals (KRS 133.020, PVA appeals); Construction Board of Appeals (KRS 65.8808, 7 members, 4 jurisdictions); Revenue Commission (502-603-5860, 230 E Main, gscrevenueky.gov, 3 jurisdictions).
SCOTT COUNTY GOVERNMENT: Fiscal Court (Judge/Executive, 3 Magistrates, 502-863-7850, scottky.gov); Scott County Clerk (deeds/records, 502-863-7875, scottcountyclerk.ky.gov); PVA (property assessments, 502-863-7885, 101 E Main Suite 203-206, scottkypva.com, qPublic searchable); Sheriff (law enforcement + tax collection, 502-863-7855, scottsheriffky.com); EMS (county-level, joint new station FY25 CIP); Detention Center. Scott County pop. ~37,086 (2020 Census).
KEY ACTIONS: Nov 24 2025: Resume requirement — Hampton/Menke UNANIMOUS. BVP Grant UNANIMOUS. Stockyards Bank MO UNANIMOUS. Board of Adjustment: Frank Allen (Stone, UNANIMOUS), Virginia Teague (Hambrick, UNANIMOUS). Board of Ethics: Causey-Upton (Lusby Mitchell, UNANIMOUS), Cozzi (Stone, UNANIMOUS). GMWSS: Baird APPROVED, Chandler APPROVED (new), Klocke TABLED to Dec 8. Housing Authority: Patricia Harman UNANIMOUS (Menke). Human Rights: April Baker 7-0 (Wilkins Brent recused — family member). Oct 1 2025: JAG $147,588 EXACT. LPR/Camera MO. VAWA grant. Sep 22 2025: AIG ratified. Sep 8 2025: Columbia Gas Ordinance (Lusby Mitchell sponsor). CAD Admin added. Jan 13 2023: Allgood appointed Chief. Feb 14 2023: Nash promoted. Mar 2023: Golden became CAO.
FINANCIALS: ~$44M general fund; $23.6M fund balance Jun 30 2025; ~$1.5M deficit (vs $7.2M budgeted); 245 FT employees; $1.2M+ stormwater FY25; new EMS station joint-funded with Scott County; stormwater utility fee study underway.
DATA SOURCES: georgetownky.gov (official), gscplanning.com (planning), scottky.gov (county), scottkypva.com (property), gscrevenueky.gov (occupational tax), gtownacc.com (arts), news-graphic.com (local paper).`; }

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
    const data = await res.json();
    let raw = (data.content||[]).map(c=>c.text||'').join('').replace(/```json|```/g,'').trim();
    let p; try { p = JSON.parse(raw); } catch { p = {verdict:'Insufficient Data',confidence:'Low',summary:raw.slice(0,300),evidence:[],discrepancies:[],sources:[]}; }
    const vm = {'Supported':{v:'v-sup',b:'vb-sup',i:'✅'},'Partially Supported':{v:'v-part',b:'vb-part',i:'⚠️'},'Unsupported':{v:'v-uns',b:'vb-uns',i:'❌'},'Insufficient Data':{v:'v-unk',b:'vb-unk',i:'❓'}};
    const v = vm[p.verdict]||vm['Insufficient Data'];
    const _esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    document.getElementById('fc-verdict').innerHTML = `<span class="${v.v}">${v.i} ${_esc(p.verdict)}</span>&nbsp;<span class="vbadge ${v.b}">${_esc(p.confidence||'')} confidence</span>`;
    let body = `<p>${_esc(p.summary||'')}</p>`;
    if (p.evidence?.length) body += `<p style="margin-top:8px"><strong>Evidence:</strong></p><ul style="padding-left:16px;margin-top:3px">${p.evidence.map(e=>`<li style="font-size:12px;margin-bottom:2px">${_esc(e)}</li>`).join('')}</ul>`;
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
