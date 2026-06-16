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
  makeup: ['Engagement Makeup', 'Mehndi Makeup', 'Bridal Makeup', 'Luxury Bridal'],
  hair: ['Ladies Hair Cut', 'Global Hair Color', 'Highlights', 'Keratin Treatment'],
  facials: ['Cleanup Facial', 'Gold Facial', 'Hydra Facial', 'Luxury Facial'],
  nails: ['Classic Manicure', 'Simple Nail Art', 'Gel Nails', 'Bridal Nails'],
  mehndi: ['Simple Hand Mehndi', 'Simple Arabic Mehndi', 'Full Hand Bridal Mehndi', 'Luxury Bridal Mehndi'],
  waxing: ['Upper Lip Wax', 'Full Face Wax', 'Full Body Wax', 'Pre-Bridal Full Body Wax'],
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
