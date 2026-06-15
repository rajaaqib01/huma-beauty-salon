import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import Link from 'next/link';

export default function TeamPage({ staff = [] }) {
  return (
    <>
      <SEO title="Our Team — Huma Beauty Saloon" description="Meet our stylists and beauty experts at Huma Beauty Saloon, Jhelum." canonical="https://humabeautysaloon.site/team" />
      <Navbar />
      <main className="page-main">
        <section className="services-page-hero page-hero-theme">
          <div className="services-page-hero-inner">
            <div className="section-label">✦ Our Experts</div>
            <h1 className="services-page-hero-title">Meet Our <em>Team</em></h1>
            <p className="services-page-hero-text">Choose your preferred stylist when booking your appointment.</p>
          </div>
        </section>
        <section className="offers-section">
          <div className="offers-container">
            <div className="services-grid team-page-grid">
              {staff.map(member => (
                <article key={member.id} className="service-card">
                  <div className="service-card-img-wrap">
                    <img src={member.img} alt={member.name} className="service-card-img" loading="lazy" />
                    <span className="service-card-badge">{member.role}</span>
                  </div>
                  <div className="service-card-body">
                    <div className="service-card-name">{member.name}</div>
                    <div className="service-card-desc">{member.bio}</div>
                    <div className="service-card-price">{member.specialty}</div>
                    <div className="service-card-footer">
                      <Link href={`/book?staff=${encodeURIComponent(member.name)}`} className="btn-rose btn-rose-small"><span>Book with {member.name.split(' ')[0]}</span></Link>
                    </div>
                  </div>
                </article>
              ))}
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
    const { getPublicStaff } = await import('../lib/staff');
    return { props: { staff: await getPublicStaff() } };
  } catch {
    return { props: { staff: [] } };
  }
}
