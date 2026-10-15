import React from 'react';
import { m as motion } from 'framer-motion';
import { stats } from '@/data/siteData';
import { Rise } from '@/components/animations/TextReveal';
import EdgeMark from '@/components/animations/EdgeMark';
import CountUp from '@/components/animations/CountUp';

/** Four numbers that sit on structural gridlines. They count up once, the first time they scroll into view. */
export default function Stats() {
  return (
    <section data-edge="move" className="chamfer stack bg-pour px-4 pb-12 pt-[calc(var(--ch)+2.5rem)] text-ink md:px-8 md:pb-16 md:pt-[calc(var(--ch)+3.5rem)]">
      <div className="mx-auto max-w-[1500px]">
        <EdgeMark label="Track record" />
        <h2 className="h-display mb-10 max-w-4xl text-[clamp(1.79rem,4.48vw,4.2rem)] md:mb-14">
          <Rise block>Numbers we are</Rise>
          <Rise block delay={0.1}>
            happy to be held to.
          </Rise>
        </h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="stat"
              initial={{ clipPath: 'inset(100% 0 0 0)', y: 40 }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)', y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.76, 0, 0.24, 1] }}
            >
              <dt className="order-2 mt-3 max-w-[16rem] text-base leading-snug text-ink/75">{s.label}</dt>
              <dd className="stat__num">
                <CountUp to={s.value} suffix={s.suffix} delay={i * 0.12} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
