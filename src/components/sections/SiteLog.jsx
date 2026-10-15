import React, { useEffect, useRef, useState } from 'react';
import { m as motion, useInView } from 'framer-motion';
import { projects } from '@/data/siteData';
import { Rise } from '@/components/animations/TextReveal';
import EdgeMark from '@/components/animations/EdgeMark';
import { imgProps } from '@/lib/img';

const live = projects.filter((p) => p.status === 'In progress');

/** A looping site diary for a live project: phases tick off one by one, the bar fills to the real progress figure. */
function SiteCard({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.55 });
  const phases = project.phases;
  const doneCount = Math.max(1, Math.round((project.progress / 100) * phases.length));
  const total = phases.length + 1;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    let n = 0;
    let timer;
    const advance = () => {
      n += 1;
      setStep(n);
      if (n < total) timer = window.setTimeout(advance, n === 1 ? 650 : 900);
      else
        timer = window.setTimeout(() => {
          n = 0;
          setStep(0);
          timer = window.setTimeout(advance, 700);
        }, 3600);
    };
    timer = window.setTimeout(advance, 500 + index * 300);
    return () => window.clearTimeout(timer);
  }, [inView, index, total]);

  const done = step >= total;
  const pct = step === 0 ? 0 : Math.round(project.progress * Math.min(1, step / total));
  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <motion.article
      ref={ref}
      onPointerMove={onMove}
      className="spot flex flex-col border border-on-dark/10 bg-spruce p-5 sm:p-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative isolate overflow-hidden border border-on-dark/15 bg-black p-4 text-[14px] leading-relaxed">
        <img
          {...imgProps(project.image, '(min-width: 1024px) 30vw, 90vw')}
          alt=""
          aria-hidden="true"
          loading="lazy"
          draggable="false"
          className={`pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover transition-[transform,opacity] duration-[1800ms] ease-out ${step > 0 ? 'scale-100 opacity-100' : 'scale-110 opacity-80'}`}
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/60 to-black/85" aria-hidden="true" />
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-bold text-on-dark">Site diary</span>
          <span className={`flex items-center gap-2 text-[13px] font-semibold ${done ? 'text-ply' : 'text-on-dark/80'}`}>
            <span className={`h-2 w-2 ${done ? 'bg-ply' : 'animate-pulse bg-survey'}`} />
            {done ? 'Logged' : step === 0 ? 'Waiting' : 'Updating'}
          </span>
        </div>
        <ul className="min-h-[140px] space-y-2 text-on-dark [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]" aria-label={`${project.title} phases`}>
          {phases.map(
            (text, i) =>
              step >= i + 1 && (
                <motion.li key={text} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="flex gap-2.5">
                  <span className={i < doneCount ? 'text-ply' : 'text-survey'} aria-hidden="true">
                    {i < doneCount ? '■' : '□'}
                  </span>
                  <span>
                    {text}
                    {i < doneCount ? '' : ' (next)'}
                  </span>
                </motion.li>
              ),
          )}
        </ul>
        <div className="mt-3 h-[3px] bg-on-dark/20" aria-hidden="true">
          <div className="h-full bg-survey transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <p className="text-sm font-semibold text-on-dark/65">
          {project.category}, {project.area}
        </p>
        <h3 className="h-display mt-1 min-h-[1.84em] text-[1.46rem] leading-[0.92] text-on-dark sm:text-[1.79rem]">{project.title}</h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-on-dark/70">{project.tieLine}</p>
        <p className="mt-5 flex items-baseline gap-2 text-on-dark/70">
          <b className="font-display text-5xl font-black leading-none text-on-dark" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {project.progress}%
          </b>
          <span className="text-sm">complete, handover {project.year}</span>
        </p>
      </div>
    </motion.article>
  );
}

export default function SiteLog() {
  return (
    <section
      data-edge="move"
      className="chamfer stack bg-hoarding px-4 pb-12 pt-[calc(var(--ch)+2.5rem)] text-on-dark md:px-8 md:pb-16 md:pt-[calc(var(--ch)+3.5rem)]"
    >
      <div className="mx-auto max-w-[1500px]">
        <EdgeMark label="Live sites" />
        <div className="mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end">
          <h2 className="h-display text-[clamp(2.02rem,5.04vw,4.82rem)]">
            <Rise block>Live sites,</Rise>
            <Rise block delay={0.1}>
              honest progress.
            </Rise>
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-on-dark/65 md:pb-3">
            Three projects are on site right now. These figures come from the same weekly report our clients receive.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {live.map((project, i) => (
            <SiteCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
