import { createAdminCookie, signAdminSession } from '../../../lib/adminSession'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me'
const USE_DEV_FALLBACK = process.env.NODE_ENV !== 'production'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    if (!USE_DEV_FALLBACK) {
      return res.status(500).json({ error: 'Admin credentials are not configured' })
    }
    console.warn('Using development admin fallback credentials because ADMIN_EMAIL / ADMIN_PASSWORD are not set.')
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin credentials' })
  }

  const token = signAdminSession({ email, method: 'local' })
  res.setHeader('Set-Cookie', createAdminCookie(token))
  return res.status(200).json({ user: { email } })
}
