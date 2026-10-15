import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, LazyMotion, m as motion, domAnimation, useReducedMotion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/animations/SmoothScroll';
import Curtain from '@/components/animations/Curtain';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { LoaderScreen, LOADER_TOTAL_MS } from '@/components/layout/LoaderScreen';
import { IntroContext } from '@/lib/intro';
import { jumpToTop, scrollToTarget } from '@/lib/scroll';
import { installRipple } from '@/lib/ripple';
import { installScrollState } from '@/lib/scrollState';
import { installSectionEdges } from '@/lib/sectionEdges';
import { installScrollReveal } from '@/lib/scrollReveal';
import { installPointerGlow } from '@/lib/pointerGlow';
import ScrollProgress from '@/components/animations/ScrollProgress';

const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_IO = [0.76, 0, 0.24, 1];

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  /* useOutlet freezes the *outgoing* route element, so the old page keeps
     rendering while it animates out (a bare <Outlet/> would flash the new one). */
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [introReady, setIntroReady] = useState(false);
  const completeIntro = useCallback(() => {
    setIntroReady(true);
    setLoading(false);
  }, []);

  useEffect(() => installRipple(), []);
  useEffect(() => installScrollState(), []);
  useEffect(() => installSectionEdges(), []);
  useEffect(() => installPointerGlow(), []);
  useEffect(() => installScrollReveal(), []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js', 'motion-ready');
    root.dataset.arrival = 'curtain';
    return () => {
      root.classList.remove('js', 'motion-ready');
      delete root.dataset.arrival;
    };
  }, []);

  /* The loader owns its animation timing; this watchdog guarantees the page can never stay covered. */
  useEffect(() => {
    if (!loading) return undefined;
    const failsafe = window.setTimeout(completeIntro, LOADER_TOTAL_MS + 1500);
    return () => window.clearTimeout(failsafe);
  }, [loading, completeIntro]);

  /* "Get a quote" from a page that has no contact section (Privacy, Terms): go Home, then scroll to it */
  useEffect(() => {
    const onGoto = () => navigate('/', { state: { scrollTo: '#contact' } });
    window.addEventListener('st:goto-contact', onGoto);
    return () => window.removeEventListener('st:goto-contact', onGoto);
  }, [navigate]);

  const { state } = useLocation();
  useEffect(() => {
    if (!state?.scrollTo) return undefined;
    const id = window.setTimeout(() => scrollToTarget(state.scrollTo), 1500);
    return () => window.clearTimeout(id);
  }, [state, pathname]);

  return (
    <LazyMotion features={domAnimation}>
      <IntroContext.Provider value={introReady}>
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10002] focus:rounded focus:bg-survey focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <div className="kg-grain hidden sm:block" aria-hidden="true" />
        <LoaderScreen visible={loading} onComplete={completeIntro} />
        <Curtain pathname={pathname} />
        <ScrollProgress />
        <Navbar introLoading={loading} />
        <main id="top" className="relative w-full" style={{ overflowX: 'clip', background: 'transparent' }}>
          {/* Scroll resets while the boards fully cover the screen */}
          <AnimatePresence mode="wait" initial={false} onExitComplete={jumpToTop}>
            <motion.div
              key={pathname}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, delay: 0.55, ease: EASE_OUT }, transitionEnd: { filter: 'none' } }}
              exit={{ opacity: 0, filter: reduceMotion ? 'none' : 'blur(6px)', transition: { duration: 0.45, ease: EASE_IO } }}
            >
              <Suspense fallback={null}>{outlet}</Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <ScrollToTop />
      </IntroContext.Provider>
    </LazyMotion>
  );
}
