import { requireAdmin } from '../../../lib/adminSession'
import { list as localList, update as localUpdate } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'
import { isOwnerRole } from '../../../lib/adminRoles'

async function handler(req, res) {
  if (!isOwnerRole(req.admin?.role)) {
    return res.status(403).json({ error: 'Only owner admin can manage courses' })
  }

  if (req.method === 'GET') {
    try {
      const items = await localList('courses')
      return res.json([...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
    } catch (e) {
      console.error('Courses load error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Course id is required' })
    const body = sanitizeObject(req.body)
    try {
      const updated = await localUpdate('courses', id, body)
      if (!updated) return res.status(404).json({ error: 'Course not found' })
      return res.json(updated)
    } catch (e) {
      console.error('Course update error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  res.setHeader('Allow', 'GET,PUT')
  return res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
