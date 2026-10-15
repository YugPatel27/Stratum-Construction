import React from 'react';
import { Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { siteConfig } from '@/data/siteData';
import Brand from '@/components/layout/Brand';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full border-t border-on-dark/10 bg-deep px-5 py-10 sm:px-8 md:py-12"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-[1.6fr_.7fr_1fr] md:gap-10">
          <div>
            <Link to="/" aria-label={`${siteConfig.name} - Home`} className="inline-block transition-opacity hover:opacity-80">
              <Brand style={{ fontSize: 'clamp(1.7rem, 8.5vw, 3.4rem)' }} />
            </Link>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-on-dark/65">{siteConfig.intro}</p>
            <p className="mt-3 text-sm text-on-dark/55">{siteConfig.location}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-on-dark/60">Pages</h3>
            <nav className="flex flex-col gap-2.5" aria-label="Footer">
              {NAV.map(({ to, label }) => (
                <Link key={to} to={to} className="link-fx self-start text-lg text-on-dark/80 hover:text-ply">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-on-dark/60">Talk to the site office</h3>
            <div className="flex flex-col gap-2.5 text-base">
              <a href={`mailto:${siteConfig.email}`} className="link-fx self-start break-words text-on-dark/80 hover:text-ply">
                {siteConfig.email}
              </a>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="link-fx self-start text-on-dark/80 hover:text-ply">
                {siteConfig.phone}
              </a>
              <p className="text-sm text-on-dark/55">{siteConfig.hours}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-on-dark/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-on-dark/60">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-on-dark/65 sm:mr-[90px]">
            <Link to="/privacy" className="link-fx hover:text-ply">
              Privacy
            </Link>
            <Link to="/terms" className="link-fx hover:text-ply">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
