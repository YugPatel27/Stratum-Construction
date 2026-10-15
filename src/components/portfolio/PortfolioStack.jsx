import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { m as motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { projects, sectorLabel } from '@/data/siteData';
import { Rise } from '@/components/animations/TextReveal';
import { Magnetic } from '@/components/animations/MagneticButton';
import { imgProps } from '@/lib/img';
import { PhaseStepper, SpecGrid, StatusPill } from '@/components/portfolio/ProjectBits';

const featured = projects.filter((p) => p.featured);

/* One case study. Every card has the same four parts in the same places: picture, title, facts, phases. */
function Case({ project, index, total, progress }) {
  const reduce = useReducedMotion();
  const from = index / total;
  const to = (index + 1) / total;
  const last = index === total - 1;
  const scale = useTransform(progress, [from, to], [1, last || reduce ? 1 : 0.94]);
  const veil = useTransform(progress, [from, to], [0, last || reduce ? 0 : 0.55]);

  return (
    <div className="pm-case-wrap" style={{ '--i': index }}>
      <motion.article style={{ scale }} className="pm-case" aria-labelledby={`case-${project.id}`}>
        <Link to={`/projects/${project.id}`} className="pm-case__media" data-cursor="View" tabIndex={-1} aria-hidden="true">
          <img {...imgProps(project.image, '(min-width: 1024px) 56vw, 100vw')} alt="" loading="lazy" />
          <span className="pm-case__tag">{sectorLabel(project.sector)}</span>
        </Link>

        <div className="pm-case__body">
          <div className="pm-case__top">
            <span className="pm-case__count">
              Project {index + 1} of {total}
            </span>
            <StatusPill project={project} />
          </div>
          <h3 id={`case-${project.id}`} className="pm-case__title" data-no-reveal>
            {project.title}
          </h3>
          <p className="pm-case__lede">{project.tieLine}</p>
          <SpecGrid project={project} />
          <PhaseStepper project={project} />
          <Link to={`/projects/${project.id}`} className="pm-link">
            Read the case study <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <motion.span aria-hidden="true" className="pm-case__veil" style={{ opacity: veil }} />
      </motion.article>
    </div>
  );
}

/** SELECTED WORK - case studies that stack as you scroll, each one landing on the last. */
export default function PortfolioStack() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 35%', 'end end'] });

  return (
    <section id="work" className="pm-section pm-section--dark" aria-labelledby="work-title">
      <div className="pm-wrap">
        <header className="pm-head">
          <h2 id="work-title" className="pm-h">
            <Rise block>Selected work,</Rise>
            <Rise block delay={0.1}>
              one standard.
            </Rise>
          </h2>
          <div className="pm-head__side">
            <p>
              {featured.length} of our {projects.length} projects: towers, a bridge, a hospital, a metro station and a warehouse. Each one lists the same facts, so you can compare like with like.
            </p>
            <Magnetic strength={0.25}>
              <Link to="/projects" className="btn-fx btn-fx--slab pm-btn pm-btn--ghost">
                All {projects.length} projects <span className="fx-dot" aria-hidden="true" />
              </Link>
            </Magnetic>
          </div>
        </header>

        <div ref={ref} className="pm-stack">
          {featured.map((project, i) => (
            <Case key={project.id} project={project} index={i} total={featured.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
