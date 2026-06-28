export const ELECTION_2026 = {
  primary: new Date('2026-05-19T00:00:00'),
  general: new Date('2026-11-03T00:00:00'),
  registerPrimary: new Date('2026-04-20T00:00:00'),  // deadline passed Apr 20 2026
  registerGeneral: new Date('2026-10-05T00:00:00'),
  // Primary results — May 19 2026. Source: News-Graphic "Election results in for 2026 primary"; Scott County turnout 26.2% (11,789 of 44,957 registered)
  // Certified results available at: scottcountyclerk.ky.gov / 502-863-7875
  primaryTurnout: { registered: 44957, ballotsCast: 11789, pct: 26.2 },
  primaryResults: {
    mayor: [
      { name: 'Burney Jenkins',  votes: 2524, pct: 37.2, advances: true  },
      { name: 'Kim Menke',       votes: 1675, pct: 24.7, advances: true  },
      { name: 'Alonzo Allen',    votes: 1362, pct: 20.1, advances: false },
      { name: 'Dan Holman',      votes: 1196, pct: 17.6, advances: false },
    ],
    council: {
      advancing: 16,
      eliminated: [
        { name: 'Charles Long', votes: 957 },
        { name: 'Dean Strong',  votes: 915 },
      ],
    },
  },
};

// Map region info — what offices appear on the ballot in each area
export const MAP_REGIONS = {
  city: {
    name: 'Georgetown City Limits',
    desc: 'Georgetown residents vote in BOTH city races and all Scott County races.',
    races: [
      { name: 'Mayor of Georgetown', type: 'Nonpartisan · 4 candidates', note: 'Burney Jenkins (incumb.), Alonzo Allen, Dan Holman, Kim Menke' },
      { name: 'City Council (8 seats)', type: 'Nonpartisan at-large · 18 candidates', note: '7 incumbents + 11 challengers' },
      { name: 'Scott County Judge/Executive', type: 'Republican primary', note: 'Joe Pat Covington (incumbent, unopposed)' },
      { name: 'Scott County Clerk', type: 'Republican primary', note: 'Neryssa Crisp filed' },
      { name: 'Scott County Coroner', type: 'Republican primary', note: 'Mark Sutton filed' },
      { name: 'KY State House District 62', type: 'Partisan primary', note: 'Includes much of Scott County' },
      { name: 'KY State Senate District 17', type: 'Partisan primary', note: 'Includes Scott County' },
    ]
  },
  north: {
    name: 'North Scott County',
    desc: 'Unincorporated north county — Toyota corridor, rural areas, Lanes Run Business Park. County races only.',
    races: [
      { name: 'Scott County Judge/Executive', type: 'Republican primary', note: 'Joe Pat Covington (incumbent, unopposed)' },
      { name: 'Scott County Magistrate (District varies)', type: 'County race', note: 'Confirm your district at scottcountyclerk.ky.gov' },
      { name: 'Scott County Clerk', type: 'Republican primary', note: 'Neryssa Crisp filed' },
      { name: 'KY State House District 62', type: 'Partisan primary', note: 'Includes much of Scott County' },
    ]
  },
  east: {
    name: 'East Scott County',
    desc: 'Unincorporated east county. County and state races only — no city races.',
    races: [
      { name: 'Scott County Judge/Executive', type: 'Republican primary', note: 'Joe Pat Covington (incumbent, unopposed)' },
      { name: 'Scott County Magistrate (District varies)', type: 'County race', note: 'Confirm your district at scottcountyclerk.ky.gov' },
      { name: 'KY State House District 62', type: 'Partisan primary', note: 'Includes much of Scott County' },
    ]
  },
  west: {
    name: 'West Scott County',
    desc: 'Unincorporated west county. County and state races only — no city races.',
    races: [
      { name: 'Scott County Judge/Executive', type: 'Republican primary', note: 'Joe Pat Covington (incumbent, unopposed)' },
      { name: 'Scott County Magistrate (District varies)', type: 'County race', note: 'Confirm your district at scottcountyclerk.ky.gov' },
      { name: 'KY State House District 62 or 88', type: 'Partisan primary', note: 'Confirm your district at govote.ky.gov' },
    ]
  },
  south: {
    name: 'South Scott County — Stamping Ground / Sadieville',
    desc: 'Stamping Ground and Sadieville are incorporated towns with their own local offices. Also vote in county and state races.',
    races: [
      { name: 'Scott County Judge/Executive', type: 'Republican primary', note: 'Joe Pat Covington (incumbent, unopposed)' },
      { name: 'Scott County Magistrate District 5', type: 'Republican primary', note: 'Dwayne Ellison filed' },
      { name: 'Stamping Ground / Sadieville local offices', type: 'Town races', note: 'Confirm at scottcountyclerk.ky.gov' },
      { name: 'KY State House District 88', type: 'Partisan primary', note: 'Includes part of south Scott County' },
    ]
  }
};

