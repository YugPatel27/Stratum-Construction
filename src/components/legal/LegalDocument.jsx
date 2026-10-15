import React from 'react';
import { Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { useSeo } from '@/lib/useSeo';
import { useIntroReady } from '@/lib/intro';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/** Shared layout for Privacy and Terms. */
export default function LegalDocument({ doc, path }) {
  const ready = useIntroReady();
  useSeo({ title: `${doc.title} | Stratum Construction`, description: doc.intro, path });
  return (
    <section className="chamfer bg-hoarding px-5 pb-20 pt-32 text-on-dark sm:px-8 md:pt-40">
      <motion.div
        initial="hidden"
        animate={ready ? 'show' : 'hidden'}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="mx-auto max-w-3xl"
      >
        <motion.h1 variants={fadeUp} className="h-display text-[clamp(2.8rem,7.84vw,6.16rem)]">
          {doc.title}
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 text-lg leading-relaxed text-on-dark/75">
          {doc.intro}
        </motion.p>
        <motion.p variants={fadeUp} className="mt-2 text-sm text-on-dark/55">
          Last updated {doc.updated}
        </motion.p>
        <div className="mt-10 border-t border-on-dark/15">
          {doc.sections.map((s) => (
            <motion.section key={s.h} variants={fadeUp} className="border-b border-on-dark/15 py-7">
              <h2 className="text-xl font-bold">{s.h}</h2>
              <p className="mt-2 max-w-prose text-base leading-relaxed text-on-dark/75">{s.p}</p>
            </motion.section>
          ))}
        </div>
        <motion.div variants={fadeUp} className="mt-10">
          <Link to="/" className="link-fx text-ply">
            Back to the home page
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
