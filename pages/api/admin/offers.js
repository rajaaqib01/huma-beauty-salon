import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

async function handler(req, res) {
  if (!supabaseServer) {
    if (req.method === 'GET') {
      const { id } = req.query
      try {
        const items = await localList('offers')
        if (id) {
          const item = items.find(x => String(x.id) === String(id))
          return res.json(item || null)
        }
        return res.json(items)
      } catch (e) {
        console.error('Local offers load error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (req.method === 'POST') {
      const body = sanitizeObject(req.body)
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

  const { method } = req
  const { id } = req.query

  if (method === 'GET') {
    if (id) {
      const { data, error } = await supabaseServer.from('offers').select('*').eq('id', id).single()
      return error ? res.status(500).json({ error: error.message }) : res.json(data)
    }
    const { data, error } = await supabaseServer.from('offers').select('*').order('created_at', { ascending: false })
    return error ? res.status(500).json({ error: error.message }) : res.json(data)
  }

  if (method === 'POST') {
    const body = sanitizeObject(req.body)
    const { data, error } = await supabaseServer.from('offers').insert([body]).select()
    return error ? res.status(500).json({ error: error.message }) : res.status(201).json(data[0])
  }

  if (method === 'PUT') {
    const body = sanitizeObject(req.body)
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

export default requireAdmin(handler)
