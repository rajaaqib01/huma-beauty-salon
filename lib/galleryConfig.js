export function decodeGalleryUrl(url) {
  if (!url) return ''
  return String(url).replace(/&amp;/g, '&')
}

export function toDisplayGalleryItem(item) {
  return {
    id: item.id,
    title: item.title || 'Salon work',
    img: decodeGalleryUrl(item.image_url),
    category: item.category || 'general',
  }
}
