import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useAdminAuth from '../lib/useAdminAuth'
import { canAccessAdminPath, getNavItemsForRole } from '../lib/adminRoles'

export default function AdminShell({ title, children }) {
  const { admin, loading } = useAdminAuth()
  const router = useRouter()
  const currentPath = router.pathname
  const role = admin?.role || 'owner'
  const navItems = getNavItemsForRole(role)

  useEffect(() => {
    if (loading || !admin) return
    if (!canAccessAdminPath(role, currentPath)) {
      router.replace('/admin')
    }
  }, [loading, admin, role, currentPath, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl bg-white/10 border border-white/10 p-10 text-center backdrop-blur">Checking admin session...</div>
      </div>
    )
  }

  if (!canAccessAdminPath(role, currentPath)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl bg-white/10 border border-white/10 p-10 text-center backdrop-blur">Redirecting…</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="admin-shell">
        <div className="admin-shell-inner">
          <header className="admin-header">
            <div className="admin-topbar">
              <div>
                <p className="admin-panel-label">Admin Panel</p>
                <h1 className="admin-page-title">{title || 'Dashboard'}</h1>
                <p className="admin-page-subtitle">
                  Signed in as {admin?.name || admin?.email || 'Admin'}
                  {role === 'reception' ? ' (Reception)' : ''}
                </p>
              </div>
              <div className="admin-header-actions">
                {navItems.map((item) => {
                  const isActive = item.href === '/admin'
                    ? currentPath === '/admin'
                    : currentPath.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`admin-nav-link${isActive ? ' active' : ''}`}
                    >
                      <span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>
                      <span className="admin-nav-text">{item.label}</span>
                    </Link>
                  )
                })}
                <button type="button" className="admin-nav-logout" onClick={() => router.push('/admin/logout')}>
                  <span className="admin-nav-icon" aria-hidden="true">🚪</span>
                  <span className="admin-nav-text">Logout</span>
                </button>
              </div>
            </div>
          </header>
          <main className="admin-main">{children}</main>
        </div>
      </div>
    </>
  )
}
