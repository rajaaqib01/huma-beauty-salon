import Link from 'next/link'
import useSWR from 'swr'
import AdminShell from '../../components/AdminShell'

const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json())

export default function AdminDashboard() {
  const { data: stats } = useSWR('/api/admin/stats', fetcher)

  return (
    <AdminShell title="Dashboard">
      <div className="admin-grid-3">
        <div className="admin-stat-card admin-stat-card--bookings">
          <p className="admin-stat-label">Total Bookings</p>
          <p className="admin-stat-value">{stats?.total_bookings ?? '—'}</p>
        </div>
        <div className="admin-stat-card admin-stat-card--confirmed">
          <p className="admin-stat-label">Confirmed</p>
          <p className="admin-stat-value">{stats?.confirmed ?? '—'}</p>
        </div>
        <div className="admin-stat-card admin-stat-card--pending">
          <p className="admin-stat-label">Pending</p>
          <p className="admin-stat-value">{stats?.pending ?? '—'}</p>
        </div>
      </div>
      <div className="admin-grid-3">
        <div className="admin-stat-card admin-stat-card--cancelled">
          <p className="admin-stat-label">Cancelled</p>
          <p className="admin-stat-value">{stats?.cancelled ?? '—'}</p>
        </div>
        <div className="admin-stat-card admin-stat-card--services">
          <p className="admin-stat-label">This Week</p>
          <p className="admin-stat-value">{stats?.bookings_this_week ?? '—'}</p>
        </div>
        <div className="admin-stat-card admin-stat-card--messages">
          <p className="admin-stat-label">Messages</p>
          <p className="admin-stat-value">{stats?.total_messages ?? '—'}</p>
        </div>
      </div>
      {stats?.popular_service ? (
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <p className="admin-stat-label">Most Popular Service</p>
          <p className="text-xl font-semibold">{stats.popular_service.name} ({stats.popular_service.count} bookings)</p>
        </div>
      ) : null}
      <div className="admin-grid-2">
        {[
          { label: 'View Bookings', href: '/admin/bookings', emoji: '📅' },
          { label: 'Manage Services', href: '/admin/services', emoji: '💅' },
          { label: 'Read Messages', href: '/admin/messages', emoji: '✉️' },
          { label: 'Manage Staff', href: '/admin/staff', emoji: '👩‍🎨' },
          { label: 'Blog Posts', href: '/admin/blog', emoji: '📝' },
          { label: 'Manage Settings', href: '/admin/settings', emoji: '⚙️' },
        ].map((card) => (
          <Link key={card.href} href={card.href} className="admin-card admin-card-cta admin-button-secondary">
            <div className="text-3xl">{card.emoji}</div>
            <p className="text-xl font-semibold">{card.label}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  )
}
