import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import Link from 'next/link';

export default function ReviewsPage({ reviews = [] }) {
  return (
    <>
      <SEO title="Client Reviews — Huma Beauty Saloon" description="Read what our clients say about Huma Beauty Saloon in Jhelum." canonical="https://humabeautysaloon.site/reviews" />
      <Navbar />
      <main className="page-main">
        <section className="services-page-hero">
          <div className="services-page-hero-inner">
            <div className="section-label">✦ Testimonials</div>
            <h1 className="services-page-hero-title">Client <em>Reviews</em></h1>
            <p className="services-page-hero-text">Real feedback from our valued salon clients.</p>
          </div>
        </section>
        <section className="offers-section">
          <div className="offers-container">
            {reviews.length > 0 ? (
              <div className="reviews-public-grid">
                {reviews.map((r, i) => (
                  <article key={i} className="reviews-public-card">
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
    const { getApprovedReviews } = await import('../lib/reviews');
    const reviews = await getApprovedReviews(50);
    return { props: { reviews } };
  } catch {
    return { props: { reviews: [] } };
  }
}
