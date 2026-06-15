import { list as localList } from './localDb'

function getEnvAdminCredentials() {
  const email = (
    process.env.ADMIN_EMAIL ||
    process.env.VITE_ADMIN_EMAIL ||
    ''
  ).trim()
  const password = (
    process.env.ADMIN_PASSWORD ||
    process.env.VITE_ADMIN_PASSWORD ||
    ''
  ).trim()
  return { email, password }
}

export async function findAdminUser(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const normalizedPassword = String(password || '').trim()
  const { email: envEmail, password: envPassword } = getEnvAdminCredentials()

  if (
    envEmail &&
    envPassword &&
    normalizedEmail === envEmail.toLowerCase() &&
    normalizedPassword === envPassword
  ) {
    return { email: envEmail, role: 'owner', name: 'Owner' }
  }

  const users = await localList('admin_users')
  const match = users.find(u => String(u.email).toLowerCase() === normalizedEmail)
  if (!match || match.active === false) return null
  if (String(match.password).trim() !== normalizedPassword) return null

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
