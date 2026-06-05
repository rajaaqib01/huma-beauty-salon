export const SERVICE_SECTIONS = [
  { id: 'makeup', category: 'Makeup', label: '✦ Signature Services', title: 'Bridal &', italic: 'Party Makeup', bg: 'var(--cream)' },
  { id: 'hair', category: 'Hair', label: '✦ Hair Studio', title: 'Hair Care &', italic: 'Styling', bg: 'var(--champagne-pale)' },
  { id: 'facials', category: 'Facial', label: '✦ Skincare Studio', title: 'Facials &', italic: 'Skin Treatments', bg: 'var(--cream)' },
  { id: 'nails', category: 'Nails', label: '✦ Nail Lounge', title: 'Nail Art &', italic: 'Lashes', bg: 'var(--blush)' },
  { id: 'mehndi', category: 'Mehndi', label: '✦ Mehndi Studio', title: 'Mehndi &', italic: 'Henna', bg: 'var(--champagne-pale)' },
  { id: 'waxing', category: 'Waxing', label: '✦ Body Care', title: 'Waxing &', italic: 'Threading', bg: 'var(--cream)' },
]

/** Curated services shown on the home page (full list on /services). */
export const HOME_FEATURED_SERVICES = {
  makeup: ['Engagement Makeup', 'Mehndi Makeup', 'Bridal Makeup', 'Luxury Bridal'],
  hair: ['Hair Cut', 'Hair Color', 'Highlights', 'Keratin Treatment'],
  facials: ['Cleanup Facial', 'Gold Facial', 'Hydra Facial', 'Luxury Glow Facial'],
  nails: ['Simple Nail Paint', 'French Nail Art', 'Glitter Nail Art', 'Luxury Nail Art'],
  mehndi: ['Simple Mehndi Design', 'Front Hand Mehndi', 'Customized Mehndi Design', 'Bridal Mehndi'],
  waxing: ['Upper Lips', 'Eyebrows', 'Legs Wax', 'Full Body Wax', 'Manicure', 'Pedicure'],
}

export const SERVICE_CATEGORIES = SERVICE_SECTIONS.map(s => s.category)

export function formatPrice(price) {
  const num = parseInt(String(price).replace(/[^\d]/g, ''), 10)
  if (!num) return 'Rs. 0'
  return `Rs. ${num.toLocaleString('en-PK')}`
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
  }
}
