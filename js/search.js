// ═══════════════════════════════════════════════════════
// SEARCH (ES module)
// ═══════════════════════════════════════════════════════
import { _LOG } from './logger.js';
import { DEPTS, PLANNING } from './data/directory.js';
import { MEETINGS } from './data/meetings.js';
import { VOTES } from './data/votes.js';
import { ORDINANCES, TYPE_CSS, TYPE_LBL } from './data/ordinances.js';
import { RACES_CITY, RACES_COUNTY, RACES_STATE } from './data/elections.js';
import { scope, activeQ, setActiveQ, SCOPE_MAP, lidx, docMap, allDocs, setIndex,
         ordFilter, setOrdFilter, voteView, setVoteView,
         setScope as _setScope } from './state.js';

export function rebuildIndex() {
  try {

  let _allDocs = [];

  // ── 1. PEOPLE (City directory + Boards) ─────────────────────────────────
  [...DEPTS, ...PLANNING].forEach(dept => {
    dept.members.forEach(m => {
      const tagText    = (m.tags||[]).join(' ').replace(/t-/g,'');
      const bioExcerpt = (m.bio||'').slice(0,300);
      const statsText  = (m.stats||[]).map(s=>s.val+' '+s.lbl).join(' ');
      const socials    = (m.socials||[]).map(s=>(s.handle||'')+' '+(s.platform||'')).join(' ');
      _allDocs.push({
        id:'p-' + m.name.replace(/\W/g,'-'),
        type:'person', name:m.name, title:m.title, dept:dept.name,
        notes:m.notes||'', group:dept.group,
        text:`${m.name} ${m.title} ${dept.name} ${dept.desc||''} ${m.notes||''} ${m.ph||''} ${tagText} ${bioExcerpt} ${statsText} ${socials} ${dept.group}`
      });
    });
  });

  // ── 2. MEETING MINUTES ────────────────────────────────────────────────────
  MEETINGS.forEach((m, i) => {
    _allDocs.push({
      id:'m-'+i, type:'meeting', name:m.title, title:m.type,
      dept:String(m.yr), notes:m.sum, group:'meetings',
      text:`${m.title} ${m.sum} ${m.yr} ${m.mo} ${(m.topics||[]).join(' ')} ${(m.actions||[]).join(' ')}`
    });
  });

  // ── 3. COUNCIL VOTES ─────────────────────────────────────────────────────
  VOTES.forEach((v, i) => {
    const memberText = [...(v.yes||[]),...(v.no||[]),...(v.abstain||[])].join(' ');
    _allDocs.push({
      id:'v-'+i, type:'vote', name:v.motion, title:'Council Vote',
      dept:v.date, notes:v.sig||'', group:'votes',
      text:`${v.motion} ${v.date} ${v.yr} ${v.result} ${v.topic||''} ${v.type||''} ${v.sig||''} ${memberText} ${v.mover||''} ${v.seconder||''}`
    });
  });

  // ── 4. ORDINANCES ────────────────────────────────────────────────────────
  ORDINANCES.forEach((o, i) => {
    _allDocs.push({
      id:'ord-'+i, type:'ordinance', name:`Ordinance ${o.num}: ${o.title}`,
      title: o.type, dept: String(o.year), notes: o.summary||'', group:'ordinances',
      text:`ordinance ${o.num} ${o.title} ${o.type} ${o.year} ${o.summary||''} ${TYPE_LBL[o.type]||''}`
    });
  });

  // ── 5. ELECTION CANDIDATES ───────────────────────────────────────────────
  const allRaces = [...(RACES_CITY||[]), ...(RACES_COUNTY||[]), ...(RACES_STATE||[])];
  allRaces.forEach(race => {
    // Index the race itself
    _allDocs.push({
      id:'race-'+race.id, type:'election', name:race.name,
      title:'2026 Election', dept:'Elections', notes:race.intro||'', group:'elections',
      text:`election 2026 ${race.name} ${race.intro||''} ${race.meta||''} ${race.badgeLabel||''}`
    });
    // Index each candidate
    (race.candidates||[]).forEach((c, ci) => {
      const incText = c.incumbent ? 'incumbent' : 'challenger candidate';
      _allDocs.push({
        id:`cand-${race.id}-${ci}`, type:'election', name:c.name,
        title:`Candidate — ${race.name}`, dept:'Elections 2026',
        notes:c.notes||'', group:'elections',
        text:`${c.name} candidate ${race.name} 2026 election ${c.status||''} ${c.notes||''} ${incText} ${race.badgeLabel||''} primary general`
      });
    });
  });

  // ── 6. DEPARTMENTS & BOARDS (as standalone entities) ─────────────────────
  [...DEPTS, ...PLANNING].forEach(dept => {
    if (!dept.name) return;
    _allDocs.push({
      id:'dept-'+dept.name.replace(/\W/g,'-'),
      type:'dept', name:dept.name, title:dept.group||'Department',
      dept:dept.group||'', notes:dept.desc||'', group:dept.group||'',
      text:`${dept.name} ${dept.desc||''} ${dept.group||''} ${dept.ph||''} ${dept.addr||''} department board commission`
    });
  });

  // ── 7. PIPELINE ITEMS (RSS / live records) ───────────────────────────────
  if (window._pipelineItems && window._pipelineItems.length) {
    window._pipelineItems.forEach((item, i) => {
      _allDocs.push({
        id:'pipe-'+i, type:'pipeline', name:item.title||'News Item',
        title:'Live Feed', dept:item.source||'Georgetown KY', notes:item.summary||'',
        group:'pipeline',
        text:`${item.title||''} ${item.summary||''} ${item.source||''} ${item.date||''} news update live`
      });
    });
  }

  // ── BUILD LUNR INDEX ─────────────────────────────────────────────────────
  const _lidx = lunr(function() {
    this.ref('id');
    this.field('name',   {boost:12});
    this.field('title',  {boost:6});
    this.field('dept',   {boost:4});
    this.field('notes',  {boost:3});
    this.field('group',  {boost:2});
    this.field('text');
    this.pipeline.remove(lunr.stemmer);  // disable stemming for proper nouns
    _allDocs.forEach(d => this.add(d));
  });
  const _docMap = {};
  _allDocs.forEach(d => _docMap[d.id] = d);

  setIndex(_lidx, _docMap, _allDocs);

  // Update home stats
  const counts = { person:0, meeting:0, vote:0, ordinance:0, election:0, dept:0, pipeline:0 };
  _allDocs.forEach(d => { if (counts[d.type] !== undefined) counts[d.type]++; });
  const sp  = document.getElementById('stat-people');   if(sp) sp.textContent  = counts.person;
  const sm  = document.getElementById('stat-meetings'); if(sm) sm.textContent  = counts.meeting;
  const st  = document.getElementById('stat-total');    if(st) st.textContent  = _allDocs.length;
  const sv  = document.getElementById('stat-votes');    if(sv) sv.textContent  = counts.vote;
  const so  = document.getElementById('stat-ords');     if(so) so.textContent  = counts.ordinance;

  } catch(_e) {
    _LOG.warn('rebuildIndex', _e.message, {fn:'rebuildIndex'});
  }
}

