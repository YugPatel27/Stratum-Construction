import React, { lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import HomePage from '@/pages/HomePage';

/* Home ships in the main bundle (first paint); the other routes load on demand.
   Suspense lives inside <Layout>, so navbar + intro paint immediately on a direct visit to any route. */
const loaders = {
  projects: () => import('@/pages/ProjectsPage'),
  project: () => import('@/pages/ProjectDetailPage'),
  about: () => import('@/pages/AboutPage'),
  privacy: () => import('@/pages/PrivacyPage'),
  terms: () => import('@/pages/TermsPage'),
};
const ProjectsPage = lazy(loaders.projects);
const ProjectDetailPage = lazy(loaders.project);
const AboutPage = lazy(loaders.about);
const PrivacyPage = lazy(loaders.privacy);
const TermsPage = lazy(loaders.terms);

/* fetch every route chunk while the browser is idle, so a click never lands on an empty page */
function usePrefetchRoutes() {
  useEffect(() => {
    const run = () => Object.values(loaders).forEach((load) => load().catch(() => {}));
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(run, 1200);
    return () => window.clearTimeout(id);
  }, []);
}

export default function App() {
  usePrefetchRoutes();
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
