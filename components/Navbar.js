import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MAIN_NAV_LINKS, TEAM_SECTION_PATHS } from '../lib/siteNav';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileNav, setIsMobileNav] = useState(false);
  const dropdownRefs = useRef({});
  const router = useRouter();

  useEffect(() => {
    if (!open) setOpenDropdown(null);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobileNav(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
  }, [router.pathname, router.asPath]);

  useEffect(() => {
    const onClickOutside = (e) => {
      const insideDropdown = Object.values(dropdownRefs.current).some(
        (ref) => ref?.contains(e.target)
      );
      if (!insideDropdown) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const solidNav = scrolled || router.pathname === '/services' || router.pathname.startsWith('/courses');
  const isTeamSectionActive = TEAM_SECTION_PATHS.some(
    (path) => router.pathname === path || router.pathname.startsWith(`${path}/`)
  );
  const activeServiceHash = String(router.asPath.split('#')[1] || 'all').trim() || 'all';

  const closeMenus = () => {
    setOpen(false);
    setOpenDropdown(null);
  };

  const isActiveHref = (href) => {
    if (href === '/') return router.pathname === '/';
    if (href === '/services') {
      return router.pathname === '/services' && (activeServiceHash === 'all' || !router.asPath.includes('#'));
    }
    if (href.startsWith('/services#')) {
      if (router.pathname !== '/services') return false;
      return href.split('#')[1] === activeServiceHash;
    }
    if (href === '/courses') {
      return router.pathname === '/courses' || router.pathname.startsWith('/courses/');
    }
    if (href === '/team') return router.pathname === '/team';
    if (href === '/blog') {
      return router.pathname === '/blog' || router.pathname.startsWith('/blog/');
    }
    return router.pathname === href;
  };

  const triggerColor = (href) => {
    if (href === '/services') return router.pathname === '/services' ? 'var(--rose-gold)' : '';
    if (href === '/team') return isTeamSectionActive ? 'var(--rose-gold)' : '';
    return isActiveHref(href) ? 'var(--rose-gold)' : '';
  };

  const linkColor = (href) => (isActiveHref(href) ? 'var(--rose-gold)' : '');

  const renderDropdownItems = (link, onNavigate) => (
    <>
      {link.dropdownIncludesParent !== false && (
        <li>
          <Link href={link.href} onClick={onNavigate} style={{ color: linkColor(link.href) }}>
            {link.label}
          </Link>
        </li>
      )}
      {link.dropdown.map((item) => (
        <li key={`${item.href}-${item.label}`}>
          <Link href={item.href} onClick={onNavigate} style={{ color: linkColor(item.href) }}>
            {item.label}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <nav className={`nav-fixed ${solidNav ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <BrandLogo href="/" priority className="nav-brand-logo" />

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {MAIN_NAV_LINKS.map((link) => (
            link.dropdown ? (
              <li
                key={link.href}
                ref={(el) => {
                  if (el) dropdownRefs.current[link.href] = el;
                  else delete dropdownRefs.current[link.href];
                }}
                className={`nav-dropdown${openDropdown === link.href ? ' open' : ''}`}
                onMouseEnter={() => { if (!isMobileNav) setOpenDropdown(link.href); }}
                onMouseLeave={() => { if (!isMobileNav) setOpenDropdown(null); }}
              >
                <button
                  type="button"
                  className="nav-dropdown-trigger"
                  style={{ color: triggerColor(link.href) }}
                  aria-expanded={openDropdown === link.href}
                  aria-haspopup="true"
                  onClick={() => setOpenDropdown((prev) => (prev === link.href ? null : link.href))}
                >
                  {link.label}
                  <span className="nav-dropdown-chevron" aria-hidden="true">▾</span>
                </button>
                <ul className="nav-dropdown-menu">
                  {renderDropdownItems(link, closeMenus)}
                </ul>
                <ul className="nav-dropdown-mobile">
                  {renderDropdownItems(link, () => setOpen(false))}
                </ul>
              </li>
            ) : (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} style={{ color: linkColor(link.href) }}>
                  {link.label}
                </Link>
              </li>
            )
          ))}
          <li>
            <Link
              href="/book"
              className="btn-rose"
              style={{ padding: '10px 22px', fontSize: '0.75rem' }}
              onClick={() => setOpen(false)}
            >
              <span>Book Now</span>
            </Link>
          </li>
        </ul>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span style={{ transform: open ? 'rotate(45deg) translateY(7px)' : '' }} />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span style={{ transform: open ? 'rotate(-45deg) translateY(-7px)' : '' }} />
        </button>
      </div>
    </nav>
  );
}
