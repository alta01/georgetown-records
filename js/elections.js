// ── elections.js ── Election UI: map tooltips, address lookup, race accordions
import { ELECTION_2026, MAP_REGIONS, RACES_CITY, RACES_COUNTY, RACES_STATE } from './data/elections.js';
import { _LOG } from './logger.js';

let activeRegion = null;

// ── Map tooltip helpers ─────────────────────────────────────────────────────

export function showMapInfo(region, event) {
  const info = MAP_REGIONS[region];
  if (!info) return;
  const tt = document.getElementById('mapTooltip');
  const ttTitle = document.getElementById('mapTTTitle');
  const ttBody  = document.getElementById('mapTTBody');
  if (!tt || !ttTitle || !ttBody) return;

  ttTitle.textContent = info.name;
  ttBody.innerHTML = `<div style="margin-bottom:6px;font-size:11px;color:var(--ink-3)">${info.desc}</div>` +
    info.races.map(r =>
      `<div class="map-tt-race"><strong>${r.name}</strong><br>${r.type}${r.note ? ' · ' + r.note : ''}</div>`
    ).join('');

  // Position tooltip near the cursor but within the map container
  const wrap = document.getElementById('elecMapWrap');
  if (wrap && event) {
    const rect = wrap.getBoundingClientRect();
    const x = event.clientX - rect.left + 10;
    const y = event.clientY - rect.top + 10;
    tt.style.left = Math.min(x, rect.width - 270) + 'px';
    tt.style.top  = Math.max(y, 0) + 'px';
  }
  tt.style.display = 'block';
}

export function hideMapInfo() {
  // Delay to allow click to register
  setTimeout(() => {
    const tt = document.getElementById('mapTooltip');
    if (tt && activeRegion === null) tt.style.display = 'none';
  }, 200);
}

