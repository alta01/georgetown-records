import { _LOG } from './logger.js';
import { WATER_RATE_DATA } from './data/water.js';
import { SCHOOL_YEARS, READING_DATA, MATH_DATA } from './data/schools.js';

// ═══════════════════════════════════════════════════════
// BUDGET CHARTS
// ═══════════════════════════════════════════════════════
let chartsReady = false;
const chartInst = {};

export function isDark() { return window.matchMedia('(prefers-color-scheme:dark)').matches; }
export function cPalette() {
  return isDark()
    ? { ink:'#f0ede4', ink3:'#88877c', line:'rgba(255,255,255,0.1)', card:'#1c1c19', green:'#52b830', gold:'#d4a830', blue:'#60a0e0', red:'#e06050', purple:'#a080e8', teal:'#40c8c0', amber:'#e09840' }
    : { ink:'#191916', ink3:'#7a796f', line:'rgba(25,25,22,0.1)',    card:'#faf8f3', green:'#1a3d0e', gold:'#966e14', blue:'#0e2f58', red:'#7a1a10', purple:'#3a1a68', teal:'#0a3e3a', amber:'#7c3c08' };
}

// ── BUDGET TAB SWITCHING ──────────────────────────────────────────────────────
export function setBudgetTab(tab, btn) {
  document.querySelectorAll('#panel-budget .tbtn').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.btab').forEach(t => t.classList.remove('active'));
  btn.classList.add('on');
  document.getElementById('btab-' + tab).classList.add('active');
  // Init charts lazily when their tab becomes visible
  if (tab === 'overview' || tab === 'grants') setTimeout(initCharts, 50);
  if (tab === 'cip') setTimeout(initCIPChart, 50);
}

let cipChartReady = false;
export function initCIPChart() {
  try {

  if (cipChartReady || typeof Chart === 'undefined') return;
  const C = cPalette();
  const make = (id, cfg) => { const el = document.getElementById(id); if(el) { chartInst[id] = new Chart(el, cfg); } };
  make('chartCIP', {
    type: 'bar',
    data: {
      labels: ['Stormwater\n(FY25)','GMWSS\nProjects','EMS\nStation','City Hall\nRenovation','Lexington Way\n/ Old Oxford','CAD Cloud\nMigration','Ladder\nTruck (FY26)','Broadway\nStormwater (FY26)'],
      datasets: [{
        label: 'Known / Est. Amount',
        data: [1200000, 296680, null, null, null, null, null, null],
        backgroundColor: [C.blue+'55',C.teal+'55',C.red+'44',C.gold+'44',C.purple+'44',C.green+'44',C.red+'44',C.blue+'44'],
        borderColor:     [C.blue,C.teal,C.red,C.gold,C.purple,C.green,C.red,C.blue],
        borderWidth: 1.5, borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => c.raw ? '$' + c.raw.toLocaleString() : 'Amount TBD — see adopted budget' } }
      },
      scales: {
        y: { ticks: { callback: v => '$' + (v/1000).toFixed(0) + 'K' }, grid: { color: C.line } },
        x: { grid: { display: false } }
      }
    }
  });
  cipChartReady = true;

  } catch(_e) {
    _LOG.warn('initCIPChart', _e.message, {fn:'initCIPChart'});
  }
}

