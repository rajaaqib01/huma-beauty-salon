import { requireAdmin } from '../../../lib/adminSession'
import { rejectUnlessCanDelete } from '../../../lib/adminRoles'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

async function handler(req, res) {
  if (req.method === 'GET') {
    return res.json(await localList('messages'))
  }

  if (req.method === 'POST') {
    const obj = await localInsert('messages', sanitizeObject(req.body))
    return res.status(201).json(obj)
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    const updated = await localUpdate('messages', id, sanitizeObject(req.body))
    return res.json(updated)
  }

  if (req.method === 'DELETE') {
    if (rejectUnlessCanDelete(req, res)) return
    const { id } = req.query
    const ok = await localRemove('messages', id)
    if (!ok) return res.status(500).json({ error: 'Failed to delete message' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
