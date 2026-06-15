import { createAdminCookie, signAdminSession } from '../../../lib/adminSession'
import { rateLimit } from '../../../lib/apiUtils/rateLimit'
import { findAdminUser, getAdminAuthStatus } from '../../../lib/adminUsers'

const USE_DEV_FALLBACK = process.env.NODE_ENV !== 'production'

async function loginHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  let user = await findAdminUser(email, password)

  if (!user && USE_DEV_FALLBACK && email === 'admin@example.com' && password === 'change-me') {
    user = { email: 'admin@example.com', role: 'owner', name: 'Admin' }
  }

  if (!user) {
    const status = getAdminAuthStatus()
    const envMissing = !status.envEmailConfigured || !status.envPasswordConfigured
    return res.status(401).json({
      error: 'Invalid admin credentials',
      hint: envMissing
        ? 'Server par ADMIN_EMAIL / ADMIN_PASSWORD set nahi. Netlify → Environment variables add karo, phir Redeploy.'
        : 'Email ya password galat hai. Netlify par password mein extra quotes mat lagao — sirf humaaqib@@8217@@ likho.',
      status: process.env.NODE_ENV === 'production' ? status : undefined,
    })
  }

  try {
    const token = signAdminSession({
      email: user.email,
      role: user.role || 'owner',
      name: user.name || user.email,
      method: 'local',
    })
    res.setHeader('Set-Cookie', createAdminCookie(token))
    return res.status(200).json({ user: { email: user.email, role: user.role, name: user.name } })
  } catch (error) {
    console.error('Admin login session error:', error)
    return res.status(500).json({
      error: 'Login session could not be created',
      hint: 'Set ADMIN_SESSION_SECRET in Netlify environment variables, then redeploy.',
    })
  }
}

export default rateLimit(loginHandler, 5, 15 * 60 * 1000)
