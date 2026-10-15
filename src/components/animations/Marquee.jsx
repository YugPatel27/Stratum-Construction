import React, { useRef } from 'react';
import { m as motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Infinite marquee that reacts to scroll: it speeds up, reverses with scroll
 * direction, and skews slightly with scroll velocity. */
export default function Marquee({ items, speed = 4, className = '', itemClassName = '', separator = '+' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '200px' });
  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const skewX = useTransform(smooth, [-2500, 0, 2500], [7, 0, -7], { clamp: true });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (!inView) return;
    const b = boost.get();
    if (b < -0.05) direction.current = -1;
    else if (b > 0.05) direction.current = 1;
    const step = direction.current * speed * (delta / 1000);
    baseX.set(baseX.get() + step + direction.current * Math.abs(step) * Math.abs(b));
  });

  return (
    <div ref={ref} className={`marquee overflow-hidden ${className}`} aria-hidden="true">
      <motion.div style={{ x, skewX }} className="flex w-max items-center whitespace-nowrap will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className={itemClassName}>{item}</span>
                <span className="mx-[0.5em] text-[0.55em] font-black text-survey-deep">{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
