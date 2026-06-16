import { promises as fs } from 'fs'
import path from 'path'
import { isServerless } from './isServerless'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function savePaymentScreenshot(file) {
  if (!file?.data || !file?.filename) {
    throw new Error('Payment screenshot is required')
  }

  if (file.mimeType && !ALLOWED_TYPES.includes(file.mimeType)) {
    throw new Error('Only JPG, PNG, WEBP or GIF images are allowed')
  }

  const base64 = String(file.data).includes(',') ? String(file.data).split(',')[1] : String(file.data)
  const buffer = Buffer.from(base64, 'base64')

  if (!buffer.length) {
    throw new Error('Invalid payment screenshot file')
  }

  if (buffer.length > MAX_BYTES) {
    throw new Error('Image must be smaller than 5MB')
  }

  const mime = file.mimeType || 'image/jpeg'

  if (isServerless()) {
    return `data:${mime};base64,${buffer.toString('base64')}`
  }

  const ext = path.extname(file.filename).toLowerCase() || '.jpg'
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${safeExt}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'admissions')
  await fs.mkdir(uploadDir, { recursive: true })
  await fs.writeFile(path.join(uploadDir, safeName), buffer)
  return `/uploads/admissions/${safeName}`
}
