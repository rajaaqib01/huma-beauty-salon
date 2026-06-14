import Link from 'next/link';

const quickLinks = [
  ['Home', '/'],
  ['Service Menu', '/services'],
  ['Gallery', '/gallery'],
  ['Offers', '/offers'],
  ['Book Appointment', '/book'],
  ['Contact Us', '/contact'],
];

const services = [
  'Bridal Makeup',
  'Hair Styling',
  'Facials & Skincare',
  'Nail Art',
  'Waxing & Threading',
  'Lash Extensions',
];

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/huma_beauty.saloon/',
    brand: 'instagram',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          fill="white"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z"
        />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@humabeautysaloonjhe',
    brand: 'tiktok',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          fill="white"
          d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"
        />
      </svg>
    ),
  },
  {
    name: 'Website',
    url: 'https://humabeautysaloon.site/',
    brand: 'website',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="white" fillOpacity="0.15" />
        <path
          fill="white"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm7.93 9h-3.18a15.34 15.34 0 00-1.07-4.58A8.03 8.03 0 0119.93 11zM12 4.04c.96 1.5 1.7 3.46 1.97 5.96h-3.94c.27-2.5 1.01-4.46 1.97-5.96zM8.32 6.42A15.34 15.34 0 007.25 11H4.07a8.03 8.03 0 014.25-4.58zM4.07 13h3.18c.22 1.62.62 3.16 1.07 4.58A8.03 8.03 0 014.07 13zm3.25 6.58c-.45-1.42-.85-2.96-1.07-4.58h3.18a15.34 15.34 0 01-1.11 4.58zM12 19.96c-.96-1.5-1.7-3.46-1.97-5.96h3.94c-.27 2.5-1.01 4.46-1.97 5.96zm3.68-1.38c.45-1.42.85-2.96 1.07-4.58h3.18a8.03 8.03 0 01-4.25 4.58zM16.93 13h-3.18a15.34 15.34 0 00-1.07-4.58h3.18a8.03 8.03 0 010 4.58z"
        />
      </svg>
    ),
  },
];

const actionLinks = [
  {
    name: 'Get Directions',
    url: 'https://maps.google.com/?q=Main+Market+Jhelum+Punjab+Pakistan',
    brand: 'directions',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp Us',
    url: 'https://wa.me/923355462214',
    brand: 'whatsapp',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

const contactItems = [
  { icon: '📍', text: 'Main Market, Jhelum, Punjab, Pakistan' },
  { icon: '📞', text: '+92 335 5462214' },
  { icon: '✉️', text: 'humaaqi96@gmail.com' },
  { icon: '🕐', text: 'Mon–Sat: 9am – 9pm\nSun: 10am – 7pm' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <div className="site-footer-logo">Huma Beauty Saloon</div>
            <p className="site-footer-tagline">
              Jhelum&apos;s premier beauty destination — where every woman deserves to feel extraordinary.
            </p>
            <div className="site-footer-social">
              {[...socialLinks, ...actionLinks].map(({ name, url, brand, icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  title={name}
                  className={`site-footer-social-link site-footer-social-link--${brand}`}
                  aria-label={name}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="site-footer-col">
            <h4 className="site-footer-heading">Quick Links</h4>
            <ul className="site-footer-list">
              {quickLinks.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="site-footer-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer-col">
            <h4 className="site-footer-heading">Our Services</h4>
            <ul className="site-footer-list site-footer-list-plain">
              {services.map(s => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="site-footer-col">
            <h4 className="site-footer-heading">Contact Us</h4>
            <div className="site-footer-contact">
              {contactItems.map(({ icon, text }) => (
                <div key={icon} className="site-footer-contact-item">
                  <span className="site-footer-contact-icon">{icon}</span>
                  <span className="site-footer-contact-text">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p className="site-footer-copy">
            © 2025 Huma Beauty Saloon. All rights reserved. Jhelum, Pakistan.
          </p>
          <p className="site-footer-credit">Crafted with ♥ for beauty</p>
        </div>
      </div>
    </footer>
  );
}
