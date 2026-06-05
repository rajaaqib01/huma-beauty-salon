import { promises as fs } from 'fs'
import path from 'path'
import { requireAdmin } from '../../../lib/adminSession'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { data, filename, mimeType } = req.body || {}
    if (!data || !filename) {
      return res.status(400).json({ error: 'Image file is required' })
    }

    if (mimeType && !ALLOWED_TYPES.includes(mimeType)) {
      return res.status(400).json({ error: 'Only JPG, PNG, WEBP or GIF images are allowed' })
    }

    const base64 = String(data).includes(',') ? String(data).split(',')[1] : String(data)
    const buffer = Buffer.from(base64, 'base64')

    if (buffer.length > MAX_BYTES) {
      return res.status(400).json({ error: 'Image must be smaller than 5MB' })
    }

    const ext = path.extname(filename).toLowerCase() || '.jpg'
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${safeExt}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
    await fs.mkdir(uploadDir, { recursive: true })
    await fs.writeFile(path.join(uploadDir, safeName), buffer)

    return res.status(201).json({ url: `/uploads/gallery/${safeName}` })
  } catch (e) {
    console.error('Gallery upload error:', e)
    return res.status(500).json({ error: 'Failed to upload image' })
  }
}

export default requireAdmin(handler)
