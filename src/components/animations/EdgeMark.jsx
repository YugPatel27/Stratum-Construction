import React, { useRef } from 'react';
import { m as motion, useInView, useReducedMotion } from 'framer-motion';
import { Rise } from '@/components/animations/TextReveal';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Marks where a section starts (default) or ends (`end`), drawn like a dimension line on a plan:
 *   start:  |  Selected projects ————————————|
 *   end:    |———————————— Next: What we build ▼|
 * The line draws in when scrolled into view and the label rises through a mask.
 * The end mark carries a level-datum triangle, so it reads as "the next floor is below". */
export default function EdgeMark({ label, end = false, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const line = (
    <motion.span
      aria-hidden="true"
      className="dim__line"
      initial={reduce ? false : { scaleX: 0 }}
      animate={{ scaleX: inView || reduce ? 1 : 0 }}
      transition={{ duration: 1.1, ease: EASE, delay: end ? 0 : 0.1 }}
    />
  );
  const text = (
    <span className="inline-flex items-center gap-2">
      <Rise when={inView} delay={0.05}>
        {label}
      </Rise>
      {end ? <span className="dim__datum" aria-hidden="true" /> : null}
    </span>
  );
  return (
    <div ref={ref} className={`dim ${end ? 'dim--end' : ''} ${className}`.trim()} aria-hidden="true">
      <span className="dim__tick" />
      {end ? (
        <>
          {line}
          {text}
        </>
      ) : (
        <>
          {text}
          {line}
        </>
      )}
      <span className="dim__tick" />
    </div>
  );
}
