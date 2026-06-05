import { getPublicOffers } from '../../lib/offers'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const offers = await getPublicOffers()
    res.setHeader('Cache-Control', 'no-store')
    return res.json(offers)
  } catch (e) {
    console.error('Public offers load error:', e)
    return res.status(500).json({ error: e.message })
  }
}
