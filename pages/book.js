import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
  '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
];

const steps = ['Your Details', 'Date & Time', 'Confirm'];

function safeDecodeQuery(value) {
  if (!value || typeof value !== 'string') return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function formatDiscount(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return raw.includes('%') ? raw : `${raw}%`;
}

export default function Book({ bookingServices = [], staffList = [], paymentInfo = {} }) {
  const router = useRouter();
  const servicePriceMap = useMemo(
    () => Object.fromEntries(bookingServices.map(s => [s.name, s.price])),
    [bookingServices]
  );
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    service: '', price: '', date: '', time: '', notes: '',
    staff_id: '', staff_name: '', referral_code: '',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [serviceFromUrl, setServiceFromUrl] = useState('');
  const [priceFromUrl, setPriceFromUrl] = useState('');
  const [offerFromUrl, setOfferFromUrl] = useState('');

  useEffect(() => {
    if (!router.isReady) return

    const service = safeDecodeQuery(router.query.service)
    const offer = safeDecodeQuery(router.query.offer)
    const price = safeDecodeQuery(router.query.price)
    const discount = formatDiscount(safeDecodeQuery(router.query.discount))

    if (service || offer) {
      const selectedService = service || offer
      const selectedPrice = price || servicePriceMap[selectedService] || ''
      const offerNote = offer
        ? `Offer: ${offer}${discount ? ` (${discount} off)` : ''} | Service: ${selectedService}`
        : ''

      setForm(f => ({
        ...f,
        service: selectedService,
        price: selectedPrice,
        notes: offerNote,
      }))
      setServiceFromUrl(selectedService)
      setPriceFromUrl(selectedPrice)
      setOfferFromUrl(offer || '')
      setStep(0)
    }

    const staffName = safeDecodeQuery(router.query.staff)
    if (staffName && staffList.length > 0) {
      const match = staffList.find(s =>
        s.name.toLowerCase() === staffName.toLowerCase() ||
        s.name.toLowerCase().startsWith(staffName.toLowerCase())
      )
      if (match) {
        setForm(f => ({ ...f, staff_id: match.id, staff_name: match.name }))
      }
    }
  }, [router.isReady, router.query.service, router.query.offer, router.query.price, router.query.discount, router.query.staff, servicePriceMap, staffList]);

  useEffect(() => {
    if (!form.date) {
      setAvailableSlots([]);
      return;
    }
    setSlotsLoading(true);
    fetch(`/api/booking-slots?date=${encodeURIComponent(form.date)}`)
      .then(res => res.json())
      .then(data => setAvailableSlots(Array.isArray(data.slots) ? data.slots : []))
      .catch(() => setAvailableSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [form.date]);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const selectService = (serviceName) => {
    setForm(f => ({ ...f, service: serviceName, price: servicePriceMap[serviceName] || '' }));
    setServiceFromUrl('');
    setPriceFromUrl('');
  };

  const validate = (allSteps = false) => {
    const e = {};
    if (allSteps || step === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.phone.trim()) e.phone = 'Phone number is required';
      if (!form.email.trim()) e.email = 'Email is required';
      if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
      if (!form.service) e.service = 'Please select a service';
    }
    if (allSteps || step === 1) {
      if (!form.date) e.date = 'Please select a date';
      if (!form.time.trim()) e.time = 'Please select or enter a time';
      else if (!convertTo24Hour(form.time)) e.time = 'Enter a valid time (e.g. 3:30 PM or 15:30)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const prev = () => { setStep(s => s - 1); setErrors({}); };

  const convertTo24Hour = (timeInput) => {
    if (!timeInput || typeof timeInput !== 'string') return '';
    const trimmed = timeInput.trim();

    if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(trimmed)) return trimmed;

    const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
      let hours = parseInt(match12[1], 10);
      const minutes = match12[2];
      const period = match12[3].toUpperCase();
      if (hours < 1 || hours > 12) return '';
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    }

    const match12NoMin = trimmed.match(/^(\d{1,2})\s*(AM|PM)$/i);
    if (match12NoMin) {
      let hours = parseInt(match12NoMin[1], 10);
      const period = match12NoMin[2].toUpperCase();
      if (hours < 1 || hours > 12) return '';
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return `${String(hours).padStart(2, '0')}:00`;
    }

    const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (match24) {
      const hours = parseInt(match24[1], 10);
      const minutes = match24[2];
      if (hours >= 0 && hours <= 23) {
        return `${String(hours).padStart(2, '0')}:${minutes}`;
      }
    }

    return '';
  };

  const submit = async () => {
    if (isLoading) return;
    if (!validate(true)) return;
    setSubmitError('');
    setIsLoading(true);
    try {
      const submissionData = {
        ...form,
        offer: offerFromUrl || undefined,
        offerId: safeDecodeQuery(router.query.offerId) || undefined,
        discount: formatDiscount(safeDecodeQuery(router.query.discount)) || undefined,
        staff_id: form.staff_id || undefined,
        staff_name: form.staff_name || undefined,
        referral_code: form.referral_code || undefined,
        time: convertTo24Hour(form.time) || form.time,
      };

      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const data = await response.json();
        const detail = data.errors ? Object.values(data.errors).join(' ') : '';
        throw new Error(detail || data.error || 'Failed to submit booking request');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitError(error.message || 'Unable to submit your booking request right now. Please try again or contact us on WhatsApp.');
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
  const stepCardStyle = { background: 'var(--champagne-pale)', borderRadius: 20, padding: 20, border: '1px solid rgba(15,76,69,0.08)', boxShadow: 'var(--shadow-soft)' };

  // Get today's date as min (local timezone — slots allow same-day booking)
  const formatLocalDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const minDate = formatLocalDate(new Date());

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
          background: 'linear-gradient(135deg, var(--rose-gold-dark) 0%, var(--rose-gold-light) 100%)',
          padding: '80px 5% 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(15,76,69,0.2)', pointerEvents: 'none' }} />
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--champagne)', marginBottom: 8 }}>Reserve Your Spot</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, color: 'white', marginBottom: 16 }}>
            Book an <em style={{ color: 'var(--blush-deep)', fontStyle: 'italic' }}>Appointment</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto' }}>
            Fill in the form below and we will confirm your appointment within 2 hours via WhatsApp.
          </p>
        </div>

        {/* Form Section */}
        <section style={{ background: 'var(--cream)', padding: '80px 5%', minHeight: '70vh' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>

            {/* Progress Steps */}
            {!submitted && (
              <div className="book-steps">
                {steps.map((s, i) => (
                  <div key={s} className="book-step-item" style={{ flex: i < steps.length - 1 ? 1 : 'none' }}>
                    <div className="book-step-node">
                      <div
                        className="book-step-circle"
                        style={{
                          background: i <= step ? 'linear-gradient(135deg, var(--rose-gold-light), var(--rose-gold-dark))' : 'white',
                          border: i <= step ? 'none' : '2px solid var(--blush-mid)',
                          color: i <= step ? 'white' : 'var(--text-light)',
                          boxShadow: i <= step ? '0 4px 12px rgba(183,110,121,0.3)' : 'none',
                        }}
                      >
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span
                        className="book-step-label"
                        style={{ color: i <= step ? 'var(--rose-gold)' : 'var(--text-light)' }}
                      >
                        {s}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className="book-step-line"
                        style={{ background: i < step ? 'var(--rose-gold-light)' : 'var(--blush-mid)' }}
                      />
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
                            <div className="book-selected-service">
                              <div className="book-selected-service-card">
                                <div className="book-selected-service-name">{form.service}</div>
                                {offerFromUrl ? (
                                  <div className="book-selected-service-offer">
                                    Offer: {offerFromUrl}
                                  </div>
                                ) : null}
                                <div className="book-selected-service-price">{form.price || priceFromUrl}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => { setServiceFromUrl(''); setPriceFromUrl(''); setOfferFromUrl(''); setForm(f => ({ ...f, service: '', price: '', notes: '' })); }}
                                className="btn-outline book-selected-service-change"
                              >
                                Change
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                              {bookingServices.map(({ name }) => (
                                <button key={name} onClick={() => selectService(name)} style={{
                                  padding: '12px 14px', borderRadius: 10, fontSize: '0.85rem', fontFamily: "'Jost', sans-serif", textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s',
                                  background: form.service === name ? 'linear-gradient(135deg, var(--rose-gold-light), var(--rose-gold-dark))' : 'var(--blush)',
                                  color: 'white',
                                  border: form.service === name ? 'none' : '1.5px solid var(--blush-mid)',
                                  fontWeight: form.service === name ? 600 : 400,
                                  boxShadow: form.service === name ? '0 4px 12px rgba(110,59,82,0.3)' : 'none',
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                    <span>{name}</span>
                                    <span style={{ fontSize: '0.8rem', color: form.service === name ? 'rgba(255,255,255,0.85)' : 'var(--text-light)', fontWeight: 500 }}>{servicePriceMap[name]}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          {errors.service && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 8 }}>{errors.service}</p>}
                        </div>

                        {staffList.length > 0 ? (
                          <div>
                            <label htmlFor="booking-stylist" style={labelStyle}>Preferred Stylist (Optional)</label>
                            <select
                              id="booking-stylist"
                              style={inputStyle('staff_id')}
                              value={form.staff_id}
                              onChange={e => {
                                const selected = staffList.find(s => s.id === e.target.value);
                                setForm(f => ({ ...f, staff_id: e.target.value, staff_name: selected?.name || '' }));
                              }}
                            >
                              <option value="">Any available stylist</option>
                              {staffList.map(s => (
                                <option key={s.id} value={s.id}>{s.name} — {s.specialty}</option>
                              ))}
                            </select>
                          </div>
                        ) : null}

                        <div>
                          <label htmlFor="booking-referral" style={labelStyle}>Referral Code (Optional)</label>
                          <input
                            id="booking-referral"
                            style={inputStyle('referral_code')}
                            value={form.referral_code}
                            onChange={e => update('referral_code', e.target.value.toUpperCase())}
                            placeholder="e.g. HUMAFRIEND"
                          />
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: 6 }}>Have a friend referral code? Enter it for a special discount.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Date & Time */}
                  {step === 1 && (
                    <div style={stepCardStyle}>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: 8 }}>Pick Date & Time</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 28 }}>Choose an available time slot for your selected date.</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div>
                          <label htmlFor="booking-date" style={labelStyle}>Preferred Date *</label>
                          <input id="booking-date" type="date" min={minDate} style={inputStyle('date')} value={form.date} onChange={e => { update('date', e.target.value); update('time', ''); }}
                            onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                            onBlur={e => e.target.style.borderColor = errors.date ? '#e57373' : 'var(--blush-mid)'} />
                          {errors.date && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.date}</p>}
                        </div>
                        <div>
                          <label style={labelStyle}>Available Time Slots *</label>
                          {!form.date ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Please select a date first.</p>
                          ) : slotsLoading ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Loading available slots…</p>
                          ) : availableSlots.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: '#c0392b' }}>No slots available for this date. Please choose another date.</p>
                          ) : (
                            <div className="book-slot-grid">
                              {availableSlots.map(slot => (
                                <button
                                  key={slot}
                                  type="button"
                                  className={`book-slot-btn${form.time === slot ? ' book-slot-btn--active' : ''}`}
                                  onClick={() => update('time', slot)}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          )}
                          {errors.time && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.time}</p>}
                        </div>
                        <div>
                          <label htmlFor="booking-notes" style={labelStyle}>Special Requests (Optional)</label>
                          <textarea id="booking-notes" rows={3} style={{ ...inputStyle('notes'), resize: 'vertical' }} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any special requests, allergies, or notes..."
                            onFocus={e => e.target.style.borderColor = 'var(--rose-gold)'}
                            onBlur={e => e.target.style.borderColor = 'var(--blush-mid)'} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Confirm */}
                  {step === 2 && (
                    <div style={stepCardStyle}>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: 8 }}>Confirm Booking</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 28 }}>Please review your booking details before confirming.</p>
                      <div style={{ background: 'white', borderRadius: 14, padding: '24px', marginBottom: 24, border: '1px solid rgba(15,76,69,0.08)' }}>
                        {[
                          ['Name', form.name],
                          ['Phone', form.phone],
                          form.email ? ['Email', form.email] : null,
                          offerFromUrl ? ['Offer', offerFromUrl] : null,
                          form.staff_name ? ['Stylist', form.staff_name] : null,
                          form.referral_code ? ['Referral', form.referral_code] : null,
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
                      <div style={{ background: 'var(--blush)', borderRadius: 10, padding: '14px 18px', fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 16 }}>
                        ℹ️ Our team will confirm your booking via WhatsApp within 2 hours. You will also receive a confirmation email if provided.
                      </div>
                      {(paymentInfo.jazzcash || paymentInfo.easypaisa) ? (
                        <div style={{ background: 'white', borderRadius: 10, padding: '14px 18px', fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.6, border: '1px solid var(--blush-mid)' }}>
                          <strong>Advance payment (optional):</strong>
                          {paymentInfo.jazzcash ? <p>JazzCash: {paymentInfo.jazzcash}</p> : null}
                          {paymentInfo.easypaisa ? <p>EasyPaisa: {paymentInfo.easypaisa}</p> : null}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="book-nav">
                    {step > 0 ? (
                      <button type="button" onClick={prev} className="btn-outline book-nav-back">← Back</button>
                    ) : <div className="book-nav-spacer" aria-hidden="true" />}
                    {step < 2 ? (
                      <button type="button" onClick={next} className="btn-rose book-nav-primary" disabled={isLoading}>
                        <span>Continue →</span>
                      </button>
                    ) : (
                      <button type="button" onClick={submit} className="btn-rose book-nav-primary" disabled={isLoading}>
                        <span>{isLoading ? 'Submitting…' : '✦ Confirm Booking'}</span>
                      </button>
                    )}
                  </div>
                  {submitError && (
                    <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: 16, textAlign: 'center' }}>{submitError}</p>
                  )}
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

export async function getServerSideProps() {
  try {
    const { getBookingServices } = await import('../lib/services');
    const { getPublicStaff } = await import('../lib/staff');
    const { getSettings } = await import('../lib/settings');
    const [bookingServices, staffList, settings] = await Promise.all([
      getBookingServices(),
      getPublicStaff(),
      getSettings(),
    ]);
    return {
      props: {
        bookingServices,
        staffList,
        paymentInfo: {
          jazzcash: settings.jazzcash_number || '',
          easypaisa: settings.easypaisa_number || '',
        },
      },
    };
  } catch (e) {
    console.error('Book page services load error:', e);
    return { props: { bookingServices: [], staffList: [], paymentInfo: {} } };
  }
}
