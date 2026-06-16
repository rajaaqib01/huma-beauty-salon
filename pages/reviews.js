import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import Link from 'next/link';

export default function ReviewsPage({ reviews = [], googleReviewsUrl = '' }) {
  return (
    <>
      <SEO
        title="Client Reviews — Bridal Makeup Jhelum | Huma Beauty Saloon"
        description="Read real client reviews for Huma Beauty Saloon in Jhelum. Bridal makeup, facials, hair styling & beauty services trusted by local clients."
        keywords="Huma Beauty Saloon reviews, bridal makeup Jhelum reviews, beauty salon Jhelum, salon reviews Jhelum"
        canonical="https://humabeautysaloon.site/reviews"
        ogImage="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80"
      />
      <Navbar />
      <main className="page-main">
        <section className="services-page-hero page-hero-theme">
          <div className="services-page-hero-inner">
            <div className="section-label">✦ Testimonials</div>
            <h1 className="services-page-hero-title">Client <em>Reviews</em></h1>
            <p className="services-page-hero-text">Admin-approved reviews from our valued salon clients in Jhelum.</p>
          </div>
        </section>
        <section className="offers-section">
          <div className="offers-container">
            {googleReviewsUrl ? (
              <div className="reviews-google-cta">
                <div>
                  <h2>Review us on Google</h2>
                  <p>Had a great experience? Share your feedback on Google — it helps other brides and clients in Jhelum find us.</p>
                </div>
                <a href={googleReviewsUrl} target="_blank" rel="noreferrer" className="btn-rose">
                  <span>Leave a Google Review</span>
                </a>
              </div>
            ) : null}
            {reviews.length > 0 ? (
              <div className="reviews-public-grid">
                {reviews.map((r) => (
                  <article key={r.id || r.name} className="reviews-public-card">
                    <div className="reviews-public-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                    <p className="reviews-public-text">&ldquo;{r.text}&rdquo;</p>
                    <div className="reviews-public-author">
                      <img src={r.img} alt={r.name} className="reviews-public-avatar" loading="lazy" />
                      <div>
                        <strong>{r.name}</strong>
                        <span>{r.loc}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="offers-empty">
                <h2>Reviews Coming Soon</h2>
                <p>Visit us and share your experience!</p>
                <Link href="/book" className="btn-rose"><span>Book Appointment</span></Link>
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
    const [{ getApprovedReviews }, { getSettings }] = await Promise.all([
      import('../lib/reviews'),
      import('../lib/settings'),
    ]);
    const [reviews, settings] = await Promise.all([
      getApprovedReviews(50),
      getSettings(),
    ]);
    return {
      props: {
        reviews,
        googleReviewsUrl: settings.google_reviews_url || '',
      },
    };
  } catch {
    return { props: { reviews: [], googleReviewsUrl: '' } };
  }
}
