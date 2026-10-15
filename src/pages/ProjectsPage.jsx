import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, m as motion } from 'framer-motion';
import { projects, sectors, siteConfig } from '@/data/siteData';
import { useSeo } from '@/lib/useSeo';
import { useIntroReady } from '@/lib/intro';
import ContactCTA from '@/components/sections/ContactCTA';
import ProjectCard from '@/components/portfolio/ProjectCard';
import CountUp from '@/components/animations/CountUp';

const STATUSES = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'On site' },
  { id: 'done', label: 'Completed' },
];

const live = projects.filter((p) => p.status === 'In progress').length;
const LEDGER = [
  { value: projects.length, label: 'projects in the portfolio' },
  { value: projects.length - live, label: 'handed over' },
  { value: live, label: 'on site right now' },
  { value: sectors.length, label: 'sectors we build in' },
];

const EASE = [0.16, 1, 0.3, 1];

/* PORTFOLIO - a ledger of totals, two filters, and one even grid of identical project tiles. */
export default function ProjectsPage() {
  const ready = useIntroReady();
  const [params, setParams] = useSearchParams();
  const sector = sectors.some((s) => s.id === params.get('sector')) ? params.get('sector') : 'all';
  const status = ['live', 'done'].includes(params.get('status')) ? params.get('status') : 'all';

  useSeo({
    title: `Projects | ${siteConfig.name}`,
    description: 'Towers, bridges, hospitals, warehouses and homes built by Stratum Construction, with size, programme and handover date for every project.',
    path: '/projects',
  });

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const list = useMemo(
    () =>
      projects.filter(
        (p) => (sector === 'all' || p.sector === sector) && (status === 'all' || (status === 'live' ? p.status === 'In progress' : p.status === 'Completed')),
      ),
    [sector, status],
  );
  const countFor = (id) => projects.filter((p) => id === 'all' || p.sector === id).length;

  return (
    <>
      <section className="pm-page-head">
        <div className="pm-wrap">
          <motion.h1
            className="pm-h pm-h--xl"
            initial={{ opacity: 0, y: 28 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: EASE }}
          >
            All projects
          </motion.h1>
          <motion.p
            className="pm-page-head__lede"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
          >
            Homes, offices, a hospital, a bridge and a warehouse. Open any project to see what it measures, how long it took and how it was built.
          </motion.p>
          <motion.dl
            className="pm-ledger"
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.24, ease: EASE }}
          >
            {LEDGER.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>
                  <CountUp to={item.value} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      <section className="pm-section pm-section--light pm-portfolio" aria-label="Project portfolio">
        <div className="pm-wrap">
          <div className="pm-filters">
            <div className="pm-chips" role="group" aria-label="Filter by sector">
              {[{ id: 'all', label: 'All sectors' }, ...sectors].map((s) => (
                <button key={s.id} type="button" className="pm-chip" aria-pressed={sector === s.id} onClick={() => set('sector', s.id)}>
                  {s.label}
                  <small>{countFor(s.id)}</small>
                </button>
              ))}
            </div>
            <div className="pm-seg" role="group" aria-label="Filter by status">
              {STATUSES.map((s) => (
                <button key={s.id} type="button" aria-pressed={status === s.id} onClick={() => set('status', s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <p className="pm-result" role="status" aria-live="polite">
            Showing {list.length} of {projects.length} projects
          </p>

          <AnimatePresence mode="wait" initial={false}>
            {list.length ? (
              <motion.ul
                key={`${sector}-${status}`}
                className="pm-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {list.map((project, i) => (
                  <motion.li
                    key={project.id}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: Math.min(i, 8) * 0.05, ease: EASE }}
                  >
                    <ProjectCard project={project} />
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div key="empty" className="pm-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>No projects match these filters.</p>
                <button
                  type="button"
                  className="pm-btn pm-btn--solid"
                  onClick={() => {
                    setParams({}, { replace: true, preventScrollReset: true });
                  }}
                >
                  Show all projects
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Suspense fallback={null}>
        <ContactCTA />
      </Suspense>
    </>
  );
}
