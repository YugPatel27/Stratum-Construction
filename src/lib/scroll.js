/* Tiny shared handle on the Lenis instance so any component can drive scroll. */
let instance = null;

export const setLenis = (lenis) => {
  instance = lenis;
};
export const getLenis = () => instance;

export function scrollToTarget(target, options = {}) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4), ...options });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: 'smooth' });
}

export function jumpToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
