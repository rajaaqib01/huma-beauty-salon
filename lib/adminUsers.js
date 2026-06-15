import { list as localList } from './localDb'

function stripEnvQuotes(value) {
  const v = String(value || '').trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1)
  }
  return v
}

function getEnvAdminCredentials() {
  const email = stripEnvQuotes(
    process.env.ADMIN_EMAIL ||
    process.env.VITE_ADMIN_EMAIL ||
    ''
  )
  const password = stripEnvQuotes(
    process.env.ADMIN_PASSWORD ||
    process.env.VITE_ADMIN_PASSWORD ||
    ''
  )
  return { email, password }
}

export function getAdminAuthStatus() {
  const { email, password } = getEnvAdminCredentials()
  return {
    envEmailConfigured: Boolean(email),
    envPasswordConfigured: Boolean(password),
    sessionSecretConfigured: Boolean(process.env.ADMIN_SESSION_SECRET?.trim()),
    githubTokenConfigured: Boolean(process.env.GITHUB_TOKEN?.trim()),
  }
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
