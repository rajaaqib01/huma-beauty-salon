import Link from 'next/link'
import { useRouter } from 'next/router'
import useAdminAuth from '../lib/useAdminAuth'

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/offers', label: 'Offers' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/settings', label: 'Settings' },
]

export default function AdminShell({ title, children }) {
  const { admin, loading } = useAdminAuth()
  const router = useRouter()
  const currentPath = router.pathname

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl bg-white/10 border border-white/10 p-10 text-center backdrop-blur">Checking admin session...</div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className="admin-shell-inner">
        <header className="admin-header">
          <div className="admin-topbar">
            <div>
              <p className="admin-panel-label">Admin Panel</p>
              <h1 className="admin-page-title">{title || 'Dashboard'}</h1>
              <p className="admin-page-subtitle">Signed in as {admin?.email || 'Admin'}</p>
            </div>
            <div className="admin-header-actions">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link ${currentPath.startsWith(item.href) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
              <button type="button" className="admin-button admin-button-secondary" onClick={() => router.push('/admin/logout')}>
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}
