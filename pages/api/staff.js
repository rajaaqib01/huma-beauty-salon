import { getPublicStaff } from '../../lib/staff'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }
  try {
    const staff = await getPublicStaff()
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return res.json(staff)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
