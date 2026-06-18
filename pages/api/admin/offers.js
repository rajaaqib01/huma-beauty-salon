import { requireOwnerAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { adminList, adminFindById } from '../../../lib/adminDb'
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
    if (id) {
      const item = await adminFindById('offers', id, (db) =>
        db.from('offers').select('*').order('created_at', { ascending: false })
      )
      return res.json(item)
    }
    const items = await adminList('offers', (db) =>
      db.from('offers').select('*').order('created_at', { ascending: false })
    )
    return res.json(items)
  }

  if (!supabaseServer) {
    if (req.method === 'POST') {
      const body = sanitizeObject(req.body)
      const validationError = validateOfferBody(body)
      if (validationError) return res.status(400).json({ error: validationError })
      try {
        const obj = await localInsert('offers', { ...body, created_at: new Date().toISOString() })
        return res.status(201).json(obj)
      } catch (e) {
        console.error('Local offer insert error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      const body = sanitizeObject(req.body)
      const validationError = validateOfferBody(body)
      if (validationError) return res.status(400).json({ error: validationError })
      try {
        const updated = await localUpdate('offers', id, { ...body, updated_at: new Date().toISOString() })
        if (!updated) return res.status(404).json({ error: 'Offer not found' })
        return res.json(updated)
      } catch (e) {
        console.error('Local offer update error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      try {
        const ok = await localRemove('offers', id)
        if (!ok) return res.status(404).json({ error: 'Offer not found' })
        return res.status(204).end()
      } catch (e) {
        console.error('Local offer delete error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    res.setHeader('Allow', 'GET,POST,PUT,DELETE')
    return res.status(405).end('Method Not Allowed')
  }

  if (method === 'POST') {
    const body = sanitizeObject(req.body)
    const validationError = validateOfferBody(body)
    if (validationError) return res.status(400).json({ error: validationError })
    const { data, error } = await supabaseServer.from('offers').insert([body]).select()
    return error ? res.status(500).json({ error: error.message }) : res.status(201).json(data[0])
  }

  if (method === 'PUT') {
    const body = sanitizeObject(req.body)
    const validationError = validateOfferBody(body)
    if (validationError) return res.status(400).json({ error: validationError })
    const { data, error } = await supabaseServer.from('offers').update({ ...body }).eq('id', id).select()
    return error ? res.status(500).json({ error: error.message }) : res.json(data[0])
  }

  if (method === 'DELETE') {
    const { error } = await supabaseServer.from('offers').delete().eq('id', id)
    return error ? res.status(500).json({ error: error.message }) : res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  res.status(405).end('Method Not Allowed')
}

export default requireOwnerAdmin(handler)
