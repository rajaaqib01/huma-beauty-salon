import { requireAdmin } from '../../../lib/adminSession'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  if (method === 'GET') {
    const users = await localList('admin_users')
    return res.json(users.map(({ password, ...u }) => u))
  }

  if (method === 'POST') {
    const body = sanitizeObject(req.body)
    if (!body.email || !body.password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    const obj = await localInsert('admin_users', {
      name: body.name || body.email,
      email: body.email,
      password: body.password,
      role: body.role || 'staff',
      active: true,
      created_at: new Date().toISOString(),
    })
    const { password, ...safe } = obj
    return res.status(201).json(safe)
  }

  if (method === 'PUT') {
    const body = sanitizeObject(req.body)
    const updated = await localUpdate('admin_users', id, body)
    if (!updated) return res.status(404).json({ error: 'Not found' })
    const { password, ...safe } = updated
    return res.json(safe)
  }

  if (method === 'DELETE') {
    const ok = await localRemove('admin_users', id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
