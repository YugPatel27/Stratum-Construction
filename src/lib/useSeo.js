import { useEffect } from 'react';
import { siteConfig } from '@/data/siteData';

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Per-route title, description and canonical (the site is a SPA, so these are updated on navigation). */
export function useSeo({ title, description, path = '/' }) {
  useEffect(() => {
    document.title = title;
    const url = `${siteConfig.origin}${path === '/' ? '/' : path}`;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
  }, [title, description, path]);
}
