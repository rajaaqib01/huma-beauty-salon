import Link from 'next/link'
import useSWR from 'swr'
import AdminShell from '../../components/AdminShell'
import useAdminAuth from '../../lib/useAdminAuth'
import { normalizeAdminRole } from '../../lib/adminRoles'
import { formatPrice } from '../../lib/bookingSales'

function monthLabel(ym) {
  if (!ym) return 'This Month'
  const [y, m] = ym.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })
}

const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json())

const ALL_QUICK_LINKS = [
  { label: 'View Bookings', href: '/admin/bookings', emoji: '📅', roles: ['owner', 'reception', 'staff'] },
  { label: 'Booking Sales', href: '/admin/sales', emoji: '💰', roles: ['owner'] },
  { label: 'Manage Services', href: '/admin/services', emoji: '💅', roles: ['owner', 'reception', 'staff'] },
  { label: 'Read Messages', href: '/admin/messages', emoji: '✉️', roles: ['owner', 'reception', 'staff'] },
  { label: 'Manage Staff', href: '/admin/staff', emoji: '👩‍🎨', roles: ['owner', 'staff'] },
  { label: 'Blog Posts', href: '/admin/blog', emoji: '📝', roles: ['owner', 'staff'] },
  { label: 'Manage Settings', href: '/admin/settings', emoji: '⚙️', roles: ['owner'] },
]

export default function AdminDashboard() {
  const { admin } = useAdminAuth()
  const role = normalizeAdminRole(admin?.role)
  const { data: stats } = useSWR('/api/admin/stats', fetcher)
  const quickLinks = ALL_QUICK_LINKS.filter((card) => card.roles.includes(role))
  const monthSales = stats?.current_month_sales

  return (
    <AdminShell title="Dashboard">
      <div className="admin-dashboard-grid">
        {role === 'owner' && monthSales ? (
          <div className="admin-stat-card admin-stat-card--sales-month">
            <p className="admin-stat-label">{monthLabel(monthSales.month)} Sales</p>
            <p className="admin-stat-value admin-stat-value--price">{formatPrice(monthSales.total)}</p>
            <p className="admin-stat-meta">
              {monthSales.count} booking{monthSales.count === 1 ? '' : 's'}
            </p>
            <Link href="/admin/sales" className="admin-stat-link-btn">View Sales</Link>
          </div>
        ) : null}
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
      <div className="admin-card admin-today-bookings">
        <div className="admin-today-bookings-header">
          <div>
            <p className="admin-stat-label">Aaj ki Bookings</p>
            <h2 className="admin-today-bookings-title">Today&apos;s Appointments</h2>
          </div>
          <Link href="/admin/bookings" className="admin-stat-link-btn">All Bookings</Link>
        </div>
        {stats?.today_bookings?.length ? (
          <ul className="admin-today-bookings-list">
            {stats.today_bookings.map((booking) => (
              <li key={booking.id} className="admin-today-bookings-item">
                <div className="admin-today-bookings-time">{booking.time || '—'}</div>
                <div className="admin-today-bookings-main">
                  <strong>{booking.customer_name}</strong>
                  <span>{booking.service_title}</span>
                </div>
                <span className={`admin-today-bookings-status admin-today-bookings-status--${String(booking.status).toLowerCase()}`}>
                  {booking.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-today-bookings-empty">No bookings scheduled for today.</p>
        )}
      </div>
      <div className="admin-grid-2">
        {quickLinks.map((card) => (
          <Link key={card.href} href={card.href} className="admin-card admin-card-cta admin-button-secondary">
            <div className="text-3xl">{card.emoji}</div>
            <p className="text-xl font-semibold">{card.label}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  )
}
