// ═══════════════════════════════════════════════════════
// app.js — Entry point (ES module)
// Imports all modules and exposes functions to window
// for inline HTML event handlers (onclick, oninput, etc.)
// ═══════════════════════════════════════════════════════

import { _LOG } from './logger.js';

// UI
import {
  showPanel, openDrawer, closeDrawer, toggleEvent,
  renderDir, renderMeet, renderPlan, renderVotes, renderOrds,
  setDF, setYF, setPF, setOrdF,
  setVoteView, setVoteYear, viewAllVotes, toggleOrdRow,
  toggleSidebar, closeSidebar, showToast, jumpSearch,
  toggleTopic, subscribeAlerts, setFType, submitFeedback, showPubkey,
  installPWA, handleConnectivity, updateHeaderH,
  renderHomeRecent, updateHomeStats,
  hl, safeId, personCard, attachArchiveFallbacks, getArchivedUrl,
} from './ui.js';

// Search
import {
  rebuildIndex, getIds, onSearch, fillSearch, clearSearch, clearSearchOverlay,
  setScope, esc,
  goToPerson, goToVote, goToOrdinance, goToMeeting, goToElection,
} from './search.js';

// Pipeline
import { loadPipeline, pipelineItems } from './pipeline.js';

// Charts
import {
  setBudgetTab, setSchoolTab,
  initCharts, initCIPChart, initSchoolCharts,
  renderWaterRateChart,
} from './charts.js';

// Fact-check
import { runFC, pfill, buildCtx } from './factcheck.js';

// Elections
import {
  showMapInfo, hideMapInfo, toggleMapInfo,
  buildCandCard, buildRaceAccordion,
  toggleRace, toggleEconItem, lookupAddress,
  updateElectionCountdown,
} from './elections.js';


// ── Expose to window for inline HTML handlers ───────────────────────────────
Object.assign(window, {
  // Navigation / panels
  showPanel, openDrawer, closeDrawer, toggleEvent,
  toggleSidebar, closeSidebar, showToast, jumpSearch,

  // Search
  onSearch, clearSearch, setScope, fillSearch, clearSearchOverlay,
  goToPerson, goToVote, goToOrdinance, goToMeeting, goToElection,
  esc, getIds, safeId,

  // Rendering
  renderDir, renderMeet, renderPlan, renderVotes, renderOrds,

  // Filters
  setDF, setYF, setPF, setOrdF,
  setVoteView, setVoteYear, viewAllVotes, toggleOrdRow,
  setBudgetTab, setSchoolTab,

  // Elections
  toggleRace, toggleEconItem, lookupAddress,
  showMapInfo, hideMapInfo, toggleMapInfo, buildRaceAccordion,
  updateElectionCountdown,

  // Fact-check
  runFC, pfill,

  // Contribute / settings
  installPWA, subscribeAlerts, submitFeedback,
  toggleTopic, setFType, showPubkey,

  // Archive fallbacks
  attachArchiveFallbacks, getArchivedUrl,
});


// ── App initialisation ──────────────────────────────────────────────────────
function appInit() {
  updateHeaderH();
  try {
    rebuildIndex();
  } catch (e) {
    console.warn('[Georgetown Records] Search index unavailable:', e.message);
    const inp = document.getElementById('gsearch');
    if (inp) { inp.placeholder = 'Search unavailable — loading…'; inp.disabled = true; }
  }
  renderDir(null);
  renderMeet(null);
  renderPlan(null);
  renderHomeRecent();
  updateHomeStats();
  updateElectionCountdown();
  renderOrds();
  loadPipeline();
}

function waitForLunr(attempts) {
  if (typeof lunr !== 'undefined') { appInit(); return; }
  if (attempts <= 0) {
    console.warn('[Georgetown Records] Lunr.js did not load in time — initialising without search');
    appInit();
    return;
  }
  setTimeout(() => waitForLunr(attempts - 1), 150);
}

// Start — give CDN scripts up to 3 seconds (20 × 150ms)
waitForLunr(20);
