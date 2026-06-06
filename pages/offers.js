import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import OfferCard from '../components/OfferCard';
import Link from 'next/link';

export default function OffersPage({ offers = [], bookingServices = [] }) {
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
              Select your service, click Book Now, fill the booking form, and your request will go straight to our admin bookings page.
            </p>
          </div>
        </section>

        <section className="offers-section">
          <div className="offers-container">
            {offers.length > 0 ? (
              <div className="offers-grid">
                {offers.map(offer => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    bookingServices={bookingServices}
                  />
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
    const { getBookingServices } = await import('../lib/services');
    const [offers, bookingServices] = await Promise.all([
      getPublicOffers(),
      getBookingServices(),
    ]);
    return { props: { offers, bookingServices } };
  } catch (e) {
    console.error('Offers page load error:', e);
    return { props: { offers: [], bookingServices: [] } };
  }
}
