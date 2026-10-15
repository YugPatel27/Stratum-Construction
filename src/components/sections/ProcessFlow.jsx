import React, { useRef, useState } from 'react';
import { m as motion, useInView, useScroll, useSpring } from 'framer-motion';
import { process as steps } from '@/data/siteData';
import { Rise } from '@/components/animations/TextReveal';
import { Magnetic } from '@/components/animations/MagneticButton';
import { scrollToTarget } from '@/lib/scroll';

function Step({ step, index, onActive }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-42% 0px -42% 0px' });
  React.useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="pm-step" data-active={inView}>
      <span className="pm-step__n" aria-hidden="true">
        {step.n}
      </span>
      <div className="pm-step__body">
        <h3 className="pm-step__title" data-no-reveal>
          {step.title}
        </h3>
        <p className="pm-step__desc">{step.desc}</p>
        <ul className="pm-step__list">
          {step.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <dl className="pm-step__meta">
          <div>
            <dt>Typical time</dt>
            <dd>{step.duration}</dd>
          </div>
          <div>
            <dt>You sign off</dt>
            <dd>{step.signoff}</dd>
          </div>
        </dl>
      </div>
    </li>
  );
}

/** HOW A BUILD RUNS - the four stages as a sequence: an index that follows you, a spine that fills as you read. */
export default function ProcessFlow() {
  const listRef = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const onActive = React.useCallback((i) => setActive(i), []);

  return (
    <section className="pm-section pm-section--light pm-flow" aria-labelledby="flow-title">
      <div className="pm-wrap pm-flow__grid">
        <div className="pm-flow__aside">
          <h2 id="flow-title" className="pm-h">
            <Rise block>Four stages,</Rise>
            <Rise block delay={0.1}>
              one clear path.
            </Rise>
          </h2>
          <p className="pm-flow__intro">Every project runs the same way. You approve the end of each stage before the next one begins, so nothing is a surprise at handover.</p>
          <ol className="pm-flow__index" aria-hidden="true">
            {steps.map((s, i) => (
              <li key={s.n} data-state={i < active ? 'done' : i === active ? 'now' : 'next'}>
                <span>{s.n}</span>
                {s.title}
              </li>
            ))}
          </ol>
          <Magnetic strength={0.3}>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget('#contact');
              }}
              className="btn-fx btn-fx--ply pm-btn pm-btn--solid"
            >
              Start with a site survey <span className="fx-dot" aria-hidden="true" />
            </a>
          </Magnetic>
        </div>

        <div className="pm-flow__track">
          <span className="pm-flow__spine" aria-hidden="true">
            <motion.i style={{ scaleY: fill }} />
          </span>
          <ol ref={listRef} className="pm-flow__list">
            {steps.map((step, i) => (
              <Step key={step.n} step={step} index={i} onActive={onActive} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
