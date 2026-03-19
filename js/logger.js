// ═══════════════════════════════════════════════════════
// SILENT ERROR TELEMETRY
// All errors are caught, timestamped, and stored in a
// ring buffer — never shown to users.
// DevTools: gtky.log()  or  window.__GTKY_LOG
// Debug:    window.__GTKY_DEBUG = true  (mirrors to console)
// ═══════════════════════════════════════════════════════
export const _LOG = (() => {
  const MAX = 200, buf = [], start = Date.now();
  const write = (lvl, ctx, msg, det) => {
    buf.push({ t: Date.now()-start, lvl, ctx, msg: String(msg), det: det||null });
    if (buf.length > MAX) buf.shift();
    if (window._gtkyDebug) (lvl==='error' ? console.error : lvl==='warn' ? console.warn : console.debug)(`[GTKY:${ctx}] ${msg}`, det||'');
  };
  return {
    info:  (c,m,d) => write('INFO',  c, m, d),
    warn:  (c,m,d) => write('WARN',  c, m, d),
    error: (c,m,d) => write('ERROR', c, m, d),
    dump:  ()      => [...buf],
    last:  (n=20)  => buf.slice(-n),
    clear: ()      => (buf.length = 0),
  };
})();

// Expose for DevTools inspection
window.gtky           = window.gtky || {};
window.gtky.log       = () => _LOG.dump();
window.gtky.last      = n  => _LOG.last(n);
window.gtky.clear     = () => _LOG.clear();
Object.defineProperty(window, '__GTKY_LOG',   { get: () => _LOG.dump(), configurable: true });
Object.defineProperty(window, '__GTKY_DEBUG', { get: () => window._gtkyDebug||false, set: v => { window._gtkyDebug = !!v; }, configurable: true });

// Global uncaught error trap — silent
window.onerror = (msg, src, line, col, err) => {
  _LOG.error('window', msg, { src: src ? src.split('/').pop() : 'unknown', line, col, stack: err ? (err.stack||'').slice(0,400) : '' });
  return true;
};
window.addEventListener('unhandledrejection', e => {
  _LOG.error('promise', String(e.reason), { stack: e.reason?.stack ? e.reason.stack.slice(0,400) : '' });
  e.preventDefault();
});
