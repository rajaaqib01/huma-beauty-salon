import Link from 'next/link';

function HomeGalleryCard({ item }) {
  return (
    <div className="service-card">
      <div className="service-card-img-wrap">
        <img
          src={item.img}
          alt={item.title}
          className="service-card-img"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80'; }}
        />
        {item.category === 'before_after' ? (
          <span className="service-card-badge">Before & After</span>
        ) : null}
      </div>
      <div className="service-card-body">
        <div className="service-card-name">{item.title}</div>
        <div className="service-card-footer">
          <Link href="/gallery" className="btn-rose btn-rose-small">
            <span>View</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomeGalleryPreview({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className="home-gallery-section">
      <div className="home-section-inner">
        <div className="home-section-header home-section-header--center">
          <div className="section-label">✦ Our Work</div>
          <h2 className="section-title">Salon <em>Gallery</em></h2>
          <div className="section-divider home-section-divider" />
          <p className="home-section-text">Bridal looks, hair styling, facials & transformations from Huma Beauty Salon.</p>
        </div>

        <div className="services-grid home-gallery-grid">
          {items.map((item) => (
            <HomeGalleryCard key={item.id} item={item} />
          ))}
        </div>

        <div className="home-section-cta">
          <Link href="/gallery" className="btn-rose"><span>View Full Gallery</span></Link>
        </div>
      </div>
    </section>
  );
}
