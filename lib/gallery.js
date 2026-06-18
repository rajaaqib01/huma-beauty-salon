import { list as localList } from './localDb'
import { toDisplayGalleryItem } from './galleryConfig'

export { toDisplayGalleryItem } from './galleryConfig'

export async function fetchGallery() {
  const items = await localList('gallery')
  return items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
}

export async function getPublicGallery() {
  const raw = await fetchGallery()
  return raw.map(toDisplayGalleryItem)
}
