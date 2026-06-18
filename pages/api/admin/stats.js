import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { adminList } from '../../../lib/adminDb'
import { isOwnerRole } from '../../../lib/adminRoles'
import { buildMonthlyTotals } from '../../../lib/bookingSales'
import { getTodayBookings, processBookingReminders } from '../../../lib/bookingReminders'

function currentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function currentMonthSales(bookings) {
  const month = currentMonthKey()
  const summary = buildMonthlyTotals(bookings).find((m) => m.month === month)
  return summary || { month, count: 0, total: 0, online: 0, manual: 0 }
}

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

function admissionStats(admissions) {
  const list = Array.isArray(admissions) ? admissions : []
  return {
    admissions_total: list.length,
    admissions_pending: list.filter((a) => String(a.status).toLowerCase() === 'pending').length,
    admissions_approved: list.filter((a) => String(a.status).toLowerCase() === 'approved').length,
    admissions_rejected: list.filter((a) => String(a.status).toLowerCase() === 'rejected').length,
  }
}

async function handler(req, res) {
  const showOwnerSales = isOwnerRole(req.admin?.role)

  setImmediate(() => {
    processBookingReminders().catch((err) => {
      console.error('Background booking reminders failed:', err.message)
    })
  })

  try {
    let admissions = []
    try {
      admissions = await adminList('admissions')
    } catch {
      admissions = []
    }
    const admissionCounts = admissionStats(admissions)

    if (supabaseServer) {
      try {
        const [allBookings, services, messages, admissionsFromDb] = await Promise.all([
          adminList('bookings'),
          adminList('services'),
          adminList('messages'),
          adminList('admissions'),
        ])
        if (admissionsFromDb.length) admissions = admissionsFromDb
        const admissionCounts = admissionStats(admissions)

        const payload = {
          total_bookings: allBookings.length,
          pending: allBookings.filter((b) => String(b.status).toLowerCase() === 'pending').length,
          confirmed: allBookings.filter((b) => String(b.status).toLowerCase() === 'confirmed').length,
          cancelled: allBookings.filter((b) => String(b.status).toLowerCase() === 'cancelled').length,
          total_services: services.length,
          total_messages: messages.length,
          bookings_this_week: bookingsThisWeek(allBookings),
          popular_service: popularService(allBookings),
          today_bookings: await getTodayBookings(),
          ...admissionCounts,
        }
        if (showOwnerSales) payload.current_month_sales = currentMonthSales(allBookings)
        return res.json(payload)
      } catch (supabaseErr) {
        console.error('Supabase stats fallback:', supabaseErr.message)
      }
    }

    const bookings = await adminList('bookings')
    const services = await adminList('services')
    const messages = await adminList('messages')
    const offers = await adminList('offers')

    const payload = {
      total_bookings: bookings.length,
      pending: bookings.filter(b => String(b.status).toLowerCase() === 'pending').length,
      confirmed: bookings.filter(b => String(b.status).toLowerCase() === 'confirmed').length,
      cancelled: bookings.filter(b => String(b.status).toLowerCase() === 'cancelled').length,
      total_services: services.length,
      total_messages: messages.length,
      total_offers: offers.length,
      bookings_this_week: bookingsThisWeek(bookings),
      popular_service: popularService(bookings),
      today_bookings: await getTodayBookings(),
      ...admissionCounts,
    }
    if (showOwnerSales) payload.current_month_sales = currentMonthSales(bookings)
    return res.json(payload)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load stats' })
  }
}

export default requireAdmin(handler)
