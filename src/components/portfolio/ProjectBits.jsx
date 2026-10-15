import React from 'react';
import { phaseStates } from '@/data/siteData';

/** Status badge. Live sites pulse; finished work shows the handover year. */
export function StatusPill({ project, className = '' }) {
  const live = project.status === 'In progress';
  return (
    <span className={`pm-pill ${live ? 'pm-pill--live' : ''} ${className}`.trim()}>
      <i aria-hidden="true" />
      {live ? `On site, ${project.progress}%` : `Handed over ${project.year}`}
    </span>
  );
}

/** Build phases as an even row of segments: done, live (the one on site now) and next. */
export function PhaseStepper({ project }) {
  const phases = phaseStates(project);
  if (!phases.length) return null;
  const label = { done: 'Done', live: 'On site now', next: 'Next' };
  return (
    <ol className="pm-steps" style={{ '--n': phases.length }} aria-label={`${project.title} build phases`}>
      {phases.map((phase) => (
        <li key={phase.name} data-state={phase.state}>
          <span className="sr-only">{label[phase.state]}: </span>
          {phase.name}
        </li>
      ))}
    </ol>
  );
}

/** Four-cell fact grid used on every project, so the same facts always sit in the same place. */
export function SpecGrid({ project, className = '' }) {
  const live = project.status === 'In progress';
  const items = [
    [live ? 'Handover' : 'Delivered', project.year],
    ['Size', project.area],
    ['Programme', project.duration],
    ['Category', project.category],
  ];
  return (
    <dl className={`pm-specs ${className}`.trim()}>
      {items.map(([k, v]) => (
        <div key={k} className="pm-spec">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
