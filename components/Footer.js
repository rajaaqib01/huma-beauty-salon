import Link from 'next/link';

const quickLinks = [
  ['Home', '/'],
  ['Services', '/services'],
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
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="white" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.5" stroke="white" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="white" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@humabeautysaloonjhe',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3v9.5c0 2.8 1.3 5 4.6 5 0.4 0 0.8 0 1.2-0.1V20c-0.5 0.1-1.1 0.2-1.7 0.2C10.8 20.1 7 16.4 7 11.9V7h3V3h2z" fill="white" />
        <path d="M15 4.5v3.2c-0.6 0-1.1-0.1-1.5-0.3-0.4-0.2-0.8-0.6-1-1.1V4.5h2.5z" fill="#25f4ee" />
        <path d="M15 14.5c-0.7 0-1.4-0.3-1.9-0.8-0.5-0.5-0.8-1.2-0.8-1.9V7h2.8c0.4 0.9 1.2 1.5 2.3 1.5V10c-0.6 0-1.2-0.2-1.7-0.5-0.5-0.3-0.8-0.8-1-1.3V14.5z" fill="#fe2c55" />
      </svg>
    ),
  },
  {
    name: 'Website',
    url: 'https://humabeautysaloon.site/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8.2" stroke="white" strokeWidth="1.8" />
        <path d="M4 12h16M12 4a16 16 0 010 16M7.5 6.5c2.3 3 2.3 7 0 10M16.5 6.5c-2.3 3-2.3 7 0 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
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
              {socialLinks.map(({ name, url, icon }) => (
                <a key={name} href={url} target="_blank" rel="noreferrer" title={name} className="site-footer-social-link" aria-label={name}>
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
            <div className="site-footer-actions">
            <a href="https://maps.google.com/?q=Main+Market+Jhelum+Punjab+Pakistan" target="_blank" rel="noreferrer" className="site-footer-directions">
              Get Directions
            </a>
            <a href="https://wa.me/923355462214" target="_blank" rel="noreferrer" className="site-footer-whatsapp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
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
