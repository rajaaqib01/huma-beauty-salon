import { requireAdmin } from '../../../lib/adminSession'
import { list as localList, update as localUpdate } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'
import { isOwnerRole } from '../../../lib/adminRoles'

function normalizeCoursePatch(body) {
  const patch = { ...body, updated_at: new Date().toISOString() }
  if (patch.fee != null && patch.fee !== '') {
    patch.fee = Number(String(patch.fee).replace(/[^\d.]/g, '')) || 0
  }
  if (patch.discount != null && patch.discount !== '') {
    patch.discount = Number(String(patch.discount).replace(/[^\d.]/g, '')) || 0
  }
  if (patch.seats != null && patch.seats !== '') {
    patch.seats = Number(patch.seats) || 0
  }
  if (Array.isArray(patch.syllabus)) {
    patch.syllabus = patch.syllabus
  } else if (typeof patch.syllabus === 'string') {
    patch.syllabus = patch.syllabus.split('\n').map((s) => s.trim()).filter(Boolean)
  }
  return patch
}

async function handler(req, res) {
  if (!isOwnerRole(req.admin?.role)) {
    return res.status(403).json({ error: 'Only owner admin can manage courses' })
  }

  if (req.method === 'GET') {
    const items = await localList('courses')
    return res.json([...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Course id is required' })
    const patch = normalizeCoursePatch(sanitizeObject(req.body))
    const updated = await localUpdate('courses', id, patch)
    if (!updated) return res.status(404).json({ error: 'Course not found' })
    return res.json(updated)
  }

  res.setHeader('Allow', 'GET,PUT')
  return res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
