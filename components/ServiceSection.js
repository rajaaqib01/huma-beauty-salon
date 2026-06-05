import ServiceCard from './ServiceCard';

export default function ServiceSection({ id, label, title, italic, services, bg }) {
  if (!services?.length) return null;

  return (
    <section id={id} style={{ background: bg, padding: '96px 5%' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="section-label">{label}</div>
        <h2 className="section-title">{title} <em>{italic}</em></h2>
        <div className="section-divider" />
        <div className="services-grid">
          {services.map(s => (
            <ServiceCard key={s.id || s.name} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
