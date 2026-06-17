import Link from 'next/link'

export default function ServicesPageHero() {
  return (
    <section className="services-page-hero page-hero-theme" aria-label="Our services">
      <div className="services-page-hero-inner">
        <div className="services-page-hero-label">✦ What We Offer</div>
        <h1 className="services-page-hero-title">Our <em>Services</em></h1>
        <p className="services-page-hero-text">
          Premium beauty treatments managed and updated by our salon team — book your favourite service today.
        </p>
        <Link href="/book" className="btn-rose services-page-hero-btn">
          <span>Book Appointment</span>
        </Link>
      </div>
    </section>
  )
}
