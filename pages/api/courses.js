export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const { getActiveCourses } = await import('../../lib/courses')
    const courses = await getActiveCourses()
    return res.json(courses)
  } catch (e) {
    console.error('Courses load error:', e)
    return res.status(500).json({ error: e.message })
  }
}
