import jwt from 'jsonwebtoken'

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_SESSION_SECRET is required in production')
  }
  return secret || 'dev-admin-session-secret'
}
const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

export function signAdminSession(payload) {
  return jwt.sign(payload, getSessionSecret(), { expiresIn: `${COOKIE_MAX_AGE}s` })
}

export function verifyAdminSession(token) {
  try {
    return jwt.verify(token, getSessionSecret())
  } catch (error) {
    return null
  }
}

export function getAdminTokenFromReq(req) {
  const cookie = req.headers?.cookie || ''
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function createAdminCookie(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`
}

export function clearAdminCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
}

export function requireAdmin(handler) {
  return async (req, res) => {
    const token = getAdminTokenFromReq(req)
    const payload = token ? verifyAdminSession(token) : null
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.admin = payload
    return handler(req, res)
  }
}
