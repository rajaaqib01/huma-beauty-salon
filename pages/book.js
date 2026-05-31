import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';

const services = [
  'Everyday Makeup', 'Simple Party Makeup', 'Glam Party Makeup', 'Engagement Makeup', 'HD Makeup', 'Mehndi Makeup', 'Bridal Makeup', 'Luxury Bridal',
  'Haircut & Styling', 'Hair Coloring', 'Keratin Treatment', 'Bridal Hairstyling',
  'Cleanup Facial', 'Basic Facial', 'Whitening Facial', 'Gold Facial', 'Hydra Facial', 'Acne Facial', 'Anti-Aging Facial', 'Luxury Glow Facial',
  'Gel Manicure', 'Nail Extensions', 'Nail Art', 'Lash Extensions',
  'Full Body Waxing', 'Threading', 'Brazilian Wax', 'Eyebrow Lamination',
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
  '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
];

const steps = ['Your Details', 'Date & Time', 'Confirm'];

export default function Book() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    service: '', price: '', date: '', time: '', notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serviceFromUrl, setServiceFromUrl] = useState('');
  const [priceFromUrl, setPriceFromUrl] = useState('');

  useEffect(() => {
    if (router.isReady && router.query.service) {
      const service = decodeURIComponent(router.query.service);
      setForm(f => ({ ...f, service }));
      setServiceFromUrl(service);
      if (router.query.price) {
        const p = decodeURIComponent(router.query.price);
        setPriceFromUrl(p);
        setForm(f => ({ ...f, price: p }));
      }
      setStep(0);
    }
  }, [router.isReady, router.query.service]);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.phone.trim()) e.phone = 'Phone number is required';
      if (!form.email.trim()) e.email = 'Email is required';
      if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
      if (!form.service) e.service = 'Please select a service';
    }
    if (step === 1) {
      if (!form.date) e.date = 'Please select a date';
      if (!form.time) e.time = 'Please select a time';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const prev = () => { setStep(s => s - 1); setErrors({}); };

  const submit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit booking request');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Unable to submit your booking request right now. Please try again or contact us on WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '14px 18px',
    border: `1.5px solid ${errors[field] ? '#e57373' : 'var(--blush-mid)'}`,
    borderRadius: 10, fontSize: '0.9rem', fontFamily: "'Jost', sans-serif",
    color: 'var(--text-dark)', background: 'white', outline: 'none',
    transition: 'border-color 0.25s',
  });

  const labelStyle = { fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-mid)', marginBottom: 6, display: 'block' };

  // Get tomorrow's date as min
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <SEO
        title="Book Appointment — Huma Beauty Saloon"
        description="Book your beauty appointment at Huma Beauty Saloon, Jhelum's premier salon."
        canonical="https://humabeautysaloon.site/book"
        ogImage="https://images.unsplash.com/photo-1560066984-138daaa56d8c?w=1200&q=80"
      />
      <Navbar />

      <main className="page-main">
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--text-dark) 0%, #5a2832 100%)',
          padding: '80px 5% 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(183,110,121,0.2)', pointerEvents: 'none' }} />
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--blush-deep)', marginBottom: 8 }}>Reserve Your Spot</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, color: 'white', marginBottom: 16 }}>
            Book an <em style={{ color: 'var(--blush-deep)', fontStyle: 'italic' }}>Appointment</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto' }}>
            Fill in the form below and we will confirm your appointment within 2 hours via WhatsApp.
          </p>
        </div>

        {/* Form Section */}
        <section style={{ background: 'var(--champagne-pale)', padding: '80px 5%', minHeight: '70vh' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>

            {/* Progress Steps */}
            {!submitted && (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 52 }}>
                {steps.map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: i <= step ? 'linear-gradient(135deg, var(--rose-gold-light), var(--rose-gold-dark))' : 'white',
                        border: i <= step ? 'none' : '2px solid var(--blush-mid)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: i <= step ? 'white' : 'var(--text-light)',
                        fontSize: '0.85rem', fontWeight: 600,
                        boxShadow: i <= step ? '0 4px 12px rgba(183,110,121,0.3)' : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: i <= step ? 'var(--rose-gold)' : 'var(--text-light)', whiteSpace: 'nowrap' }}>{s}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: i < step ? 'var(--rose-gold-light)' : 'var(--blush-mid)', margin: '0 8px', marginBottom: 20, transition: 'background 0.3s' }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Card */}
            <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(28px, 5vw, 48px)', boxShadow: 'var(--shadow-soft)' }}>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 16 }}>✦</div>
                  <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.5rem', color: 'var(--rose-gold)', marginBottom: 8 }}>Thank You!</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, color: 'var(--text-dark)', marginBottom: 16 }}>Appointment Requested</h2>
                  <p style={{ color: 'var(--text-light)', lineHeight: 1.7, marginBottom: 12 }}>
                    We have received your booking for <strong>{form.service}</strong>{form.price ? <> (<strong>{form.price}</strong>)</> : ''} on <strong>{form.date}</strong> at <strong>{form.time}</strong>.
                  </p>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: 32 }}>Our team will confirm via WhatsApp within 2 hours.</p>
                  <a href={`https://wa.me/923355462214?text=Hello! I just booked an appointment for ${encodeURIComponent(form.service)} on ${encodeURIComponent(form.date)} at ${encodeURIComponent(form.time)}. My name is ${encodeURIComponent(form.name)}.`} target="_blank" rel="noreferrer">
                    <button style={{ background: '#25d366', color: 'white', border: 'none', padding: '14px 28px', borderRadius: 50, fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      Confirm on WhatsApp
                    </button>
                  </a>
                </div>
              ) : (
                <>
                  {/* Step 0: Your Details + Choose Service */}
                  {step === 0 && (
                    <div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: 8 }}>Your Details & Service</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 32 }}>Tell us about yourself and select your service.</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Personal Info Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--rose-gold)' }}>📋 Your Information</div>
                          <div>
                            <label htmlFor="booking-name" style={labelStyle}>Full Name *</label>
                            <input id="booking-name" style={inputStyle('name')} value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Ayesha Malik"
                              onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                              onBlur={e => e.target.style.borderColor = errors.name ? '#e57373' : 'var(--blush-mid)'} />
                            {errors.name && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.name}</p>}
                          </div>
                          <div>
                            <label htmlFor="booking-phone" style={labelStyle}>WhatsApp / Phone *</label>
                            <input id="booking-phone" style={inputStyle('phone')} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="e.g. 0300-1234567"
                              onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                              onBlur={e => e.target.style.borderColor = errors.phone ? '#e57373' : 'var(--blush-mid)'} />
                            {errors.phone && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.phone}</p>}
                          </div>
                          <div>
                            <label htmlFor="booking-email" style={labelStyle}>Email Address *</label>
                            <input id="booking-email" style={inputStyle('email')} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="e.g. ayesha@email.com"
                              onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                              onBlur={e => e.target.style.borderColor = errors.email ? '#e57373' : 'var(--blush-mid)'} />
                            {errors.email && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.email}</p>}
                          </div>
                        </div>

                        {/* Service Selection Section */}
                        <div style={{ borderTop: '1px solid var(--blush-mid)', paddingTop: 20 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--rose-gold)', marginBottom: 16 }}>💅 Choose Service</div>
                          {serviceFromUrl ? (
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                              <div style={{ flex: 1, background: form.service ? 'linear-gradient(135deg, var(--rose-gold-light), var(--rose-gold-dark))' : 'var(--blush)', color: form.service ? 'white' : 'var(--text-mid)', padding: 16, borderRadius: 12 }}>
                                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{form.service}</div>
                                <div style={{ fontSize: '0.9rem', color: form.service ? 'rgba(255,255,255,0.9)' : 'var(--text-light)', marginTop: 6 }}>{priceFromUrl}</div>
                              </div>
                              <button onClick={() => { setServiceFromUrl(''); setPriceFromUrl(''); setForm(f => ({ ...f, service: '' })); }} className="btn-outline" style={{ padding: '10px 16px' }}>Change</button>
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                              {services.map(s => (
                                <button key={s} onClick={() => update('service', s)} style={{
                                  padding: '12px 14px', borderRadius: 10, fontSize: '0.85rem', fontFamily: "'Jost', sans-serif", textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s',
                                  background: form.service === s ? 'linear-gradient(135deg, var(--rose-gold-light), var(--rose-gold-dark))' : 'var(--blush)',
                                  color: form.service === s ? 'white' : 'var(--text-mid)',
                                  border: form.service === s ? 'none' : '1.5px solid var(--blush-mid)',
                                  fontWeight: form.service === s ? 600 : 400,
                                  boxShadow: form.service === s ? '0 4px 12px rgba(110,59,82,0.3)' : 'none',
                                }}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                          {errors.service && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 8 }}>{errors.service}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Date & Time */}
                  {step === 1 && (
                    <div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: 8 }}>Pick Date & Time</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 28 }}>Choose your preferred appointment slot.</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div>
                          <label htmlFor="booking-date" style={labelStyle}>Preferred Date *</label>
                          <input id="booking-date" type="date" min={minDate} style={inputStyle('date')} value={form.date} onChange={e => update('date', e.target.value)}
                            onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                            onBlur={e => e.target.style.borderColor = errors.date ? '#e57373' : 'var(--blush-mid)'} />
                          {errors.date && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.date}</p>}
                        </div>
                        <div>
                          <label style={labelStyle}>Preferred Time *</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
                            {timeSlots.map(t => (
                              <button key={t} onClick={() => update('time', t)} style={{
                                padding: '9px 4px', borderRadius: 8, fontSize: '0.78rem', fontFamily: "'Jost', sans-serif", cursor: 'pointer', transition: 'all 0.2s',
                                background: form.time === t ? 'linear-gradient(135deg, var(--rose-gold-light), var(--rose-gold-dark))' : 'var(--blush)',
                                color: form.time === t ? 'white' : 'var(--text-mid)',
                                border: form.time === t ? 'none' : '1.5px solid var(--blush-mid)',
                                fontWeight: form.time === t ? 600 : 400,
                              }}>{t}</button>
                            ))}
                          </div>
                          {errors.time && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.time}</p>}
                        </div>
                        <div>
                          <label style={labelStyle}>Special Requests (Optional)</label>
                          <textarea rows={3} style={{ ...inputStyle('notes'), resize: 'vertical' }} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any special requests, allergies, or notes..."
                            onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                            onBlur={e => e.target.style.borderColor = 'var(--blush-mid)'} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Confirm */}
                  {step === 2 && (
                    <div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: 8 }}>Confirm Booking</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 28 }}>Please review your booking details before confirming.</p>
                      <div style={{ background: 'var(--champagne-pale)', borderRadius: 14, padding: '24px', marginBottom: 24 }}>
                        {[
                          ['Name', form.name],
                          ['Phone', form.phone],
                          form.email ? ['Email', form.email] : null,
                          ['Service', form.service],
                          form.price ? ['Price', form.price] : null,
                          ['Date', form.date],
                          ['Time', form.time],
                          form.notes ? ['Notes', form.notes] : null,
                        ].filter(Boolean).map(([key, val]) => (
                          <div key={key} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--blush-mid)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-light)', minWidth: 80 }}>{key}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 500 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: 'var(--blush)', borderRadius: 10, padding: '14px 18px', fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>
                        ℹ️ Our team will confirm your booking via WhatsApp within 2 hours. For immediate assistance, WhatsApp us at <strong>+92 335 5462214</strong>.
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, gap: 12 }}>
                    {step > 0 ? (
                      <button onClick={prev} className="btn-outline" style={{ padding: '13px 28px' }}>← Back</button>
                    ) : <div />}
                    {step < 2 ? (
                      <button onClick={next} className="btn-rose" style={{ padding: '13px 28px' }}><span>Continue →</span></button>
                    ) : (
                      <button onClick={submit} className="btn-rose" style={{ padding: '13px 36px' }}><span>✦ Confirm Booking</span></button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Info cards */}
            {!submitted && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 28 }}>
                {[
                  { icon: '📞', title: 'Call Us', desc: '+92 335 5462214' },
                  { icon: '⏰', title: 'Working Hours', desc: 'Mon–Sat 9am–9pm\nSun 10am–7pm' },
                  { icon: '📍', title: 'Location', desc: 'Main Market, Jhelum' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} style={{ background: 'white', borderRadius: 12, padding: '20px', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--rose-gold)', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
