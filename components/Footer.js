import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--text-dark)',
      color: 'rgba(255,255,255,0.8)',
      padding: '64px 5% 32px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 48,
          marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.4rem', color: 'var(--blush-deep)', marginBottom: 12 }}>
              Huma Beauty Saloon
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
              Jhelum's premier beauty destination — where every woman deserves to feel extraordinary.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { name: 'Instagram', url: 'https://www.instagram.com/huma_beauty.saloon/', icon: '📷' },
                { name: 'TikTok', url: 'https://www.tiktok.com/@humabeautysaloonjhe', icon: '🎵' },
                { name: 'Website', url: 'https://humabeautysaloon.site/', icon: '🌐' }
              ].map(({ name, url, icon }) => (
                <a key={name} href={url} target="_blank" rel="noreferrer" title={name} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.95rem', transition: 'all 0.3s', color: 'white',
                  background: 'transparent',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--rose-gold)'; e.currentTarget.style.borderColor = 'var(--rose-gold)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: 'white', marginBottom: 20 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Home', '/'], ['Services', '/#services'], ['Gallery', '/#gallery'], ['Book Appointment', '/book'], ['Contact Us', '/contact']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} style={{
                    fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)',
                    transition: 'color 0.25s',
                  }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--blush-deep)'}
                    onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: 'white', marginBottom: 20 }}>Our Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Bridal Makeup', 'Hair Styling', 'Facials & Skincare', 'Nail Art', 'Waxing & Threading', 'Lash Extensions'].map(s => (
                <li key={s} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)' }}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: 'white', marginBottom: 20 }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '📍', text: 'Main Market, Jhelum, Punjab, Pakistan' },
                { icon: '📞', text: '+92 335 5462214' },
                { icon: '✉️', text: 'humaaqi96@gmail.com' },
                { icon: '🕐', text: 'Mon–Sat: 9am – 9pm\nSun: 10am – 7pm' },
              ].map(({ icon, text }) => (
                <div key={icon} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.9rem' }}>{icon}</span>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{text}</span>
                </div>
              ))}
            </div>
            <a href="https://wa.me/923355462214" target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#25d366', color: 'white', padding: '10px 20px',
                borderRadius: 50, fontSize: '0.8rem', fontWeight: 600, marginTop: 20,
                letterSpacing: '0.08em', transition: 'all 0.3s',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'none'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 24,
          display: 'flex', flexWrap: 'wrap', gap: 12,
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
            © 2025 Huma Beauty Saloon. All rights reserved. Jhelum, Pakistan.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>
            Crafted with ♥ for beauty
          </p>
        </div>
      </div>
    </footer>
  );
}
