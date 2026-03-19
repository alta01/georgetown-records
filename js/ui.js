// ═══════════════════════════════════════════════════════
// ui.js — UI rendering, navigation, and event listeners
// Extracted from index.html
// ═══════════════════════════════════════════════════════

import { _LOG } from './logger.js';
import { IMG, DEPTS, PLANNING, GRPORD, GRPLBL } from './data/directory.js';
import { MEETINGS } from './data/meetings.js';
import { VOTES, MEMBERS_SHORT, MEMBERS_FULL } from './data/votes.js';
import { ORDINANCES, TYPE_CSS, TYPE_LBL } from './data/ordinances.js';
import { deptF, yearF, voteYear, voteView, activeQ, planF, ordFilter,
         setDeptF as _setDeptF, setYearF as _setYearF, setVoteYear as _setVoteYear,
         setVoteView as _setVoteView, setOrdFilter as _setOrdFilter, setPlanF as _setPlanF,
         allDocs, alertTopics, feedbackType, setFeedbackType } from './state.js';
import { initCharts, initCIPChart, renderWaterRateChart, cPalette } from './charts.js';

const fL = { verified:'Verified', new:'New', updated:'Updated', archived:'Archived' };

// ═══════════════════════════════════════════════════════
// HIGHLIGHT / SAFE-ID
// ═══════════════════════════════════════════════════════
export function hl(t, q) {
  if (!q || q.length < 2) return t;
  const e = q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return String(t).replace(new RegExp('(' + e + ')','gi'),'<span class="hl">$1</span>');
}

export function safeId(name) { return name.replace(/\W/g,'-'); }

