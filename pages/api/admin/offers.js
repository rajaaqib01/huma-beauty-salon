import { requireOwnerAdmin } from '../../../lib/adminSession'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

function validateOfferBody(body) {
  if (!body.service_title?.trim()) {
    return 'Service is required. Select a service from admin services list.'
  }
  if (!body.title?.trim()) {
    return 'Offer title is required.'
  }
  return null
}

async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  if (method === 'GET') {
    const items = await localList('offers')
    if (id) return res.json(items.find((x) => String(x.id) === String(id)) || null)
    return res.json(items)
  }

  if (method === 'POST') {
    const body = sanitizeObject(req.body)
    const validationError = validateOfferBody(body)
    if (validationError) return res.status(400).json({ error: validationError })
    const obj = await localInsert('offers', { ...body, created_at: new Date().toISOString() })
    return res.status(201).json(obj)
  }

  if (method === 'PUT') {
    const body = sanitizeObject(req.body)
    const validationError = validateOfferBody(body)
    if (validationError) return res.status(400).json({ error: validationError })
    const updated = await localUpdate('offers', id, { ...body, updated_at: new Date().toISOString() })
    if (!updated) return res.status(404).json({ error: 'Offer not found' })
    return res.json(updated)
  }

  if (method === 'DELETE') {
    const ok = await localRemove('offers', id)
    if (!ok) return res.status(404).json({ error: 'Offer not found' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default requireOwnerAdmin(handler)
