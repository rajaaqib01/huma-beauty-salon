import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import SEO from '../../components/SEO';
import { isValidPhone } from '../../lib/apiUtils/validation';

const steps = ['Your Details', 'Course & Payment', 'Confirm'];
const BATCH_OPTIONS = ['Morning', 'Evening', 'Weekend'];
const EXPERIENCE_OPTIONS = ['Beginner', 'Some Experience', 'Professional'];

function safeDecode(value) {
  if (!value || typeof value !== 'string') return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function parseApiResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text.startsWith('Body') ? 'Screenshot is too large. Please use a smaller image (under 3MB).' : text);
  }
}

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => resolve({
        data: reader.result,
        filename: file.name,
        mimeType: file.type,
      });
      reader.onerror = () => reject(new Error('Could not read image file'));
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxWidth = 1400;
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not process image'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const data = canvas.toDataURL('image/jpeg', 0.82);
      resolve({
        data,
        filename: file.name.replace(/\.\w+$/, '') + '.jpg',
        mimeType: 'image/jpeg',
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image'));
    };
    img.src = objectUrl;
  });
}

export default function CourseApplyPage({ courses = [], jazzcashNumber = '03355462214' }) {
  const router = useRouter();
  const courseMap = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.slug, c])),
    [courses]
  );

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', age: '', city: '',
    course_id: '', batch: '', experience: 'Beginner', notes: '',
    transaction_id: '', payment_screenshot: '',
  });
  const [pendingFile, setPendingFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const slug = safeDecode(router.query.course);
    if (!slug || !courseMap[slug]) return;
    const course = courseMap[slug];
    setForm((f) => ({ ...f, course_id: course.id }));
  }, [router.isReady, router.query.course, courseMap]);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === form.course_id) || null,
    [courses, form.course_id]
  );

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = (allSteps = false) => {
    const e = {};
    if (allSteps || step === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.phone.trim()) e.phone = 'Phone is required';
      else if (!isValidPhone(form.phone.trim())) e.phone = 'Enter a valid phone number (10-15 digits)';
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    }
    if (allSteps || step === 1) {
      if (!form.course_id) e.course_id = 'Please select a course';
      if (!form.batch) e.batch = 'Please select a batch';
      if (!form.transaction_id.trim()) e.transaction_id = 'Transaction ID is required';
      if (!pendingFile && !form.payment_screenshot) e.payment_screenshot = 'Upload JazzCash payment screenshot';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const prev = () => { setStep((s) => s - 1); setErrors({}); };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((err) => ({ ...err, payment_screenshot: 'Please choose an image file' }));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrors((err) => ({ ...err, payment_screenshot: 'Image must be smaller than 8MB' }));
      return;
    }
    try {
      const compressed = await compressImageFile(file);
      setPreview(compressed.data);
      setPendingFile(compressed);
      setErrors((err) => ({ ...err, payment_screenshot: '' }));
    } catch {
      setErrors((err) => ({ ...err, payment_screenshot: 'Could not process image. Try another file.' }));
    }
  };

  const submit = async () => {
    if (isLoading) return;
    if (!validate(true)) return;
    setSubmitError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/course-admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          payment_file: pendingFile || undefined,
        }),
      });
      const data = await parseApiResponse(response);
      if (!response.ok) {
        const detail = data.errors ? Object.values(data.errors).join(' ') : '';
        throw new Error(detail || data.error || 'Failed to submit application');
      }
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || 'Unable to submit right now. Please try again or WhatsApp us.');
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

  const labelStyle = {
    fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--text-mid)', marginBottom: 6, display: 'block',
  };

  return (
    <>
      <SEO
        title="Course Admission — Huma Beauty Academy Jhelum"
        description="Apply online for professional beauty courses at Huma Beauty Saloon Academy. Pay course fee via JazzCash."
        canonical="https://humabeautysaloon.site/courses/apply"
      />
      <Navbar />

      <main className="page-main book-page-wrap">
        <section className="book-page-section">
          <div className="book-page-header">
            <div className="section-label">✦ Academy Admission</div>
            <h1 className="book-page-title">Course <em>Application</em></h1>
            <p className="book-page-subtitle">Fill the form and pay via JazzCash. We verify payment within 24–48 hours.</p>
          </div>

          {!submitted && (
            <div className="book-steps" role="tablist" aria-label="Application steps">
              {steps.map((label, i) => (
                <div key={label} className={`book-step${i === step ? ' book-step--active' : ''}${i < step ? ' book-step--done' : ''}`}>
                  <span className="book-step-num">{i < step ? '✓' : i + 1}</span>
                  <span className="book-step-label">{label}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(28px, 5vw, 48px)', boxShadow: 'var(--shadow-soft)', maxWidth: 720, margin: '0 auto' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🎓</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: 'var(--text-dark)', marginBottom: 12 }}>Application Submitted!</h2>
                <p style={{ color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 24 }}>
                  Thank you, <strong>{form.name}</strong>. We received your application for <strong>{selectedCourse?.title}</strong>.
                  Our team will verify your JazzCash payment and confirm via WhatsApp within 24–48 hours.
                </p>
                <Link href="/courses" className="btn-outline">Back to Courses</Link>
              </div>
            ) : (
              <>
                {step === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: 'var(--text-dark)' }}>Your Details</h2>
                    <div>
                      <label htmlFor="adm-name" style={labelStyle}>Full Name *</label>
                      <input id="adm-name" style={inputStyle('name')} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" />
                      {errors.name && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="adm-phone" style={labelStyle}>WhatsApp / Phone *</label>
                      <input id="adm-phone" style={inputStyle('phone')} value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="e.g. 0300-1234567" />
                      {errors.phone && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="adm-email" style={labelStyle}>Email *</label>
                      <input id="adm-email" type="email" style={inputStyle('email')} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" />
                      {errors.email && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.email}</p>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label htmlFor="adm-age" style={labelStyle}>Age (Optional)</label>
                        <input id="adm-age" type="number" min="14" max="60" style={inputStyle('age')} value={form.age} onChange={(e) => update('age', e.target.value)} />
                      </div>
                      <div>
                        <label htmlFor="adm-city" style={labelStyle}>City (Optional)</label>
                        <input id="adm-city" style={inputStyle('city')} value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="e.g. Jhelum" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: 'var(--text-dark)' }}>Course & Payment</h2>
                    <div>
                      <label htmlFor="adm-course" style={labelStyle}>Select Course *</label>
                      <select id="adm-course" style={inputStyle('course_id')} value={form.course_id} onChange={(e) => update('course_id', e.target.value)}>
                        <option value="">Choose a course</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.title} — {c.fee}</option>
                        ))}
                      </select>
                      {errors.course_id && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.course_id}</p>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label htmlFor="adm-batch" style={labelStyle}>Batch Preference *</label>
                        <select id="adm-batch" style={inputStyle('batch')} value={form.batch} onChange={(e) => update('batch', e.target.value)}>
                          <option value="">Select batch</option>
                          {BATCH_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {errors.batch && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.batch}</p>}
                      </div>
                      <div>
                        <label htmlFor="adm-exp" style={labelStyle}>Experience</label>
                        <select id="adm-exp" style={inputStyle('experience')} value={form.experience} onChange={(e) => update('experience', e.target.value)}>
                          {EXPERIENCE_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>

                    {selectedCourse ? (
                      <div style={{ background: 'var(--champagne-pale)', border: '1px solid rgba(15,76,69,0.12)', borderRadius: 12, padding: '16px 18px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', margin: 0, lineHeight: 1.6 }}>
                          <strong>Course fee:</strong> {selectedCourse.fee} &nbsp;|&nbsp; <strong>Duration:</strong> {selectedCourse.duration}
                        </p>
                      </div>
                    ) : null}

                    <div style={{ background: 'var(--champagne-pale)', border: '1px solid rgba(15,76,69,0.14)', borderRadius: 12, padding: '16px 18px' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--blush)', marginBottom: 8 }}>JazzCash Payment</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', margin: '0 0 8px', lineHeight: 1.6 }}>
                        Send full course fee to JazzCash: <strong>{jazzcashNumber}</strong>
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-mid)', margin: 0 }}>After payment, enter transaction ID and upload screenshot below.</p>
                    </div>

                    <div>
                      <label htmlFor="adm-txn" style={labelStyle}>JazzCash Transaction ID *</label>
                      <input id="adm-txn" style={inputStyle('transaction_id')} value={form.transaction_id} onChange={(e) => update('transaction_id', e.target.value)} placeholder="e.g. 1234567890" />
                      {errors.transaction_id && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.transaction_id}</p>}
                    </div>

                    <div>
                      <label htmlFor="adm-screenshot" style={labelStyle}>Payment Screenshot *</label>
                      <input id="adm-screenshot" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} className="admin-input admin-file-input" style={{ width: '100%' }} />
                      {preview ? (
                        <img src={preview} alt="Payment preview" style={{ marginTop: 12, maxWidth: 200, borderRadius: 8, border: '1px solid var(--blush-mid)' }} />
                      ) : null}
                      {errors.payment_screenshot && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginTop: 4 }}>{errors.payment_screenshot}</p>}
                    </div>

                    <div>
                      <label htmlFor="adm-notes" style={labelStyle}>Notes (Optional)</label>
                      <textarea id="adm-notes" rows={3} style={{ ...inputStyle('notes'), resize: 'vertical' }} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Any questions or special requests..." />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: 'var(--text-dark)', marginBottom: 20 }}>Confirm Application</h2>
                    <div style={{ background: 'white', borderRadius: 14, padding: '20px', border: '1px solid rgba(15,76,69,0.08)', marginBottom: 20 }}>
                      {[
                        ['Name', form.name],
                        ['Phone', form.phone],
                        ['Email', form.email],
                        form.age ? ['Age', form.age] : null,
                        form.city ? ['City', form.city] : null,
                        ['Course', selectedCourse?.title],
                        ['Fee', selectedCourse?.fee],
                        ['Batch', form.batch],
                        ['Experience', form.experience],
                        ['Transaction ID', form.transaction_id],
                      ].filter(Boolean).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--blush-mid)' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-light)', minWidth: 110 }}>{key}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 500 }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: 'var(--champagne-pale)', border: '1px solid rgba(15,76,69,0.14)', borderRadius: 10, padding: '14px 18px', fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: 1.6 }}>
                      By submitting, you confirm that the JazzCash payment details are correct. We will verify and contact you on WhatsApp.
                    </div>
                  </div>
                )}

                <div className="book-nav" style={{ marginTop: 28 }}>
                  {step > 0 ? (
                    <button type="button" onClick={prev} className="btn-outline book-nav-back">← Back</button>
                  ) : <div className="book-nav-spacer" aria-hidden="true" />}
                  {step < 2 ? (
                    <button type="button" onClick={next} className="btn-rose book-nav-primary"><span>Continue →</span></button>
                  ) : (
                    <button type="button" onClick={submit} className="btn-rose book-nav-primary" disabled={isLoading}>
                      <span>{isLoading ? 'Submitting…' : '✦ Submit Application'}</span>
                    </button>
                  )}
                </div>
                {submitError && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: 16, textAlign: 'center' }}>{submitError}</p>}
              </>
            )}
          </div>

          <p style={{ textAlign: 'center', marginTop: 20 }}>
            <Link href="/courses" style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>← Back to all courses</Link>
          </p>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const { getActiveCourses } = await import('../../lib/courses');
    const { getSettings } = await import('../../lib/settings');
    const [courses, settings] = await Promise.all([getActiveCourses(), getSettings()]);
    return {
      props: {
        courses,
        jazzcashNumber: settings.jazzcash_number || '03355462214',
      },
    };
  } catch (e) {
    console.error('Course apply page load error:', e);
    return { props: { courses: [], jazzcashNumber: '03355462214' } };
  }
}
