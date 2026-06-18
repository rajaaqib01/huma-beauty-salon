import { list as localList } from './localDb'
import { supabaseRead } from './supabaseRuntime'
import { toDisplayGalleryItem } from './galleryConfig'

export { toDisplayGalleryItem } from './galleryConfig'

export async function fetchGallery() {
  const items = await supabaseRead(
    'gallery',
    (db) => db.from('gallery').select('*').order('created_at', { ascending: false }),
    () => localList('gallery'),
  )
  return items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
}

export async function getPublicGallery() {
  const raw = await fetchGallery()
  return raw.map(toDisplayGalleryItem)
}