// ═══════════════════════════════════════════════════════
// PERSON CARD — photo with robust fallback
// ═══════════════════════════════════════════════════════
export function personCard(m, q, deptName) {
  const tags = (m.tags||[]).map(t => `<span class="tag ${t}">${t.replace('t-','').replace('-',' ')}</span>`).join('');
  const fresh = m.pipeline ? 'pipeline' : (m.f||'verified');
  const freshlabel = m.pipeline ? 'Live' : (fL[m.f]||m.f);
  const sid = safeId(m.name);
  const deptSafe = (deptName||'').replace(/\\/g,'\\').replace(/'/g,"'");
  const nameSafe = m.name.replace(/\\/g,'\\').replace(/'/g,"'");
  const clickAttr = `onclick="openDrawer('${sid}','${deptSafe}','${nameSafe}')"
    onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openDrawer('${sid}','${deptSafe}','${nameSafe}')}"`;

  // Build photo/avatar - show avatar by default, swap to photo if it loads
  let mediaEl;
  if (m.photo) {
    mediaEl = `<div class="pcard-media-wrap">
      <div class="pcard-avatar ${m.av}" id="av-${sid}">${m.ini}</div>
      <img src="${m.photo}" class="pcard-photo" alt="${m.name}" loading="lazy"
        referrerpolicy="no-referrer"
        onload="this.style.display='block';document.getElementById('av-${sid}').style.display='none'"
        onerror="this.style.display='none'"
        style="display:none">
    </div>`;
  } else {
    mediaEl = `<div class="pcard-avatar ${m.av}">${m.ini}</div>`;
  }

  return `<div class="pcard" role="button" tabindex="0" aria-label="View details for ${m.name}" ${clickAttr}>
    <div class="fbadge ${fresh}"><div class="fdot"></div>${freshlabel}</div>
    <div class="pcard-top">
      ${mediaEl}
      <div>
        <div class="pcard-name">${hl(m.name,q)}</div>
        <div class="pcard-title">${hl(m.title,q)}</div>
        ${deptName ? `<div class="pcard-dept">${hl(deptName,q)}</div>` : ''}
      </div>
    </div>
    <div class="pcard-meta">
      ${m.ph ? `<div class="pcard-row"><span class="pcard-ico">📞</span><a href="tel:${m.ph.replace(/\D/g,'')}" onclick="event.stopPropagation()">${m.ph}</a></div>` : ''}
      ${m.notes ? `<div class="pcard-row"><span class="pcard-ico">ℹ</span><span>${hl(m.notes,q)}</span></div>` : ''}
    </div>
    <div class="pcard-tags">${tags}</div>
    <div class="pcard-viewmore"><span>View details</span><span class="pcard-viewmore-arrow">→</span></div>
  </div>`;
}

// ═══════════════════════════════════════════════════════
// PERSON DRAWER
// ═══════════════════════════════════════════════════════
export function findMember(sid, memberName) {
  for (const d of [...DEPTS, ...PLANNING]) {
    for (const m of d.members) {
      if (safeId(m.name) === sid || m.name === memberName) return { m, dept: d };
    }
  }
  return null;
}

export function openDrawer(sid, deptName, memberName) {
  try {

  const found = findMember(sid, memberName);
  if (!found) return;
  const { m, dept } = found;

  // Photo/avatar in hero
  const wrap = document.getElementById('drawerPhotoWrap');
  if (m.photo) {
    const avHtml = `<div class="drawer-avatar ${m.av}" id="drawer-av">${m.ini}</div>`;
    const imgHtml = `<img src="${m.photo}" class="drawer-photo" alt="${m.name}" loading="lazy" referrerpolicy="no-referrer"
      onload="this.style.display='block';document.getElementById('drawer-av').style.display='none'"
      onerror="this.style.display='none'" style="display:none">`;
    wrap.innerHTML = avHtml + imgHtml;
  } else {
    wrap.innerHTML = `<div class="drawer-avatar ${m.av}">${m.ini}</div>`;
  }

  document.getElementById('drawerName').textContent = m.name;
  document.getElementById('drawerTitleLine').textContent = m.title;
  document.getElementById('drawerDeptLine').textContent = dept.name;
  document.getElementById('drawerPhoneLine').textContent = m.ph || '';
  const fresh = m.pipeline ? 'pipeline' : (m.f||'verified');
  const freshlabel = m.pipeline ? 'Live' : (fL[m.f]||m.f);
  document.getElementById('drawerBadge').innerHTML = `<span class="fbadge ${fresh}" style="position:static"><div class="fdot"></div>${freshlabel}</span>`;

  // Drawer body sections
  let body = '';
  if (m.positionSummary) {
    body += `<div class="dsec-inner"><div class="dsec-title"><span class="dsec-title-ico">📌</span>Role &amp; Responsibilities</div><div class="drawer-summary">${m.positionSummary}</div></div>`;
  }
  if (m.bio) {
    body += `<div class="dsec-inner"><div class="dsec-title"><span class="dsec-title-ico">👤</span>Background</div><div class="drawer-bio">${m.bio}</div></div>`;
  }
  if (m.stats && m.stats.length) {
    body += `<div class="dsec-inner"><div class="dsec-title"><span class="dsec-title-ico">📊</span>Key Facts</div><div class="drawer-stats">${m.stats.map(s=>`<div class="dstat"><div class="dstat-val">${s.val}</div><div class="dstat-lbl">${s.lbl}</div></div>`).join('')}</div></div>`;
  }

  // Vote history in drawer
  const memberVotes = VOTES.filter(v => v.votes[Object.keys(MEMBERS_FULL).find(k => MEMBERS_FULL[k].full === m.name)]);
  if (memberVotes.length) {
    const mKey = Object.keys(MEMBERS_FULL).find(k => MEMBERS_FULL[k].full === m.name);
    if (mKey) {
      const yeas = memberVotes.filter(v => v.votes[mKey] === 'Y').length;
      const abs  = memberVotes.filter(v => v.votes[mKey] === 'A').length;
      const abst = memberVotes.filter(v => v.votes[mKey] === 'X').length;
      const recentVotes = memberVotes.slice(0,5).map((v, i) => {
        const code = v.votes[mKey];
        const vc   = code==='Y'?'vc-yea':code==='N'?'vc-nay':code==='A'?'vc-abstain':'vc-absent';
        const icon = code==='Y'?'✓':code==='N'?'✗':code==='A'?'~':'—';
        const eid  = `vev-${safeId(m.name)}-${i}`;
        const hasDetail = !!(v.sig || v.url);
        const click = hasDetail ? `onclick="toggleEvent('${eid}')"` : '';
        const cls   = hasDetail ? 'devent has-detail' : 'devent';
        const rc    = v.result.toLowerCase().includes('unanimous')?'unanimous':v.result.toLowerCase().includes('table')?'tabled':'passed';
        return `<div class="${cls}" id="${eid}" ${click}>
          <div class="devent-header">
            <div class="devent-date">${v.date}</div>
            <div class="devent-text" style="display:flex;align-items:flex-start;gap:7px">
              <span class="vote-cell ${vc}" style="width:18px;height:18px;flex-shrink:0;margin-top:1px;font-size:10px">${icon}</span>
              <span>${v.motion} <span class="vdr-result ${rc}" style="margin-left:4px;font-size:9px">${v.result}</span></span>
            </div>
            ${hasDetail ? '<span class="devent-chevron">▾</span>' : ''}
          </div>
          ${hasDetail ? `<div class="devent-body">
            ${v.sig ? `<div class="devent-summary">${v.sig}</div>` : ''}
            ${v.url ? `<a href="${v.url}" target="_blank" rel="noopener" class="devent-source" onclick="event.stopPropagation()">📄 View Source ↗</a>` : ''}
          </div>` : ''}
        </div>`;
      }).join('');
      body += `<div class="dsec-inner"><div class="dsec-title"><span class="dsec-title-ico">🗳</span>Vote Record</div>
        <div style="display:flex;gap:10px;margin-bottom:10px">
          <div class="dstat"><div class="dstat-val">${yeas}</div><div class="dstat-lbl">Yea</div></div>
          <div class="dstat"><div class="dstat-val">${abs}</div><div class="dstat-lbl">Abstain</div></div>
          <div class="dstat"><div class="dstat-val">${abst}</div><div class="dstat-lbl">Not on record</div></div>
          <div class="dstat"><div class="dstat-val">${memberVotes.length}</div><div class="dstat-lbl">Total</div></div>
        </div>
        <div class="drawer-events">${recentVotes}</div>
        <div style="margin-top:8px"><button onclick="viewAllVotes()" style="background:none;border:1px solid var(--line-2);color:var(--green);font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:4px 12px;border-radius:8px;cursor:pointer">View All Votes →</button></div>
      </div>`;
    }
  }

  const contactRows = [];
  if (m.ph) contactRows.push(`<div class="dc-row"><span class="dc-ico">📞</span><a href="tel:${m.ph.replace(/\D/g,'')}">${m.ph}</a></div>`);
  if (m.email) contactRows.push(`<div class="dc-row"><span class="dc-ico">✉️</span><a href="mailto:${m.email}">${m.email}</a></div>`);
  if (contactRows.length) {
    body += `<div class="dsec-inner"><div class="dsec-title"><span class="dsec-title-ico">📬</span>Contact</div><div class="drawer-contacts">${contactRows.join('')}</div></div>`;
  }
  if (m.socials && m.socials.length) {
    const btns = m.socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener" class="dsocial"><span>${s.icon==='f'?'𝗙':'🔗'}</span>${s.label}</a>`).join('');
    body += `<div class="dsec-inner"><div class="dsec-title"><span class="dsec-title-ico">🔗</span>Social &amp; Online</div><div class="drawer-socials">${btns}</div></div>`;
  }
  if (m.events && m.events.length) {
    const eventCards = m.events.map((e, i) => {
      const hasDetail = e.summary || e.url;
      const eid = `ev-${safeId(m.name)}-${i}`;
      const header = `<div class="devent-header">
          <div class="devent-date">${e.date}</div>
          <div class="devent-text">${e.text}</div>
          ${hasDetail ? '<span class="devent-chevron">▾</span>' : ''}
        </div>`;
      const bodyInner = hasDetail ? `<div class="devent-body">
          ${e.summary ? `<div class="devent-summary">${e.summary}</div>` : ''}
          ${e.url    ? `<a href="${e.url}" target="_blank" rel="noopener" class="devent-source" onclick="event.stopPropagation()">📄 View Source ↗</a>` : ''}
        </div>` : '';
      const cls = hasDetail ? 'devent has-detail' : 'devent';
      const click = hasDetail ? `onclick="toggleEvent('${eid}')"` : '';
      return `<div class="${cls}" id="${eid}" ${click}>${header}${bodyInner}</div>`;
    }).join('');
    body += `<div class="dsec-inner"><div class="dsec-title"><span class="dsec-title-ico">🗓</span>Recent Activity <span style="font-size:9px;font-weight:400;color:var(--ink-4);text-transform:none;letter-spacing:0">— tap to expand</span></div><div class="drawer-events">${eventCards}</div></div>`;
  }
  const tags = (m.tags||[]).map(t=>`<span class="tag ${t}">${t.replace('t-','').replace('-',' ')}</span>`).join('');
  if (tags) body += `<div class="dsec-inner"><div class="dsec-title"><span class="dsec-title-ico">🏷</span>Categories</div><div class="drawer-tags">${tags}</div></div>`;
  body += `<div class="dsec-inner"><div class="dsec-title"><span class="dsec-title-ico">🌐</span>Official Sources</div><div class="drawer-contacts">
    <div class="dc-row"><span class="dc-ico">🏛️</span><a href="https://www.georgetownky.gov/Directory.aspx" target="_blank" rel="noopener">Georgetown Staff Directory ↗</a></div>
    <div class="dc-row"><span class="dc-ico">📋</span><a href="https://www.georgetownky.gov/AgendaCenter" target="_blank" rel="noopener">Meeting Minutes Archive ↗</a></div>
  </div></div>`;

  document.getElementById('drawerBody').innerHTML = body;
  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('personDrawer').classList.add('open');
  document.getElementById('personDrawer').scrollTop = 0;
  document.body.style.overflow = 'hidden';

  } catch(_e) {
    _LOG.warn('openDrawer', _e.message, {fn:'openDrawer'});
  }
}

export function closeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('personDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

export function toggleEvent(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('open');
  // Scroll the newly opened body into view if needed
  if (el.classList.contains('open')) {
    const body = el.querySelector('.devent-body');
    if (body) setTimeout(() => body.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }
}

// ═══════════════════════════════════════════════════════
// RENDER — DIRECTORY
// ═══════════════════════════════════════════════════════
export function renderDir(ids, q) {
  try {

  q = q || '';
  const el = document.getElementById('dir-out');
  if (!el) return;
  let total = 0, html = '';
  GRPORD.forEach(grp => {
    const ds = DEPTS.filter(d => d.group===grp && (deptF==='all' || deptF===grp));
    if (!ds.length) return;
    let gh = '';
    ds.forEach(dept => {
      let ms = dept.members;
      if (ids) ms = ms.filter(m => ids.has('p-' + safeId(m.name)));
      if (!ms.length) return;
      total += ms.length;
      gh += `<div class="dsec"><div class="dhdr"><div class="dico ${dept.icoc}">${dept.icon}</div><div><div class="dtitle">${dept.name}</div><div class="dsub">${dept.desc.slice(0,82)}…</div></div><div class="dphone">${dept.phone}</div></div><div class="card-grid">${ms.map(m=>personCard(m,q,dept.name)).join('')}</div></div>`;
    });
    if (gh) html += `<div class="grp-head">${GRPLBL[grp]}</div>` + gh;
  });
  el.innerHTML = total ? html : `<div class="empty"><div class="empty-ico">🔍</div><p>No staff found.</p></div>`;
  const md = document.getElementById('meta-dir'); if(md) md.innerHTML = `Showing <strong>${total}</strong> staff members`;
  const nc = document.getElementById('nc-dir'); if(nc) nc.textContent = total;

  } catch(_e) {
    _LOG.warn('renderDir', _e.message, {fn:'renderDir'});
  }
}

// ═══════════════════════════════════════════════════════
// RENDER — MEETINGS
// ═══════════════════════════════════════════════════════
export function renderMeet(ids, q) {
  try {

  q = q || '';
  const el = document.getElementById('meet-out');
  if (!el) return;
  const filtered = MEETINGS.filter((m, i) => {
    if (yearF !== 'all' && m.yr !== yearF) return false;
    if (ids && !ids.has('m-' + i)) return false;
    return true;
  });
  if (!filtered.length) {
    el.innerHTML = `<div class="empty"><div class="empty-ico">📋</div><p>No meetings found.</p></div>`;
    const mm = document.getElementById('meta-meet'); if(mm) mm.innerHTML = 'No results';
    const nc = document.getElementById('nc-meet'); if(nc) nc.textContent = 0;
    return;
  }
  const years = [...new Set(filtered.map(m => m.yr))].sort((a,b) => b-a);
  let html = '';
  years.forEach(yr => {
    const ms = filtered.filter(m => m.yr === yr);
    const nc = ms.filter(m => m.f==='New' || m.pipeline).length;
    html += `<div class="ygrp"><div class="ylabel">${yr}</div><span class="ycnt${nc?' hasnew':''}">${ms.length} record${ms.length!==1?'s':''}${nc?' · '+nc+' new':''}</span></div><div class="mlist">${ms.map(m => {
      const tc = m.topics.map(t=>`<span class="mt mt-${t}">${t}</span>`).join('');
      const fr = m.pipeline ? 'Live' : (m.f||'');
      return `<div class="mrow y${m.yr}${m.pipeline?' pipeline':''}"><div class="mdate"><div class="mmo">${m.mo}</div><div class="mday">${m.dy}</div><div class="myr">${m.yr}</div></div><div class="mbody"><div class="mtitle">${hl(m.title,q)}</div><div class="msum">${hl(m.sum,q)}</div><div class="mtopics">${tc}</div>${m.url&&m.url!=='#'?`<div class="mlinks"><a href="${m.url}" target="_blank" rel="noopener" class="mlink">Agenda / Minutes ↗</a></div>`:''}</div><div class="mrow-fresh ${fr}">${fr}</div></div>`;
    }).join('')}</div>`;
  });
  el.innerHTML = html;
  const mm = document.getElementById('meta-meet'); if(mm) mm.innerHTML = `Showing <strong>${filtered.length}</strong> meeting records`;
  const nm = document.getElementById('nc-meet'); if(nm) nm.textContent = filtered.length;

  } catch(_e) {
    _LOG.warn('renderMeet', _e.message, {fn:'renderMeet'});
  }
}

// ═══════════════════════════════════════════════════════
// RENDER — PLANNING
// ═══════════════════════════════════════════════════════
export function renderPlan(ids, q) {
  try {

  q = q || '';
  const el = document.getElementById('plan-out');
  if (!el) return;
  const GRP = {
    planning:    'Georgetown-Scott County Planning Commission & Boards',
    regional:    'Regional Intergovernmental Bodies',
    arts:        'Arts, Culture & Community Committees',
    'county-boards': 'Scott County Boards & Appeals',
    'county-govt':   'Scott County Government'
  };
  let total = 0, html = '';
  Object.keys(GRP).forEach(grp => {
    if (planF !== 'all' && planF !== grp) return;
    const ds = PLANNING.filter(d => d.group===grp);
    if (!ds.length) return;
    let gh = '';
    ds.forEach(dept => {
      let ms = dept.members;
      if (ids) ms = ms.filter(m => ids.has('p-' + safeId(m.name)));
      if (!ms.length) return;
      total += ms.length;
      gh += `<div class="dsec"><div class="dhdr"><div class="dico ${dept.icoc}">${dept.icon}</div><div><div class="dtitle">${dept.name}</div><div class="dsub">${dept.desc.slice(0,82)}…</div></div><div class="dphone">${dept.phone}</div></div><div class="card-grid">${ms.map(m=>personCard(m,q,dept.name)).join('')}</div></div>`;
    });
    if (gh) html += `<div class="grp-head">${GRP[grp]}</div>` + gh;
  });
  el.innerHTML = total ? html : `<div class="empty"><div class="empty-ico">📐</div><p>No records found.</p></div>`;
  const mp = document.getElementById('meta-plan'); if(mp) mp.innerHTML = `Showing <strong>${total}</strong> planning, regional &amp; county records`;
  const np = document.getElementById('nc-plan'); if(np) np.textContent = total;

  } catch(_e) {
    _LOG.warn('renderPlan', _e.message, {fn:'renderPlan'});
  }
}

// ═══════════════════════════════════════════════════════
// RENDER — VOTES
// ═══════════════════════════════════════════════════════
export function filteredVotes() {
  return voteYear === 'all' ? VOTES : VOTES.filter(v => v.yr === voteYear);
}

export function voteCell(code) {
  const map = { Y:`<span class="vote-cell vc-yea" title="Yea">✓</span>`, N:`<span class="vote-cell vc-nay" title="Nay">✗</span>`, A:`<span class="vote-cell vc-abstain" title="Abstain/Recused">~</span>`, X:`<span class="vote-cell vc-absent" title="Absent">—</span>` };
  return map[code] || map['X'];
}

export function memberScorecard(key, votes) {
  const m = MEMBERS_FULL[key];
  const relevant = votes.filter(v => v.votes[key] && v.votes[key] !== 'X');
  const yeas = relevant.filter(v => v.votes[key]==='Y').length;
  const abs  = relevant.filter(v => v.votes[key]==='A').length;
  const pct  = relevant.length ? Math.round((yeas/relevant.length)*100) : 0;
  const photoUrl = IMG(m.photo);
  return `<div class="mscore-card" role="button" tabindex="0" onclick="openDrawer('${safeId(m.full)}','City Council','${m.full}')" onkeydown="if(event.key==='Enter')openDrawer('${safeId(m.full)}','City Council','${m.full}')">
    <div class="mscore-top">
      <div class="mscore-avatar ${m.av}" id="msav-${key}">${m.ini}</div>
      <img src="${photoUrl}" class="mscore-photo" alt="${m.full}" loading="lazy" referrerpolicy="no-referrer"
        onload="this.style.display='block';document.getElementById('msav-${key}').style.display='none'"
        onerror="this.style.display='none'" style="display:none">
      <div><div class="mscore-name">${m.full}</div><div class="mscore-title">City Councilmember</div></div>
    </div>
    <div class="mscore-stats">
      <div class="mscore-stat"><div class="mscore-val">${yeas}</div><div class="mscore-lbl">Yea</div></div>
      <div class="mscore-stat"><div class="mscore-val">${abs}</div><div class="mscore-lbl">Abstain</div></div>
      <div class="mscore-stat"><div class="mscore-val">${relevant.length}</div><div class="mscore-lbl">Voted</div></div>
    </div>
    <div class="mscore-bar"><div class="mscore-bar-fill" style="width:${pct}%"></div></div>
    <div style="font-size:10px;color:var(--ink-3);margin-top:4px;text-align:right;font-family:'IBM Plex Mono',monospace">${pct}% yea rate</div>
  </div>`;
}

export function renderVotes() {
  try {

  const el = document.getElementById('vote-out');
  if (!el) return;
  const vts = filteredVotes();
  const nc = document.getElementById('nc-votes'); if(nc) nc.textContent = vts.length;

  if (voteView === 'scorecards') {
    el.innerHTML = `<div class="rmeta" style="margin-bottom:12px">Showing <strong>${vts.length}</strong> recorded votes · Click a card to open full profile</div>
      <div class="member-scorecards">${MEMBERS_SHORT.map(k => memberScorecard(k,vts)).join('')}</div>`;
    return;
  }
  if (voteView === 'matrix') {
    const hdrs = MEMBERS_SHORT.map(k=>`<th title="${MEMBERS_FULL[k].full}">${MEMBERS_FULL[k].ini}</th>`).join('');
    const rows = vts.map(v => {
      const cells = MEMBERS_SHORT.map(k=>`<td>${voteCell(v.votes[k]||'X')}</td>`).join('');
      const res = v.result.toLowerCase().includes('unanimous') ? `<span class="vc-unanimous">★ Unani.</span>` : `<span style="font-size:10px;color:var(--ink-3)">${v.result}</span>`;
      return `<tr><td class="motion-date">${v.date}</td><td class="motion-name">${v.motion}${v.note?`<div style="font-size:9px;color:var(--ink-4);margin-top:2px">${v.note}</div>`:''}</td>${cells}<td>${res}</td></tr>`;
    }).join('');
    el.innerHTML = `<div class="rmeta" style="margin-bottom:12px">Showing <strong>${vts.length}</strong> recorded votes</div>
      <div class="vote-matrix"><table class="vmatrix-table"><thead><tr><th>Date</th><th class="member-col">Motion</th>${hdrs}<th>Result</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    return;
  }
  // timeline
  const rows = vts.map(v => {
    const yeas = MEMBERS_SHORT.filter(k=>v.votes[k]==='Y').map(k=>MEMBERS_FULL[k].ini);
    const nays = MEMBERS_SHORT.filter(k=>v.votes[k]==='N').map(k=>MEMBERS_FULL[k].ini);
    const abst = MEMBERS_SHORT.filter(k=>v.votes[k]==='A').map(k=>MEMBERS_FULL[k].ini);
    const abs  = MEMBERS_SHORT.filter(k=>v.votes[k]==='X').map(k=>MEMBERS_FULL[k].ini);
    const rc   = v.result.toLowerCase().includes('unanimous')?'unanimous':v.result.toLowerCase().includes('table')?'tabled':'passed';
    const moverLine = (v.mover||v.seconder) ? `<div style="font-size:10px;color:var(--ink-4);margin-top:3px">${v.mover?'Moved by '+v.mover:''}${v.mover&&v.seconder?' · ':''}${v.seconder?'Seconded by '+v.seconder:''}</div>` : '';
    const noteLine  = v.note ? `<div style="font-size:10px;color:var(--ink-4);margin-top:2px">📌 ${v.note}</div>` : '';
    const sigBlock  = v.sig  ? `<div class="vdr-sig"><span class="vdr-sig-label">What this means</span>${v.sig}</div>` : '';
    const voteBreakdown = `<div class="vdr-chips">
      <span class="vdr-chip">${v.type||'motion'}</span>
      ${yeas.length ? `<span class="vdr-chip vdr-chip-yea">✓ Yea: ${yeas.join(', ')}</span>` : ''}
      ${nays.length ? `<span class="vdr-chip vdr-chip-nay">✗ Nay: ${nays.join(', ')}</span>` : ''}
      ${abst.length ? `<span class="vdr-chip vdr-chip-abs">~ Abstain: ${abst.join(', ')}</span>` : ''}
      ${abs.length  ? `<span class="vdr-chip">— Not voting: ${abs.join(', ')}</span>` : ''}
    </div>`;
    return `<div class="vdr">
      <div class="vdr-top">
        <div class="vdr-motion">${v.motion}${moverLine}${noteLine}</div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;margin-left:12px">
          <div class="vdr-date">${v.date}</div>
          <span class="vdr-result ${rc}">${v.result}</span>
        </div>
      </div>
      ${sigBlock}
      ${voteBreakdown}
    </div>`;
  }).join('');
  el.innerHTML = `<div class="rmeta" style="margin-bottom:12px">Showing <strong>${vts.length}</strong> recorded votes — with plain-English summaries of what each vote means for Georgetown residents</div><div class="vote-detail-rows">${rows}</div>`;

  } catch(_e) {
    _LOG.warn('renderVotes', _e.message, {fn:'renderVotes'});
  }
}

export function setVoteView(v, btn) {
  _setVoteView(v);
  document.querySelectorAll('#voteViewFilter .tbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderVotes();
}
export function viewAllVotes() {
  showPanel('votes');
  _setVoteView('timeline');
  document.querySelectorAll('#voteViewFilter .tbtn').forEach((b, i) => b.classList.toggle('on', i === 2));
  renderVotes();
}
export function setVoteYear(y, btn) {
  _setVoteYear(y);
  document.querySelectorAll('#voteYearFilter .tbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderVotes();
}

// ═══════════════════════════════════════════════════════
// ALERTS
// ═══════════════════════════════════════════════════════
export function toggleTopic(btn, topic) {
  if (topic === 'all') {
    alertTopics.clear(); alertTopics.add('all');
    document.querySelectorAll('#alertTopics .alert-topic-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on'); return;
  }
  alertTopics.delete('all');
  const allBtn = document.querySelector('#alertTopics .alert-topic-btn');
  if (allBtn) allBtn.classList.remove('on');
  alertTopics.has(topic) ? (alertTopics.delete(topic), btn.classList.remove('on')) : (alertTopics.add(topic), btn.classList.add('on'));
  if (!alertTopics.size) { alertTopics.add('all'); if(allBtn) allBtn.classList.add('on'); }
}

export function subscribeAlerts() {
  const email  = document.getElementById('alertEmail').value.trim();
  const result = document.getElementById('alertResult');
  if (!email || !email.includes('@')) { result.textContent='⚠️ Please enter a valid email address.'; result.className='alert-result err'; return; }
  const topics = [...alertTopics].join(',');
  const subj = encodeURIComponent('[Georgetown Records] Subscribe — ' + topics);
  const body = encodeURIComponent('Please add me to Georgetown Records meeting alerts.\n\nEmail: '+email+'\nTopics: '+topics+'\n\n---\nSent from Georgetown KY Public Records Index');
  window.location.href = 'mailto:YOUR_EMAIL@example.com?subject=' + subj + '&body=' + body;
  result.textContent = '✅ Opening your email client to confirm. You\'ll receive a confirmation once subscribed.';
  result.className = 'alert-result ok';
}

// ═══════════════════════════════════════════════════════
// COMMUNITY — FEEDBACK
// ═══════════════════════════════════════════════════════
export function setFType(t, btn) {
  setFeedbackType(t);
  document.querySelectorAll('.ftype-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
export function submitFeedback() {
  const subject = document.getElementById('fbSubject').value.trim();
  const message = document.getElementById('fbMessage').value.trim();
  const name    = document.getElementById('fbName').value.trim();
  const email   = document.getElementById('fbEmail').value.trim();
  const result  = document.getElementById('fbResult');
  if (!subject || !message) { result.textContent='⚠️ Please fill in a subject and message.'; result.className='fb-result err'; result.style.display='block'; return; }
  const typeLabels = { correction:'Correction', tip:'Tip', suggestion:'Suggestion', question:'Question' };
  const body = encodeURIComponent('Type: '+(typeLabels[feedbackType]||feedbackType)+'\n'+(name?'From: '+name+'\n':'')+(email?'Reply-to: '+email+'\n':'')+'\n'+message+'\n\n---\nSent from Georgetown KY Public Records Index');
  const subj = encodeURIComponent('[Georgetown Records '+(typeLabels[feedbackType]||feedbackType)+'] '+subject);
  window.location.href = 'mailto:YOUR_EMAIL@example.com?subject=' + subj + '&body=' + body;
  result.textContent = '✅ Opening your email client — thanks for the contribution!';
  result.className = 'fb-result ok'; result.style.display = 'block';
}

// ═══════════════════════════════════════════════════════
// CONTRIBUTE — PUBLIC KEY
// ═══════════════════════════════════════════════════════
export function showPubkey() {
  const m = document.getElementById('pubkeyModal');
  if (m) m.style.display = 'flex';
}

// ═══════════════════════════════════════════════════════
// PWA
// ═══════════════════════════════════════════════════════
let pwaInstallEvent = null;

export function installPWA() {
  if (!pwaInstallEvent) return;
  pwaInstallEvent.prompt();
  pwaInstallEvent.userChoice.then(r => { if(r.outcome==='accepted') { const b=document.getElementById('pwaBanner');if(b)b.classList.remove('show'); showToast('App installed! 📱'); } pwaInstallEvent = null; });
}
export function handleConnectivity() { const p=document.getElementById('offlinePill');if(p)p.classList.toggle('show',!navigator.onLine); }

// ── PDF ARCHIVING ─────────────────────────────────────────────────────────────
//
// Strategy: Cloudflare Worker fetches PDFs from the AgendaCenter and stores
// them in R2 alongside new-records.json. The browser can then link to the
// archived copy as a fallback when the original URL is unavailable.
// This prevents link rot if the city removes documents.
//
// The archiver runs as a second cron job on the Worker (daily, not 30-min).
// Cost: R2 storage ~$0.015/GB/month. 200 PDFs × ~500KB = ~100MB = ~$0.0015/mo.

export const PDF_ARCHIVE_BASE = 'https://YOUR-WORKER.workers.dev/archive/';
// When a source URL matches georgetownky.gov and ends in .pdf or ViewFile,
// the frontend checks the archived copy first as a fallback.

export function getArchivedUrl(originalUrl) {
  if (!originalUrl || !originalUrl.includes('georgetownky.gov')) return originalUrl;
  // Encode the original URL as a path-safe key
  const key = btoa(originalUrl).replace(/[+/=]/g, c => c === '+' ? '-' : c === '/' ? '_' : '');
  return PDF_ARCHIVE_BASE + key;
}

// Attach archive fallback to all source links in event cards
// Called after drawer body is rendered
export function attachArchiveFallbacks() {
  document.querySelectorAll('.devent-source, .sr-meeting a[target="_blank"]').forEach(link => {
    const orig = link.href;
    if (!orig || !orig.includes('georgetownky.gov')) return;
    link.addEventListener('click', async function(e) {
      // Try original first; if it fails (404/error), try archive
      // We don't intercept unless needed
    }, { once: true });
  });
}
export function setPF(v, btn) {
  _setPlanF(v);
  document.querySelectorAll('#panel-planning .tbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderPlan(window.getIds(), activeQ);
}
export function setDF(v, btn)   { _setDeptF(v); document.querySelectorAll('#panel-directory .tbtn').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); renderDir(window.getIds(), activeQ); }
export function setYF(v, btn)   { _setYearF(v); document.querySelectorAll('#panel-meetings .tbtn').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); renderMeet(window.getIds(), activeQ); }

// ═══════════════════════════════════════════════════════
// NAVIGATION — PANELS & SIDEBAR
// ═══════════════════════════════════════════════════════
export function showPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  const navBtn = document.getElementById('nb-' + id);
  if (!panel) { console.warn('showPanel: no panel with id "panel-' + id + '"'); return; }
  if (!navBtn) { console.warn('showPanel: no nav button with id "nb-' + id + '"'); return; }
  panel.classList.add('active');
  navBtn.classList.add('active');
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Lazy init for data-heavy panels
  if (id === 'budget') {
    // Init charts for whichever budget sub-tab is currently active
    const activeTab = document.querySelector('.btab.active');
    if (!activeTab || activeTab.id === 'btab-overview' || activeTab.id === 'btab-grants') setTimeout(initCharts, 50);
    if (activeTab && activeTab.id === 'btab-cip') setTimeout(initCIPChart, 50);
  }
  // Re-render dynamic panels every time they become active.
  // Fixes mobile content-visibility / deferred-render issue.
  const _q = activeQ || '';
  const _ids = (typeof window.getIds === 'function') ? window.getIds() : null;
  if (id === 'directory')  renderDir(_ids, _q);
  if (id === 'meetings')   renderMeet(_ids, _q);
  if (id === 'planning')   renderPlan(_ids, _q);
  if (id === 'votes')      renderVotes();
  if (id === 'ordinances') { try { renderOrds(); } catch(e) {} }
  if (id === 'water') { try { renderWaterRateChart(); } catch(e) {} }
  // Hide search overlay when explicitly navigating
  const overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.classList.remove('active');

  // ── Sync bottom nav active state ──────────────────────
  // The bottom nav has 5 fixed tabs. Map each panel to its
  // nearest bnav tab, or clear all if no match (sidebar panels).
  const BNAV_MAP = {
    home: 'home', directory: 'directory', planning: 'directory',
    votes: 'votes', meetings: 'votes',
    elections: 'elections',
    budget: 'more', factcheck: 'more', pipeline: 'more',
    alerts: 'more', community: 'more', about: 'more',
    contribute: 'more', econ: 'more', ordinances: 'more',
    zoning: 'more', schools: 'more', vendors: 'more', water: 'more',
  };
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
  const bnavId = BNAV_MAP[id];
  const bnavBtn = bnavId ? document.getElementById('bnav-' + bnavId) : null;
  if (bnavBtn) bnavBtn.classList.add('active');
}

export function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuBtn = document.querySelector('.hdr-menu-btn');
  const isOpen  = sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
export function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ═══════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════
export function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ═══════════════════════════════════════════════════════
// HEADER HEIGHT — sticky sidebar sync
// ═══════════════════════════════════════════════════════
export function updateHeaderH() {
  const h = document.getElementById('siteHeader').offsetHeight;
  document.documentElement.style.setProperty('--header-h', h + 'px');
  const sb = document.getElementById('sidebar');
  if (window.innerWidth > 900) {
    sb.style.top    = h + 'px';
    sb.style.height = 'calc(100vh - ' + h + 'px)';
  } else {
    sb.style.top    = '';
    sb.style.height = '';
  }
}

// ═══════════════════════════════════════════════════════
// HOME PANEL HELPERS
// ═══════════════════════════════════════════════════════

/**
 * jumpSearch: populates the global search bar, switches to the most relevant
 * panel, and runs the search — giving users a one-tap path from home chips.
 */
export function jumpSearch(query) {
  const input = document.getElementById('gsearch');
  if (!input) return;
  input.value = query;
  window.onSearch(query);
  // Navigate to the most relevant panel for this query
  const q = query.toLowerCase();
  if (q.includes('meeting') || q.includes('minutes') || q.includes('jag') ||
      q.includes('columbia') || q.includes('ems') || q.includes('airport') ||
      q.includes('stormwater') || q.includes('gmwss') || q.includes('resume')) {
    showPanel('meetings');
  } else {
    showPanel('directory');
  }
}

/**
 * renderHomeRecent: populates the 5 most recent meeting rows on the home panel.
 * Called from appInit after MEETINGS data is available.
 */
export function renderHomeRecent() {
  const el = document.getElementById('home-recent-list');
  if (!el || !MEETINGS || !MEETINGS.length) return;
  const recent = MEETINGS.slice(0, 5);
  el.innerHTML = recent.map(m => {
    const badge = (m.f === 'New' || m.pipeline)
      ? `<span class="home-recent-badge hrb-new">${m.pipeline ? 'Live' : 'New'}</span>`
      : m.f === 'Updated' ? `<span class="home-recent-badge hrb-upd">Updated</span>` : '';
    const dateStr = `${m.mo} ${m.dy}, ${m.yr}`;
    return `<div class="home-recent-row" onclick="showPanel('meetings')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')showPanel('meetings')">
      <div class="home-recent-date">${dateStr}</div>
      <div class="home-recent-text"><strong>${m.title}</strong> — ${m.sum.slice(0, 100)}${m.sum.length > 100 ? '…' : ''}</div>
      ${badge}
    </div>`;
  }).join('');
}

/**
 * updateHomeStats: fills in the bento stat tiles after the lunr index builds.
 */
export function updateHomeStats() {
  const people   = document.getElementById('home-stat-people');
  const meetings = document.getElementById('home-stat-meetings');
  if (people   && allDocs) people.textContent   = allDocs.filter(d => d.type === 'person').length;
  if (meetings && MEETINGS) meetings.textContent = MEETINGS.length;
}

// ═══════════════════════════════════════════════════════
// ORDINANCE REGISTRY
// ═══════════════════════════════════════════════════════
export function setOrdF(f, btn) {
  _setOrdFilter(f);
  document.querySelectorAll('#panel-ordinances .tbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderOrds();
}

export function renderOrds() {
  try {

  const tbody = document.getElementById('ordBody');
  if (!tbody) return;
  const filtered = ordFilter === 'all' ? ORDINANCES : ORDINANCES.filter(o => o.type === ordFilter);
  tbody.innerHTML = filtered.map((o, i) => {
    const rowId = 'ord-row-' + o.num.replace(/[^a-z0-9]/gi,'');
    return `<tr class="ord-main-row" onclick="toggleOrdRow('${rowId}')"
              style="cursor:pointer" role="button" tabindex="0"
              onkeydown="if(event.key==='Enter'||event.key===' ')toggleOrdRow('${rowId}')">
      <td><span class="ord-num">${o.num}</span></td>
      <td class="ord-title">
        <span class="ord-chevron" id="chv-${rowId}" aria-hidden="true">▾</span>
        ${o.title}
      </td>
      <td><span class="ord-type ${TYPE_CSS[o.type] || 'ot-other'}">${TYPE_LBL[o.type] || o.type}</span></td>
      <td><a href="${o.url}" target="_blank" rel="noopener" class="ord-link"
             onclick="event.stopPropagation()">View ↗</a></td>
    </tr>
    <tr class="ord-detail-row" id="${rowId}" style="display:none">
      <td colspan="4" class="ord-detail-cell">
        <div class="ord-detail-body">
          <div class="ord-detail-summary">${o.summary}</div>
          <a href="${o.url}" target="_blank" rel="noopener" class="ord-detail-link">
            📄 View Official Ordinance ${o.num} ↗
          </a>
        </div>
      </td>
    </tr>`;
  }).join('');

  } catch(_e) {
    _LOG.warn('renderOrds', _e.message, {fn:'renderOrds'});
  }
}

export function toggleOrdRow(rowId) {
  try {

  const row = document.getElementById(rowId);
  const chv = document.getElementById('chv-' + rowId);
  if (!row) return;
  const isOpen = row.style.display !== 'none';
  row.style.display = isOpen ? 'none' : 'table-row';
  if (chv) {
    chv.style.transform = isOpen ? '' : 'rotate(180deg)';
    chv.style.color = isOpen ? '' : 'var(--green-3)';
  }

  } catch(_e) {
    _LOG.warn('toggleOrdRow', _e.message, {fn:'toggleOrdRow'});
  }
}

// ═══════════════════════════════════════════════════════
// WINDOW EVENT LISTENERS (side effects on import)
// ═══════════════════════════════════════════════════════
window.addEventListener('resize', updateHeaderH);
window.addEventListener('orientationchange', updateHeaderH);
window.addEventListener('online', handleConnectivity);
window.addEventListener('offline', handleConnectivity);
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); pwaInstallEvent = e;
  const b = document.getElementById('pwaBanner'); if(b) b.classList.add('show');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
handleConnectivity();
