import { useEffect, useState } from 'react'
import Link from 'next/link'

const ROTATE_MS = 5000
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80'

export default function ServicesPageHero({ images = [] }) {
  const slides = images.length ? images : [FALLBACK_IMAGE]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return undefined
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, ROTATE_MS)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="services-page-hero" aria-label="Our services">
      <div className="services-page-hero-slides" aria-hidden="true">
        {slides.map((image, i) => (
          <div
            key={`${image}-${i}`}
            className={`services-page-hero-slide${i === index ? ' is-active' : ''}`}
            style={{ backgroundImage: `url("${image}")` }}
          />
        ))}
      </div>
      <div className="services-page-hero-overlay" aria-hidden="true" />
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
