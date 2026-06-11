import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import localDb from '../../../lib/localDb'

function weekStart() {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString()
}

function popularService(bookings) {
  const counts = {}
  for (const b of bookings) {
    const s = b.service_title || b.service || 'Unknown'
    counts[s] = (counts[s] || 0) + 1
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return sorted[0] ? { name: sorted[0][0], count: sorted[0][1] } : null
}

function bookingsThisWeek(bookings) {
  const since = weekStart()
  return bookings.filter(b => b.created_at && b.created_at >= since).length
}

async function handler(req, res) {
  try {
    if (supabaseServer) {
      const [{ count: total_bookings }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true })
      const [{ count: pending }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      const [{ count: confirmed }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed')
      const [{ count: cancelled }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'cancelled')
      const [{ count: total_services }] = await supabaseServer.from('services').select('*', { count: 'exact', head: true })
      const [{ count: total_messages }] = await supabaseServer.from('messages').select('*', { count: 'exact', head: true })
      const { data: allBookings } = await supabaseServer.from('bookings').select('service_title, created_at')

      return res.json({
        total_bookings,
        pending,
        confirmed,
        cancelled,
        total_services,
        total_messages,
        bookings_this_week: bookingsThisWeek(allBookings || []),
        popular_service: popularService(allBookings || []),
      })
    }

    const bookings = await localDb.list('bookings')
    const services = await localDb.list('services')
    const messages = await localDb.list('messages')
    const offers = await localDb.list('offers')

    return res.json({
      total_bookings: bookings.length,
      pending: bookings.filter(b => String(b.status).toLowerCase() === 'pending').length,
      confirmed: bookings.filter(b => String(b.status).toLowerCase() === 'confirmed').length,
      cancelled: bookings.filter(b => String(b.status).toLowerCase() === 'cancelled').length,
      total_services: services.length,
      total_messages: messages.length,
      total_offers: offers.length,
      bookings_this_week: bookingsThisWeek(bookings),
      popular_service: popularService(bookings),
    })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load stats' })
  }
}

export default requireAdmin(handler)
