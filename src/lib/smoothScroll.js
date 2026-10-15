/**
 * Dependency-free smooth scrolling (replaces the `lenis` package).
 * Eases mouse-wheel scrolling on the real window scroll, so framer-motion's
 * useScroll and `position: sticky` keep working. Touch and keyboard stay native.
 * API: scrollTo(target, opts), stop(), start(), destroy() */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

export default class SmoothScroller {
  constructor({ ease = 0.1, wheelMultiplier = 0.95 } = {}) {
    this.ease = ease;
    this.mult = wheelMultiplier;
    this.current = window.scrollY;
    this.target = window.scrollY;
    this.stopped = false;
    this.tween = null;
    this.lastSet = window.scrollY;
    this.raf = 0;
    this.last = 0;
    this.root = document.documentElement;
    this.root.classList.add('lenis');

    this.onWheel = this.onWheel.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.loop = this.loop.bind(this);
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.wake();
  }

  wake() {
    if (!this.raf) {
      this.last = 0; // fresh start: no stale frame delta
      this.raf = requestAnimationFrame(this.loop);
    }
  }

  onWheel(event) {
    if (event.ctrlKey || event.defaultPrevented) return; // pinch-zoom / handled elsewhere
    if (event.target instanceof Element && event.target.closest('[data-lenis-prevent]')) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    if (this.stopped) return;
    const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * window.innerHeight : event.deltaY;
    this.tween = null;
    this.target = clamp(this.target + delta * this.mult, 0, maxScroll());
    this.wake();
  }

  /* keyboard, scrollbar drag, touch, anchor jumps: adopt the native position */
  onScroll() {
    if (Math.abs(window.scrollY - this.lastSet) > 2 && !this.tween) {
      this.current = this.target = window.scrollY;
      this.lastSet = window.scrollY;
    }
  }

  loop(now) {
    /* Frame-rate independent easing: a dropped frame covers the distance it should have,
       instead of the page crawling behind the wheel (that crawl read as "lag"). */
    const dt = this.last ? Math.min(now - this.last, 48) : 16.667;
    this.last = now;
    const k = 1 - Math.pow(1 - this.ease, dt / 16.667);
    if (this.tween) {
      const t = this.tween;
      const p = clamp((now - t.start) / t.duration, 0, 1);
      this.current = t.from + (t.to - t.from) * t.easing(p);
      if (p >= 1) {
        this.target = this.current = t.to;
        this.tween = null;
      }
      this.write();
    } else if (Math.abs(this.target - this.current) > 0.05) {
      this.current += (this.target - this.current) * k;
      if (Math.abs(this.target - this.current) <= 0.05) this.current = this.target;
      this.write();
    } else {
      this.raf = 0;
      this.last = 0; // settled: sleep until the next wheel / scrollTo (no idle per-frame work)
      return;
    }
    this.raf = requestAnimationFrame(this.loop);
  }

  write() {
    this.lastSet = this.current;
    window.scrollTo(0, this.current);
  }

  scrollTo(target, { duration = 1.2, easing = (t) => 1 - Math.pow(1 - t, 4), immediate = false, offset = 0 } = {}) {
    let y;
    if (typeof target === 'number') y = target;
    else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      y = el.getBoundingClientRect().top + window.scrollY;
    }
    y = clamp(y + offset, 0, maxScroll());
    if (immediate || duration <= 0) {
      this.tween = null;
      this.target = this.current = y;
      this.write();
      return;
    }
    this.tween = { from: this.current, to: y, start: performance.now(), duration: duration * 1000, easing };
    this.wake();
  }

  stop() {
    this.stopped = true;
  }
  start() {
    this.stopped = false;
    this.current = this.target = window.scrollY;
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('scroll', this.onScroll);
    this.root.classList.remove('lenis');
  }
}