let chartLoadAttempts = 0;
export function initCharts() {
  if (chartsReady) return;
  if (typeof Chart === 'undefined') {
    chartLoadAttempts++;
    if (chartLoadAttempts < 15) { setTimeout(initCharts, 300); return; }
    document.querySelectorAll('.chart-wrap canvas').forEach(el => {
      el.parentElement.innerHTML = '<div style="padding:20px;text-align:center;color:var(--ink-3);font-size:12px;border:1px solid var(--line);border-radius:var(--r-sm)">📊 Charts require an internet connection.<br>Key figures are shown in the stat tiles above.</div>';
    });
    return;
  }
  const C = cPalette();
  Chart.defaults.color = C.ink3;
  Chart.defaults.borderColor = C.line;
  Chart.defaults.font.family = "'Barlow', system-ui, sans-serif";
  Object.values(chartInst).forEach(c => { try { c.destroy(); } catch(e){} });

  const make = (id, cfg) => { const el = document.getElementById(id); if(el) { chartInst[id] = new Chart(el, cfg); } };

  make('chartFundBalance', { type:'bar', data:{ labels:['Budgeted Deficit (FY25)','Actual Projected Deficit (FY25)','General Fund Balance (Jun 30 2025)'], datasets:[{ data:[7200000,1500000,23600000], backgroundColor:[C.red+'44',C.gold+'44',C.green+'44'], borderColor:[C.red,C.gold,C.green], borderWidth:1.5, borderRadius:5 }] }, options:{ responsive:true, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:c=>'$'+c.raw.toLocaleString()}} }, scales:{ y:{ ticks:{callback:v=>'$'+(v/1000000).toFixed(1)+'M'}, grid:{color:C.line} }, x:{grid:{display:false}} } } });

  make('chartDeptAlloc', { type:'doughnut', data:{ labels:['Police','Fire & EMS','Public Works','Stormwater','Admin / Finance','IT / HR / Legal','Grants & Capital','Other'], datasets:[{ data:[22,14,9,3,10,8,18,16], backgroundColor:[C.blue+'cc',C.red+'cc',C.purple+'cc',C.blue+'88',C.gold+'cc',C.teal+'cc',C.green+'cc',C.amber+'cc'], borderWidth:2, borderColor:C.card }] }, options:{ responsive:true, cutout:'65%', plugins:{ legend:{position:'right', labels:{font:{size:10},boxWidth:12,padding:8}}, tooltip:{callbacks:{label:c=>c.label+': ~'+c.raw+'%'+(c.label==='Stormwater'?' ($1.2M+ confirmed)':'')}} } } });

  make('chartGrants', { type:'bar', data:{ labels:['JAG\n(Community Recovery)','BVP\n(Bulletproof Vest)','VAWA','Airport\n(AIG)','ARPA\n(Capital, est.)'], datasets:[{ data:[147588,20000,25000,200000,1000000], backgroundColor:[C.green+'55',C.blue+'55',C.teal+'55',C.gold+'55',C.amber+'55'], borderColor:[C.green,C.blue,C.teal,C.gold,C.amber], borderWidth:1.5, borderRadius:4 }] }, options:{ indexAxis:'y', responsive:true, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:c=>c.raw>=1000?'$'+(c.raw/1000).toFixed(0)+'K est.':'$'+c.raw.toLocaleString()}} }, scales:{ x:{ticks:{callback:v=>'$'+(v>=1000000?(v/1000000).toFixed(1)+'M':(v/1000).toFixed(0)+'K')}, grid:{color:C.line}}, y:{grid:{display:false}} } } });

  make('chartGMWSS', { type:'bar', data:{ labels:['Judy Construction','Universal Solutions','Lovo Inc.','Hazen'], datasets:[{ data:[236172.45,33008.40,15900,11600], backgroundColor:[C.teal+'55',C.blue+'55',C.green+'55',C.gold+'55'], borderColor:[C.teal,C.blue,C.green,C.gold], borderWidth:1.5, borderRadius:4 }] }, options:{ responsive:true, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:c=>'$'+c.raw.toLocaleString()}} }, scales:{ y:{ticks:{callback:v=>'$'+(v/1000).toFixed(0)+'K'}, grid:{color:C.line}}, x:{grid:{display:false}} } } });

  chartsReady = true;
}

window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', () => {
  chartsReady = false;
  if (document.getElementById('panel-budget').classList.contains('active')) initCharts();
});

// ═══════════════════════════════════════════════════════
// SCHOOL CHARTS
// ═══════════════════════════════════════════════════════
export function setSchoolTab(tab, btn) {
  document.querySelectorAll('.school-ptab').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.school-ptab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  const el = document.getElementById('spt-' + tab);
  if (el) el.classList.add('active');
  if (tab === 'trend') initSchoolCharts();
}

