import { requireAdmin } from '../../../lib/adminSession'
import { rejectUnlessCanDelete } from '../../../lib/adminRoles'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

const TABLE_NAME = 'nails_categories'

async function handler(req, res) {
  if (req.method === 'GET') {
    const items = await localList(TABLE_NAME)
    return res.json([...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
  }

  if (req.method === 'POST') {
    const body = sanitizeObject(req.body)
    if (!body.name?.trim()) {
      return res.status(400).json({ error: 'Category name is required' })
    }
    const payload = {
      name: body.name.trim(),
      sort_order: Number(body.sort_order) || 0,
    }
    const obj = await localInsert(TABLE_NAME, payload)
    return res.status(201).json(obj)
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    const body = sanitizeObject(req.body)
    if (!id) return res.status(400).json({ error: 'Category id is required' })
    const payload = {
      ...(body.name != null ? { name: String(body.name).trim() } : {}),
      ...(body.sort_order != null ? { sort_order: Number(body.sort_order) || 0 } : {}),
    }
    const updated = await localUpdate(TABLE_NAME, id, payload)
    if (!updated) return res.status(404).json({ error: 'Category not found' })
    return res.json(updated)
  }

  if (req.method === 'DELETE') {
    if (rejectUnlessCanDelete(req, res)) return
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Category id is required' })
    const ok = await localRemove(TABLE_NAME, id)
    if (!ok) return res.status(404).json({ error: 'Category not found' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
