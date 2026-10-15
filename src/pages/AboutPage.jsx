import React from 'react';
import { m as motion } from 'framer-motion';
import { siteConfig, milestones, methods, commitments } from '@/data/siteData';
import ContactCTA from '@/components/sections/ContactCTA';
import { imgProps } from '@/lib/img';
import ContourReveal from '@/components/ui/ContourReveal';
import { useSeo } from '@/lib/useSeo';
import { useIntroReady } from '@/lib/intro';
import EdgeMark from '@/components/animations/EdgeMark';
import { Rise } from '@/components/animations/TextReveal';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = (d = 0.1, s = 0) => ({ hidden: {}, show: { transition: { staggerChildren: d, delayChildren: s } } });

/* INTRO */
function Intro() {
  const ready = useIntroReady();
  const facts = [
    ['Founded', String(siteConfig.founded)],
    ['Site office', siteConfig.location],
    ['Hours', siteConfig.hours.replace('Site office open ', '')],
    ['After handover', 'Five-year defects warranty'],
  ];
  return (
    <section className="about-panel about-panel--intro about-intro relative z-10">
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <motion.div variants={stagger(0.12)} initial="hidden" animate={ready ? 'show' : 'hidden'} className="about-intro__grid">
          <div className="about-intro__text">
            <div>
              <motion.h1 variants={fadeUp} className="h-display about-intro__title pb-[0.1em] text-ink">
                We are
                <br />
                Stratum.
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-3 max-w-md text-base leading-relaxed text-ink/75 md:mt-5 md:text-lg">
                A building contractor with its own designers, engineers and site crews. We take a project from survey to handover under one roof.
              </motion.p>
            </div>
            <motion.dl variants={fadeUp} className="about-facts">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm font-semibold text-ink/55">{label}</dt>
                  <dd className="mt-1 text-base font-semibold leading-snug text-ink">{value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div variants={fadeUp} className="about-portrait overflow-hidden">
            <ContourReveal
              className="!aspect-auto h-full w-full"
              imgProps={imgProps('/img/foundation-section.webp', '(min-width: 1024px) 560px, 90vw')}
              alt="Drawing of a building section: footings, columns and floor slabs resting on layers of soil"
              when={ready}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* MILESTONES */
function Milestones() {
  return (
    <motion.section
      data-edge="dim"
      initial={{ opacity: 0, x: -90 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="about-panel about-panel--timeline about-seam relative z-10 pb-[calc(var(--seam)+1rem)] pt-10 text-on-dark md:pt-14"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <EdgeMark label="How we got here" />
        <h2 className="h-display mb-6 text-[clamp(1.79rem,3.92vw,3.64rem)] md:mb-8">Seventeen years, layer by layer</h2>
        <ol className="journey relative mt-2">
          <span className="journey__rail" aria-hidden="true" />
          {milestones.map((item, i) => (
            <motion.li
              key={item.year}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="journey__item"
            >
              <span className="journey__period">{item.year}</span>
              <span className={`journey__dot ${i === milestones.length - 1 ? 'is-active' : ''}`} aria-hidden="true" />
              <div className="journey__card">
                <span className="journey__period journey__period--inline">{item.year}</span>
                <h3 className="text-xl font-bold md:text-2xl">{item.title}</h3>
                <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-on-dark/70 md:text-base">{item.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.section>
  );
}

/* METHODS */
function Methods() {
  return (
    <motion.section
      data-edge="dim"
      initial={{ opacity: 0, y: -56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="about-panel about-panel--methods about-seam relative z-10 pb-[calc(var(--seam)+1rem)] pt-10 md:pt-14"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <EdgeMark label="What we build with" />
        <h2 className="h-display mb-3 max-w-4xl text-[clamp(1.79rem,3.92vw,3.64rem)]">Materials and methods we trust</h2>
        <p className="mb-8 max-w-xl text-base leading-relaxed text-ink/75 md:text-lg">
          We pick the method that suits the ground, the programme and the budget, then stay with it from the first pour to the last coat.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((m, i) => (
            <motion.li
              key={m}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center justify-between border border-ink/20 bg-white/40 px-5 py-4 text-lg font-bold transition-[background-color,border-color,transform] duration-300 hover:-translate-y-1 hover:border-ink hover:bg-ink hover:text-on-dark"
            >
              {m}
              <span
                className="block h-2 w-2 rotate-45 bg-survey transition-transform duration-500 group-hover:rotate-[225deg] group-hover:scale-150"
                aria-hidden="true"
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}

/* COMMITMENTS */
function Commitments() {
  return (
    <section className="about-panel about-panel--rules relative z-10 pb-14 pt-10 md:pb-20 md:pt-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <EdgeMark label="What you can hold us to" />
        <h2 className="h-display mb-8 max-w-4xl text-[clamp(1.79rem,3.92vw,3.64rem)]">
          <Rise block>Three promises,</Rise>
          <Rise block delay={0.1}>
            in writing.
          </Rise>
        </h2>
        <div className="grid grid-cols-1 gap-px bg-ink/20 md:grid-cols-3">
          {commitments.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slab p-6 md:p-8"
            >
              <h3 className="h-display text-[1.46rem] leading-[0.92] md:text-[1.79rem]">{c.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-ink/75">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  useSeo({
    title: `About | ${siteConfig.name}`,
    description:
      'Stratum Construction has built homes, offices, a hospital and a cable-stayed bridge since 2008, with design, engineering and site crews under one roof.',
    path: '/about',
  });
  return (
    <>
      <Intro />
      <Milestones />
      <Methods />
      <Commitments />
      <ContactCTA />
    </>
  );
}
