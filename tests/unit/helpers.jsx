import React from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

/* jsdom has no layout engine: give components the browser APIs they feature-detect */
export function installBrowserStubs() {
  const noop = () => {};
  class IO {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  class RO extends IO {}
  window.IntersectionObserver = IO;
  window.ResizeObserver = RO;
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({
      matches: false,
      media: query,
      addEventListener: noop,
      removeEventListener: noop,
      addListener: noop,
      removeListener: noop,
      onchange: null,
      dispatchEvent: () => false,
    }));
  window.scrollTo = noop;
  window.requestIdleCallback = (fn) => setTimeout(fn, 0);
  window.cancelIdleCallback = (id) => clearTimeout(id);
  HTMLCanvasElement.prototype.getContext = () => null;
  document.elementsFromPoint = () => [];
  document.fonts = { ready: Promise.resolve(), load: () => Promise.resolve() };
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

export function Shell({ children, route = '/' }) {
  return (
    <LazyMotion features={domAnimation}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </LazyMotion>
  );
}
