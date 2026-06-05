import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import ServiceSection from '../components/ServiceSection';
import { SERVICE_SECTIONS } from '../lib/serviceConfig';

export default function ServicesPage({ groupedServices = {} }) {
  const hasServices = SERVICE_SECTIONS.some(section => groupedServices[section.id]?.length > 0);

  return (
    <>
      <SEO
        title="Our Services — Huma Beauty Saloon"
        description="Explore bridal makeup, hair styling, facials, nails, mehndi and waxing services at Huma Beauty Saloon, Jhelum."
        canonical="https://humabeautysaloon.site/services"
        ogImage="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80"
      />
      <Navbar />

      <main className="page-main">
        <section className="services-page-hero">
          <div className="services-page-hero-inner">
            <div className="section-label">✦ What We Offer</div>
            <h1 className="services-page-hero-title">Our <em>Services</em></h1>
            <p className="services-page-hero-text">
              Premium beauty treatments managed and updated by our salon team — book your favourite service today.
            </p>
            <Link href="/book"><button className="btn-rose"><span>Book Appointment</span></button></Link>
          </div>
        </section>

        {hasServices ? (
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
        ) : (
          <section className="services-page-empty-wrap">
            <div className="services-page-empty">
              <div className="services-page-empty-icon">✦</div>
              <h2>Services Coming Soon</h2>
              <p>Our service list is being updated. Please contact us or book a consultation.</p>
              <div className="services-page-empty-actions">
                <Link href="/contact"><button className="btn-rose"><span>Contact Us</span></button></Link>
                <Link href="/book"><button className="btn-outline">Book Appointment</button></Link>
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
    const { getGroupedServices } = await import('../lib/services');
    const groupedServices = await getGroupedServices();
    return { props: { groupedServices } };
  } catch (e) {
    console.error('Services page load error:', e);
    const empty = {};
    for (const section of SERVICE_SECTIONS) empty[section.id] = [];
    return { props: { groupedServices: empty } };
  }
}
