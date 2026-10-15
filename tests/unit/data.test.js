import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { projects, capabilities, stats, process as steps, milestones, sectors, phaseStates } from '../../src/data/siteData';
import manifest from '../../src/data/images.json';
import { imgProps } from '../../src/lib/img';

const pub = (p) => resolve(__dirname, '../../public', p.replace(/^\//, ''));

describe('site data', () => {
  it('every project has a unique id and an image that exists in the manifest and on disk', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    projects.forEach((p) => {
      const slug = p.image.replace(/^\/img\//, '').replace(/\.webp$/, '');
      expect(manifest[slug], `${p.id} manifest entry`).toBeTruthy();
      expect(existsSync(pub(p.image)), `${p.image} on disk`).toBe(true);
      expect(existsSync(pub(`/img/${slug}-${manifest[slug].small}.webp`)), `${slug} small variant`).toBe(true);
    });
  });

  it('live projects carry a progress figure and phases; the home carousel and the projects page both have enough items', () => {
    projects
      .filter((p) => p.status === 'In progress')
      .forEach((p) => {
        expect(p.progress).toBeGreaterThan(0);
        expect(p.progress).toBeLessThan(100);
        expect(p.phases.length).toBeGreaterThanOrEqual(3);
      });
    expect(projects.filter((p) => p.featured).length).toBeGreaterThanOrEqual(5);
    expect(projects.filter((p) => !p.featured).length).toBeGreaterThanOrEqual(4);
    expect(projects.filter((p) => p.status === 'In progress').length).toBe(3);
  });

  it('every capability resolves to real projects with an image', () => {
    capabilities.forEach((c) => {
      expect(c.built.length).toBeGreaterThan(0);
      expect(c.image).toMatch(/^\/img\//);
    });
  });

  it('supporting content is present', () => {
    expect(stats).toHaveLength(4);
    expect(steps.map((s) => s.n)).toEqual(['01', '02', '03', '04']);
    expect(milestones.length).toBeGreaterThanOrEqual(4);
  });

  it('every project belongs to a sector and every process step is fully described', () => {
    const ids = sectors.map((s) => s.id);
    projects.forEach((p) => expect(ids, `${p.id} sector`).toContain(p.sector));
    capabilities.forEach((c) => expect(ids, `${c.title} sector`).toContain(c.sector));
    steps.forEach((s) => {
      expect(s.deliverables).toHaveLength(3);
      expect(s.duration).toBeTruthy();
      expect(s.signoff).toBeTruthy();
    });
  });

  it('phaseStates marks done, live and next from the progress figure', () => {
    const aurora = projects.find((p) => p.id === 'aurora-tower');
    expect(phaseStates(aurora).map((p) => p.state)).toEqual(['done', 'done', 'live', 'next']);
    const bridge = projects.find((p) => p.id === 'riverline-bridge');
    expect(phaseStates(bridge).every((p) => p.state === 'done')).toBe(true);
    expect(phaseStates(projects.find((p) => p.id === 'saffron-villas'))).toEqual([]);
  });

  it('imgProps builds a srcset and intrinsic size', () => {
    const props = imgProps('/img/aurora-tower.webp', '50vw');
    expect(props.srcSet).toContain('aurora-tower-640.webp 640w');
    expect(props.width).toBe(1600);
    expect(props.height).toBe(1000);
  });
});
