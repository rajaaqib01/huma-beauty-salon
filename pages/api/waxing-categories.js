export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const { fetchWaxingCategories } = await import('../../lib/waxingCategories')
    const categories = await fetchWaxingCategories()
    return res.json(categories)
  } catch (e) {
    console.error('Waxing categories load error:', e)
    return res.status(500).json({ error: e.message })
  }
}
