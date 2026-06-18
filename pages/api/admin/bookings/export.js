import { requireAdmin } from '../../../../lib/adminSession'
import { list as localList } from '../../../../lib/localDb'

function toCsvRow(values) {
  return values.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')
}

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  const { month } = req.query
  let bookings = await localList('bookings')

  if (month) {
    bookings = bookings.filter(b => String(b.date || '').startsWith(String(month)))
  }

  const headers = ['ID', 'Name', 'Phone', 'Email', 'Service', 'Price', 'Offer', 'Date', 'Time', 'Status', 'Notes', 'Created']
  const rows = bookings.map(b => toCsvRow([
    b.id,
    b.customer_name || b.name,
    b.phone,
    b.email,
    b.service_title || b.service,
    b.price,
    b.offer_title,
    b.date,
    b.time,
    b.status,
    b.notes,
    b.created_at,
  ]))

  const csv = [toCsvRow(headers), ...rows].join('\n')
  const filename = month ? `bookings-${month}.csv` : `bookings-${new Date().toISOString().slice(0, 10)}.csv`

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  return res.status(200).send(csv)
}

export default requireAdmin(handler)
