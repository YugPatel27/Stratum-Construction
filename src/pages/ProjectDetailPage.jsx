import React, { useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { m as motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { phaseStates, projectById, projects, sectorLabel, siteConfig } from '@/data/siteData';
import { useSeo } from '@/lib/useSeo';
import { useIntroReady } from '@/lib/intro';
import { imgProps } from '@/lib/img';
import ContactCTA from '@/components/sections/ContactCTA';
import ProjectCard from '@/components/portfolio/ProjectCard';
import { StatusPill } from '@/components/portfolio/ProjectBits';

const EASE = [0.16, 1, 0.3, 1];
const STATE_LABEL = { done: 'Complete', live: 'On site now', next: 'Up next' };

function summary(p) {
  const live = p.status === 'In progress';
  const when = live ? `due for handover in ${p.year}` : `handed over in ${p.year}`;
  return `${p.title} is a ${p.category.toLowerCase()} project of ${p.area}, built over ${p.duration} and ${when}.`;
}

function Detail({ project }) {
  const ready = useIntroReady();
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  const live = project.status === 'In progress';
  const phases = phaseStates(project);
  const index = projects.findIndex((p) => p.id === project.id);
  const next = projects[(index + 1) % projects.length];

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);

  /* three related tiles, always: same sector first, then the rest */
  const related = [...projects.filter((p) => p.id !== project.id && p.sector === project.sector), ...projects.filter((p) => p.id !== project.id && p.sector !== project.sector)].slice(0, 3);

  useSeo({
    title: `${project.title} | ${siteConfig.name}`,
    description: `${summary(project)} ${project.tieLine}`,
    path: `/projects/${project.id}`,
  });

  const facts = [
    ['Category', project.category],
    [live ? 'Handover' : 'Delivered', project.year],
    ['Size', project.area],
    ['Programme', project.duration],
  ];

  return (
    <>
      <section ref={heroRef} className="pm-dhero">
        <motion.div className="pm-dhero__media" style={{ y: imgY, scale: imgScale }}>
          <img {...imgProps(project.image, '100vw')} alt={`${project.title}, ${project.category.toLowerCase()} project`} loading="eager" fetchpriority="high" />
        </motion.div>
        <div className="pm-dhero__shade" aria-hidden="true" />
        <div className="pm-wrap pm-dhero__content">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, ease: EASE }}>
            <Link to="/projects" className="pm-back">
              <span aria-hidden="true">&larr;</span> All projects
            </Link>
          </motion.div>
          <motion.div className="pm-dhero__status" initial={{ opacity: 0, y: 18 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay: 0.08, ease: EASE }}>
            <StatusPill project={project} />
            <span>{sectorLabel(project.sector)}</span>
          </motion.div>
          <motion.h1 className="pm-h pm-h--xl" initial={{ opacity: 0, y: 34 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1, delay: 0.14, ease: EASE }}>
            {project.title}
          </motion.h1>
          <motion.p className="pm-dhero__lede" initial={{ opacity: 0, y: 22 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, delay: 0.28, ease: EASE }}>
            {project.tieLine}
          </motion.p>
        </div>
      </section>

      <section className="pm-section pm-section--light pm-detail">
        <div className="pm-wrap">
          <dl className="pm-factbar">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="pm-detail__grid">
            <div>
              <h2 className="pm-h pm-h--md">What we delivered</h2>
              <p className="pm-detail__summary">{summary(project)}</p>
              <ul className="pm-scope" aria-label="Scope of work">
                {project.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="pm-h pm-h--md">{live ? 'How it is being built' : 'How it was built'}</h2>
              {phases.length ? (
                <>
                  {live ? (
                    <div className="pm-meter" role="img" aria-label={`${project.progress} percent complete`}>
                      <div className="pm-meter__bar">
                        <motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: project.progress / 100 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
                      </div>
                      <p>
                        <b>{project.progress}%</b> complete, handover {project.year}
                      </p>
                    </div>
                  ) : null}
                  <ol className="pm-timeline">
                    {phases.map((phase) => (
                      <li key={phase.name} data-state={phase.state}>
                        <span className="pm-timeline__name">{phase.name}</span>
                        <span className="pm-timeline__state">{STATE_LABEL[phase.state]}</span>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <p className="pm-detail__summary">
                  Built as a single programme and handed over in {project.year}. Every Stratum project follows the same four stages, from survey to handover, with sign-off at the end of each.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pm-section pm-section--dark" aria-labelledby="related-title">
        <div className="pm-wrap">
          <header className="pm-head">
            <h2 id="related-title" className="pm-h">
              More like this
            </h2>
            <div className="pm-head__side">
              <Link to="/projects" className="pm-link pm-link--light">
                See every project <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </header>
          <ul className="pm-grid">
            {related.map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} tone="dark" />
              </li>
            ))}
          </ul>
          <Link to={`/projects/${next.id}`} className="pm-next" data-cursor="Next">
            <span>Next project</span>
            <strong>{next.title}</strong>
            <i aria-hidden="true">&rarr;</i>
          </Link>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = projectById(id);
  if (!project) return <Navigate to="/projects" replace />;
  return <Detail key={project.id} project={project} />;
}
