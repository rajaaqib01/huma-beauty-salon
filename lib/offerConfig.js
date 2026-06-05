function decodeImageUrl(url) {
  if (!url) return ''
  return String(url).replace(/&amp;/g, '&')
}

export function formatOfferDates(startsAt, endsAt) {
  const fmt = (d) => {
    if (!d) return null
    const date = new Date(d)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const start = fmt(startsAt)
  const end = fmt(endsAt)
  if (start && end) return `${start} – ${end}`
  if (end) return `Valid until ${end}`
  if (start) return `Starts ${start}`
  return 'Limited time offer'
}

export function isOfferActive(offer, now = new Date()) {
  const start = offer.starts_at ? new Date(offer.starts_at) : null
  const end = offer.ends_at ? new Date(offer.ends_at) : null
  if (start && !Number.isNaN(start.getTime()) && now < start) return false
  if (end && !Number.isNaN(end.getTime())) {
    const endOfDay = new Date(end)
    endOfDay.setHours(23, 59, 59, 999)
    if (now > endOfDay) return false
  }
  return true
}

export function toDisplayOffer(offer) {
  const discount = String(offer.discount || '').replace(/[^\d.]/g, '')
  return {
    id: offer.id,
    title: offer.title || '',
    description: offer.description || '',
    discount: discount ? `${discount}% OFF` : 'Special Offer',
    discountValue: discount,
    img: decodeImageUrl(offer.image_url) || 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80',
    dates: formatOfferDates(offer.starts_at, offer.ends_at),
    active: isOfferActive(offer),
  }
}
