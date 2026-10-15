/**
 * Section start / end effects.
 * One passive scroll listener -> one rAF -> a handful of getBoundingClientRect reads, then CSS-variable writes.
 * Only elements marked [data-edge] are touched, and only while they are near the viewport.
 */
const clamp = (v) => Math.min(1, Math.max(0, v));

export function installSectionEdges(root = document) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  /* modern browsers run this effect as a scroll-driven CSS animation (polish.css): nothing to do in JS */
  if (typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()')) return () => {};
  let nodes = [];
  let frame = 0;
  let refreshTimer = 0;

  const collect = () => {
    nodes = Array.from(root.querySelectorAll('[data-edge]'));
    schedule();
  };

  const update = () => {
    frame = 0;
    const vh = window.innerHeight;
    const reads = nodes.map((el) => el.getBoundingClientRect()); // all reads first...
    nodes.forEach((el, i) => {
      // ...then all writes
      const r = reads[i];
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) return; // far away: leave as is
      const into = clamp((vh - r.top) / (vh * 0.55)); // 0 when its top edge reaches the fold, 1 once 45% up
      const out = clamp((vh * 0.85 - r.bottom) / (vh * 0.85)); // 0 when its bottom edge enters, 1 at the top
      const live = into < 1 || out > 0;
      el.style.setProperty('--in', into.toFixed(3));
      el.style.setProperty('--out', out.toFixed(3));
      if (live) el.setAttribute('data-edge-live', '');
      else el.removeAttribute('data-edge-live');
    });
  };
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  /* sections arrive lazily (code-split), so watch for them */
  const mo = new MutationObserver(() => {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(collect, 120);
  });
  mo.observe(root.querySelector?.('main') || root.body || root, { childList: true, subtree: true });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  collect();

  return () => {
    mo.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    window.clearTimeout(refreshTimer);
    if (frame) cancelAnimationFrame(frame);
    nodes.forEach((el) => {
      el.removeAttribute('data-edge-live');
      el.style.removeProperty('--in');
      el.style.removeProperty('--out');
    });
  };
}
