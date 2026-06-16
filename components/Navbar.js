import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const TEAM_PATHS = ['/team', '/gallery', '/reviews', '/blog'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const teamRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setTeamOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (teamRef.current && !teamRef.current.contains(e.target)) {
        setTeamOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Service Menu' },
    { href: '/courses', label: 'Courses' },
    { href: '/offers', label: 'Offers' },
    {
      href: '/team',
      label: 'Team',
      dropdown: [
        { href: '/gallery', label: 'Gallery' },
        { href: '/reviews', label: 'Reviews' },
        { href: '/blog', label: 'Blog' },
      ],
    },
    { href: '/contact', label: 'Contact' },
  ];

  const solidNav = scrolled || router.pathname === '/services' || router.pathname.startsWith('/courses');
  const isTeamActive = TEAM_PATHS.some((path) => router.pathname === path || router.pathname.startsWith(`${path}/`));

  const linkColor = (href) => {
    if (href === '/team' && isTeamActive) return 'var(--rose-gold)';
    return router.pathname === href ? 'var(--rose-gold)' : '';
  };

  return (
    <nav className={`nav-fixed ${solidNav ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo-text">Huma Beauty Saloon</Link>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            l.dropdown ? (
              <li
                key={l.href}
                ref={teamRef}
                className={`nav-dropdown${teamOpen ? ' open' : ''}`}
                onMouseEnter={() => setTeamOpen(true)}
                onMouseLeave={() => setTeamOpen(false)}
              >
                <button
                  type="button"
                  className="nav-dropdown-trigger"
                  style={{ color: linkColor(l.href) }}
                  aria-expanded={teamOpen}
                  aria-haspopup="true"
                  onClick={() => setTeamOpen((prev) => !prev)}
                >
                  {l.label}
                  <span className="nav-dropdown-chevron" aria-hidden="true">▾</span>
                </button>
                <ul className="nav-dropdown-menu">
                  <li>
                    <Link href={l.href} onClick={() => { setOpen(false); setTeamOpen(false); }} style={{ color: linkColor(l.href) }}>
                      {l.label}
                    </Link>
                  </li>
                  {l.dropdown.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => { setOpen(false); setTeamOpen(false); }}
                        style={{ color: linkColor(item.href) }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="nav-dropdown-mobile">
                  <li>
                    <Link href={l.href} onClick={() => setOpen(false)} style={{ color: linkColor(l.href) }}>
                      {l.label}
                    </Link>
                  </li>
                  {l.dropdown.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => setOpen(false)} style={{ color: linkColor(item.href) }}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} style={{ color: linkColor(l.href) }}>
                  {l.label}
                </Link>
              </li>
            )
          ))}
          <li>
            <Link href="/book" onClick={() => setOpen(false)}>
              <button className="btn-rose" style={{ padding: '10px 22px', fontSize: '0.75rem' }}>
                <span>Book Now</span>
              </button>
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
