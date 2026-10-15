import React, { useEffect, useState } from 'react';
import { AnimatePresence, animate, m as motion, useReducedMotion } from 'framer-motion';

const COUNT_S = 1.15;
export const LOADER_TOTAL_MS = 1500;
const EASE = [0.76, 0, 0.24, 1];

/** Opening: wordmark, hairline progress and a counter. When it finishes the whole plate wipes upward,
    revealing the hero while its headline is already starting. */
export function LoaderScreen({ visible = false, onComplete }) {
  const reduceMotion = useReducedMotion();
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!visible) return undefined;
    if (reduceMotion) {
      setPercent(100);
      const t = window.setTimeout(onComplete, 100);
      return () => window.clearTimeout(t);
    }
    const controls = animate(0, 100, { duration: COUNT_S, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setPercent(Math.round(v)) });
    const t = window.setTimeout(onComplete, LOADER_TOTAL_MS);
    return () => {
      controls.stop();
      window.clearTimeout(t);
    };
  }, [visible, reduceMotion, onComplete]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="loader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-deep px-6 py-7 text-on-dark sm:px-10 sm:py-9"
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.95, ease: EASE } }}
        >
          <div className="flex justify-between text-[11px] uppercase tracking-[0.28em] text-on-dark/55">
            <span>Stratum Construction</span>
            <span>Est. 2008</span>
          </div>
          <div className="flex flex-col items-center gap-7">
            <motion.span
              className="h-display text-[clamp(2.4rem,6vw,4.8rem)] tracking-[0.02em]"
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Stratum
            </motion.span>
            <span className="block h-px w-[min(240px,52vw)] overflow-hidden bg-on-dark/15">
              <span className="block h-full origin-left bg-survey" style={{ transform: `scaleX(${percent / 100})` }} />
            </span>
          </div>
          <div className="flex items-end justify-between text-[11px] uppercase tracking-[0.28em] text-on-dark/55">
            <span>Homes, offices, infrastructure</span>
            <span className="tabular-nums text-on-dark/80">{String(percent).padStart(3, '0')}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
