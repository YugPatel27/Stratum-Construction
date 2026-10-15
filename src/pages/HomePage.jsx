import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { m as motion, useScroll, useTransform } from 'framer-motion';
import { Magnetic } from '@/components/animations/MagneticButton';
import HeroCinema from '@/components/sections/HeroCinema';
import { imgProps } from '@/lib/img';
import { useSeo } from '@/lib/useSeo';

const ContactCTA = lazy(() => import('@/components/sections/ContactCTA'));
const StackMarquee = lazy(() => import('@/components/sections/StackMarquee'));
const Stats = lazy(() => import('@/components/sections/Stats'));
const SiteLog = lazy(() => import('@/components/sections/SiteLog'));
const PortfolioStack = lazy(() => import('@/components/portfolio/PortfolioStack'));
const Capabilities = lazy(() => import('@/components/sections/Capabilities'));
const ProcessFlow = lazy(() => import('@/components/sections/ProcessFlow'));


/* w = word, img = inline picture that opens up as the sentence is read */
const STATEMENT = [
  [
    { w: 'For' },
    { w: 'seventeen' },
    { w: 'years' },
    { w: 'we' },
    { w: 'have' },
    { w: 'delivered' },
    { img: '/img/saffron-villas.webp' },
    { w: '240' },
    { w: 'homes,' },
  ],
  [{ w: 'a' }, { img: '/img/aurora-tower.webp' }, { w: 'city' }, { w: 'skyline' }, { w: 'and' }, { w: '61' }, { w: 'km' }, { w: 'of' }, { w: 'highway,' }],
  [
    { w: 'and' },
    { w: 'we' },
    { w: 'inspect' },
    { img: '/img/terra-highway-interchange.webp' },
    { w: 'every' },
    { w: 'site' },
    { w: 'before' },
    { w: 'work' },
    { w: 'begins.' },
  ],
];
const STATEMENT_TOTAL = STATEMENT.flat().length;

/* STATEMENT - words light up with scroll, inline pictures open between them */
function ScrubToken({ token, index, progress }) {
  const start = (index / STATEMENT_TOTAL) * 0.78;
  const end = start + 0.1;
  const opacity = useTransform(progress, [start, end], [0.28, 1]);
  /* pictures keep their final width from the start (no layout shift) and are revealed with a clip wipe */
  const wipe = useTransform(progress, [start, end + 0.05], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const zoom = useTransform(progress, [start, end + 0.05], [1.5, 1]);
  const lift = useTransform(progress, [start, end], [22, 0]);
  const blur = useTransform(progress, [start, end], ['blur(6px)', 'blur(0px)']);

  if (token.img) {
    return (
      <motion.span style={{ clipPath: wipe }} className="about-type__pill inline-flex overflow-hidden">
        <motion.img style={{ scale: zoom }} {...imgProps(token.img, '20vw')} loading="eager" alt="" className="h-full w-full object-cover" />
      </motion.span>
    );
  }
  return <motion.span style={{ opacity, y: lift, filter: blur, display: 'inline-block' }}>{token.w}</motion.span>;
}

function Statement() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 85%', 'end 60%'] });
  const ctaOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.6, 0.85], [26, 0]);
  const ctaEvents = useTransform(ctaOpacity, (v) => (v > 0.5 ? 'auto' : 'none'));
  let counter = 0;

  return (
    <section
      data-edge="move"
      ref={sectionRef}
      className="chamfer stack overflow-clip bg-slab pb-14 pt-[calc(var(--ch)+3.5rem)] text-ink md:pb-20 md:pt-[calc(var(--ch)+5rem)]"
    >
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <h2 className="about-type max-w-[1500px] text-ink">
          <span className="about-type__flow">
            {STATEMENT.flat().map((token) => (
              <ScrubToken key={counter} token={token} index={counter++} progress={scrollYProgress} />
            ))}
          </span>
        </h2>
        <motion.div style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaEvents }} className="mt-8">
          <Magnetic strength={0.25}>
            <Link
              to="/about"
              data-cursor="Open"
              className="btn-fx btn-fx--ink inline-flex items-center gap-3 rounded-lg border border-ink/30 px-6 py-3 text-sm font-bold"
            >
              About Stratum <span className="fx-dot" aria-hidden="true" />
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

const prefetchBelowFold = () => {
  import('@/components/portfolio/PortfolioStack');
  import('@/components/sections/StackMarquee');
  import('@/components/sections/Capabilities');
  import('@/components/sections/Stats');
  import('@/components/sections/SiteLog');
  import('@/components/sections/ProcessFlow');
  import('@/components/sections/ContactCTA');
};

/* HOME - hero, statement, numbers, selected work, methods band, what we build, live sites, process, contact */
export default function HomePage() {
  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 600));
    const id = idle(prefetchBelowFold);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, []);
  useSeo({
    title: 'Stratum Construction | Homes, offices and infrastructure, built on time',
    description:
      'Stratum Construction builds homes, offices, hospitals, bridges and warehouses, and hands each one over on the date promised. See our projects and request a quote.',
    path: '/',
  });
  return (
    <>
      <HeroCinema />
      <Statement />
      <Suspense fallback={null}>
        <Stats />
        <PortfolioStack />
        <StackMarquee />
        <Capabilities />
        <SiteLog />
        <ProcessFlow />
        <ContactCTA />
      </Suspense>
    </>
  );
}
