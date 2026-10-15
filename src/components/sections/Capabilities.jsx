import React from 'react';
import { Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { capabilities, projectById } from '@/data/siteData';
import { Rise } from '@/components/animations/TextReveal';
import { imgProps } from '@/lib/img';

/** WHAT WE BUILD - four equal columns. Each is proven by named projects you can open. */
export default function Capabilities() {
  return (
    <section className="pm-section pm-section--light" aria-labelledby="cap-title">
      <div className="pm-wrap">
        <header className="pm-head">
          <h2 id="cap-title" className="pm-h">
            <Rise block>Four kinds of work,</Rise>
            <Rise block delay={0.1}>
              each one proven.
            </Rise>
          </h2>
          <div className="pm-head__side">
            <p>We take on what we have already built. Open any project below to see its size, programme and how it was delivered.</p>
          </div>
        </header>

        <ul className="pm-caps">
          {capabilities.map((cap, i) => (
            <motion.li
              key={cap.title}
              className="pm-cap"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={`/projects?sector=${cap.sector}`} className="pm-cap__media" data-cursor="View" aria-label={`${cap.title}: see all projects`}>
                <img {...imgProps(cap.image, '(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw')} alt="" loading="lazy" />
              </Link>
              <div className="pm-cap__body">
                <p className="pm-cap__count">
                  {cap.ids.length} {cap.ids.length === 1 ? 'project' : 'projects'}
                </p>
                <h3 className="pm-cap__title" data-no-reveal>
                  {cap.title}
                </h3>
                <p className="pm-cap__desc">{cap.desc}</p>
                <ul className="pm-cap__list" aria-label={`${cap.title}, recent work`}>
                  {cap.ids.map((id) => {
                    const p = projectById(id);
                    return (
                      <li key={id}>
                        <Link to={`/projects/${id}`}>
                          <span>{p.title}</span>
                          <small>{p.year}</small>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
