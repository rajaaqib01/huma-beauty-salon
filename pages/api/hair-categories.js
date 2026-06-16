export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const { fetchHairCategories } = await import('../../lib/hairCategories')
    const categories = await fetchHairCategories()
    return res.json(categories)
  } catch (e) {
    console.error('Hair categories load error:', e)
    return res.status(500).json({ error: e.message })
  }
}
