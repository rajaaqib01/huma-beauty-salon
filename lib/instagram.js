import { promises as fs } from 'fs'
import path from 'path'
import { getSettings } from './settings'
import { list as localList } from './localDb'

const postsFile = path.join(process.cwd(), 'data', 'instagram_posts.json')

const FALLBACK_IMAGES = [
  'https://i.pinimg.com/736x/c6/86/80/c6868022cdca01bb5fa833fb88d9a7d2.jpg',
  'https://i.pinimg.com/1200x/af/88/07/af88072fa63f949a9669269726f9b408.jpg?w=500&q=80',
  'https://i.pinimg.com/736x/19/89/8b/19898bfd41b6ecfa10e087f59a01881a.jpg?w=500&q=80',
  'https://i.pinimg.com/736x/2c/a0/25/2ca0258ddeef532121c97c579a897541.jpg?w=500&q=80',
  'https://i.pinimg.com/736x/07/39/5c/07395cba511b8dcfe1b993b645c07e1b.jpg?w=500&q=80',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80',
]

async function readLocalPosts() {
  try {
    const raw = await fs.readFile(postsFile, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parsePostUrls(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  return String(value)
    .split(/[\n,]+/)
    .map(s => s.trim())
    .filter(Boolean)
}

async function fetchOembedPost(postUrl) {
  try {
    const endpoint = `https://api.instagram.com/oembed?url=${encodeURIComponent(postUrl)}&omitscript=true`
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const data = await res.json()
    if (!data?.thumbnail_url) return null
    return {
      url: postUrl,
      image_url: data.thumbnail_url,
      title: data.title || '',
    }
  } catch {
    return null
  }
}

async function postsFromGallery(profileUrl, limit) {
  try {
    const gallery = await localList('gallery')
    const items = gallery
      .filter(g => g.image_url)
      .slice(0, limit)
      .map(g => ({
        url: profileUrl,
        image_url: g.image_url,
        title: g.title || 'Salon work',
      }))
    if (items.length >= 3) return items
  } catch {
    /* ignore */
  }

  return FALLBACK_IMAGES.slice(0, limit).map((image_url, i) => ({
    url: profileUrl,
    image_url,
    title: `Salon highlight ${i + 1}`,
  }))
}

/**
 * Load Instagram grid posts: local JSON → oEmbed from settings URLs → gallery fallback.
 */
export async function getInstagramFeedPosts(limit = 6) {
  const settings = await getSettings()
  const profileUrl = settings.instagram || 'https://www.instagram.com/huma_beauty.saloon/'
  const localPosts = await readLocalPosts()
  const configuredUrls = parsePostUrls(settings.instagram_post_urls)

  const withImages = localPosts.filter(p => p.image_url).slice(0, limit)
  if (withImages.length >= 3) {
    return withImages.map(p => ({
      url: p.url || profileUrl,
      image_url: p.image_url,
      title: p.title || 'Instagram post',
    }))
  }

  if (configuredUrls.length > 0) {
    const fetched = await Promise.all(configuredUrls.slice(0, limit).map(fetchOembedPost))
    const valid = fetched.filter(Boolean)
    if (valid.length >= 3) return valid.slice(0, limit)
  }

  return postsFromGallery(profileUrl, limit)
}
