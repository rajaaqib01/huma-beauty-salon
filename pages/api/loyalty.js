import { getLoyaltyByPhone } from '../../lib/loyalty'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  const { phone } = req.query
  if (!phone) return res.status(400).json({ error: 'Phone is required' })

  try {
    const record = await getLoyaltyByPhone(phone)
    if (!record) return res.json({ points: 0, visits: 0 })
    return res.json({ points: record.points || 0, visits: record.visits || 0 })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
