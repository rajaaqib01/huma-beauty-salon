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

function parseAmount(value) {
  const num = parseInt(String(value || '').replace(/[^\d]/g, ''), 10)
  return Number.isFinite(num) ? num : 0
}

export function formatOfferPrice(amount) {
  if (!amount) return ''
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

function findMatchingServicePrice(offer, services = []) {
  if (offer.service_title) {
    const linked = services.find(s => String(s.title).toLowerCase() === String(offer.service_title).toLowerCase())
    if (linked) return parseAmount(linked.price)
  }

  const offerTitle = String(offer.title || '').toLowerCase()
  let bestMatch = null
  let bestLength = 0

  for (const service of services) {
    const serviceTitle = String(service.title || '').toLowerCase()
    if (!serviceTitle) continue
    if (offerTitle.includes(serviceTitle) && serviceTitle.length > bestLength) {
      bestMatch = service
      bestLength = serviceTitle.length
    }
  }

  return bestMatch ? parseAmount(bestMatch.price) : 0
}

export function getOfferPrices(offer, services = []) {
  const linkedOriginal = parseAmount(offer.original_price ?? offer.price)
  const original = linkedOriginal || findMatchingServicePrice(offer, services)
  const discount = parseFloat(String(offer.discount || '').replace(/[^\d.]/g, '')) || 0
  const sale = original && discount
    ? Math.max(0, Math.round(original - (original * discount / 100)))
    : original
  return { original, sale, discount }
}

export function toDisplayOffer(offer, services = []) {
  const linkedName = String(offer.service_title || '').trim()
  const linkedService = services.find(
    s => String(s.title).toLowerCase() === linkedName.toLowerCase()
  )
  const { original, sale, discount } = getOfferPrices(offer, services)

  return {
    id: offer.id,
    title: offer.title || '',
    description: offer.description || '',
    serviceTitle: linkedName,
    hasValidService: Boolean(linkedName && linkedService),
    linkedServicePrice: linkedService ? formatOfferPrice(parseAmount(linkedService.price)) : '',
    discount: discount ? `${discount}% OFF` : 'Special Offer',
    discountValue: discount,
    originalPrice: formatOfferPrice(original),
    salePrice: formatOfferPrice(sale),
    originalAmount: original,
    saleAmount: sale,
    img: decodeImageUrl(offer.image_url) || 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80',
    dates: formatOfferDates(offer.starts_at, offer.ends_at),
    active: isOfferActive(offer),
  }
}

export function isPublicOffer(offer) {
  return Boolean(offer.serviceTitle?.trim() && offer.hasValidService && offer.active)
}
