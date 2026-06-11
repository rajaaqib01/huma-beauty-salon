import { getAvailableSlots } from '../../lib/bookingSlots'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  const { date } = req.query
  if (!date) return res.status(400).json({ error: 'Date is required' })

  try {
    const result = await getAvailableSlots(String(date))
    res.setHeader('Cache-Control', 'no-store')
    return res.json(result)
  } catch (e) {
    console.error('Booking slots error:', e)
    return res.status(500).json({ error: e.message })
  }
}
