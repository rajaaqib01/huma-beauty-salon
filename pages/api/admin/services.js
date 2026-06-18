import { requireAdmin } from '../../../lib/adminSession'
import { rejectUnlessCanDelete } from '../../../lib/adminRoles'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'
import { genId } from '../../../lib/dbId'

function normalizeServicePrice(price) {
  if (price == null || price === '') return null
  const num = Number(String(price).replace(/[^\d.]/g, ''))
  return Number.isFinite(num) ? num : null
}

function buildServicePayload(body, { forUpdate = false } = {}) {
  const now = new Date().toISOString()
  const payload = {
    ...body,
    title: String(body.title || '').trim(),
    description: String(body.description || '').trim(),
    category: String(body.category || '').trim(),
    subcategory: String(body.subcategory || '').trim(),
    image_url: String(body.image_url || '').trim(),
    price: normalizeServicePrice(body.price),
    updated_at: now,
  }
  if (!forUpdate) {
    payload.id = body.id || genId()
    payload.created_at = now
  }
  return payload
}

async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const items = await localList('services')
      if (id) {
        return res.json(items.find((x) => String(x.id) === String(id)) || null)
      }
      return res.json(items)
    } catch (e) {
      console.error('Services load error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = sanitizeObject(req.body)
      const obj = await localInsert('services', buildServicePayload(body))
      return res.status(201).json(obj)
    } catch (e) {
      console.error('Service insert error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  if (req.method === 'PUT') {
    try {
      const body = sanitizeObject(req.body)
      const updated = await localUpdate('services', id, buildServicePayload(body, { forUpdate: true }))
      if (!updated) return res.status(404).json({ error: 'Service not found' })
      return res.json(updated)
    } catch (e) {
      console.error('Service update error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  if (req.method === 'DELETE') {
    if (rejectUnlessCanDelete(req, res)) return
    try {
      const ok = await localRemove('services', id)
      if (!ok) return res.status(500).json({ error: 'Failed to delete service' })
      return res.status(204).end()
    } catch (e) {
      console.error('Service delete error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
