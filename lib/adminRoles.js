export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Overview', roles: ['owner', 'reception', 'staff'] },
  { href: '/admin/services', label: 'Services', roles: ['owner', 'reception', 'staff'] },
  { href: '/admin/bookings', label: 'Bookings', roles: ['owner', 'reception', 'staff'] },
  { href: '/admin/sales', label: 'Sales', roles: ['owner'] },
  { href: '/admin/messages', label: 'Messages', roles: ['owner', 'reception', 'staff'] },
  { href: '/admin/gallery', label: 'Gallery', roles: ['owner', 'staff'] },
  { href: '/admin/offers', label: 'Offers', roles: ['owner', 'staff'] },
  { href: '/admin/reviews', label: 'Reviews', roles: ['owner', 'staff'] },
  { href: '/admin/staff', label: 'Staff', roles: ['owner', 'staff'] },
  { href: '/admin/blog', label: 'Blog', roles: ['owner', 'staff'] },
  { href: '/admin/users', label: 'Users', roles: ['owner'] },
  { href: '/admin/settings', label: 'Settings', roles: ['owner'] },
]

const RECEPTION_PATH_PREFIXES = [
  '/admin/services',
  '/admin/bookings',
  '/admin/messages',
]

export function normalizeAdminRole(role) {
  const r = String(role || 'owner').toLowerCase()
  if (r === 'reception') return 'reception'
  if (r === 'staff') return 'staff'
  return 'owner'
}

export function getNavItemsForRole(role) {
  const normalized = normalizeAdminRole(role)
  return ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(normalized))
}

export function canAccessAdminPath(role, pathname) {
  const normalized = normalizeAdminRole(role)
  if (normalized === 'owner' || normalized === 'staff') return true

  const path = String(pathname || '')
  if (path === '/admin/login' || path === '/admin/logout') return true
  if (path === '/admin' || path === '/admin/') return true

  return RECEPTION_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  )
}

export function isOwnerRole(role) {
  return normalizeAdminRole(role) === 'owner'
}

/** Only main owner admin may delete cards/records */
export function canAdminDelete(role) {
  return isOwnerRole(role)
}

export function rejectUnlessCanDelete(req, res) {
  if (!canAdminDelete(req.admin?.role)) {
    res.status(403).json({ error: 'Only owner admin can delete records' })
    return true
  }
  return false
}
