import React, { useRef } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';

const LABELS = { '/': 'Home', '/projects': 'Projects', '/about': 'About', '/privacy': 'Privacy', '/terms': 'Terms' };
const DURATION = 1.05;
const EASE = [0.76, 0, 0.24, 1];
export const CURTAIN_COVER_MS = Math.round(DURATION * 0.45 * 1000) + 90; // moment the screen is fully covered

/* two plates sweep up over the page, hold while the route swaps, then lift away upward.
   clip-path keeps the motion GPU-cheap and edge-sharp (no boards, no colour flashes). */
const COVER = ['inset(100% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0 0 100% 0)'];
const TIMES = [0, 0.45, 0.58, 1];

export default function Curtain({ pathname }) {
  const reduce = useReducedMotion();
  const previous = useRef(pathname);
  const runs = useRef(0);
  if (previous.current !== pathname) {
    previous.current = pathname;
    runs.current += 1;
  }
  if (!runs.current || reduce) return null;

  const run = runs.current;
  const label = LABELS[pathname] ?? 'Home';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9000] overflow-hidden">
      <motion.div
        key={`a-${run}`}
        className="absolute inset-0 bg-spruce"
        initial={{ clipPath: COVER[0] }}
        animate={{ clipPath: COVER }}
        transition={{ duration: DURATION, times: TIMES, ease: EASE }}
      />
      <motion.div
        key={`b-${run}`}
        className="absolute inset-0 bg-deep"
        initial={{ clipPath: COVER[0] }}
        animate={{ clipPath: COVER }}
        transition={{ duration: DURATION, delay: 0.09, times: TIMES, ease: EASE }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          key={`t-${run}`}
          className="flex flex-col items-center gap-4 text-on-dark"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: [0, 0, 1, 1, 0], y: [16, 16, 0, 0, -10] }}
          transition={{ duration: DURATION, delay: 0.1, times: [0, 0.34, 0.5, 0.64, 0.82], ease: 'easeOut' }}
        >
          <span className="h-display text-[clamp(1.8rem,3.4vw,3rem)]">{label}</span>
          <span className="block h-px w-14 bg-survey" />
        </motion.div>
      </div>
    </div>
  );
}
