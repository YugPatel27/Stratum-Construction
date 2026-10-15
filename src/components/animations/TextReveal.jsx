import React, { useRef } from 'react';
import { m as motion, useInView, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];
const HIDDEN = { y: '118%' };
const SHOWN = { y: '0%' };

/**
 * Masked "rise" reveal. Wrap any line / word / inline element.
 *  - default: plays when scrolled into view
 *  - `when` (boolean): controlled, used for the intro after the loader
 *  - `block`: line-level (display:block) instead of inline-block */
export function Rise({ children, className = '', delay = 0, duration = 0.85, when, once = true, amount = 0.2, block = false }) {
  const reduce = useReducedMotion();
  /* Watch the MASK, not the moving text: the text starts fully hidden below the mask's clip,
     so observing it could never report "visible" and the heading stayed blank. The small positive
     margin starts the reveal just before the line scrolls into view. */
  const maskRef = useRef(null);
  const inView = useInView(maskRef, { once, amount, margin: '0px 0px 12% 0px' });
  if (reduce)
    return (
      <span className={block ? 'block' : 'inline-block'}>
        <span className={className}>{children}</span>
      </span>
    );

  const show = when === undefined ? inView : when;

  return (
    <span ref={maskRef} className={`rise-mask${block ? ' rise-mask--block' : ''}`}>
      <motion.span className={`rise-inner ${className}`.trim()} initial={HIDDEN} animate={show ? SHOWN : HIDDEN} transition={{ duration, delay, ease: EASE }}>
        {children}
      </motion.span>
    </span>
  );
}

/** Splits a plain string into words that rise one after another. */
export function SplitWords({ text, className = '', wordClassName = '', delay = 0, stagger = 0.045, when, once = true }) {
  return (
    <span className={className}>
      {text.split(' ').map((word, i, all) => (
        <React.Fragment key={`${word}-${i}`}>
          <Rise className={wordClassName} delay={delay + i * stagger} when={when} once={once}>
            {word}
          </Rise>
          {i < all.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </span>
  );
}
