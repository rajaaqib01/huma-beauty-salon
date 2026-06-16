export const SERVICE_SECTIONS = [
  { id: 'makeup', category: 'Makeup', tabLabel: 'Makeup', label: '✦ Signature Services', title: 'Bridal &', italic: 'Party Makeup', bg: 'var(--cream)' },
  { id: 'hair', category: 'Hair', tabLabel: 'Hair', label: '✦ Hair Studio', title: 'Hair Care &', italic: 'Styling', bg: 'var(--champagne-pale)' },
  { id: 'facials', category: 'Facial', tabLabel: 'Facials', label: '✦ Skincare Studio', title: 'Facials &', italic: 'Skin Treatments', bg: 'var(--cream)' },
  { id: 'nails', category: 'Nails', tabLabel: 'Nails & Self-Care', label: '✦ Nail Lounge', title: 'Nail Art &', italic: 'Lashes', bg: 'var(--champagne-pale)' },
  { id: 'mehndi', category: 'Mehndi', tabLabel: 'Mehndi', label: '✦ Mehndi Studio', title: 'Mehndi &', italic: 'Henna', bg: 'var(--champagne-pale)' },
  { id: 'waxing', category: 'Waxing', tabLabel: 'Waxing', label: '✦ Body Care', title: 'Waxing &', italic: 'Threading', bg: 'var(--cream)' },
]

/** Curated services shown on the home page (full list on /services). */
export const HOME_FEATURED_SERVICES = {
  makeup: ['Bridal Makeup', 'HD Bridal Makeup', 'Party Makeup', 'Engagement Makeup'],
  hair: ['Ladies Hair Cut', 'Highlights', 'Keratin Treatment', 'Blow Dry'],
  facials: ['Basic Facial', 'Gold Facial', 'Hydra Facial', 'Herbal Facial'],
  nails: ['Basic Manicure', 'Gel Manicure', 'Simple Nail Art', 'Bridal Nail Art'],
  mehndi: ['Simple Mehndi', 'Arabic Mehndi', 'Full Hand Mehndi', 'Engagement Mehndi'],
  waxing: ['Upper Lip', 'Full Face Wax', 'Full Body Wax', 'Rica Wax'],
}

export const SERVICE_CATEGORIES = SERVICE_SECTIONS.map(s => s.category)

export function formatPrice(price) {
  const num = parsePriceNumber(price)
  if (!num) return 'Rs. 0'
  return `Rs. ${num.toLocaleString('en-PK')}`
}

export function parsePriceNumber(price) {
  return parseInt(String(price ?? '').replace(/[^\d]/g, ''), 10) || 0
}

export function sortServicesByPrice(services, priceKey = 'price') {
  return [...services].sort(
    (a, b) => parsePriceNumber(a[priceKey]) - parsePriceNumber(b[priceKey])
  )
}

function decodeImageUrl(url) {
  if (!url) return ''
  return String(url).replace(/&amp;/g, '&')
}

export function toDisplayService(service) {
  return {
    id: service.id,
    name: service.title,
    desc: service.description || '',
    price: formatPrice(service.price),
    badge: service.badge || '',
    img: decodeImageUrl(service.image_url),
    category: service.category || '',
    subcategory: service.subcategory || '',
  }
}
