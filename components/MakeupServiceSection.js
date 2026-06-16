import Link from 'next/link';
import ServiceCard from './ServiceCard';

export default function MakeupServiceSection({ id, label, title, italic, groupedServices = [], bg, moreHref }) {
  const groupsWithServices = groupedServices.filter((group) => group.services?.length > 0);
  if (!groupsWithServices.length) return null;

  return (
    <section id={id} className="service-section" style={{ background: bg }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="section-label">{label}</div>
        <h2 className="section-title">{title} <em>{italic}</em></h2>
        <div className="section-divider" />
        {groupsWithServices.map((group) => (
          <div key={group.id} className="makeup-category-group">
            <h3 className="makeup-category-title">
              <span className="makeup-category-title-mark" aria-hidden="true">✦</span>
              <span className="makeup-category-title-text">{group.name}</span>
            </h3>
            <div className="services-grid">
              {group.services.map((service) => (
                <ServiceCard key={service.id || service.name} service={service} />
              ))}
            </div>
          </div>
        ))}
        {moreHref ? (
          <div className="service-section-more">
            <Link href={moreHref} className="service-section-more-link">More Services →</Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
