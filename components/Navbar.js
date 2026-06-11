import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/offers', label: 'Offers' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/team', label: 'Team' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`nav-fixed ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo-text">Huma Beauty</Link>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}
                style={{ color: router.pathname === l.href ? 'var(--rose-gold)' : '' }}>
                {l.label}
              </Link>
            </li>
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
