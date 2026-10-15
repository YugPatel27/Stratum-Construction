import React from 'react';
import { Link } from 'react-router-dom';
import { sectorLabel } from '@/data/siteData';
import { imgProps } from '@/lib/img';
import { StatusPill } from '@/components/portfolio/ProjectBits';

/** Portfolio tile. Identical structure for every project: picture, label row, title, one line, three facts. */
export default function ProjectCard({ project, sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw', tone = 'light' }) {
  return (
    <Link to={`/projects/${project.id}`} className={`pm-card pm-card--${tone}`} data-cursor="View" data-no-reveal>
      <span className="pm-card__media">
        <img {...imgProps(project.image, sizes)} alt="" loading="lazy" />
        <StatusPill project={project} className="pm-card__pill" />
      </span>
      <span className="pm-card__body">
        <span className="pm-card__meta">
          <span>{sectorLabel(project.sector)}</span>
          <span>{project.year}</span>
        </span>
        <h3 className="pm-card__title">{project.title}</h3>
        <span className="pm-card__lede">{project.tieLine}</span>
        <span className="pm-card__facts">
          <span>
            <small>Size</small>
            {project.area}
          </span>
          <span>
            <small>Programme</small>
            {project.duration}
          </span>
          <span>
            <small>Category</small>
            {project.category}
          </span>
        </span>
      </span>
      <span className="pm-card__go" aria-hidden="true">
        &rarr;
      </span>
      <span className="sr-only">View {project.title} case study</span>
    </Link>
  );
}
