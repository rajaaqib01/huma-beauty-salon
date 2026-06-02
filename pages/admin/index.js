import Link from 'next/link'
import useSWR, { mutate } from 'swr'
import AdminShell from '../../components/AdminShell'
import { useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function AdminDashboard() {
  const { data: stats } = useSWR('/api/admin/stats', fetcher)

  useEffect(() => {
    if (!supabase) return undefined

    // Subscribe to bookings, messages and services changes and revalidate stats
    const bookingsChannel = supabase
      .channel('public:bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        mutate('/api/admin/stats')
      })
      .subscribe()

    const messagesChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        mutate('/api/admin/stats')
      })
      .subscribe()

    const servicesChannel = supabase
      .channel('public:services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        mutate('/api/admin/stats')
      })
      .subscribe()

    return () => {
      try {
        bookingsChannel.unsubscribe()
        messagesChannel.unsubscribe()
        servicesChannel.unsubscribe()
      } catch (e) {
        // ignore cleanup errors
      }
    }
  }, [])

  return (
    <AdminShell title="Dashboard">
      <div className="admin-grid-3">
        <div className="admin-card admin-stat-card">
          <p className="admin-panel-label">Total Bookings</p>
          <p className="text-5xl font-bold">{stats?.total_bookings ?? '—'}</p>
        </div>
        <div className="admin-card admin-stat-card">
          <p className="admin-panel-label">Confirmed</p>
          <p className="text-5xl font-bold" style={{ color: '#0F4C45' }}>{stats?.confirmed ?? '—'}</p>
        </div>
        <div className="admin-card admin-stat-card">
          <p className="admin-panel-label">Pending</p>
          <p className="text-5xl font-bold" style={{ color: '#D4AF37' }}>{stats?.pending ?? '—'}</p>
        </div>
      </div>
      <div className="admin-grid-3">
        <div className="admin-card admin-stat-card">
          <p className="admin-panel-label">Cancelled</p>
          <p className="text-5xl font-bold" style={{ color: '#E74C3C' }}>{stats?.cancelled ?? '—'}</p>
        </div>
        <div className="admin-card admin-stat-card">
          <p className="admin-panel-label">Total Services</p>
          <p className="text-5xl font-bold">{stats?.total_services ?? '—'}</p>
        </div>
        <div className="admin-card admin-stat-card">
          <p className="admin-panel-label">Messages</p>
          <p className="text-5xl font-bold">{stats?.total_messages ?? '—'}</p>
        </div>
      </div>
      <div className="admin-grid-2">
        {[{
          label: 'View Bookings', href: '/admin/bookings', emoji: '📅'
        }, {
          label: 'Manage Services', href: '/admin/services', emoji: '💅'
        }, {
          label: 'Read Messages', href: '/admin/messages', emoji: '✉️'
        }, {
          label: 'Manage Settings', href: '/admin/settings', emoji: '⚙️'
        }].map((card) => (
          <Link key={card.href} href={card.href} className="admin-card admin-card-cta admin-button-secondary" >
            <div className="text-3xl">{card.emoji}</div>
            <p className="text-xl font-semibold">{card.label}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  )
}
