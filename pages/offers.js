import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';

function OfferCard({ offer }) {
  const bookHref = {
    pathname: '/book',
    query: {
      offer: offer.title,
      service: offer.title,
      price: offer.salePrice || offer.originalPrice,
      discount: offer.discountValue ? `${offer.discountValue}%` : '',
    },
  }

  return (
    <article className="offer-card">
      <div className="offer-card-img-wrap">
        <img src={offer.img} alt={offer.title} className="offer-card-img" loading="lazy" />
        <span className="offer-card-discount">{offer.discount}</span>
      </div>
      <div className="offer-card-body">
        <h3 className="offer-card-title">{offer.title}</h3>
        <p className="offer-card-desc">{offer.description}</p>
        {(offer.originalPrice || offer.salePrice) ? (
          <div className="offer-card-pricing">
            {offer.originalPrice && offer.salePrice && offer.originalPrice !== offer.salePrice ? (
              <>
                <span className="offer-card-price-old">{offer.originalPrice}</span>
                <span className="offer-card-price-new">{offer.salePrice}</span>
              </>
            ) : (
              <span className="offer-card-price-new">{offer.salePrice || offer.originalPrice}</span>
            )}
          </div>
        ) : offer.discountValue ? (
          <div className="offer-card-pricing">
            <span className="offer-card-price-new">{offer.discount}</span>
          </div>
        ) : null}
        <p className="offer-card-dates">{offer.dates}</p>
        <div className="offer-card-actions">
          <Link href={bookHref} className="btn-rose btn-rose-small">
            <span>Book Now</span>
          </Link>
          <Link href="/contact" className="offer-card-link">Contact Us →</Link>
        </div>
      </div>
    </article>
  );
}

export default function OffersPage({ offers = [] }) {
  return (
    <>
      <SEO
        title="Special Offers — Huma Beauty Saloon"
        description="Exclusive beauty salon offers and discounts at Huma Beauty Saloon, Jhelum."
        canonical="https://humabeautysaloon.site/offers"
        ogImage="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&q=80"
      />
      <Navbar />

      <main className="page-main">
        <section className="offers-hero">
          <div className="offers-hero-inner">
            <div className="section-label">✦ Exclusive Deals</div>
            <h1 className="offers-hero-title">Special <em>Offers</em></h1>
            <p className="offers-hero-text">
              Grab our latest salon promotions on bridal makeup, hair care, facials, and more.
            </p>
          </div>
        </section>

        <section className="offers-section">
          <div className="offers-container">
            {offers.length > 0 ? (
              <div className="offers-grid">
                {offers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="offers-empty">
                <div className="offers-empty-icon">✦</div>
                <h2>No Active Offers Right Now</h2>
                <p>Check back soon for new promotions, or contact us for the latest salon deals.</p>
                <div className="offers-empty-actions">
                  <Link href="/contact" className="btn-rose"><span>Contact Us</span></Link>
                  <Link href="/book" className="btn-outline">Book Appointment</Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {offers.length > 0 && (
          <section className="offers-cta">
            <div className="offers-cta-inner">
              <h2>Questions about an offer?</h2>
              <p>WhatsApp us or visit the salon — our team will help you choose the best deal.</p>
              <div className="offers-cta-actions">
                <a href="https://wa.me/923355462214" target="_blank" rel="noreferrer" className="btn-secondary">WhatsApp Us</a>
                <Link href="/contact" className="btn-outline">Contact Page</Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const { getPublicOffers } = await import('../lib/offers');
    const offers = await getPublicOffers();
    return { props: { offers } };
  } catch (e) {
    console.error('Offers page load error:', e);
    return { props: { offers: [] } };
  }
}
