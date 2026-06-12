/** Parse "Rs. 3,500" or "3500" to number */
export function parsePriceAmount(value) {
  if (value == null || value === '') return 0
  if (typeof value === 'number' && !Number.isNaN(value)) return Math.max(0, Math.round(value))
  let s = String(value).trim()
  s = s.replace(/^rs\.?\s*/i, '')
  s = s.replace(/,/g, '')
  s = s.replace(/[^\d]/g, '')
  const num = parseInt(s, 10)
  return Number.isNaN(num) ? 0 : Math.max(0, num)
}

export function formatPrice(amount) {
  const n = Math.round(parsePriceAmount(amount))
  return `Rs. ${n.toLocaleString('en-PK')}`
}

export function getBookingSource(booking) {
  return booking?.source === 'manual' ? 'manual' : 'online'
}

export function isConfirmedSale(booking) {
  return String(booking?.status || '').toLowerCase() === 'confirmed'
}

export function getSaleAmount(booking) {
  const priceAmt = parsePriceAmount(booking?.price)
  if (booking?.sale_amount != null && booking.sale_amount !== '') {
    const saleAmt = parsePriceAmount(booking.sale_amount)
    // Ignore legacy bad parses (e.g. "Rs. 14,400" → 0.144)
    if (saleAmt > 0 && (priceAmt === 0 || saleAmt >= priceAmt * 0.5)) return saleAmt
  }
  return priceAmt
}

export function normalizeSaleRow(booking) {
  const amount = getSaleAmount(booking)
  return {
    id: booking.id,
    customer_name: booking.customer_name || booking.name || '—',
    phone: booking.phone || '',
    email: booking.email || '',
    service_title: booking.service_title || booking.service || '—',
    price: booking.price || formatPrice(amount),
    sale_amount: amount,
    date: booking.date || '',
    time: booking.time || '',
    source: getBookingSource(booking),
    notes: booking.notes || '',
    confirmed_at: booking.confirmed_at || booking.updated_at || booking.created_at || '',
    created_at: booking.created_at || '',
  }
}

export function filterSales(bookings, { month = '', service = '', source = '' } = {}) {
  let rows = bookings
    .filter(isConfirmedSale)
    .map(normalizeSaleRow)

  if (month) {
    rows = rows.filter((r) => String(r.date).startsWith(String(month)))
  }
  if (service) {
    rows = rows.filter((r) => r.service_title === service)
  }
  if (source === 'online' || source === 'manual') {
    rows = rows.filter((r) => r.source === source)
  }

  rows.sort((a, b) => {
    const da = String(b.date).localeCompare(String(a.date))
    if (da !== 0) return da
    return String(b.created_at).localeCompare(String(a.created_at))
  })

  return rows
}

export function buildMonthlyTotals(bookings) {
  const map = new Map()

  bookings
    .filter(isConfirmedSale)
    .forEach((b) => {
      const monthKey = String(b.date || '').slice(0, 7)
      if (!/^\d{4}-\d{2}$/.test(monthKey)) return
      const current = map.get(monthKey) || { month: monthKey, count: 0, total: 0, online: 0, manual: 0 }
      const amount = getSaleAmount(b)
      current.count += 1
      current.total += amount
      if (getBookingSource(b) === 'manual') current.manual += amount
      else current.online += amount
      map.set(monthKey, current)
    })

  return [...map.values()].sort((a, b) => b.month.localeCompare(a.month))
}

export function getUniqueServices(bookings) {
  const set = new Set()
  bookings
    .filter(isConfirmedSale)
    .forEach((b) => {
      const name = b.service_title || b.service
      if (name) set.add(name)
    })
  return [...set].sort()
}