export function getIds() {
  if (!activeQ || activeQ.length < 2) return null;
  let r; try { r = lidx.search(activeQ + ' ' + activeQ + '*'); } catch(e) { r = lidx.search(activeQ); }
  return new Set(r.map(x => x.ref));
}
// ── SEARCH — unified overlay results ─────────────────────────────────────────
//
// Architecture: onSearch() runs the Lunr query and renders a SEARCH RESULTS
// OVERLAY that floats over the current panel. Each result card is clickable and
// navigates directly to the record (opens drawer for people, navigates to the
// meetings panel and highlights for meetings). This replaces the old invisible
// multi-panel approach where results were rendered into hidden panels.

// ═══════════════════════════════════════════════════════
// SEARCH — COMPREHENSIVE OVERHAUL
// Indexes: people · meetings · votes · ordinances · election candidates · depts · pipeline
// ═══════════════════════════════════════════════════════

export function onSearch(q) {
  setActiveQ(q.trim());
  const cnt      = document.getElementById('srchCount');
  const overlay  = document.getElementById('searchOverlay');
  const overlayBody = document.getElementById('srOverlayBody');
  const overlayCnt  = document.getElementById('srOverlayCount');

  if (!activeQ || activeQ.length < 2) {
    if (cnt) cnt.textContent = '';
    if (overlay) overlay.classList.remove('active');
    window.renderDir(null); window.renderMeet(null); window.renderPlan(null);
    return;
  }

  // ── Multi-strategy Lunr query ─────────────────────────────────────────────
  // Try 3 strategies: exact+wildcard → fuzzy → partial fallback
  let results = [];
  const strategies = [
    () => lidx.search(activeQ + '* ' + activeQ),
    () => lidx.search(activeQ.split(/\s+/).map(w => w.length > 3 ? w + '~1' : w).join(' ')),
    () => lidx.search(activeQ.split(/\s+/).map(w => '*' + w + '*').join(' ')),
  ];
  for (const fn of strategies) {
    try { results = fn(); if (results.length) break; } catch(e) {}
  }

  // ── Scope filter ─────────────────────────────────────────────────────────
  const scopeFn = SCOPE_MAP[scope] || (() => true);

  const scored = results
    .map(r => ({ ...r, doc: docMap[r.ref] }))
    .filter(r => r.doc && scopeFn(r.doc));

  const total = scored.length;
  const countText = total ? total + ' result' + (total !== 1 ? 's' : '') : 'No results';
  if (cnt) cnt.textContent = countText;

  // Panel renders happen on-demand when user clicks a result (via goTo* functions)
  // We do NOT pre-render panels silently — it causes confusion if user is mid-task.

  if (!overlay || !overlayBody) return;

  if (total === 0) {
    overlayBody.innerHTML = `<div class="sr-empty">
      <div class="sr-empty-ico">\u{1F50D}</div>
      <div>No records match <strong>"${esc(activeQ)}"</strong></div>
      <div class="sr-empty-tips">
        <div class="sr-tip-label">Try searching for:</div>
        <button class="sr-tip" onclick="fillSearch('Toyota')">Toyota</button>
        <button class="sr-tip" onclick="fillSearch('budget')">budget</button>
        <button class="sr-tip" onclick="fillSearch('Jenkins')">Jenkins</button>
        <button class="sr-tip" onclick="fillSearch('zoning')">zoning</button>
        <button class="sr-tip" onclick="fillSearch('stormwater')">stormwater</button>
        <button class="sr-tip" onclick="fillSearch('Hambrick')">Hambrick</button>
      </div>
    </div>`;
    overlayCnt.textContent = 'No results';
    overlay.classList.add('active');
    return;
  }

  overlayCnt.textContent = total + ' result' + (total !== 1 ? 's' : '') + ' across all records';

  // ── Group results by type ─────────────────────────────────────────────────
  const byType = { person:[], meeting:[], vote:[], ordinance:[], election:[], dept:[], pipeline:[] };
  scored.forEach(r => {
    const t = r.doc.type;
    if (byType[t]) byType[t].push(r);
  });

  let out = '';

  // ── PEOPLE ───────────────────────────────────────────────────────────────
  if (byType.person.length) {
    out += `<div class="sr-section">
      <div class="sr-section-label">\u{1F464} People & Officials
        <span class="sr-section-count">${byType.person.length}</span>
        <button class="sr-see-all" onclick="showPanel('directory');clearSearchOverlay()">See all in Directory \u2192</button>
      </div>
      <div class="sr-person-grid">`;
    byType.person.slice(0,20).forEach(r => {
      const d = r.doc;
      let member = null, deptName = '';
      for (const dept of [...DEPTS, ...PLANNING]) {
        const m = dept.members.find(m => 'p-' + window.safeId(m.name) === r.ref);
        if (m) { member = m; deptName = dept.name; break; }
      }
      if (!member) return;
      const sid   = window.safeId(member.name);
      const safe  = member.name.replace(/\\/g,'\\').replace(/'/g,"'");
      const dsafe = deptName.replace(/\\/g,'\\').replace(/'/g,"'");
      const avatarEl = member.photo
        ? `<div class="sr-person-avatar ${member.av||''}" id="srav-${sid}">${member.ini||''}</div>
           <img src="${member.photo}" alt="${member.name}" loading="lazy" referrerpolicy="no-referrer"
             style="display:none;width:32px;height:32px;border-radius:50%;object-fit:cover;object-position:top;flex-shrink:0"
             onload="this.style.display='block';document.getElementById('srav-${sid}').style.display='none'"
             onerror="this.style.display='none'">`
        : `<div class="sr-person-avatar ${member.av||''}">${member.ini||''}</div>`;
      out += `<div class="sr-person" onclick="goToPerson('${sid}','${dsafe}','${safe}')"
          role="button" tabindex="0"
          onkeydown="if(event.key==='Enter'||event.key===' ')goToPerson('${sid}','${dsafe}','${safe}')">
          ${avatarEl}
          <div class="sr-person-info">
            <div class="sr-person-name">${window.hl(member.name, activeQ)}</div>
            <div class="sr-person-sub">${window.hl(member.title||'', activeQ)}</div>
            <div class="sr-person-dept">${window.hl(deptName, activeQ)}</div>
          </div>
          <div class="sr-person-arrow">\u2192</div>
        </div>`;
    });
    if (byType.person.length > 20) out += `<div class="sr-more">+${byType.person.length - 20} more in Directory</div>`;
    out += '</div></div>';
  }

  // ── VOTES ────────────────────────────────────────────────────────────────
  if (byType.vote.length) {
    out += `<div class="sr-section">
      <div class="sr-section-label">\u{1F5F3}\uFE0F Council Votes
        <span class="sr-section-count">${byType.vote.length}</span>
        <button class="sr-see-all" onclick="showPanel('votes');clearSearchOverlay()">See all Votes \u2192</button>
      </div>`;
    byType.vote.slice(0,8).forEach(r => {
      const vi  = parseInt(r.ref.replace('v-',''), 10);
      const v   = VOTES[vi];
      if (!v) return;
      const resultBadge = v.result === 'Unanimous'
        ? `<span class="sr-vote-badge sr-vote-pass">Unanimous</span>`
        : v.result === 'Failed'
        ? `<span class="sr-vote-badge sr-vote-fail">Failed</span>`
        : `<span class="sr-vote-badge sr-vote-split">${v.result}</span>`;
      out += `<div class="sr-vote-row" onclick="goToVote(${vi})"
          role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')goToVote(${vi})">
          <div class="sr-vote-date">${v.date}</div>
          <div class="sr-vote-body">
            <div class="sr-vote-motion">${window.hl(v.motion, activeQ)}</div>
            ${v.sig ? `<div class="sr-vote-sig">${window.hl(v.sig.slice(0,120), activeQ)}${v.sig.length>120?'\u2026':''}</div>` : ''}
          </div>
          ${resultBadge}
        </div>`;
    });
    if (byType.vote.length > 8) out += `<div class="sr-more">+${byType.vote.length - 8} more \u2014 open Votes panel</div>`;
    out += '</div>';
  }

  // ── ORDINANCES ───────────────────────────────────────────────────────────
  if (byType.ordinance.length) {
    out += `<div class="sr-section">
      <div class="sr-section-label">\u{1F4DC} Ordinances
        <span class="sr-section-count">${byType.ordinance.length}</span>
        <button class="sr-see-all" onclick="showPanel('ordinances');clearSearchOverlay()">See all Ordinances \u2192</button>
      </div>`;
    byType.ordinance.slice(0,6).forEach(r => {
      const oi = parseInt(r.ref.replace('ord-',''), 10);
      const o  = ORDINANCES[oi];
      if (!o) return;
      const typeBadge = `<span class="ord-type ${TYPE_CSS[o.type]||'ot-other'}">${TYPE_LBL[o.type]||o.type}</span>`;
      out += `<div class="sr-ord-row" onclick="goToOrdinance(${oi})"
          role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')goToOrdinance(${oi})">
          <div class="sr-ord-meta">
            <span class="sr-ord-num">Ord. ${o.num}</span>
            <span class="sr-ord-year">${o.year}</span>
            ${typeBadge}
          </div>
          <div class="sr-ord-title">${window.hl(o.title, activeQ)}</div>
          ${o.summary ? `<div class="sr-ord-sum">${window.hl(o.summary.slice(0,130), activeQ)}${o.summary.length>130?'\u2026':''}</div>` : ''}
          <a href="${o.url}" target="_blank" rel="noopener" class="sr-ord-link"
             onclick="event.stopPropagation()">View Ord. ${o.num} \u2197</a>
        </div>`;
    });
    if (byType.ordinance.length > 6) out += `<div class="sr-more">+${byType.ordinance.length - 6} more \u2014 open Ordinances panel</div>`;
    out += '</div>';
  }

  // ── MEETINGS ─────────────────────────────────────────────────────────────
  if (byType.meeting.length) {
    out += `<div class="sr-section">
      <div class="sr-section-label">\u{1F4CB} Meeting Minutes
        <span class="sr-section-count">${byType.meeting.length}</span>
        <button class="sr-see-all" onclick="showPanel('meetings');clearSearchOverlay()">See all Minutes \u2192</button>
      </div>`;
    byType.meeting.slice(0,6).forEach(r => {
      const mi = parseInt(r.ref.replace('m-',''), 10);
      const m  = MEETINGS[mi];
      if (!m) return;
      out += `<div class="sr-meeting" onclick="goToMeeting(${mi})"
          role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')goToMeeting(${mi})">
          <div class="sr-meeting-date">${m.mo} ${m.dy}<br>${m.yr}</div>
          <div style="flex:1;min-width:0">
            <div class="sr-meeting-title">${window.hl(m.title, activeQ)}</div>
            <div class="sr-meeting-sum">${window.hl((m.sum||'').slice(0,110), activeQ)}${(m.sum||'').length>110?'\u2026':''}</div>
          </div>
          <div class="sr-meeting-arrow">\u2192</div>
        </div>`;
    });
    if (byType.meeting.length > 6) out += `<div class="sr-more">+${byType.meeting.length - 6} more \u2014 open Meeting Minutes</div>`;
    out += '</div>';
  }

  // ── ELECTION CANDIDATES ──────────────────────────────────────────────────
  if (byType.election.length) {
    out += `<div class="sr-section">
      <div class="sr-section-label">\u{1F5F3}\uFE0F 2026 Election
        <span class="sr-section-count">${byType.election.length}</span>
        <button class="sr-see-all" onclick="showPanel('elections');clearSearchOverlay()">See Elections panel \u2192</button>
      </div>`;
    byType.election.slice(0,6).forEach(r => {
      const d = r.doc;
      const raceId = r.ref.startsWith('race-') ? r.ref.replace('race-','')
                   : r.ref.startsWith('cand-') ? r.ref.replace(/^cand-/,'').replace(/-\d+$/,'')
                   : 'mayor';
      const incBadge = d.name && d.notes && d.notes.toLowerCase().includes('incumbent')
        ? `<span class="sr-elec-badge">\u2605 Incumbent</span>` : '';
      out += `<div class="sr-elec-row" onclick="goToElection('${raceId}')"
          role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')goToElection('${raceId}')">
          <div class="sr-elec-body">
            <div class="sr-elec-name">${window.hl(d.name, activeQ)} ${incBadge}</div>
            <div class="sr-elec-race">${window.hl(d.title||'', activeQ)}</div>
            ${d.notes ? `<div class="sr-elec-notes">${window.hl(d.notes.slice(0,100), activeQ)}${d.notes.length>100?'\u2026':''}</div>` : ''}
          </div>
        </div>`;
    });
    out += '</div>';
  }

  // ── PIPELINE (live items) ────────────────────────────────────────────────
  if (byType.pipeline.length) {
    out += `<div class="sr-section">
      <div class="sr-section-label">\u{1F534} Live Updates
        <span class="sr-section-count">${byType.pipeline.length}</span>
        <button class="sr-see-all" onclick="showPanel('pipeline');clearSearchOverlay()">See Pipeline \u2192</button>
      </div>`;
    byType.pipeline.slice(0,4).forEach(r => {
      const d = r.doc;
      out += `<div class="sr-pipe-row" onclick="showPanel('pipeline');clearSearchOverlay()" role="button" tabindex="0">
        <div class="fdot" style="flex-shrink:0;margin-top:3px"></div>
        <div>
          <div class="sr-pipe-title">${window.hl(d.name, activeQ)}</div>
          <div class="sr-pipe-sub">${window.hl((d.notes||'').slice(0,100), activeQ)} \u00b7 <em>${d.dept}</em></div>
        </div>
      </div>`;
    });
    out += '</div>';
  }

  overlayBody.innerHTML = out || `<div class="sr-empty"><div class="sr-empty-ico">\u{1F50D}</div>No results found.</div>`;
  overlayCnt.textContent = total + ' result' + (total !== 1 ? 's' : '') + ' across all records';
  overlay.classList.add('active');
  overlay.scrollTop = 0;
}

export function fillSearch(q) {
  const inp = document.getElementById('gsearch');
  if (inp) { inp.value = q; inp.focus(); onSearch(q); }
}

export function clearSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.classList.remove('active');
}


// Navigate to a specific meeting: switch to meetings panel and scroll to it
export function goToPerson(sid, deptName, memberName) {
  try {

  clearSearchOverlay();
  window.showPanel('directory');
  // Wait for directory panel to render, then open drawer
  setTimeout(() => window.openDrawer(sid, deptName, memberName), 80);

  } catch(_e) {
    _LOG.warn('goToPerson', _e.message, {fn:'goToPerson'});
  }
}

export function goToVote(idx) {
  try {

  clearSearchOverlay();
  window.showPanel('votes');
  // Switch to timeline view so the vote is visible as a card
  setVoteView('timeline');
  document.querySelectorAll('#voteViewFilter .tbtn').forEach((b, i) => b.classList.toggle('on', i === 2));
  window.renderVotes();
  setTimeout(() => {
    const el = document.getElementById('vote-out');
    if (!el) return;
    const rows = el.querySelectorAll('.vdr');
    if (rows[idx]) {
      rows[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      rows[idx].style.outline = '2px solid var(--green-3)';
      rows[idx].style.borderRadius = 'var(--r-sm)';
      setTimeout(() => { if (rows[idx]) rows[idx].style.outline = ''; }, 2200);
    }
  }, 120);

  } catch(_e) {
    _LOG.warn('goToVote', _e.message, {fn:'goToVote'});
  }
}

export function goToOrdinance(idx) {
  try {

  clearSearchOverlay();
  window.showPanel('ordinances');
  // Clear any active filter so the ordinance is visible
  setOrdFilter('all');
  document.querySelectorAll('#ordFilter .tbtn').forEach(b => b.classList.remove('on'));
  const allBtn = document.querySelector('#ordFilter .tbtn');
  if (allBtn) allBtn.classList.add('on');
  window.renderOrds();
  setTimeout(() => {
    const rowId = 'ord-row-' + (ORDINANCES[idx] ? ORDINANCES[idx].num.replace(/[^a-z0-9]/gi,'') : '');
    // Trigger expand for the target row
    const mainRow = document.querySelector(`[onclick*="toggleOrdRow('${rowId}')"]`);
    if (mainRow) {
      mainRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      mainRow.style.outline = '2px solid var(--green-3)';
      mainRow.style.borderRadius = 'var(--r-sm)';
      // Auto-expand it
      const detailRow = document.getElementById(rowId);
      if (detailRow) detailRow.style.display = 'table-row';
      const chv = document.getElementById('chv-' + rowId);
      if (chv) { chv.style.transform = 'rotate(180deg)'; chv.style.color = 'var(--green-3)'; }
      setTimeout(() => { if (mainRow) mainRow.style.outline = ''; }, 2200);
    }
  }, 120);

  } catch(_e) {
    _LOG.warn('goToOrdinance', _e.message, {fn:'goToOrdinance'});
  }
}

export function goToElection(raceId) {
  try {

  clearSearchOverlay();
  window.showPanel('elections');
  setTimeout(() => {
    const el = document.getElementById('race-' + raceId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.outline = '2px solid var(--green-3)';
      el.style.borderRadius = 'var(--r-sm)';
      if (!el.classList.contains('open')) window.toggleRace(raceId);
      setTimeout(() => { if (el) el.style.outline = ''; }, 2200);
    }
  }, 120);

  } catch(_e) {
    _LOG.warn('goToElection', _e.message, {fn:'goToElection'});
  }
}

export function goToMeeting(idx) {
  try {

  window.showPanel('meetings');
  // Meetings panel is now visible — find the rendered row and scroll to it
  setTimeout(() => {
    const meetOut = document.getElementById('meet-out');
    if (!meetOut) return;
    // Meetings render with y{year} class — find the right row by index position
    const rows = meetOut.querySelectorAll('.mrow');
    if (rows[idx]) {
      rows[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      rows[idx].style.outline = '2px solid var(--green-3)';
      rows[idx].style.borderRadius = 'var(--r-sm)';
      setTimeout(() => { rows[idx].style.outline = ''; }, 2000);
    }
  }, 80);

  } catch(_e) {
    _LOG.warn('goToMeeting', _e.message, {fn:'goToMeeting'});
  }
}

// HTML escape helper for safe insertion
export function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

export function clearSearch() {
  const i = document.getElementById('gsearch');
  if (i) i.value = '';
  onSearch('');
}

// Scope tab → panel map (what to show when tab is clicked with no search query)
export const SCOPE_PANEL_MAP = {
  all:        null,           // show overlay with all if query exists, else do nothing
  people:     'directory',
  meetings:   'meetings',
  votes:      'votes',
  ordinances: 'ordinances',
  elections:  'elections',
  boards:     'planning',
};

export function setScope(s, btn) {
  _setScope(s);
  document.querySelectorAll('.scope-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');

  if (activeQ && activeQ.length >= 2) {
    // Re-run search filtered to this scope — show overlay
    onSearch(activeQ);
  } else {
    // No active query — navigate directly to the relevant panel
    const targetPanel = SCOPE_PANEL_MAP[s];
    if (targetPanel) {
      window.showPanel(targetPanel);
    }
    // If scope === 'all' with no query, just clear everything
    if (s === 'all') {
      const overlay = document.getElementById('searchOverlay');
      if (overlay) overlay.classList.remove('active');
      const cnt = document.getElementById('srchCount');
      if (cnt) cnt.textContent = '';
    }
  }
}
