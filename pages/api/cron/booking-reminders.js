import { processBookingReminders } from '../../../lib/bookingReminders'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.CRON_SECRET?.trim()
  if (secret) {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : req.query.secret
    if (token !== secret) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  try {
    const result = await processBookingReminders()
    return res.json({ ok: true, ...result })
  } catch (err) {
    console.error('Booking reminders cron failed:', err.message)
    return res.status(500).json({ error: 'Failed to process reminders' })
  }
}
