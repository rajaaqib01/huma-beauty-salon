import { promises as fs } from 'fs'
import path from 'path'
import { isServerless } from './isServerless'

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

/** Fields that must not be HTML-escaped when saving admin records. */
export const ADMIN_URL_FIELDS = new Set([
  'image_url',
  'logo_url',
  'payment_screenshot',
])

export function isLocalServiceUpload(url) {
  return typeof url === 'string' && url.startsWith('/uploads/services/')
}

export function isPersistedImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  return (
    trimmed.startsWith('data:image/')
    || trimmed.startsWith('http://')
    || trimmed.startsWith('https://')
    || isLocalServiceUpload(trimmed)
  )
}

/**
 * Keep uploaded service images inside JSON on serverless so live site can render
 * them without relying on ephemeral filesystem uploads.
 */
export async function normalizeServiceImageUrl(imageUrl) {
  const trimmed = String(imageUrl || '').trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  if (!isLocalServiceUpload(trimmed)) {
    return trimmed
  }

  if (!isServerless()) {
    return trimmed
  }

  try {
    const filePath = path.join(process.cwd(), 'public', trimmed)
    const buffer = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const mime = MIME_BY_EXT[ext] || 'image/jpeg'
    return `data:${mime};base64,${buffer.toString('base64')}`
  } catch {
    return trimmed
  }
}