export function toggleMapInfo(region) {
  // On mobile/touch, toggle the tooltip pinned
  if (activeRegion === region) {
    activeRegion = null;
    const tt = document.getElementById('mapTooltip');
    if (tt) tt.style.display = 'none';
  } else {
    activeRegion = region;
    // Highlight selected region
    document.querySelectorAll('.map-region').forEach(el => el.classList.remove('active'));
    const el = document.getElementById('region-' + region);
    if (el) el.classList.add('active');
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

// Render one candidate card. Incumbents get photo + "View Profile" button.
export function buildCandCard(c, uid) {
  // safeId must match what the main app uses for openDrawer
  const sid   = c.memberName ? c.memberName.replace(/[^a-zA-Z0-9]/g, '-') : '';
  const dsafe = (c.deptName  || '').replace(/'/g, "\u0027");
  const nsafe = (c.memberName|| '').replace(/'/g, "\u0027");
  const avId  = 'eca-' + uid;

  const avatarBlock = c.photo
    ? `<div class="cand-avatar-sm ${c.av}" id="${avId}">${c.ini}
         <img src="https://www.georgetownky.gov/ImageRepository/Document?documentID=${c.photo}"
              class="cand-photo-sm" alt="${c.name}" loading="lazy" referrerpolicy="no-referrer"
              onload="this.style.opacity=1;document.getElementById('${avId}').style.color='transparent'"
              onerror="this.remove()" style="opacity:0;transition:opacity .25s">
       </div>`
    : `<div class="cand-avatar-sm ${c.av || 'av-x'}">${(c.ini || c.name[0])}</div>`;

  const profileBtn = (c.incumbent && c.memberName)
    ? `<button class="cand-link-btn"
         onclick="event.stopPropagation();showPanel('directory');setTimeout(()=>openDrawer('${sid}','${dsafe}','${nsafe}'),120)"
         aria-label="View full profile for ${c.name}">View Full Profile \u2192</button>`
    : '';

  const clickAttr = (c.incumbent && c.memberName)
    ? `role="button" tabindex="0"
       onclick="showPanel('directory');setTimeout(()=>openDrawer('${sid}','${dsafe}','${nsafe}'),120)"
       onkeydown="if(event.key==='Enter'){showPanel('directory');setTimeout(()=>openDrawer('${sid}','${dsafe}','${nsafe}'),120);}"`
    : '';

  return `<div class="cand-card ${c.incumbent ? 'cand-incumbent' : 'cand-challenger'}" ${clickAttr}>
    <div class="cand-card-top">
      <div style="position:relative;width:28px;height:28px;flex-shrink:0">${avatarBlock}</div>
      <div style="min-width:0">
        <div class="cand-name">${c.name}</div>
        <div class="cand-status ${c.incumbent ? 'cs-incumbent' : 'cs-challenger'}">${c.status}</div>
      </div>
    </div>
    ${c.notes ? `<div class="cand-notes">${c.notes}</div>` : ''}
    ${profileBtn}
  </div>`;
}

// Render one race accordion row
export function buildRaceAccordion(race, raceIdx) {
  const cards = race.candidates
    .map((c, ci) => buildCandCard(c, `${raceIdx}-${ci}`))
    .join('');
  return `<div class="race-accordion" id="race-${race.id}">
    <button class="race-trigger" onclick="toggleRace('${race.id}')" aria-expanded="false">
      <span class="race-trigger-icon">${race.icon}</span>
      <div class="race-trigger-body">
        <div class="race-trigger-name">
          ${race.name}
          <span class="race-trigger-badge ${race.badge}">${race.badgeLabel}</span>
        </div>
        <div class="race-trigger-meta">${race.meta}</div>
      </div>
      <span class="race-chevron" aria-hidden="true">\u25be</span>
    </button>
    <div class="race-body" role="region">
      <div class="race-cand-intro">${race.intro}</div>
      <div class="race-cand-grid">${cards}</div>
    </div>
  </div>`;
}

export function toggleEconItem(id) {
  try {

  const detail = document.getElementById(id);
  const chv    = document.getElementById('echv-' + id);
  if (!detail) return;
  const isOpen = detail.style.display !== 'none';
  detail.style.display = isOpen ? 'none' : 'block';
  if (chv) {
    chv.style.transform = isOpen ? '' : 'rotate(180deg)';
    chv.style.color = isOpen ? '' : 'var(--green-3)';
  }

  } catch(_e) {
    _LOG.warn('toggleEconItem', _e.message, {fn:'toggleEconItem'});
  }
}

export function toggleRace(id) {
  try {

  const el  = document.getElementById('race-' + id);
  const btn = el && el.querySelector('.race-trigger');
  if (!el) return;
  const opening = !el.classList.contains('open');
  el.classList.toggle('open');
  if (btn) btn.setAttribute('aria-expanded', opening ? 'true' : 'false');

  } catch(_e) {
    _LOG.warn('toggleRace', _e.message, {fn:'toggleRace'});
  }
}

// ── Main lookup ───────────────────────────────────────────────────────────────
export function lookupAddress() {
  try {

  const input  = document.getElementById('elecAddr');
  const result = document.getElementById('elecAddrResult');
  if (!input || !result) return;

  const raw  = input.value.trim();
  if (!raw) { result.style.display = 'none'; return; }
  const addr = raw.toLowerCase();

  // Pattern matching — all processing is local, nothing is transmitted
  const isStamping  = /stamping\s*ground|sadieville/i.test(addr);
  const isCounty    = /rural|route\s*\d|rr\s*\d|county\s+rd|cr\s+\d|\bky[-\s]\d/i.test(addr);
  const isCity      = /40324|\d+\s+(n|s|e|w|north|south|east|west)\s+(court|main|broadway|hamilton|college|jackson|mulberry|water)|paris\s+pike\s+\d|lemons\s+mill\s+\d/i.test(addr);
  const hasGtown    = /georgetown/i.test(addr);

  let zone, icon, title, desc, races;

  if (isStamping) {
    zone  = 'county';
    icon  = '\ud83d\udccd';
    title = 'Stamping Ground / Sadieville area';
    desc  = 'You are likely in an incorporated south-county town. Georgetown city races (Mayor, City Council) do <strong>not</strong> appear on your ballot unless you live within Georgetown city limits.';
    races = [...RACES_COUNTY, ...RACES_STATE];
  } else if (isCity || (hasGtown && !isCounty)) {
    zone  = 'city';
    icon  = '\ud83c\udfd9\ufe0f';
    title = 'Georgetown \u2014 likely inside city limits';
    desc  = 'Georgetown city residents vote in <strong>city races</strong> (Mayor + 8 Council seats), all <strong>Scott County races</strong>, and <strong>state races</strong>. Primary: <strong>May 19, 2026</strong> \u00b7 Register by <strong>April 20</strong>.';
    races = [...RACES_CITY, ...RACES_COUNTY, ...RACES_STATE];
  } else if (isCounty || !hasGtown) {
    zone  = 'county';
    icon  = '\ud83c\udf3e';
    title = 'Likely unincorporated Scott County';
    desc  = 'County residents outside Georgetown city limits vote in <strong>county races</strong> and <strong>state races</strong>. Georgetown city races (Mayor, City Council) do <strong>not</strong> appear on your ballot.';
    races = [...RACES_COUNTY, ...RACES_STATE];
  } else {
    zone  = 'unknown';
    icon  = '\u2753';
    title = 'Unable to determine district';
    desc  = 'We could not confidently determine your area from this address.';
    races = [];
  }

  const accordions = races.map((r, i) => buildRaceAccordion(r, i)).join('');

  result.className = 'elec-addr-result ' + zone;
  result.innerHTML = `
    <div class="ballot-zone-title">${icon} ${title}</div>
    <div class="ballot-zone-desc" style="margin-bottom:12px">${desc}</div>
    ${accordions
      ? `<div class="ballot-races">${accordions}</div>`
      : `<p style="font-size:12px;color:var(--ink-3)">Confirm your races at <a href="https://govote.ky.gov" target="_blank">GoVote.ky.gov</a>.</p>`}
    <div class="ballot-disclaimer">
      \u2696\ufe0f Estimate only \u2014 not a legally binding determination.
      Confirm at <a href="https://govote.ky.gov" target="_blank" rel="noopener">GoVote.ky.gov</a>
      or call the <a href="https://scottcountyclerk.ky.gov" target="_blank" rel="noopener">Scott County Clerk</a> (502-863-7875).
      Your address was not stored or transmitted.
    </div>`;
  result.style.display = 'block';

  } catch(_e) {
    _LOG.warn('lookupAddress', _e.message, {fn:'lookupAddress'});
  }
}

// Allow Enter key in address field
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('elecAddr');
  if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') lookupAddress(); });
});


// Election countdown — updates the home panel bento
export function updateElectionCountdown() {
  try {

  const el = document.getElementById('electionDays');
  if (!el) return;
  const now     = new Date();
  const primary = ELECTION_2026.primary;
  if (now > primary) {
    // After primary, show general
    const general = ELECTION_2026.general;
    if (now > general) { el.textContent = '\u2713'; return; }
    const days = Math.ceil((general - now) / 86400000);
    el.textContent = days;
    const lbl = el.nextElementSibling;
    if (lbl) lbl.textContent = 'days until general';
    const title = document.querySelector('.ecb-title');
    if (title) title.textContent = 'General Election \u2014 Nov 3, 2026';
    return;
  }
  const days = Math.ceil((primary - now) / 86400000);
  el.textContent = days;

  } catch(_e) {
    _LOG.warn('elecCountdown', _e.message, {fn:'elecCountdown'});
  }
}
