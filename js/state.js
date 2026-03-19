// ═══════════════════════════════════════════════════════
// SHARED MUTABLE STATE
// All cross-module state lives here. Modules import live
// bindings and call setter functions to mutate.
// ═══════════════════════════════════════════════════════

// Search / filter state
export let scope    = 'all';
export let deptF    = 'all';
export let yearF    = 'all';
export let voteYear = 'all';
export let voteView = 'scorecards';
export let activeQ  = '';
export let ordFilter = 'all';
export let planF    = 'all';

// Scope filter map — used by onSearch and setScope
export const SCOPE_MAP = {
  all:        d => true,
  people:     d => d.type === 'person',
  meetings:   d => d.type === 'meeting',
  votes:      d => d.type === 'vote',
  ordinances: d => d.type === 'ordinance',
  elections:  d => d.type === 'election',
  boards:     d => d.type === 'person' && ['planning','regional','arts','county-boards','county-govt'].includes(d.group),
};

// Lunr search index state
export let lidx   = null;
export let docMap  = null;
export let allDocs = null;

// Alerts
export const alertTopics = new Set(['all']);

// Community feedback
export let feedbackType = 'correction';

// Setters
export function setScope(s)    { scope = s; }
export function setActiveQ(q)  { activeQ = q; }
export function setDeptF(f)    { deptF = f; }
export function setYearF(f)    { yearF = f; }
export function setVoteYear(y) { voteYear = y; }
export function setVoteView(v) { voteView = v; }
export function setOrdFilter(f) { ordFilter = f; }
export function setPlanF(f)    { planF = f; }
export function setFeedbackType(t) { feedbackType = t; }
export function setIndex(i, d, a) { lidx = i; docMap = d; allDocs = a; }
