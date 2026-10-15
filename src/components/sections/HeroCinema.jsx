import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m as motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { projects, siteConfig } from '@/data/siteData';
import { SplitWords } from '@/components/animations/TextReveal';
import { Magnetic } from '@/components/animations/MagneticButton';
import { useIntroReady } from '@/lib/intro';
import { scrollToTarget } from '@/lib/scroll';
import { imgProps } from '@/lib/img';

const SLIDES = projects.filter((p) => p.featured).slice(0, 4);
const INTERVAL = 6500;
const EASE = [0.16, 1, 0.3, 1];

/* HERO - full-bleed project photography. Slides dissolve through a blur, the picture drifts slowly,
   and on scroll the frame lifts away (parallax, push-in, fade to charcoal). */
export default function HeroCinema() {
  const ready = useIntroReady();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const visible = useInView(ref, { amount: 0.35 });
  const [tabActive, setTabActive] = useState(true);
  const slide = SLIDES[i];

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const shade = useTransform(scrollYProgress, [0.1, 1], [0, 0.85]);

  useEffect(() => {
    const onVisibility = () => setTabActive(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  /* the slideshow only runs while the hero is on screen and the tab is in front */
  useEffect(() => {
    if (!ready || reduce || !visible || !tabActive) return undefined;
    const t = window.setTimeout(() => setI((v) => (v + 1) % SLIDES.length), INTERVAL);
    return () => window.clearTimeout(t);
  }, [i, ready, reduce, visible, tabActive]);

  const fade = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: ready || reduce ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section data-edge="dim" ref={ref} className="relative h-svh min-h-[640px] overflow-clip bg-deep text-on-dark">
      <motion.div style={{ y: mediaY }} className="absolute inset-0">
        <motion.div style={{ scale: mediaScale }} className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={slide.id}
              {...imgProps(slide.image, '100vw')}
              alt=""
              loading="eager"
              fetchpriority={i === 0 ? 'high' : undefined}
              className="absolute inset-0 h-full w-full object-cover"
              initial={reduce ? false : { opacity: 0, filter: 'blur(22px)', scale: 1.14 }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1,
                transition: { opacity: { duration: 1.5 }, filter: { duration: 1.5 }, scale: { duration: 9, ease: 'linear' } },
              }}
              exit={{ opacity: 0, filter: 'blur(16px)', transition: { duration: 1.3 } }}
            />
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,9,8,0.86)_0%,rgba(10,9,8,0.38)_42%,rgba(10,9,8,0.55)_100%)]" />
      <motion.div style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-deep" />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-40 sm:px-8 md:pb-44 lg:px-12"
      >
        <motion.p {...fade(0)} className="mb-5 text-[11.5px] font-medium uppercase tracking-[0.26em] text-on-dark/75">
          {siteConfig.profession} <span className="mx-2 text-survey">/</span> Since {siteConfig.founded}
        </motion.p>
        <h1 className="h-display text-[clamp(2.7rem,7vw,6.4rem)] text-on-dark">
          <span className="block">
            <SplitWords text="Precision from" when={ready} delay={0.05} stagger={0.08} />
          </span>
          <span className="block">
            <SplitWords text="footing to roof." when={ready} delay={0.22} stagger={0.08} />
          </span>
        </h1>
        <motion.p {...fade(0.55)} className="mt-8 max-w-xl text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-on-dark/80">
          {siteConfig.intro}
        </motion.p>
        <motion.div {...fade(0.7)} className="mt-8 flex flex-wrap gap-3">
          <Magnetic strength={0.2}>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget('#contact');
              }}
              className="btn-fx btn-fx--ply inline-flex items-center gap-3 bg-on-dark px-7 py-3.5 text-[15px] text-ink"
            >
              Get a quote <span className="fx-dot" aria-hidden="true" />
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <Link to="/projects" className="btn-fx btn-fx--slab inline-flex items-center gap-3 border border-on-dark/40 px-7 py-3.5 text-[15px] text-on-dark">
              View projects <span className="fx-dot" aria-hidden="true" />
            </Link>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div {...fade(0.9)} className="absolute inset-x-0 bottom-0 z-10 border-t border-on-dark/20 bg-black/25 backdrop-blur-md">
        <div className="mx-auto grid max-w-[1500px] items-center gap-4 px-5 py-4 sm:px-8 md:grid-cols-[auto_1fr_auto] md:gap-10 lg:px-12">
          <div className="flex items-center gap-2" role="group" aria-label="Featured project">
            {SLIDES.map((s, n) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Show ${s.title}`}
                aria-current={n === i}
                className="group relative h-6 w-10 sm:w-14"
              >
                <span className="absolute inset-x-0 top-1/2 h-px bg-on-dark/30" />
                {n === i ? (
                  <motion.span
                    key={`${s.id}-${i}`}
                    className="absolute inset-x-0 top-1/2 h-px origin-left bg-on-dark"
                    initial={{ scaleX: reduce ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: reduce ? 0 : INTERVAL / 1000, ease: 'linear' }}
                  />
                ) : null}
              </button>
            ))}
          </div>
          <div className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={slide.id}
                className="truncate text-sm text-on-dark/85"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <span className="font-medium text-on-dark">{slide.title}</span>
                <span className="mx-3 text-on-dark/35">|</span>
                {slide.category}
                <span className="mx-3 text-on-dark/35">|</span>
                {slide.area}
                <span className="mx-3 hidden text-on-dark/35 sm:inline">|</span>
                <span className="hidden sm:inline">{slide.status}</span>
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="hidden text-[11.5px] uppercase tracking-[0.22em] text-on-dark/60 md:block">{siteConfig.location}</p>
        </div>
      </motion.div>
    </section>
  );
}
