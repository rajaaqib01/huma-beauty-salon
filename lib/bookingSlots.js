import { list as localList } from './localDb'
import { supabaseServer } from './supabaseServer'
import { getSettings } from './settings'

const DEFAULT_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
  '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
]

function parseTime12to24(timeStr) {
  const t = String(timeStr || '').trim()
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return t
  let h = parseInt(m[1], 10)
  const min = m[2]
  const p = m[3].toUpperCase()
  if (p === 'PM' && h !== 12) h += 12
  if (p === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${min}`
}

function time24toMinutes(t) {
  const [h, m] = String(t).split(':').map(Number)
  return h * 60 + m
}

function minutesToLabel(mins) {
  const h24 = Math.floor(mins / 60)
  const m = mins % 60
  const period = h24 >= 12 ? 'PM' : 'AM'
  let h12 = h24 % 12
  if (h12 === 0) h12 = 12
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`
}

function generateSlotsFromSettings(settings, dateStr) {
  const day = new Date(`${dateStr}T12:00:00`).getDay()
  const isSunday = day === 0
  const start = isSunday ? (settings.sunday_open || '10:00') : (settings.weekday_open || '09:00')
  const end = isSunday ? (settings.sunday_close || '19:00') : (settings.weekday_close || '21:00')
  const step = parseInt(settings.slot_minutes || '30', 10) || 30

  const startM = time24toMinutes(start)
  const endM = time24toMinutes(end)
  const slots = []
  for (let m = startM; m < endM; m += step) {
    slots.push(minutesToLabel(m))
  }
  return slots.length ? slots : DEFAULT_SLOTS
}

async function fetchBookingsForDate(dateStr) {
  if (supabaseServer) {
    const { data } = await supabaseServer
      .from('bookings')
      .select('time, status')
      .eq('date', dateStr)
    return data || []
  }
  const all = await localList('bookings')
  return all.filter(b => b.date === dateStr && b.status !== 'cancelled')
}

export async function getAvailableSlots(dateStr) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { slots: [], booked: [] }
  }

  const settings = await getSettings()
  const allSlots = generateSlotsFromSettings(settings, dateStr)
  const bookings = await fetchBookingsForDate(dateStr)
  const bookedTimes = new Set(
    bookings.map(b => parseTime12to24(b.time)).filter(Boolean)
  )

  const now = new Date()
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const isToday = dateStr === localToday
  const nowMins = now.getHours() * 60 + now.getMinutes()

  const available = allSlots.filter(slot => {
    const slot24 = parseTime12to24(slot)
    if (bookedTimes.has(slot24)) return false
    if (isToday && time24toMinutes(slot24) <= nowMins + 30) return false
    return true
  })

  return {
    slots: available,
    booked: [...bookedTimes],
    all: allSlots,
  }
}

export function isSlotAvailable(dateStr, timeStr, bookedTimes) {
  const slot24 = parseTime12to24(timeStr)
  return !bookedTimes.has(slot24)
}

export async function validateBookingSlot(dateStr, timeStr) {
  const { slots } = await getAvailableSlots(dateStr)
  const slot24 = parseTime12to24(timeStr)
  const available24 = new Set(slots.map(parseTime12to24))
  return available24.has(slot24)
}
