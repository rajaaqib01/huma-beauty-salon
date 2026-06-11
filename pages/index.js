import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import ServiceSection from '../components/ServiceSection';
import InstagramFeed from '../components/InstagramFeed';
import HomeGalleryPreview from '../components/HomeGalleryPreview';
import TikTokFeed from '../components/TikTokFeed';
import { SERVICE_SECTIONS } from '../lib/serviceConfig';

const FALLBACK_TESTIMONIALS = [
  { name: 'Ayesha Khan', loc: 'Jhelum', text: 'I got my bridal makeup done here and it was absolutely stunning! The team understood exactly what I wanted. Highly recommended!', stars: 5, img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
  { name: 'Sana Malik', loc: 'Rawalpindi', text: "Best salon in the area. The keratin treatment transformed my hair completely. I've been coming here for 2 years now.", stars: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { name: 'Fatima Raza', loc: 'Jhelum', text: 'The facials here are divine! My skin has never looked this glowing. The atmosphere is so relaxing and luxurious.', stars: 5, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { name: 'Zara Ahmed', loc: 'Gujrat', text: 'Excellent nail art! The nail artist is so talented and creative. Got exactly the design I wanted for my engagement.', stars: 5, img: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&q=80' },
  { name: 'Hira Baig', loc: 'Jhelum', text: 'Very professional staff, hygienic environment and affordable prices for such premium quality services. My go-to salon!', stars: 5, img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80' },
  { name: 'Nadia Hussain', loc: 'Kharian', text: "The party makeup they did for my sister's wedding was breathtaking. Everyone kept asking who did her makeup!", stars: 5, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80' },
  { name: 'Amna Riaz', loc: 'Lahore', text: 'Friendly staff and immaculate service. My lashes look amazing and last for weeks!', stars: 5, img: 'https://images.unsplash.com/photo-1545996124-1f1f6d9f5a1f?w=100&q=80' },
  { name: 'Zainab Ali', loc: 'Islamabad', text: 'Lovely ambience and true professionals. My bridal mehndi was flawless and lasted beautifully.', stars: 5, img: 'https://images.unsplash.com/photo-1544005313-2f8b3b4b3a2d?w=100&q=80' },
];
export default function Home({ groupedServices = {}, testimonials = FALLBACK_TESTIMONIALS, settings = {}, instagramPosts = [], galleryPreview = [], tiktokPosts = [] }) {
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
              <h1>{settings.hero_title || 'Huma Beauty Saloon'}</h1>
              <p className="hero-subtitle">{settings.hero_subtitle || 'Luxury beauty services crafted for your perfect moment'}</p>
              <p className="hero-text">We deliver bridal makeup, hair styling, facials, nails, and waxing with the same care, hygiene, and premium touch every time.</p>
              <div className="hero-ctas">
                <Link href="/book" className="btn-rose"><span>✦ Book Appointment</span></Link>
                <Link href="/contact" className="btn-outline">Contact Us</Link>
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
              moreHref={`/services#${section.id}`}
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
        <section className="home-reviews-section">
          <div className="home-reviews-inner">
            <div className="home-reviews-header">
              <div className="section-label">✦ Client Love</div>
              <h2 className="section-title">What Our Clients <em>Say</em></h2>
              <div className="section-divider home-reviews-divider" />
              <Link href="/reviews" className="home-reviews-link">All Reviews →</Link>
            </div>
            <div className="reviews-public-grid">
              {testimonials.map((t, i) => (
                <article key={t.id || i} className="reviews-public-card">
                  <div className="reviews-public-stars">{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</div>
                  <p className="reviews-public-text">&ldquo;{t.text}&rdquo;</p>
                  <div className="reviews-public-author">
                    <img src={t.img} alt={t.name} className="reviews-public-avatar" loading="lazy" />
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.loc}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <HomeGalleryPreview items={galleryPreview} />

        {/* INSTAGRAM */}
        <section className="home-instagram-section">
          <div className="home-section-inner">
            <div className="home-section-header home-section-header--center">
              <div className="section-label">✦ Social</div>
              <h2 className="section-title">Follow on <em>Instagram</em></h2>
              <div className="section-divider home-section-divider" />
              <p className="home-section-text">Latest bridal looks, facials & salon highlights — updated daily.</p>
            </div>
            <InstagramFeed
              username={settings.instagram_username || 'huma_beauty.saloon'}
              profileUrl={settings.instagram}
              posts={instagramPosts}
              embedded
            />
          </div>
        </section>

        {/* TIKTOK */}
        <section className="home-tiktok-section">
          <div className="home-section-inner">
            <div className="home-section-header home-section-header--center">
              <div className="section-label">✦ Social</div>
              <h2 className="section-title">Watch on <em>TikTok</em></h2>
              <div className="section-divider home-section-divider" />
              <p className="home-section-text">Transformation videos, makeup tips & salon highlights on TikTok.</p>
            </div>
            <TikTokFeed
              username="humabeautysaloonjhe"
              profileUrl="https://www.tiktok.com/@humabeautysaloonjhe"
              posts={tiktokPosts}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="home-cta-section">
          <div className="home-cta-inner">
            <div className="home-cta-script">Ready to Glow?</div>
            <h2 className="home-cta-title">Book Your Beauty Experience Today</h2>
            <p className="home-cta-text">Whether it is a bridal transformation or a relaxing facial, our expert team is ready to make you feel extraordinary.</p>
            <div className="home-cta-actions">
              <Link href="/book" className="btn-rose" style={{ background: 'white', color: 'var(--rose-gold-dark)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <span>✦ Book Appointment</span>
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
  const empty = {};
  for (const section of SERVICE_SECTIONS) empty[section.id] = [];

  try {
    const [{ getHomeGroupedServices }, { getApprovedReviews }, { getSettings }, { getInstagramFeedPosts }, { getPublicGallery }] = await Promise.all([
      import('../lib/services'),
      import('../lib/reviews'),
      import('../lib/settings'),
      import('../lib/instagram'),
      import('../lib/gallery'),
    ]);

    const [groupedServices, approvedReviews, settings, instagramPosts, gallery] = await Promise.all([
      getHomeGroupedServices(),
      getApprovedReviews(8),
      getSettings(),
      getInstagramFeedPosts(6),
      getPublicGallery(),
    ]);

    const tiktokProfile = 'https://www.tiktok.com/@humabeautysaloonjhe';
    const tiktokPosts = gallery.slice(0, 6).map((item) => ({
      image_url: item.img,
      url: tiktokProfile,
      title: item.title,
    }));

    return {
      props: {
        groupedServices,
        testimonials: approvedReviews.length > 0 ? approvedReviews : FALLBACK_TESTIMONIALS,
        settings,
        instagramPosts,
        galleryPreview: gallery.slice(0, 6),
        tiktokPosts,
      },
    };
  } catch (e) {
    console.error('Home page load error:', e);
    return { props: { groupedServices: empty, testimonials: FALLBACK_TESTIMONIALS, settings: {}, instagramPosts: [], galleryPreview: [], tiktokPosts: [] } };
  }
}
