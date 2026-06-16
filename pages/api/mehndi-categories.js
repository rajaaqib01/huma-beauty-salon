export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const { fetchMehndiCategories } = await import('../../lib/mehndiCategories')
    const categories = await fetchMehndiCategories()
    return res.json(categories)
  } catch (e) {
    console.error('Mehndi categories load error:', e)
    return res.status(500).json({ error: e.message })
  }
}
