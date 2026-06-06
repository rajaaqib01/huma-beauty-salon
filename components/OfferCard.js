import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { formatOfferPrice } from '../lib/offerConfig'

function parseAmount(value) {
  const num = parseInt(String(value || '').replace(/[^\d]/g, ''), 10)
  return Number.isFinite(num) ? num : 0
}

function getOfferPriceForService(offer, serviceName, bookingServices) {
  const discount = offer.discountValue || 0
  const svc = bookingServices.find(s => s.name === serviceName)
  const svcOriginal = svc ? parseAmount(svc.price) : 0

  const linkedService = offer.serviceTitle || ''
  if (linkedService && serviceName === linkedService && offer.originalAmount) {
    return {
      original: offer.originalPrice,
      sale: offer.salePrice,
    }
  }

  const original = svcOriginal || offer.originalAmount || 0
  const sale = discount && original
    ? Math.max(0, Math.round(original - (original * discount / 100)))
    : original

  return {
    original: formatOfferPrice(original),
    sale: formatOfferPrice(sale),
  }
}

export default function OfferCard({ offer, bookingServices = [] }) {
  const router = useRouter()
  const defaultService = useMemo(() => {
    if (offer.serviceTitle && bookingServices.some(s => s.name === offer.serviceTitle)) {
      return offer.serviceTitle
    }
    const match = bookingServices.find(s =>
      String(offer.title || '').toLowerCase().includes(String(s.name).toLowerCase())
    )
    return match?.name || bookingServices[0]?.name || ''
  }, [offer, bookingServices])

  const [selectedService, setSelectedService] = useState(defaultService)
  const [error, setError] = useState('')

  const prices = useMemo(
    () => getOfferPriceForService(offer, selectedService, bookingServices),
    [offer, selectedService, bookingServices]
  )

  const handleBookNow = () => {
    if (!selectedService) {
      setError('Please select a service first.')
      return
    }

    setError('')
    router.push({
      pathname: '/book',
      query: {
        offer: offer.title,
        offerId: offer.id,
        service: selectedService,
        price: prices.sale || prices.original,
        discount: offer.discountValue ? `${offer.discountValue}%` : '',
      },
    })
  }

  return (
    <article className="offer-card">
      <div className="offer-card-img-wrap">
        <img src={offer.img} alt={offer.title} className="offer-card-img" loading="lazy" />
        <span className="offer-card-discount">{offer.discount}</span>
      </div>
      <div className="offer-card-body">
        <h3 className="offer-card-title">{offer.title}</h3>
        <p className="offer-card-desc">{offer.description}</p>

        {(prices.original || prices.sale) && (
          <div className="offer-card-pricing">
            {prices.original && prices.sale && prices.original !== prices.sale ? (
              <>
                <span className="offer-card-price-old">{prices.original}</span>
                <span className="offer-card-price-new">{prices.sale}</span>
              </>
            ) : (
              <span className="offer-card-price-new">{prices.sale || prices.original}</span>
            )}
          </div>
        )}

        <p className="offer-card-dates">{offer.dates}</p>

        <div className="offer-card-service-select">
          <label htmlFor={`offer-service-${offer.id}`} className="offer-card-service-label">
            Select Service *
          </label>
          <select
            id={`offer-service-${offer.id}`}
            className="offer-card-service-input"
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value)
              setError('')
            }}
          >
            <option value="">Choose a service</option>
            {bookingServices.map(({ name, price }) => (
              <option key={name} value={name}>
                {name} — {price}
              </option>
            ))}
          </select>
        </div>

        {error ? <p className="offer-card-error">{error}</p> : null}

        <div className="offer-card-actions">
          <button type="button" onClick={handleBookNow} className="btn-rose btn-rose-small">
            <span>Book Now</span>
          </button>
          <Link href="/contact" className="offer-card-link">Contact Us →</Link>
        </div>
      </div>
    </article>
  )
}