let activeRegion = null;

function showMapInfo(region, event) {
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

function hideMapInfo() {
  // Delay to allow click to register
  setTimeout(() => {
    const tt = document.getElementById('mapTooltip');
    if (tt && activeRegion === null) tt.style.display = 'none';
  }, 200);
}

function toggleMapInfo(region) {
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

// ── ELECTION ADDRESS LOOKUP ─────────────────────────────────────────────────
//
// RACES_CITY / RACES_COUNTY / RACES_STATE drive the accordion UI.
// Incumbents with a memberName get a photo avatar + "View Profile" button
// that calls openDrawer() and navigates to their full record card.

export const RACES_CITY = [
  {
    id: 'mayor', icon: '🏛️',
    name: 'Mayor of Georgetown',
    badge: 'rtb-city', badgeLabel: 'City Race',
    meta: 'Nonpartisan · Top 2 advance to general · 4-year term',
    intro: 'All Georgetown residents vote in this race. The top 2 candidates from the May 19 primary advance to the November 3 general election.',
    candidates: [
      { name:'Burney Jenkins',  status:'★ Advancing — Led primary (37%)', incumbent:true,
        memberName:'Burney Jenkins',      deptName:"Mayor's Office",  av:'av-gd', ini:'BJ', photo:2203,
        notes:'First Black mayor in Georgetown history (elected 2022). Led May 19 primary with 2,524 votes (37.2%). Advances to Nov 3 general.' },
      { name:'Kim Menke',       status:'Advancing — 2nd in primary (25%)', incumbent:true,
        memberName:'Kim Menke',           deptName:'City Council',    av:'av-g',  ini:'KM', photo:3154,
        notes:'Current City Councilmember (since Jan 2025). Received 1,675 votes (24.7%) in May 19 primary. Advances to Nov 3 general.' },
      { name:'Alonzo Allen',    status:'Eliminated in primary',        incumbent:false,
        notes:'Received 1,362 votes (20.1%) in May 19 primary. Did not advance to general.' },
      { name:'Dan Holman',      status:'Eliminated in primary',        incumbent:false,
        notes:'Received 1,196 votes (17.6%) in May 19 primary. Did not advance to general.' },
    ]
  },
  {
    id: 'council', icon: '⚖️',
    name: 'City Council — Georgetown',
    badge: 'rtb-city', badgeLabel: 'City Race',
    meta: 'Nonpartisan · At-large · Top 8 elected · 2-year term · 16 candidates advancing to general',
    intro: 'Georgetown City Council is at-large — all city residents vote for all 8 seats. The top 8 vote-getters in the November 3 general election are elected. 16 of 18 candidates advanced from the May 19 primary (Charles Long and Dean Strong eliminated). Incumbents are marked ★ — click their card to view their full profile.',
    candidates: [
      { name:'Sonja Wilkins Brent', status:'★ Incumbent — Advancing to general', incumbent:true,
        memberName:'Sonja Wilkins Brent', deptName:'City Council', av:'av-g', ini:'SW', photo:2052,
        notes:'Elected 2022. Scott County Attorney\'s Office background. Advanced from May 19 primary.' },
      { name:'Michael Crisp',       status:'★ Incumbent — Advancing to general', incumbent:true,
        memberName:'Michael Crisp',       deptName:'City Council', av:'av-g', ini:'MC', photo:3152,
        notes:'First term (Jan 2025). Active on budget and personnel votes. Advanced from May 19 primary.' },
      { name:'Willow Hambrick',     status:'★ Incumbent — Advancing to general', incumbent:true,
        memberName:'Willow Hambrick',     deptName:'City Council', av:'av-g', ini:'WH', photo:2054,
        notes:'Consistent presence on board appointments and GMWSS oversight. Advanced from May 19 primary.' },
      { name:'Greg Hampton',        status:'★ Incumbent — Advancing to general', incumbent:true,
        memberName:'Greg Hampton',        deptName:'City Council', av:'av-g', ini:'GH', photo:2050,
        notes:'Led Nov 2025 board transparency reform. X: @chefHampton. Advanced from May 19 primary.' },
      { name:'Karen Tingle Sames',  status:'★ Incumbent — Advancing to general', incumbent:true,
        memberName:'Karen Tingle Sames',  deptName:'City Council', av:'av-g', ini:'KT', photo:3168,
        notes:'Former Mayor (2006–2010). Consistent presence since 2012. Advanced from May 19 primary.' },
      { name:'Todd Stone',          status:'★ Incumbent — Advancing to general', incumbent:true,
        memberName:'Todd Stone',          deptName:'City Council', av:'av-g', ini:'TS', photo:2053,
        notes:'Highest vote-getter in 2024 (6,730 votes). Advanced from May 19 primary.' },
      { name:'Tammy Lusby Mitchell',status:'★ Incumbent — Advancing to general', incumbent:true,
        memberName:'Tammy Lusby Mitchell',deptName:'City Council', av:'av-g', ini:'TL', photo:3158,
        notes:'Sponsored Columbia Gas Franchise Ordinance (Sep 2025). Advanced from May 19 primary.' },
      { name:'Donnie Black',     status:'Advancing to general', incumbent:false, notes:'Advanced from May 19 primary. On Nov 3 general election ballot.' },
      { name:'Tony Hall',        status:'Advancing to general', incumbent:false, notes:'Advanced from May 19 primary. On Nov 3 general election ballot.' },
      { name:'Michael James',    status:'Advancing to general', incumbent:false, notes:'Advanced from May 19 primary. On Nov 3 general election ballot.' },
      { name:'Kevin Johnson',    status:'Advancing to general', incumbent:false, notes:'Advanced from May 19 primary. On Nov 3 general election ballot.' },
      { name:'Charles Long',     status:'Eliminated in primary',  incumbent:false, notes:'Received 957 votes in May 19 primary. Did not advance to general.' },
      { name:'David Lusby',      status:'Advancing to general', incumbent:false, notes:'Former councilmember (~30 yrs). Advanced from May 19 primary.' },
      { name:'Stephen Price',    status:'Advancing to general', incumbent:false, notes:'Advanced from May 19 primary. On Nov 3 general election ballot.' },
      { name:'Connie Tackett',   status:'Advancing to general', incumbent:false, notes:'Former councilmember (14 yrs). Advanced from May 19 primary.' },
      { name:'Mark Showalter',   status:'Advancing to general', incumbent:false, notes:'Former councilmember. Advanced from May 19 primary.' },
      { name:'Dean Strong',      status:'Eliminated in primary',  incumbent:false, notes:'Received 915 votes in May 19 primary. Did not advance to general.' },
      { name:'Theta Vinegar',    status:'Advancing to general', incumbent:false, notes:'Advanced from May 19 primary. On Nov 3 general election ballot.' },
    ]
  },
];

// TODO: Verify May 19 2026 primary outcomes for Scott County and KY State races with Scott County Clerk (scottcountyclerk.ky.gov / 502-863-7875). City mayor/council results are confirmed below; county and state race results are pending.
export const RACES_COUNTY = [
  {
    id: 'judge-exec', icon: '🏛️',
    name: 'Scott County Judge/Executive',
    badge: 'rtb-county', badgeLabel: 'County',
    meta: 'Republican primary · Incumbent running unopposed',
    intro: 'The Judge/Executive is the chief executive of Scott County, presiding over the Fiscal Court. Appears on the ballot for all Scott County residents.',
    candidates: [
      { name:'Joe Pat Covington', status:'★ Incumbent (unopposed) — Advances to Nov 3 general', incumbent:true,
        memberName:'Scott County Fiscal Court', deptName:'Scott County Fiscal Court',
        av:'av-gd', ini:'JC', photo:null,
        notes:'Incumbent Scott County Judge/Executive. Ran unopposed in May 19 Republican primary — advances automatically to Nov 3 general election.' },
    ]
  },
  {
    id: 'sc-clerk', icon: '📜',
    name: 'Scott County Clerk',
    badge: 'rtb-county', badgeLabel: 'County',
    meta: 'Republican primary',
    intro: 'The County Clerk maintains public records including deeds, elections, and vehicle titles.',
    candidates: [
      // TODO: Verify May 19 2026 primary result for Scott County Clerk race — confirm Neryssa Crisp status with Scott County Clerk (scottcountyclerk.ky.gov / 502-863-7875)
      { name:'Neryssa Crisp', status:'Filed (R) — May 19 primary result pending verification', incumbent:false, notes:'Filed for Scott County Clerk, January 2026. Primary outcome not yet reflected — verify at scottcountyclerk.ky.gov.' },
    ]
  },
  {
    id: 'coroner', icon: '⚕️',
    name: 'Scott County Coroner',
    badge: 'rtb-county', badgeLabel: 'County',
    meta: 'Republican primary',
    intro: 'The County Coroner investigates deaths within Scott County.',
    candidates: [
      // TODO: Verify May 19 2026 primary result for Scott County Coroner race — confirm Mark Sutton status with Scott County Clerk (scottcountyclerk.ky.gov / 502-863-7875)
      { name:'Mark Sutton', status:'Filed (R) — May 19 primary result pending verification', incumbent:false, notes:'Filed for Scott County Coroner, January 2026. Primary outcome not yet reflected — verify at scottcountyclerk.ky.gov.' },
    ]
  },
];

// TODO: Verify KY House District 62 and KY Senate District 17 May 19 2026 primary results — check Kentucky SOS (sos.ky.gov) or GoVote.ky.gov for certified outcomes
export const RACES_STATE = [
  {
    id: 'house62', icon: '🏦',
    name: 'KY House of Representatives — District 62',
    badge: 'rtb-state', badgeLabel: 'State',
    meta: 'Partisan primary · Includes much of Scott County',
    intro: 'District 62 includes much of Scott County. Confirm your district at GoVote.ky.gov.',
    candidates: [
      // TODO: Verify May 19 2026 primary results for House 62 — Tony Hampton (R) won R primary? Check sos.ky.gov
      { name:'Tony Hampton (R)',     status:'Filed — May 19 primary result pending verification', incumbent:false, notes:'Republican candidate. Georgetown area. Primary outcome not yet reflected — verify at sos.ky.gov.' },
      // TODO: Verify May 19 2026 Democratic primary for House 62 — Marshall vs. Simpkins result pending
      { name:'Matthew Marshall (D)', status:'Filed — May 19 primary result pending verification', incumbent:false, notes:'Democratic candidate. Primary result vs. Randy Simpkins pending verification at sos.ky.gov.' },
      { name:'Randy Simpkins (D)',   status:'Filed — May 19 primary result pending verification', incumbent:false, notes:'Democratic candidate. Primary result vs. Matthew Marshall pending verification at sos.ky.gov.' },
    ]
  },
  {
    id: 'senate17', icon: '🏦',
    name: 'KY Senate — District 17',
    badge: 'rtb-state', badgeLabel: 'State',
    meta: 'Partisan primary · Includes Scott County · Open seat',
    intro: 'Damon Thayer did not seek re-election after 2025 legislative session. District 17 covers Scott County.',
    candidates: [
      // TODO: Verify May 19 2026 Republican primary for Senate 17 — Jaddock vs. Nunn result pending — check sos.ky.gov
      { name:'Julia Jaddock (R)',  status:'Filed — May 19 primary result pending verification', incumbent:false, notes:'Republican candidate from Georgetown. R primary result vs. Matt Nunn pending verification at sos.ky.gov.' },
      { name:'Matt Nunn (R)',      status:'Filed — May 19 primary result pending verification', incumbent:false, notes:'Republican candidate from Sadieville. R primary result vs. Julia Jaddock pending verification at sos.ky.gov.' },
      { name:'Kiana Fields (D)',   status:'Advancing to Nov 3 general (ran unopposed in D primary)', incumbent:false, notes:'Democratic candidate from Georgetown. Ran unopposed in May 19 Democratic primary — advances to Nov 3 general election.' },
    ]
  },
];
