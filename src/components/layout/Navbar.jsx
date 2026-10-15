import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Magnetic } from '@/components/animations/MagneticButton';
import { getLenis, scrollToTarget } from '@/lib/scroll';
import { siteConfig } from '@/data/siteData';
import MenuToggle from '@/components/layout/MenuToggle';
import Brand from '@/components/layout/Brand';

const NAV_LINKS = [
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
];

const MENU_LINKS = [
  { label: 'Home', to: '/', note: 'Where we start' },
  { label: 'Projects', to: '/projects', note: 'What we have built' },
  { label: 'About', to: '/about', note: 'Who builds it' },
];

const MENU_EASE = [0.16, 1, 0.3, 1];

export default function Navbar({ introLoading = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuOpenRef = useRef(false);
  menuOpenRef.current = menuOpen;
  const { pathname } = useLocation();

  useEffect(() => {
    let last = window.scrollY;
    const updateScrollState = () => {
      const y = window.scrollY;
      setIsScrolled(y > 24);
      const delta = y - last;
      if (Math.abs(delta) < 8) return; // ignore jitter
      setHidden(y > 240 && delta > 0 && !menuOpenRef.current);
      last = y;
    };
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) getLenis()?.stop();
    else getLenis()?.start();
    return () => {
      document.body.style.overflow = '';
      getLenis()?.start();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  /* Contact lives on Home, Projects and About. From a legal page, hop to Home and let Layout finish the scroll. */
  const scrollToContact = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    getLenis()?.start();
    if (document.querySelector('#contact')) scrollToTarget('#contact');
    else window.dispatchEvent(new CustomEvent('st:goto-contact'));
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: hidden ? '-125%' : 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 px-3 transition-[padding] duration-300 sm:px-5 ${isScrolled ? 'py-1.5' : 'py-3'}`}
    >
      <div
        data-menu-open={menuOpen}
        className={`navbar-shell mx-auto flex w-full max-w-[1600px] items-center justify-between px-3 py-1.5 transition-[background-color,backdrop-filter,border-color,box-shadow,color,width] duration-500 sm:px-4 text-on-dark ${isScrolled ? 'navbar-shell--scrolled' : ''}`}
      >
        <Link to="/" aria-label={`${siteConfig.name} - Home`} className="group flex items-center">
          <Brand
            dataBrand
            className="transition-[opacity,font-size] duration-300"
            style={{ opacity: introLoading ? 0 : 1, fontSize: isScrolled ? '1.3rem' : '1.55rem' }}
          />
        </Link>

        <nav className={`hidden items-center transition-[gap] duration-300 lg:flex ${isScrolled ? 'gap-3' : 'gap-7'}`} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[15px] font-semibold transition-[color,opacity] duration-300 ${menuOpen ? 'pointer-events-none opacity-0' : ''} ${pathname === link.to || pathname.startsWith(`${link.to}/`) ? 'nav-link--active text-on-dark' : 'text-on-dark/70 hover:text-on-dark'}`}
            >
              <span className="roll">
                <span>{link.label}</span>
                <span aria-hidden="true">{link.label}</span>
              </span>
            </Link>
          ))}
          <Magnetic
            strength={0.35}
            className={`transition-opacity duration-300 ${menuOpen ? 'pointer-events-none opacity-0' : ''} ${isScrolled ? 'ml-0' : 'ml-3'}`}
          >
            <a
              href="#contact"
              onClick={scrollToContact}
              className={`btn-fx btn-fx--ply group inline-flex items-center gap-2.5 rounded-lg bg-survey font-bold text-ink transition-[padding] duration-300 ${isScrolled ? 'px-3.5 py-1.5 text-[13px]' : 'px-5 py-2.5 text-[14px]'}`}
            >
              Get a quote <span className="fx-dot" aria-hidden="true" />
            </a>
          </Magnetic>
          <MenuToggle
            open={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            isScrolled={isScrolled}
            className="hidden lg:inline-flex"
          />
        </nav>

        <MenuToggle
          open={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          isScrolled={isScrolled}
          className="inline-flex lg:hidden"
        />
      </div>

      {/* Full-screen menu: circular reveal from the toggle, big links rise through masks */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                id="site-menu"
                key="site-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                initial={{ clipPath: 'circle(0px at calc(100% - 64px) 38px)' }}
                animate={{ clipPath: 'circle(150% at calc(100% - 64px) 38px)', transition: { duration: 0.85, ease: MENU_EASE } }}
                exit={{ clipPath: 'circle(0px at calc(100% - 64px) 38px)', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.12 } }}
                className="site-menu"
                data-lenis-prevent
              >
                <nav aria-label="Primary">
                  <ul className="site-menu__list">
                    {[...MENU_LINKS, { label: 'Get a quote', to: '#contact', note: 'Tell us what you want built', contact: true }].map((link, i) => {
                      const inner = (
                        <>
                          <span className="site-menu__text">{link.label}</span>
                          <span className="site-menu__note" aria-hidden="true">
                            {link.note}
                          </span>
                        </>
                      );
                      return (
                        <li key={link.label} className="site-menu__item">
                          <motion.div
                            initial={{ y: '110%' }}
                            animate={{ y: 0, transition: { duration: 0.8, delay: 0.28 + i * 0.07, ease: MENU_EASE } }}
                            exit={{ y: '110%', transition: { duration: 0.3, delay: (3 - i) * 0.03 } }}
                          >
                            {link.contact ? (
                              <a href="#contact" onClick={scrollToContact} className="site-menu__link">
                                {inner}
                              </a>
                            ) : (
                              <Link
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                aria-current={pathname === link.to ? 'page' : undefined}
                                className="site-menu__link"
                              >
                                {inner}
                              </Link>
                            )}
                          </motion.div>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                <motion.div
                  className="site-menu__foot"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.7, ease: MENU_EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <span>{siteConfig.location}</span>
                  <nav aria-label="Contact">
                    <a href={`mailto:${siteConfig.email}`} className="link-fx">
                      {siteConfig.email}
                    </a>
                    <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="link-fx">
                      {siteConfig.phone}
                    </a>
                  </nav>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </motion.header>
  );
}
