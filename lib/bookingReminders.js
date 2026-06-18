import localDb from './localDb'
import { notifyCustomerBookingReminder } from './notifications'

export function formatDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function tomorrowDateKey() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return formatDateKey(d)
}

export function todayDateKey() {
  return formatDateKey(new Date())
}

export function normalizeBookingDate(date) {
  const raw = String(date || '').trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  const parsed = new Date(raw)
  if (!Number.isNaN(parsed.getTime())) return formatDateKey(parsed)
  return ''
}

function parseTimeMinutes(time) {
  const match = String(time || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!match) return 0
  let hours = Number(match[1])
  const minutes = Number(match[2])
  const meridiem = (match[3] || '').toUpperCase()
  if (meridiem === 'PM' && hours < 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  return hours * 60 + minutes
}

export function sortBookingsByTime(bookings = []) {
  return [...bookings].sort((a, b) => parseTimeMinutes(a.time) - parseTimeMinutes(b.time))
}

async function fetchAllBookings() {
  return localDb.list('bookings')
}

export async function getBookingsForDate(dateKey) {
  const all = await fetchAllBookings()
  return all.filter((b) => normalizeBookingDate(b.date) === dateKey)
}

export async function getTodayBookings() {
  const today = todayDateKey()
  const bookings = await getBookingsForDate(today)
  return sortBookingsByTime(
    bookings.filter((b) => {
      const status = String(b.status || '').toLowerCase()
      return status === 'confirmed' || status === 'pending'
    })
  ).map(toDashboardBooking)
}

function toDashboardBooking(booking) {
  return {
    id: booking.id,
    customer_name: booking.customer_name || booking.name || 'Guest',
    phone: booking.phone || '',
    service_title: booking.service_title || booking.service || 'Service',
    time: booking.time || '',
    status: booking.status || 'pending',
  }
}

async function markReminderSent(booking) {
  const patch = { reminder_sent_at: new Date().toISOString() }
  await localDb.update('bookings', booking.id, patch)
}

export async function processBookingReminders() {
  const tomorrow = tomorrowDateKey()
  const bookings = await getBookingsForDate(tomorrow)
  const confirmed = bookings.filter(
    (b) => String(b.status).toLowerCase() === 'confirmed'
  )
  const due = confirmed.filter((b) => !b.reminder_sent_at)

  const results = []
  for (const booking of due) {
    const sent = await notifyCustomerBookingReminder(booking)
    if (sent.email || sent.whatsapp) {
      await markReminderSent(booking)
      results.push({ id: booking.id, email: sent.email, whatsapp: sent.whatsapp })
    } else {
      results.push({
        id: booking.id,
        email: false,
        whatsapp: false,
        skipped: 'Email/WhatsApp not configured or delivery failed',
      })
    }
  }

  return {
    date: tomorrow,
    due: due.length,
    already_sent: confirmed.length - due.length,
    sent: results.filter((r) => r.email || r.whatsapp).length,
    results,
  }
}
