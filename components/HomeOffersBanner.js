import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import OfferCard from './OfferCard'

const ROTATE_MS = 4500

function useVisibleCount() {
  const [count, setCount] = useState(4)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 520) setCount(1)
      else if (w < 768) setCount(2)
      else if (w < 1024) setCount(3)
      else setCount(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return count
}

export default function HomeOffersBanner({ offers = [] }) {
  const visibleCount = useVisibleCount()
  const viewportRef = useRef(null)
  const [slideWidth, setSlideWidth] = useState(0)
  const [offset, setOffset] = useState(0)

  const maxOffset = Math.max(0, offers.length - visibleCount)
  const canSlide = offers.length > visibleCount

  useEffect(() => {
    setOffset((prev) => Math.min(prev, maxOffset))
  }, [maxOffset])

  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current) return
      setSlideWidth(viewportRef.current.clientWidth / visibleCount)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [visibleCount, offers.length])

  useEffect(() => {
    if (!canSlide) return undefined
    const timer = setInterval(() => {
      setOffset((prev) => (prev >= maxOffset ? 0 : prev + 1))
    }, ROTATE_MS)
    return () => clearInterval(timer)
  }, [canSlide, maxOffset])

  if (!offers.length) return null

  return (
    <section className="home-offers-banner" aria-label="Current salon offers">
      <div className="home-offers-banner-wrap">
        <div className="home-offers-banner-header">
          <div>
            <div className="section-label">✦ Special Offers</div>
            <h2 className="home-offers-banner-heading">Today&apos;s <em>Deals</em></h2>
          </div>
          <Link href="/offers" className="home-offers-banner-all-link">View all offers →</Link>
        </div>

        <div className="home-offers-carousel" ref={viewportRef}>
          <div
            className="home-offers-track"
            style={{
              transform: slideWidth ? `translateX(-${offset * slideWidth}px)` : undefined,
            }}
          >
            {offers.map((offer) => (
              <div key={offer.id} className="home-offers-slide">
                <OfferCard offer={offer} />
              </div>
            ))}
          </div>
        </div>

        {canSlide ? (
          <div className="home-offers-banner-dots" role="tablist" aria-label="Offer carousel">
            {Array.from({ length: maxOffset + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === offset}
                aria-label={`Show offer slide ${i + 1}`}
                className={`home-offers-banner-dot${i === offset ? ' is-active' : ''}`}
                onClick={() => setOffset(i)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
