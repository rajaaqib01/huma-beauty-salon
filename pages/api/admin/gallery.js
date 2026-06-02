import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../utils/security'

async function handler(req, res) {
  if (!supabaseServer) {
    // Local fallback for environments without Supabase
    const { method } = req
    const { id } = req.query

    if (method === 'GET') {
      try {
        if (id) {
          const items = await localList('gallery')
          const found = items.find(x => String(x.id) === String(id)) || null
          return res.json(found)
        }
        const items = await localList('gallery')
        return res.json(items)
      } catch (e) {
        console.error('Local gallery load error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (method === 'POST') {
      try {
        const obj = await localInsert('gallery', sanitizeObject(req.body))
        return res.status(201).json(obj)
      } catch (e) {
        console.error('Local gallery insert error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (method === 'PUT') {
      const { id } = req.query
      try {
        const updated = await localUpdate('gallery', id, sanitizeObject(req.body))
        return res.json(updated)
      } catch (e) {
        console.error('Local gallery update error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (method === 'DELETE') {
      const { id } = req.query
      try {
        const ok = await localRemove('gallery', id)
        if (!ok) return res.status(500).json({ error: 'Failed to delete gallery item' })
        return res.status(204).end()
      } catch (e) {
        console.error('Local gallery delete error:', e)
        return res.status(500).json({ error: e.message })
      }
    }
  }
  if (method === 'GET') {
    if (id) {
      const { data, error } = await supabaseServer.from('gallery').select('*').eq('id', id).single()
      return error ? res.status(500).json({ error: error.message }) : res.json(data)
    }
    const { data, error } = await supabaseServer.from('gallery').select('*').order('created_at', { ascending: false })
    return error ? res.status(500).json({ error: error.message }) : res.json(data)
  }

  if (method === 'POST') {
    const body = sanitizeObject(req.body)
    const { data, error } = await supabaseServer.from('gallery').insert([body]).select()
    return error ? res.status(500).json({ error: error.message }) : res.status(201).json(data[0])
  }

  if (method === 'PUT') {
    const body = sanitizeObject(req.body)
    const { data, error } = await supabaseServer.from('gallery').update({ ...body }).eq('id', id).select()
    return error ? res.status(500).json({ error: error.message }) : res.json(data[0])
  }

  if (method === 'DELETE') {
    const { error } = await supabaseServer.from('gallery').delete().eq('id', id)
    return error ? res.status(500).json({ error: error.message }) : res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
