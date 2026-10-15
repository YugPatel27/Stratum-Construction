import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import HomePage from '../../src/pages/HomePage';
import ProjectsPage from '../../src/pages/ProjectsPage';
import AboutPage from '../../src/pages/AboutPage';
import ProjectDetailPage from '../../src/pages/ProjectDetailPage';
import PrivacyPage from '../../src/pages/PrivacyPage';
import TermsPage from '../../src/pages/TermsPage';
import { installBrowserStubs, Shell } from './helpers';

beforeEach(() => installBrowserStubs());

describe('pages render without runtime errors', () => {
  it('home: hero, statement and every lazy section', async () => {
    render(
      <Shell>
        <HomePage />
      </Shell>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('#contact')).toBeTruthy(), { timeout: 4000 });
    expect(await screen.findByText(/Live sites,/i, {}, { timeout: 4000 })).toBeInTheDocument();
    expect(screen.getAllByText(/Four stages,/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Selected work,/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Four kinds of work,/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('form', { name: /request a quote/i })).toBeInTheDocument();
    expect(document.querySelectorAll('[data-edge]').length).toBeGreaterThanOrEqual(3);
  });

  it('projects: every project is listed as a tile and the filters work', async () => {
    render(
      <Shell route="/projects">
        <ProjectsPage />
      </Shell>,
    );
    expect(screen.getByRole('heading', { level: 1, name: /all projects/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aurora Tower' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Lumen Hospital' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Greenfield School' })).toBeInTheDocument();
    expect(screen.getByText(/Showing 11 of 11 projects/)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /filter by sector/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Industrial/ }));
    expect(await screen.findByText(/Showing 1 of 11 projects/)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Aurora Tower' })).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Harbor Logistics Hub' })).toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('#contact')).toBeTruthy(), { timeout: 4000 });
  });

  it('about: intro, milestones, methods and commitments', async () => {
    render(
      <Shell route="/about">
        <AboutPage />
      </Shell>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/stratum/i);
    expect(screen.getByText('Founded with one crew')).toBeInTheDocument();
    expect(screen.getByText(/Three promises,/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(8);
  });

  it('project detail: facts, phases and related projects', async () => {
    render(
      <Shell route="/projects/aurora-tower">
        <Routes>
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
        </Routes>
      </Shell>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Aurora Tower' })).toBeInTheDocument();
    expect(screen.getByText('Core and frame to level 28')).toBeInTheDocument();
    expect(screen.getByText('On site now')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /more like this/i })).toBeInTheDocument();
  });

  it('legal pages', () => {
    const { unmount } = render(
      <Shell route="/privacy">
        <PrivacyPage />
      </Shell>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy' })).toBeInTheDocument();
    unmount();
    render(
      <Shell route="/terms">
        <TermsPage />
      </Shell>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Terms' })).toBeInTheDocument();
  });
});
