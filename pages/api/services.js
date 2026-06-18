import { fetchServices, toDisplayService } from '../../lib/services'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const services = await fetchServices()
    res.setHeader('Cache-Control', 'no-store, must-revalidate')
    return res.json(services.map(toDisplayService))
  } catch (e) {
    console.error('Public services load error:', e)
    return res.status(500).json({ error: e.message })
  }
}
