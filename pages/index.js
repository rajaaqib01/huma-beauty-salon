import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import ServiceSection from '../components/ServiceSection';
import { SERVICE_SECTIONS } from '../lib/serviceConfig';

const testimonials = [
  { name: 'Ayesha Khan', loc: 'Jhelum', text: 'I got my bridal makeup done here and it was absolutely stunning! The team understood exactly what I wanted. Highly recommended!', stars: 5, img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
  { name: 'Sana Malik', loc: 'Rawalpindi', text: "Best salon in the area. The keratin treatment transformed my hair completely. I've been coming here for 2 years now.", stars: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { name: 'Fatima Raza', loc: 'Jhelum', text: 'The facials here are divine! My skin has never looked this glowing. The atmosphere is so relaxing and luxurious.', stars: 5, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { name: 'Zara Ahmed', loc: 'Gujrat', text: 'Excellent nail art! The nail artist is so talented and creative. Got exactly the design I wanted for my engagement.', stars: 5, img: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&q=80' },
  { name: 'Hira Baig', loc: 'Jhelum', text: 'Very professional staff, hygienic environment and affordable prices for such premium quality services. My go-to salon!', stars: 5, img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80' },
  { name: 'Nadia Hussain', loc: 'Kharian', text: "The party makeup they did for my sister's wedding was breathtaking. Everyone kept asking who did her makeup!", stars: 5, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80' },
  { name: 'Amna Riaz', loc: 'Lahore', text: 'Friendly staff and immaculate service. My lashes look amazing and last for weeks!', stars: 5, img: 'https://images.unsplash.com/photo-1545996124-1f1f6d9f5a1f?w=100&q=80' },
  { name: 'Zainab Ali', loc: 'Islamabad', text: 'Lovely ambience and true professionals. My bridal mehndi was flawless and lasted beautifully.', stars: 5, img: 'https://images.unsplash.com/photo-1544005313-2f8b3b4b3a2d?w=100&q=80' },
];
const tiktokProfileLink = 'https://www.tiktok.com/@humabeautysaloonjhe';
const tiktokVideoEmbedUrl = 'https://www.tiktok.com/embed/v2/7631137952298454292';

export default function Home({ groupedServices = {} }) {
  return (
    <>
      <SEO
        title="Huma Beauty Saloon — Premium Beauty in Jhelum"
        description="Jhelum's most luxurious beauty salon. Expert bridal makeup, hair styling, facials, nail art and more."
        canonical="https://humabeautysaloon.site/"
        ogImage="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80"
      />
      <Navbar />
      <main className="page-main">

        {/* HERO */}
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600&q=90')" }} >
          <div className="hero-overlay" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-label">Welcome to</div>
              <h1>Huma <span>Beauty</span> Saloon</h1>
              <p className="hero-subtitle">Luxury beauty services crafted for your perfect moment</p>
              <p className="hero-text">We deliver bridal makeup, hair styling, facials, nails, and waxing with the same care, hygiene, and premium touch every time.</p>
              <div className="hero-ctas">
                <Link href="/book"><button className="btn-rose">✦ Book Appointment</button></Link>
                <Link href="/contact"><button className="btn-outline">Contact Us</button></Link>
              </div>
              <div className="hero-badges">
                <span>Bridal Specialist</span>
                <span>Clean Salon</span>
                <span>Fast WhatsApp Booking</span>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-tag">Quick Salon Guide</div>
              <h2>Book in 3 easy steps</h2>
              <ol className="hero-card-list">
                <li>Select the service you love</li>
                <li>Pick a convenient date & time</li>
                <li>Confirm instantly on WhatsApp</li>
              </ol>
              <a className="btn-secondary hero-card-whatsapp" href="https://wa.me/923355462214" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </div>
          </div>
          <div className="hero-scroll-tip">Scroll to explore</div>
        </section>

        {/* SERVICES */}
        <div id="services">
          {SERVICE_SECTIONS.map(section => (
            <ServiceSection
              key={section.id}
              id={section.id}
              label={section.label}
              title={section.title}
              italic={section.italic}
              services={groupedServices[section.id] || []}
              bg={section.bg}
            />
          ))}
        </div>

        {/* WHY US */}
        <section id="about" className="why-us-section">
          <div className="why-us-background-circle" />
          <div className="why-us-wrapper">
            <div className="section-label">✦ Our Promise</div>
            <h2 className="section-title" style={{ color: 'white' }}>Why Choose <em>Us</em></h2>
            <div className="section-divider" style={{ margin: '20px auto 52px' }} />
            <div className="why-us-cards">
              {[
                { icon: '✦', title: 'Expert Stylists', desc: 'Professionally trained artists with years of experience in bridal and beauty transformations.' },
                { icon: '◈', title: 'Premium Products', desc: 'We use only international-grade, skin-safe products from trusted beauty brands worldwide.' },
                { icon: '❋', title: 'Hygienic Environment', desc: 'Strict sanitization protocols ensure every tool and surface is impeccably clean and safe.' },
                { icon: '♡', title: 'Relaxing Atmosphere', desc: 'Escape into our serene, spa-like ambiance designed for total relaxation and comfort.' },
                { icon: '✿', title: 'Affordable Luxury', desc: 'Premium quality services at prices that make luxury accessible to every woman in Jhelum.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="why-us-card">
                  <div className="why-us-card-icon">{icon}</div>
                  <h3 className="why-us-card-title">{title}</h3>
                  <p className="why-us-card-text">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ background: 'var(--champagne-pale)', padding: '96px 5%' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div className="section-label">✦ Client Love</div>
              <h2 className="section-title">What Our Clients <em>Say</em></h2>
              <div className="section-divider" style={{ margin: '20px auto' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-quote">"</div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-meta">
                    <img src={t.img} alt={t.name} className="testimonial-avatar" loading="lazy" />
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-loc">{t.loc}</div>
                    </div>
                    <div className="testimonial-stars">
                      {Array(t.stars).fill(0).map((_, j) => <span key={j}>★</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL / GALLERY CTA */}
        <section style={{ background: 'var(--cream)', padding: '96px 5%' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="section-label">✦ Our Work</div>
                <h2 className="section-title">Watch & <em>Explore</em></h2>
                <div className="section-divider" style={{ marginBottom: 0 }} />
              </div>
              <Link href="/gallery" style={{ fontSize: '0.85rem', color: 'var(--rose-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>View Full Gallery →</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'stretch' }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', background: 'white', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
                  <iframe
                    src={tiktokVideoEmbedUrl}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    title="Huma Beauty TikTok Video"
                  />
                </div>
              </div>
              <div style={{ borderRadius: 24, padding: '28px', background: 'white', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="section-label">TikTok</div>
                  <h3 style={{ margin: '16px 0 12px', fontSize: 'clamp(1.6rem, 2.2vw, 2rem)', lineHeight: 1.1 }}>Watch our latest TikTok beauty reel</h3>
                  <p style={{ color: 'var(--text-mid)', lineHeight: 1.8, marginBottom: 24 }}>See the newest transformation videos, makeup tips and salon highlights from Huma Beauty Salon.</p>
                </div>
                <a href={tiktokProfileLink} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 22px', borderRadius: 999, background: '#010101', color: 'white', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Visit TikTok Profile</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, var(--rose-gold-dark), var(--rose-gold), var(--champagne))', padding: '80px 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>Ready to Glow?</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white', fontWeight: 300, marginBottom: 16 }}>Book Your Beauty Experience Today</h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginBottom: 36, lineHeight: 1.7 }}>Whether it is a bridal transformation or a relaxing facial, our expert team is ready to make you feel extraordinary.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/book">
                <button style={{ background: 'white', color: 'var(--rose-gold-dark)', fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '15px 34px', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.3s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'none'}>✦ Book Appointment</button>
              </Link>
              <a href="https://wa.me/923355462214" target="_blank" rel="noreferrer" className="btn-secondary">WhatsApp Us</a>
            </div>
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
    const { getGroupedServices } = await import('../lib/services');
    const groupedServices = await getGroupedServices();
    return { props: { groupedServices } };
  } catch (e) {
    console.error('Home page services load error:', e);
    const empty = {};
    for (const section of SERVICE_SECTIONS) empty[section.id] = [];
    return { props: { groupedServices: empty } };
  }
}
