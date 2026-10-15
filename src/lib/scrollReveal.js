/**
 * Direction-aware scroll reveals.
 * Blocks of content fade + rise into view when you scroll DOWN and drop in from above when you scroll UP,
 * and they replay each time they re-enter. Only `opacity`, `translate` and `scale` are animated (GPU, no layout).
 *
 * Safety rules so a page can never be left blank:
 *  - nothing is hidden until JS has armed it, and only elements that are currently OUTSIDE the viewport are armed
 *  - elements framer-motion already animates (inline opacity / transform) are left alone
 *  - the `html.rv-on` gate is removed again if the observer is unavailable
 */
const SELECTOR = [
  'main h2',
  'main h3',
  'main figure',
  'main form',
  'main table',
  'main dl',
  'main li.border',
  'main .journey__card',
  'main .process-step',
  'main .spot',
  'main [data-reveal]',
].join(',');
const SKIP = '.sr-only, [data-no-reveal], .hero-stage, .build-hero, [data-cursor], .marquee, .sg, [aria-hidden="true"], .work-cursor-preview';

export function installScrollReveal() {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const root = document.documentElement;
  const armed = new WeakSet();
  const seen = new WeakSet();
  let io = null;
  let timer = 0;

  const onIntersect = (entries) => {
    let step = 0;
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.style.setProperty('--rv-d', `${Math.min(step++, 5) * 70}ms`);
        el.classList.add('rv-in');
        el.dataset.rv = 'in';
      } else {
        const above = entry.boundingClientRect.top < 0;
        el.classList.remove('rv-in');
        el.style.removeProperty('--rv-d');
        el.dataset.rv = above ? 'above' : 'below';
      }
    });
  };

  const arm = () => {
    const main = document.querySelector('main');
    if (!main) return;
    const vh = window.innerHeight;
    main.querySelectorAll(SELECTOR.replace(/main /g, '')).forEach((el) => {
      if (armed.has(el) || seen.has(el)) return;
      seen.add(el);
      if (el.closest(SKIP)) return;
      if (el.style.opacity || el.style.transform || el.style.translate) return; // already driven by framer-motion
      if (el.parentElement?.closest('.rv')) return; // only the outermost block moves
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      const inView = r.bottom > 0 && r.top < vh;
      el.classList.add('rv');
      if (inView) el.classList.add('rv-in');
      armed.add(el);
      io.observe(el);
    });
  };

  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(arm, 90);
  };

  io = new IntersectionObserver(onIntersect, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
  root.classList.add('rv-on');
  const main = document.querySelector('main');
  const mo = new MutationObserver(schedule);
  mo.observe(main || document.body, { childList: true, subtree: true });
  schedule();

  return () => {
    window.clearTimeout(timer);
    mo.disconnect();
    io.disconnect();
    root.classList.remove('rv-on');
    document.querySelectorAll('.rv').forEach((el) => {
      el.classList.remove('rv', 'rv-in');
      el.removeAttribute('data-rv');
      el.style.removeProperty('--rv-d');
    });
  };
}
