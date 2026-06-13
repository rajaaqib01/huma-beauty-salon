import { useRouter } from 'next/router'

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

  const hasDiscount = offer.originalPrice && offer.salePrice && offer.originalPrice !== offer.salePrice

  return (
    <div className="service-card">
      <div className="service-card-img-wrap">
        <img src={offer.img} alt={offer.serviceTitle} className="service-card-img" loading="lazy" />
        {offer.discount ? <span className="offer-discount-badge">{offer.discount}</span> : null}
      </div>
      <div className="service-card-body">
        <div className="service-card-name">{offer.serviceTitle}</div>
        <div className="service-card-desc">{offer.description}</div>
        {(offer.originalPrice || offer.salePrice) ? (
          <div className="service-card-price">
            {hasDiscount ? (
              <>
                <span className="service-card-price-old">{offer.originalPrice}</span>
                {offer.salePrice}
              </>
            ) : (
              offer.salePrice || offer.originalPrice
            )}
          </div>
        ) : null}
        {offer.dates ? (
          <div className="service-card-dates">
            <span className="service-card-dates-label">Valid</span>
            {offer.dates}
          </div>
        ) : null}
        <div className="service-card-footer">
          <button type="button" onClick={handleBookNow} className="btn-rose btn-rose-small">
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  )
}
