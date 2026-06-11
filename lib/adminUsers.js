import { list as localList } from './localDb'

const ENV_EMAIL = process.env.ADMIN_EMAIL?.trim()
const ENV_PASSWORD = process.env.ADMIN_PASSWORD?.trim()

export async function findAdminUser(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase()

  if (ENV_EMAIL && ENV_PASSWORD && normalizedEmail === ENV_EMAIL.toLowerCase() && password === ENV_PASSWORD) {
    return { email: ENV_EMAIL, role: 'owner', name: 'Owner' }
  }

  const users = await localList('admin_users')
  const match = users.find(u => String(u.email).toLowerCase() === normalizedEmail)
  if (!match || match.active === false) return null
  if (String(match.password) !== String(password)) return null

  return {
    id: match.id,
    email: match.email,
    role: match.role || 'staff',
    name: match.name || match.email,
  }
}

export async function listAdminUsers() {
  const users = await localList('admin_users')
  return users.map(({ password, ...rest }) => rest)
}
