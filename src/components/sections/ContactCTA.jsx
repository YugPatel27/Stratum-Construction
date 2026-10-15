import React from 'react';
import { m as motion } from 'framer-motion';
import { Rise } from '@/components/animations/TextReveal';
import QuoteForm from '@/components/ui/QuoteForm';
import { siteConfig } from '@/data/siteData';

const fadeUp = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(8px)' },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = (d = 0.1, s = 0) => ({ hidden: {}, show: { transition: { staggerChildren: d, delayChildren: s } } });

export default function ContactCTA() {
  return (
    <section id="contact" className="px-0 pb-0 pt-0">
      <motion.div
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="relative overflow-hidden bg-deep px-0 py-0"
      >
        <motion.div variants={fadeUp} className="relative z-10">
          <div className="px-4 pt-8 md:px-6 md:pt-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <p className="text-base leading-relaxed text-on-dark/70 md:text-lg">Tell us what you want built.</p>
              <p className="text-base leading-relaxed text-on-dark/70 md:text-lg">We will come back with a plan, a price and a date.</p>
            </div>

            <h2 className="h-display mt-10 max-w-5xl text-[clamp(2.6rem,6.6vw,6.2rem)] text-on-dark md:mt-16">
              <Rise block>Let us build something</Rise>
              <Rise block delay={0.1}>
                that is made to last.
              </Rise>
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-[1500px] gap-10 px-4 pb-12 md:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="flex flex-col gap-6 text-on-dark">
              <div>
                <h3 className="text-[11.5px] font-medium uppercase tracking-[0.22em] text-on-dark/55">Email</h3>
                <a href={`mailto:${siteConfig.email}`} className="link-fx mt-1 break-all text-xl font-normal hover:text-ply">
                  {siteConfig.email}
                </a>
              </div>
              <div>
                <h3 className="text-[11.5px] font-medium uppercase tracking-[0.22em] text-on-dark/55">Phone</h3>
                <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="link-fx mt-1 text-xl font-normal hover:text-ply">
                  {siteConfig.phone}
                </a>
              </div>
              <div>
                <h3 className="text-[11.5px] font-medium uppercase tracking-[0.22em] text-on-dark/55">Site office</h3>
                <p className="mt-1 text-xl font-normal">{siteConfig.location}</p>
                <p className="mt-1 text-sm text-on-dark/60">{siteConfig.hours}</p>
              </div>
            </div>
            <QuoteForm />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
