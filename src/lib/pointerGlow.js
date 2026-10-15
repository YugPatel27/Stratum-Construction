/**
 * Pointer glow for cards, panels and buttons.
 * One passive pointermove listener -> one rAF -> two CSS variables written on the single element under the pointer.
 * The look itself lives in polish.css (`.fx-glow`).
 */
const TARGETS = [
  '.fx-glow',
  '.journey__card',
  '.process-step',
  '.spot',
  '.btn-fx',
  '.about-portrait',
  'main li.border',
  'main a.border',
  'main article',
  'main button.group',
].join(',');

export function installPointerGlow() {
  if (!window.matchMedia('(pointer: fine)').matches) return () => {};
  let frame = 0;
  let ev = null;
  let current = null;

  const apply = () => {
    frame = 0;
    if (!ev) return;
    const t = ev.target instanceof Element ? ev.target.closest(TARGETS) : null;
    if (current && current !== t) current.classList.remove('is-glowing');
    current = t;
    if (!t) return;
    if (!t.classList.contains('fx-glow')) t.classList.add('fx-glow');
    const r = t.getBoundingClientRect();
    t.style.setProperty('--mx', `${ev.clientX - r.left}px`);
    t.style.setProperty('--my', `${ev.clientY - r.top}px`);
    t.classList.add('is-glowing');
  };
  const onMove = (e) => {
    ev = e;
    if (!frame) frame = requestAnimationFrame(apply);
  };
  const onLeave = () => {
    current?.classList.remove('is-glowing');
    current = null;
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('mouseleave', onLeave);
  return () => {
    cancelAnimationFrame(frame);
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('mouseleave', onLeave);
    current?.classList.remove('is-glowing');
  };
}
