export const ELECTION_2026 = {
  primary: new Date('2026-05-19T00:00:00'),
  general: new Date('2026-11-03T00:00:00'),
  registerPrimary: new Date('2026-04-20T00:00:00'),
  registerGeneral: new Date('2026-10-05T00:00:00'),
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
      { name:'Burney Jenkins',  status:'★ Incumbent Mayor',         incumbent:true,
        memberName:'Burney Jenkins',      deptName:"Mayor's Office",  av:'av-gd', ini:'BJ', photo:2203,
        notes:'First Black mayor in Georgetown history (elected 2022). Former teacher 46 yrs, Georgetown Parks & Rec 25 yrs.' },
      { name:'Kim Menke',       status:'Filed — Current Councilmember', incumbent:true,
        memberName:'Kim Menke',           deptName:'City Council',    av:'av-g',  ini:'KM', photo:3154,
        notes:'Current City Councilmember (since Jan 2025). Co-seconded landmark board transparency reform Nov 2025.' },
      { name:'Alonzo Allen',    status:'Challenger — Filed',        incumbent:false,
        notes:'Filed for Mayor, January 2026.' },
      { name:'Dan Holman',      status:'Challenger — Filed',        incumbent:false,
        notes:'Filed for Mayor, January 2026.' },
    ]
  },
  {
    id: 'council', icon: '⚖️',
    name: 'City Council — Georgetown',
    badge: 'rtb-city', badgeLabel: 'City Race',
    meta: 'Nonpartisan · At-large · Top 8 elected · 2-year term · 18 candidates',
    intro: 'Georgetown City Council is at-large — all city residents vote for all 8 seats. The top 8 vote-getters are elected. Seven incumbents are seeking re-election alongside 11 challengers. Incumbents are marked ★ — click their card to view their full profile.',
    candidates: [
      { name:'Sonja Wilkins Brent', status:'★ Incumbent', incumbent:true,
        memberName:'Sonja Wilkins Brent', deptName:'City Council', av:'av-g', ini:'SW', photo:2052,
        notes:'Elected 2022. Scott County Attorney\'s Office background.' },
      { name:'Michael Crisp',       status:'★ Incumbent', incumbent:true,
        memberName:'Michael Crisp',       deptName:'City Council', av:'av-g', ini:'MC', photo:3152,
        notes:'First term (Jan 2025). Active on budget and personnel votes.' },
      { name:'Willow Hambrick',     status:'★ Incumbent', incumbent:true,
        memberName:'Willow Hambrick',     deptName:'City Council', av:'av-g', ini:'WH', photo:2054,
        notes:'Consistent presence on board appointments and GMWSS oversight.' },
      { name:'Greg Hampton',        status:'★ Incumbent', incumbent:true,
        memberName:'Greg Hampton',        deptName:'City Council', av:'av-g', ini:'GH', photo:2050,
        notes:'Led Nov 2025 board transparency reform. X: @chefHampton.' },
      { name:'Karen Tingle Sames',  status:'★ Incumbent', incumbent:true,
        memberName:'Karen Tingle Sames',  deptName:'City Council', av:'av-g', ini:'KT', photo:3168,
        notes:'Former Mayor (2006–2010). Consistent presence since 2012.' },
      { name:'Todd Stone',          status:'★ Incumbent', incumbent:true,
        memberName:'Todd Stone',          deptName:'City Council', av:'av-g', ini:'TS', photo:2053,
        notes:'Highest vote-getter in 2024 (6,730 votes).' },
      { name:'Tammy Lusby Mitchell',status:'★ Incumbent', incumbent:true,
        memberName:'Tammy Lusby Mitchell',deptName:'City Council', av:'av-g', ini:'TL', photo:3158,
        notes:'Sponsored Columbia Gas Franchise Ordinance (Sep 2025).' },
      { name:'Donnie Black',     status:'Challenger', incumbent:false, notes:'Filed January 2026.' },
      { name:'Tony Hall',        status:'Challenger', incumbent:false, notes:'Filed January 2026.' },
      { name:'Michael James',    status:'Challenger', incumbent:false, notes:'Filed January 2026.' },
      { name:'Kevin Johnson',    status:'Challenger', incumbent:false, notes:'Filed January 2026.' },
      { name:'Charles Long',     status:'Challenger', incumbent:false, notes:'Filed January 2026.' },
      { name:'David Lusby',      status:'Challenger', incumbent:false, notes:'Former councilmember (~30 yrs). Lost to Jenkins for Mayor 2022.' },
      { name:'Stephen Price',    status:'Challenger', incumbent:false, notes:'Filed January 2026.' },
      { name:'Connie Tackett',   status:'Challenger', incumbent:false, notes:'Former councilmember (14 yrs). Narrowly missed re-election in 2024 by 282 votes.' },
      { name:'Mark Showalter',   status:'Challenger', incumbent:false, notes:'Former councilmember. Did not seek re-election in 2024.' },
      { name:'Dean Strong',      status:'Challenger', incumbent:false, notes:'Filed January 2026.' },
      { name:'Theta Vinegar',    status:'Challenger', incumbent:false, notes:'Filed January 2026.' },
    ]
  },
];

