import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';

function GalleryCard({ item }) {
  return (
    <article className="gallery-page-card">
      <div className="gallery-page-card-img-wrap">
        <img
          src={item.img}
          alt={item.title}
          className="gallery-page-card-img"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80' }}
        />
        <div className="gallery-page-card-overlay">
          <span>{item.title}</span>
        </div>
      </div>
    </article>
  );
}

export default function GalleryPage({ gallery = [] }) {
  return (
    <>
      <SEO
        title="Gallery — Huma Beauty Saloon"
        description="Browse our bridal makeup, hair styling, facials and salon transformations at Huma Beauty Saloon, Jhelum."
        canonical="https://humabeautysaloon.site/gallery"
        ogImage="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80"
      />
      <Navbar />

      <main className="page-main">
        <section className="gallery-page-hero">
          <div className="gallery-page-hero-inner">
            <div className="section-label">✦ Our Work</div>
            <h1 className="gallery-page-hero-title">Salon <em>Gallery</em></h1>
            <p className="gallery-page-hero-text">
              Real transformations from our salon — bridal looks, hair styling, facials, nails and more.
            </p>
            <a
              href="https://www.instagram.com/huma_beauty.saloon/"
              target="_blank"
              rel="noreferrer"
              className="gallery-page-instagram-link"
            >
              Follow @HumaBeauty on Instagram →
            </a>
          </div>
        </section>

        <section className="gallery-page-section">
          <div className="gallery-page-container">
            {gallery.length > 0 ? (
              <div className="gallery-page-grid">
                {gallery.map(item => (
                  <GalleryCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="gallery-page-empty">
                <div className="gallery-page-empty-icon">✦</div>
                <h2>Gallery Coming Soon</h2>
                <p>New salon photos will appear here soon. Follow us on Instagram for the latest work.</p>
                <div className="gallery-page-empty-actions">
                  <a href="https://www.instagram.com/huma_beauty.saloon/" target="_blank" rel="noreferrer" className="btn-rose">
                    <span>Visit Instagram</span>
                  </a>
                  <Link href="/contact" className="btn-outline">Contact Us</Link>
                </div>
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

export async function getServerSideProps({ res }) {
  res.setHeader('Cache-Control', 'no-store, must-revalidate')
  try {
    const { getPublicGallery } = await import('../lib/gallery');
    const gallery = await getPublicGallery();
    return { props: { gallery } };
  } catch (e) {
    console.error('Gallery page load error:', e);
    return { props: { gallery: [] } };
  }
}
