import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const validate = () => {
    const e = {};
    const name = form.name.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();
    const email = form.email.trim();

    if (name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!phone) e.phone = 'Phone is required';
    else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) e.phone = 'Enter a valid phone (10-15 digits)';
    }
    if (message.length < 2) e.message = 'Message must be at least 2 characters';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    setServerError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmittedName(form.name);
        setSubmitted(true);
        setForm({ name: '', phone: '', email: '', subject: '', message: '' });
        setServerError('');
      } else {
        const data = await response.json();
        const detail = data.errors ? Object.values(data.errors).join(' ') : '';
        setServerError(detail || data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error:', error);
      setServerError('Failed to send message. Please try again or contact us directly on WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '14px 18px',
    border: `1.5px solid ${errors[field] ? '#e57373' : 'var(--blush-mid)'}`,
    borderRadius: 10, fontSize: '0.9rem', fontFamily: "'Jost', sans-serif",
    color: 'var(--text-dark)', background: 'white', outline: 'none',
  });
  const labelStyle = { fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-mid)', marginBottom: 6, display: 'block' };

  const infos = [
    { icon: '📍', title: 'Our Location', lines: ['Main Market, Jhelum', 'Punjab, Pakistan'] },
    { icon: '📞', title: 'Phone & WhatsApp', lines: ['+92 335 5462214'] },
    { icon: '✉️', title: 'Email Us', lines: ['humaaqi96@gmail.com'] },
    { icon: '🕐', title: 'Working Hours', lines: ['Mon – Sat: 9:00 AM – 9:00 PM', 'Sunday: 10:00 AM – 7:00 PM'] },
  ];

  return (
    <>
      <SEO
        title="Contact Us — Huma Beauty Saloon"
        description="Get in touch with Huma Beauty Saloon in Jhelum. Call, WhatsApp or visit us."
        canonical="https://humabeautysaloon.site/contact"
        ogImage="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&q=80"
      />
      <Navbar />

      <main className="page-main">
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #3d1a28 0%, var(--rose-gold-dark) 50%, #3d1a28 100%)',
          padding: '80px 5% 60px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Get in Touch</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, color: 'white', marginBottom: 16 }}>
            Contact <em style={{ fontStyle: 'italic', color: 'var(--blush-deep)' }}>Us</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
            We would love to hear from you. Reach out for bookings, queries, or just to say hello!
          </p>
        </div>

        <section style={{ background: 'var(--cream)', padding: '80px 5%' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="contact-page-grid">

              {/* Left — Info */}
              <div>
                <div className="section-label">✦ Reach Us</div>
                <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                  We are <em>Here</em> for You
                </h2>
                <div className="section-divider" />
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 36 }}>
                  Visit our salon in Jhelum, or reach us via phone or WhatsApp. We are always happy to help you look and feel your best.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
                  {infos.map(({ icon, title, lines }) => (
                    <div key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 48, height: 48, minWidth: 48, borderRadius: 12,
                        background: 'linear-gradient(135deg, var(--blush), var(--blush-mid))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem',
                      }}>{icon}</div>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--rose-gold)', marginBottom: 4 }}>{title}</div>
                        {lines.map(l => <div key={l} style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>{l}</div>)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 14 }}>Follow Us</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[
                      {
                        label: 'Instagram',
                        href: 'https://www.instagram.com/huma_beauty.saloon/',
                        color: '#e1306c',
                        icon: (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="1.8" />
                            <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" />
                            <circle cx="17.5" cy="6.5" r="1.3" fill="white" />
                          </svg>
                        ),
                      },
                      {
                        label: 'TikTok',
                        href: 'https://www.tiktok.com/@humabeautysaloonjhe/',
                        color: '#010101',
                        icon: (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3v9.5c0 2.8 1.3 5 4.6 5 0.4 0 0.8 0 1.2-0.1V20c-0.5 0.1-1.1 0.2-1.7 0.2C10.8 20.1 7 16.4 7 11.9V7h3V3h2z" fill="white" />
                            <path d="M15 4.5v3.2c-0.6 0-1.1-0.1-1.5-0.3-0.4-0.2-0.8-0.6-1-1.1V4.5h2.5z" fill="#25f4ee" />
                            <path d="M15 14.5c-0.7 0-1.4-0.3-1.9-0.8-0.5-0.5-0.8-1.2-0.8-1.9V7h2.8c0.4 0.9 1.2 1.5 2.3 1.5V10c-0.6 0-1.2-0.2-1.7-0.5-0.5-0.3-0.8-0.8-1-1.3V14.5z" fill="#fe2c55" />
                          </svg>
                        ),
                      },
                      {
                        label: 'Website',
                        href: 'https://humabeautysaloon.site/',
                        color: 'var(--blush-deep)',
                        icon: (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="8.5" stroke="white" strokeWidth="1.8" />
                            <path d="M4 12h16M12 4a16 16 0 010 16M7.5 6.5c2.3 3 2.3 7 0 10M16.5 6.5c-2.3 3-2.3 7 0 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        ),
                      },
                    ].map(({ label, href, color, icon }) => (
                      <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: color, color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.25s, box-shadow 0.25s',
                        boxShadow: `0 4px 12px ${color}55`,
                      }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'none'; }}
                      >{icon}</a>
                    ))}
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a href="https://wa.me/923355462214" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 28, background: '#25d366', color: 'white', padding: '13px 24px', borderRadius: 50, fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,211,102,0.35)', transition: 'all 0.3s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.45)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.35)'; }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Right — Form */}
              <div>
                <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(28px, 5vw, 44px)', boxShadow: 'var(--shadow-soft)' }}>
                  {submitted ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>✦</div>
                      <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.2rem', color: 'var(--rose-gold)', marginBottom: 8 }}>Message Sent!</div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, color: 'var(--text-dark)', marginBottom: 12 }}>Thank You, {submittedName}!</h3>
                      <p style={{ color: 'var(--text-light)', lineHeight: 1.7, fontSize: '0.9rem' }}>
                        We have received your message and will get back to you within 24 hours. For urgent queries, please WhatsApp us directly.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: 8 }}>Send a Message</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 28 }}>Fill in the form and we will respond as soon as possible.</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div className="contact-form-row-2">
                          <div>
                            <label htmlFor="contact-name" style={labelStyle}>Name *</label>
                            <input id="contact-name" style={inputStyle('name')} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name"
                              onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                              onBlur={e => e.target.style.borderColor = errors.name ? '#e57373' : 'var(--blush-mid)'} />
                            {errors.name && <p style={{ color: '#c0392b', fontSize: '0.75rem', marginTop: 4 }}>{errors.name}</p>}
                          </div>
                          <div>
                            <label htmlFor="contact-phone" style={labelStyle}>Phone *</label>
                            <input id="contact-phone" style={inputStyle('phone')} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="0300-1234567"
                              onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                              onBlur={e => e.target.style.borderColor = errors.phone ? '#e57373' : 'var(--blush-mid)'} />
                            {errors.phone && <p style={{ color: '#c0392b', fontSize: '0.75rem', marginTop: 4 }}>{errors.phone}</p>}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="contact-email" style={labelStyle}>Email (Optional)</label>
                          <input id="contact-email" style={inputStyle('email')} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com"
                            onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                            onBlur={e => e.target.style.borderColor = errors.email ? '#e57373' : 'var(--blush-mid)'} />
                          {errors.email && <p style={{ color: '#c0392b', fontSize: '0.75rem', marginTop: 4 }}>{errors.email}</p>}
                        </div>

                        <div>
                          <label htmlFor="contact-subject" style={labelStyle}>Subject</label>
                          <select id="contact-subject" style={{ ...inputStyle('subject'), cursor: 'pointer' }} value={form.subject} onChange={e => update('subject', e.target.value)}
                            onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                            onBlur={e => e.target.style.borderColor = 'var(--blush-mid)'}>
                            <option value="">Select a topic</option>
                            <option>General Inquiry</option>
                            <option>Bridal Package Inquiry</option>
                            <option>Service Pricing</option>
                            <option>Appointment Cancellation</option>
                            <option>Feedback / Complaint</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="contact-message" style={labelStyle}>Message *</label>
                          <textarea id="contact-message" rows={5} style={{ ...inputStyle('message'), resize: 'vertical' }} value={form.message} onChange={e => update('message', e.target.value)} placeholder="Tell us how we can help you..."
                            onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                            onBlur={e => e.target.style.borderColor = errors.message ? '#e57373' : 'var(--blush-mid)'} />
                          {errors.message && <p style={{ color: '#c0392b', fontSize: '0.75rem', marginTop: 4 }}>{errors.message}</p>}
                        </div>

                        <button onClick={submit} disabled={isLoading} className="btn-rose" style={{ padding: '15px 32px', fontSize: '0.88rem', width: '100%', justifyContent: 'center', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                          <span>{isLoading ? '⟳ Sending...' : '✦ Send Message'}</span>
                        </button>
                        {serverError && (
                          <p style={{ color: '#c0392b', fontSize: '0.9rem', lineHeight: 1.6, marginTop: 14 }}>
                            {serverError}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div style={{ marginTop: 64 }}>
              <div className="section-label">✦ Find Us</div>
              <h2 className="section-title" style={{ marginBottom: 28 }}>Our <em>Location</em></h2>
              <div style={{
                borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-soft)',
                border: '1px solid var(--blush-mid)',
                background: 'var(--blush)',
                height: 360,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 16,
                position: 'relative',
              }}>
                {/* Embedded Google Maps iframe */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53714.12!2d73.7200!3d32.9361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391ec5e5d2e06e7f%3A0x5e3e1e3c3a1e1e1e!2sJhelum%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000"
                  width="100%" height="360" style={{ border: 0, display: 'block' }} allowFullScreen="" loading="lazy"
                  title="Huma Beauty Saloon Location"
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <a href="https://maps.google.com/?q=Main+Market+Jhelum+Punjab+Pakistan" target="_blank" rel="noreferrer" className="btn-rose">
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