export const RACES_COUNTY = [
  {
    id: 'judge-exec', icon: '🏛️',
    name: 'Scott County Judge/Executive',
    badge: 'rtb-county', badgeLabel: 'County',
    meta: 'Republican primary · Incumbent running unopposed',
    intro: 'The Judge/Executive is the chief executive of Scott County, presiding over the Fiscal Court. Appears on the ballot for all Scott County residents.',
    candidates: [
      { name:'Joe Pat Covington', status:'★ Incumbent (unopposed)', incumbent:true,
        memberName:'Scott County Fiscal Court', deptName:'Scott County Fiscal Court',
        av:'av-gd', ini:'JC', photo:null,
        notes:'Incumbent Scott County Judge/Executive. Running unopposed in Republican primary.' },
    ]
  },
  {
    id: 'sc-clerk', icon: '📜',
    name: 'Scott County Clerk',
    badge: 'rtb-county', badgeLabel: 'County',
    meta: 'Republican primary',
    intro: 'The County Clerk maintains public records including deeds, elections, and vehicle titles.',
    candidates: [
      { name:'Neryssa Crisp', status:'Filed (R)', incumbent:false, notes:'Filed for Scott County Clerk, January 2026.' },
    ]
  },
  {
    id: 'coroner', icon: '⚕️',
    name: 'Scott County Coroner',
    badge: 'rtb-county', badgeLabel: 'County',
    meta: 'Republican primary',
    intro: 'The County Coroner investigates deaths within Scott County.',
    candidates: [
      { name:'Mark Sutton', status:'Filed (R)', incumbent:false, notes:'Filed for Scott County Coroner, January 2026.' },
    ]
  },
];

export const RACES_STATE = [
  {
    id: 'house62', icon: '🏦',
    name: 'KY House of Representatives — District 62',
    badge: 'rtb-state', badgeLabel: 'State',
    meta: 'Partisan primary · Includes much of Scott County',
    intro: 'District 62 includes much of Scott County. Confirm your district at GoVote.ky.gov.',
    candidates: [
      { name:'Tony Hampton (R)',     status:'Filed', incumbent:false, notes:'Republican candidate. Georgetown area.' },
      { name:'Matthew Marshall (D)', status:'Filed', incumbent:false, notes:'Democratic candidate.' },
      { name:'Randy Simpkins (D)',   status:'Filed', incumbent:false, notes:'Democratic candidate.' },
    ]
  },
  {
    id: 'senate17', icon: '🏦',
    name: 'KY Senate — District 17',
    badge: 'rtb-state', badgeLabel: 'State',
    meta: 'Partisan primary · Includes Scott County · Open seat',
    intro: 'Damon Thayer did not seek re-election after 2025 legislative session. District 17 covers Scott County.',
    candidates: [
      { name:'Julia Jaddock (R)',  status:'Filed', incumbent:false, notes:'Republican candidate from Georgetown.' },
      { name:'Matt Nunn (R)',      status:'Filed', incumbent:false, notes:'Republican candidate from Sadieville.' },
      { name:'Kiana Fields (D)',   status:'Filed', incumbent:false, notes:'Democratic candidate from Georgetown.' },
    ]
  },
];
