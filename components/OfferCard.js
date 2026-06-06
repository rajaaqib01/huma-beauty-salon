import { useRouter } from 'next/router'
import Link from 'next/link'

export default function OfferCard({ offer }) {
  const router = useRouter()

  const handleBookNow = () => {
    router.push({
      pathname: '/book',
      query: {
        offer: offer.title,
        offerId: offer.id,
        service: offer.serviceTitle,
        price: offer.salePrice || offer.originalPrice,
        discount: offer.discountValue ? String(offer.discountValue) : '',
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

        <div className="offer-card-service-badge">
          <span className="offer-card-service-label">Service</span>
          <strong>{offer.serviceTitle}</strong>
        </div>

        {(offer.originalPrice || offer.salePrice) && (
          <div className="offer-card-pricing">
            {offer.originalPrice && offer.salePrice && offer.originalPrice !== offer.salePrice ? (
              <>
                <span className="offer-card-price-old">{offer.originalPrice}</span>
                <span className="offer-card-price-new">{offer.salePrice}</span>
              </>
            ) : (
              <span className="offer-card-price-new">{offer.salePrice || offer.originalPrice}</span>
            )}
          </div>
        )}

        <p className="offer-card-dates">{offer.dates}</p>

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
