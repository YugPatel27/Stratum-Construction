import { useEffect } from 'react';
import SmoothScroller from '@/lib/smoothScroll';
import { setLenis } from '@/lib/scroll';

/** Smooth wheel scrolling (built in, no external package). */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const scroller = new SmoothScroller();
    setLenis(scroller);
    return () => {
      scroller.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
