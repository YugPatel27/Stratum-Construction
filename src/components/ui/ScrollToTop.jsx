import React, { useState, useEffect } from 'react';
import { m as motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { scrollToTarget } from '@/lib/scroll';

/** Back-to-top button wrapped in a ring that fills as you move down the page (the height of the building so far). */
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const ring = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => scrollToTarget(0, { duration: 1.6 })}
          className="scroll-to-top-button fixed z-[9980] flex items-center justify-center rounded-full bg-deep text-ply shadow-[0_6px_28px_rgba(3,15,12,0.5)] transition-colors duration-300 hover:text-survey"
          aria-label="Scroll to top"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 52 52" aria-hidden="true">
            <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(239,234,224,0.16)" strokeWidth="3" />
            <motion.circle cx="26" cy="26" r="24" fill="none" stroke="#c2a36d" strokeWidth="3" strokeLinecap="butt" style={{ pathLength: ring }} />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="relative h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.4}
            aria-hidden="true"
          >
            <path strokeLinecap="square" strokeLinejoin="miter" d="M5 11l7-7m0 0l7 7m-7-7v17" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
