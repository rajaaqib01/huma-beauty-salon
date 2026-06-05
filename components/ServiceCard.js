import Link from 'next/link';

export default function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <div className="service-card-img-wrap">
        <img src={service.img} alt={service.name} className="service-card-img" loading="lazy" />
        {service.badge && <span className="service-card-badge">{service.badge}</span>}
      </div>
      <div className="service-card-body">
        <div className="service-card-name">{service.name}</div>
        <div className="service-card-desc">{service.desc}</div>
        <div className="service-card-price">{service.price}</div>
        <div className="service-card-footer">
          <Link href={`/book?service=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}`} className="btn-rose btn-rose-small">
            <span>Book Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
