/**
 * One shared "is the page scrolling?" signal.
 *
 * While the page is moving (wheel, smooth-scroll tween, keyboard, scrollbar) we:
 *   - add `is-scrolling` to <html>, which CSS uses to drop expensive full-screen layers
 *     (blend-mode cursor, grain overlay, cursor glow) and to stop hover churn, and
 *   - tell subscribers so hover previews can hide instead of fighting the scroll.
 * It settles IDLE_MS after the last scroll event.
 */
const IDLE_MS = 140;
let scrolling = false;
let timer = 0;
const subscribers = new Set();

const set = (value) => {
  if (scrolling === value) return;
  scrolling = value;
  document.documentElement.classList.toggle('is-scrolling', value);
  subscribers.forEach((fn) => fn(value));
};

export const isScrolling = () => scrolling;

/** subscribe(fn(isScrolling)) -> unsubscribe */
export const onScrollingChange = (fn) => {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
};

export function installScrollState() {
  const onScroll = () => {
    set(true);
    window.clearTimeout(timer);
    timer = window.setTimeout(() => set(false), IDLE_MS);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.clearTimeout(timer);
    set(false);
  };
}
