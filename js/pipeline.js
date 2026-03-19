// ═══════════════════════════════════════════════════════
// PIPELINE (ES module)
// ═══════════════════════════════════════════════════════
import { _LOG } from './logger.js';
import { MEETINGS } from './data/meetings.js';

// Sanitize external data before DOM insertion
const _esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function safeUrl(u) {
  if (!u) return '';
  try { const p = new URL(u); return (p.protocol === 'https:' || p.protocol === 'http:') ? u : ''; } catch { return ''; }
}

export const R2_URL = 'https://gtky-pipeline.altanetworks.workers.dev/records';
export let pipelineLoaded = 0;
export let pipelineItems = [];

export async function loadPipeline() {
  const setStatus = (state, msg) => {
    const dot  = document.getElementById('pipeStatusDot');
    const text = document.getElementById('pipeStatusText');
    const last = document.getElementById('pipeLastCheck');
    if (dot)  dot.className = 'pipe-status-dot ' + state;
    if (text) text.textContent = msg;
    if (last) last.textContent = 'Checked ' + new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  };
  try {
    _LOG.info('pipeline', 'Fetching', {url: R2_URL});
    setStatus('', 'Checking for new records\u2026');
    const r = await fetch(R2_URL, { signal: AbortSignal.timeout(4000), cache: 'no-store' });
    if (!r.ok) {
      _LOG.warn('pipeline', 'Non-OK response', {status: r.status});
      setStatus('offline', 'Live feed unavailable \u2014 showing all archived records');
      return;
    }
    const items = await r.json();
    if (!Array.isArray(items) || !items.length) {
      setStatus('live', 'Feed active \u00b7 No new records');
      return;
    }
    const seen = new Set(MEETINGS.map(m => m.url));
    let added = 0;
    items.forEach(item => {
      const url = safeUrl(item.url);
      if (!url || seen.has(url)) return;
      seen.add(url);
      MEETINGS.unshift({ mo:_esc(item.mo||'\u2014'), dy:_esc(item.dy||'\u2014'), yr:_esc(item.yr||'2025'),
        type:_esc(item.type||'Agenda'), title:_esc(item.title||'New Record'),
        sum:_esc(item.sum||item.description||'New record from live feed.'),
        topics:(Array.isArray(item.topics)?item.topics:['motion']).map(t=>_esc(t)), url:url, f:'New', pipeline:true });
      added++;
    });
    if (added > 0) {
      pipelineLoaded = added;
      window._pipelineItems = (window._pipelineItems || []);
      items.forEach(item => { if (!window._pipelineItems.find(p => p.url === item.url)) window._pipelineItems.push(item); });
      pipelineItems = window._pipelineItems;
      window.rebuildIndex();
      window.renderMeet(window.getIds(), window.activeQ);
      window.renderHomeRecent();
      window.updateHomeStats();
      const pill = document.getElementById('pipePill');
      if (pill) { document.getElementById('pipePillCount').textContent = added + ' New'; pill.classList.add('show'); }
      const nc = document.getElementById('nc-meet'); if(nc) { nc.textContent = MEETINGS.length; nc.classList.add('new-flag'); }
      const np = document.getElementById('nc-pipe'); if(np) { np.style.display=''; np.textContent='+'+added; }
      const sp = document.getElementById('stat-pipe'); if(sp) sp.textContent = added;
      const nrDiv  = document.getElementById('pipeNewRecords');
      const nrList = document.getElementById('pipeNewList');
      const nrCnt  = document.getElementById('pipeNewCount');
      if (nrDiv && nrList && nrCnt) {
        nrCnt.textContent = added;
        nrList.innerHTML = MEETINGS.slice(0, added).map(m =>
          `<div class="mrow pipeline" style="margin-bottom:6px">
            <div class="mdate"><div class="mmo">${m.mo}</div><div class="mday">${m.dy}</div><div class="myr">${m.yr}</div></div>
            <div class="mbody"><div class="mtitle">${m.title}</div>
              <div class="msum">${(m.sum||'').slice(0,100)}${(m.sum||'').length>100?'\u2026':''}</div>
              ${m.url?`<a href="${m.url}" target="_blank" rel="noopener" class="mlink" style="margin-top:4px;display:inline-block">View official record \u2197</a>`:''}</div>
          </div>`).join('');
        nrDiv.style.display = '';
      }
      window.showToast(added + ' new record' + (added>1?'s':'') + ' loaded');
      setStatus('live', added + ' new record' + (added>1?'s':'') + ' \u00b7 Feed active');
      _LOG.info('pipeline', 'Loaded OK', {added});
    } else {
      setStatus('live', 'Feed active \u00b7 Up to date');
    }
  } catch(_e) {
    _LOG.warn('pipeline', _e.message, {url: R2_URL});
    const dot  = document.getElementById('pipeStatusDot');
    const text = document.getElementById('pipeStatusText');
    if (dot)  dot.className = 'pipe-status-dot offline';
    if (text) text.textContent = 'Live feed offline \u2014 all archived records available';
  }


  // ── GMWSS board minutes: surface water-related pipeline items ────────────
  try {
    const gmwssWaterEl = document.getElementById('water-pipe-last');
    if (gmwssWaterEl && window._pipelineItems) {
      const waterItems = window._pipelineItems.filter(i =>
        i.category === 'GMWSS' || (i.title && /water|sewer|gmwss/i.test(i.title))
      );
      if (waterItems.length) {
        gmwssWaterEl.textContent = waterItems.length + ' GMWSS record' + (waterItems.length > 1 ? 's' : '') + ' from pipeline';
      }
    }
    _LOG.info('pipeline', 'GMWSS water section check complete');
  } catch(_e2) {
    _LOG.warn('pipeline', 'GMWSS water check failed', {msg: _e2.message});
  }
}
