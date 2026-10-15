/* Click ripple for any element carrying .btn-fx or [data-ripple]: one delegated listener, no per-button code. */
export function installRipple() {
  if (typeof document === 'undefined') return () => {};
  const onDown = (e) => {
    if (e.button > 0) return;
    const el = e.target.closest?.('.btn-fx, .menu-toggle, [data-ripple]');
    if (!el) return;
    const b = el.getBoundingClientRect();
    const size = Math.hypot(Math.max(e.clientX - b.left, b.right - e.clientX), Math.max(e.clientY - b.top, b.bottom - e.clientY)) * 2;
    const dot = document.createElement('span');
    dot.className = 'fx-ripple';
    dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - b.left - size / 2}px;top:${e.clientY - b.top - size / 2}px`;
    el.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
  };
  document.addEventListener('pointerdown', onDown, { passive: true });
  return () => document.removeEventListener('pointerdown', onDown);
}
