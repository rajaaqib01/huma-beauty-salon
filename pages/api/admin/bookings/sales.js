import { requireOwnerAdmin } from '../../../../lib/adminSession'
import { list as localList, insert as localInsert, update as localUpdate } from '../../../../lib/localDb'
import { sanitizeObject } from '../../../../lib/apiUtils/security'
import {
  filterSales,
  buildMonthlyTotals,
  buildDaySummary,
  getUniqueServices,
  parsePriceAmount,
  formatPrice,
} from '../../../../lib/bookingSales'

async function loadBookings() {
  return localList('bookings')
}

async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  if (method === 'GET') {
    try {
      const bookings = await loadBookings()
      const { month = '', date = '', service = '', source = '' } = req.query
      const sales = filterSales(bookings, { month, date, service, source })
      const monthlyTotals = buildMonthlyTotals(bookings)
      const services = getUniqueServices(bookings)
      const selectedMonth = date ? String(date).slice(0, 7) : (month || '')
      const monthSummary = selectedMonth && !date
        ? monthlyTotals.find((m) => m.month === selectedMonth) || { month: selectedMonth, count: 0, total: 0, online: 0, manual: 0 }
        : null
      const daySummary = date ? buildDaySummary(sales, date) : null

      return res.status(200).json({
        sales,
        monthlyTotals,
        monthSummary,
        daySummary,
        services,
        filters: { month, date, service, source },
      })
    } catch (e) {
      console.error('Sales load error:', e)
      return res.status(500).json({ error: 'Failed to load sales data' })
    }
  }

  if (method === 'POST') {
    try {
      const body = sanitizeObject(req.body || {})
      const {
        customer_name, name, phone, email, service_title, service,
        price, sale_amount, date, time, notes,
      } = body

      if (!String(customer_name || name || '').trim()) {
        return res.status(400).json({ error: 'Customer name is required' })
      }
      if (!String(service_title || service || '').trim()) {
        return res.status(400).json({ error: 'Service name is required' })
      }
      if (!date) {
        return res.status(400).json({ error: 'Date is required' })
      }

      const amount = parsePriceAmount(sale_amount ?? price)
      const now = new Date().toISOString()
      const payload = {
        customer_name: String(customer_name || name).trim(),
        name: String(customer_name || name).trim(),
        phone: String(phone || '').trim(),
        email: String(email || '').trim(),
        service_title: String(service_title || service).trim(),
        service: String(service_title || service).trim(),
        price: formatPrice(amount),
        sale_amount: amount,
        date: String(date).trim(),
        time: String(time || '10:00').trim(),
        notes: String(notes || '').trim(),
        status: 'confirmed',
        source: 'manual',
        read: true,
        confirmed_at: now,
        created_at: now,
      }

      const created = await localInsert('bookings', payload)
      return res.status(201).json(created)
    } catch (e) {
      console.error('Manual sale insert error:', e)
      return res.status(500).json({ error: 'Failed to add manual booking sale' })
    }
  }

  if (method === 'PUT') {
    if (!id) return res.status(400).json({ error: 'Missing sale id' })

    try {
      const body = sanitizeObject(req.body || {})
      const patch = {}

      if (body.customer_name !== undefined || body.name !== undefined) {
        const n = String(body.customer_name || body.name || '').trim()
        patch.customer_name = n
        patch.name = n
      }
      if (body.phone !== undefined) patch.phone = String(body.phone).trim()
      if (body.email !== undefined) patch.email = String(body.email).trim()
      if (body.service_title !== undefined || body.service !== undefined) {
        const s = String(body.service_title || body.service).trim()
        patch.service_title = s
        patch.service = s
      }
      if (body.date !== undefined) patch.date = String(body.date).trim()
      if (body.time !== undefined) patch.time = String(body.time).trim()
      if (body.notes !== undefined) patch.notes = String(body.notes).trim()
      if (body.sale_amount !== undefined || body.price !== undefined) {
        const amount = parsePriceAmount(body.sale_amount ?? body.price)
        patch.sale_amount = amount
        patch.price = formatPrice(amount)
      }

      patch.updated_at = new Date().toISOString()

      const updated = await localUpdate('bookings', id, patch)
      if (!updated) return res.status(404).json({ error: 'Sale record not found' })
      return res.json(updated)
    } catch (e) {
      console.error('Sale update error:', e)
      return res.status(500).json({ error: 'Failed to update sale record' })
    }
  }

  res.setHeader('Allow', 'GET,POST,PUT')
  return res.status(405).end('Method Not Allowed')
}

export default requireOwnerAdmin(handler)