export function initSchoolCharts() {
  try {
  renderSchoolChart('schoolReadChart', SCHOOL_YEARS, READING_DATA);
  renderSchoolChart('schoolMathChart', SCHOOL_YEARS, MATH_DATA);
  } catch(_e) {
    _LOG.warn('initSchoolCharts', _e.message, {fn:'initSchoolCharts'});
  }
}

export function renderSchoolChart(id, years, data) {
  try {

  const el = document.getElementById(id);
  if (!el) return;
  const styles = getComputedStyle(document.documentElement);
  const colors = {
    elem: styles.getPropertyValue('--green').trim() || '#1a3d0e',
    mid:  styles.getPropertyValue('--gold').trim()  || '#7a5a10',
    hs:   styles.getPropertyValue('--blue').trim()  || '#0e2f58',
    ky:   styles.getPropertyValue('--red-2').trim() || '#a02818',
  };
  const W = el.offsetWidth || 400, H = 150;
  const pad = { t: 10, r: 10, b: 30, l: 36 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const minV = 20, maxV = 70;
  const xStep = cw / (years.length - 1);
  const yScale = v => pad.t + ch - ((v - minV) / (maxV - minV)) * ch;

  let paths = '';
  const series = [
    { key: 'elem', label: 'Elem' },
    { key: 'mid',  label: 'Mid'  },
    { key: 'hs',   label: 'HS'   },
    { key: 'ky',   label: 'KY'   },
  ];
  series.forEach(s => {
    const pts = data[s.key];
    let d = '', prev = null;
    pts.forEach((v, i) => {
      if (v === null) { prev = null; return; }
      const x = pad.l + i * xStep, y = yScale(v);
      if (prev === null) d += `M${x},${y}`;
      else d += ` L${x},${y}`;
      prev = { x, y };
    });
    const stroke = s.key === 'ky' ? '4,3' : '0';
    paths += `<path d="${d}" stroke="${colors[s.key]}" stroke-width="${s.key==='ky'?1.5:2}" fill="none" stroke-dasharray="${stroke}" opacity="${s.key==='ky'?0.7:1}"/>`;
    // dots
    pts.forEach((v, i) => {
      if (v === null) return;
      const x = pad.l + i * xStep, y = yScale(v);
      paths += `<circle cx="${x}" cy="${y}" r="4" fill="${colors[s.key]}" stroke="${styles.getPropertyValue('--card').trim()||'#fff'}" stroke-width="1.5"/>`;
      paths += `<text x="${x}" y="${y-7}" text-anchor="middle" fill="${colors[s.key]}" font-size="9" font-weight="700">${v}%</text>`;
    });
  });

  // Y grid lines
  let grid = '';
  [30,40,50,60].forEach(v => {
    const y = yScale(v);
    grid += `<line x1="${pad.l}" x2="${pad.l+cw}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1"/>`;
    grid += `<text x="${pad.l-4}" y="${y+4}" text-anchor="end" fill="var(--ink-4)" font-size="9">${v}%</text>`;
  });
  // X labels
  let xlbls = years.map((yr, i) =>
    `<text x="${pad.l + i * xStep}" y="${H - 4}" text-anchor="middle" fill="var(--ink-3)" font-size="9">${yr}</text>`
  ).join('');

  el.innerHTML = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${grid}${paths}${xlbls}</svg>`;

  } catch(_e) {
    _LOG.warn('renderSchoolChart', _e.message, {fn:'renderSchoolChart'});
  }
}

// ═══════════════════════════════════════════════════════
// WATER OVERSIGHT — Rate Chart
// ═══════════════════════════════════════════════════════
let _waterLineChartInst = null;
let _waterRateChartInst = null;

export function renderWaterRateChart() {
  const isDk  = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridClr = isDk ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
  const txtClr  = isDk ? '#c4c1b6' : '#3d3c36';

  // Line chart — water + sewer history
  const lineEl = document.getElementById('waterRateLineChart');
  if (lineEl && typeof Chart !== 'undefined') {
    if (_waterLineChartInst) { try { _waterLineChartInst.destroy(); } catch(e){} }
    const C = cPalette();
    // Build two segments: actual (solid) and projected (dashed)
    const actualEnd   = WATER_RATE_DATA.isProjected.indexOf(true);
    const actualSlice = actualEnd === -1 ? WATER_RATE_DATA.water.length : actualEnd;

    _waterLineChartInst = new Chart(lineEl, {
      type: 'line',
      data: {
        labels: WATER_RATE_DATA.labels,
        datasets: [
          {
            label: 'Water (fixed, first 2000 gal)',
            data: WATER_RATE_DATA.water,
            borderColor: C.blue,
            backgroundColor: C.blue + '22',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: WATER_RATE_DATA.isProjected.map(p => p ? C.blue + '66' : C.blue),
            segment: {
              borderDash: ctx => WATER_RATE_DATA.isProjected[ctx.p0DataIndex] ? [6,3] : undefined,
            }
          },
          {
            label: 'Sewer (fixed, first 2000 gal)',
            data: WATER_RATE_DATA.sewer,
            borderColor: C.teal,
            backgroundColor: C.teal + '22',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: WATER_RATE_DATA.isProjected.map(p => p ? C.teal + '66' : C.teal),
            segment: {
              borderDash: ctx => WATER_RATE_DATA.isProjected[ctx.p0DataIndex] ? [6,3] : undefined,
            }
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 14, padding: 10 } },
          tooltip: {
            callbacks: {
              title: (items) => WATER_RATE_DATA.labelsFull[items[0].dataIndex] || items[0].label,
              label: c => c.dataset.label + ': $' + c.raw.toFixed(2) + '/mo'
                + (WATER_RATE_DATA.isProjected[c.dataIndex] ? ' (projected)' : ''),
            }
          }
        },
        scales: {
          x: { ticks: { color: txtClr, font: { size: 10 }, maxRotation: 0 }, grid: { color: gridClr } },
          y: { ticks: { color: txtClr, font: { size: 11 }, callback: v => '$' + v.toFixed(0) },
               grid: { color: gridClr },
               title: { display: true, text: 'Fixed Monthly Charge ($)', color: txtClr, font: { size: 11 } } }
        }
      }
    });
  }

  // Stacked bar — combined water+sewer
  const barEl = document.getElementById('waterRateBarChart');
  if (barEl && typeof Chart !== 'undefined') {
    if (_waterRateChartInst) { try { _waterRateChartInst.destroy(); } catch(e){} }
    const C = cPalette();
    _waterRateChartInst = new Chart(barEl, {
      type: 'bar',
      data: {
        labels: WATER_RATE_DATA.labels,
        datasets: [
          {
            label: 'Water',
            data: WATER_RATE_DATA.water,
            backgroundColor: WATER_RATE_DATA.isProjected.map(p => p ? C.blue + '44' : C.blue + '88'),
            borderColor: C.blue,
            borderWidth: 1,
            borderRadius: 2,
          },
          {
            label: 'Sewer',
            data: WATER_RATE_DATA.sewer,
            backgroundColor: WATER_RATE_DATA.isProjected.map(p => p ? C.teal + '44' : C.teal + '88'),
            borderColor: C.teal,
            borderWidth: 1,
            borderRadius: 2,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 14, padding: 10 } },
          tooltip: {
            callbacks: {
              title: (items) => WATER_RATE_DATA.labelsFull[items[0].dataIndex] || items[0].label,
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const total = WATER_RATE_DATA.water[idx] + WATER_RATE_DATA.sewer[idx];
                return 'Combined: $' + total.toFixed(2) + '/mo'
                  + (WATER_RATE_DATA.isProjected[idx] ? ' (projected)' : '');
              }
            }
          }
        },
        scales: {
          x: { stacked: true, ticks: { color: txtClr, font: { size: 10 }, maxRotation: 0 }, grid: { color: gridClr } },
          y: { stacked: true, ticks: { color: txtClr, font: { size: 11 }, callback: v => '$' + v }, grid: { color: gridClr },
               title: { display: true, text: 'Fixed Monthly Charge ($)', color: txtClr, font: { size: 11 } } }
        }
      }
    });
  }
}
