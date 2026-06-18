import { requireOwnerAdmin } from '../../../lib/adminSession'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  if (method === 'GET') {
    const items = await localList('reviews')
    if (id) return res.json(items.find((x) => String(x.id) === String(id)) || null)
    return res.json(items)
  }

  if (method === 'POST') {
    const obj = await localInsert('reviews', {
      ...sanitizeObject(req.body),
      created_at: new Date().toISOString(),
    })
    return res.status(201).json(obj)
  }

  if (method === 'PUT') {
    const updated = await localUpdate('reviews', id, {
      ...sanitizeObject(req.body),
      updated_at: new Date().toISOString(),
    })
    if (!updated) return res.status(404).json({ error: 'Review not found' })
    return res.json(updated)
  }

  if (method === 'DELETE') {
    const ok = await localRemove('reviews', id)
    if (!ok) return res.status(404).json({ error: 'Review not found' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default requireOwnerAdmin(handler)
