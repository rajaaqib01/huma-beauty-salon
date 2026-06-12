import { requireOwnerAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  if (!supabaseServer) {
    if (method === 'GET') {
      try {
        const items = await localList('reviews')
        if (id) {
          const found = items.find(x => String(x.id) === String(id)) || null
          return res.json(found)
        }
        return res.json(items)
      } catch (e) {
        console.error('Local reviews load error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (method === 'POST') {
      try {
        const obj = await localInsert('reviews', {
          ...sanitizeObject(req.body),
          created_at: new Date().toISOString(),
        })
        return res.status(201).json(obj)
      } catch (e) {
        console.error('Local review insert error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (method === 'PUT') {
      try {
        const updated = await localUpdate('reviews', id, {
          ...sanitizeObject(req.body),
          updated_at: new Date().toISOString(),
        })
        if (!updated) return res.status(404).json({ error: 'Review not found' })
        return res.json(updated)
      } catch (e) {
        console.error('Local review update error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (method === 'DELETE') {
      try {
        const ok = await localRemove('reviews', id)
        if (!ok) return res.status(404).json({ error: 'Review not found' })
        return res.status(204).end()
      } catch (e) {
        console.error('Local review delete error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    res.setHeader('Allow', 'GET,POST,PUT,DELETE')
    return res.status(405).end('Method Not Allowed')
  }

  if (method === 'GET') {
    if (id) {
      const { data, error } = await supabaseServer.from('reviews').select('*').eq('id', id).single()
      return error ? res.status(500).json({ error: error.message }) : res.json(data)
    }
    const { data, error } = await supabaseServer.from('reviews').select('*').order('created_at', { ascending: false })
    return error ? res.status(500).json({ error: error.message }) : res.json(data)
  }

  if (method === 'POST') {
    const body = sanitizeObject(req.body)
    const { data, error } = await supabaseServer.from('reviews').insert([body]).select()
    return error ? res.status(500).json({ error: error.message }) : res.status(201).json(data[0])
  }

  if (method === 'PUT') {
    const body = sanitizeObject(req.body)
    const { data, error } = await supabaseServer.from('reviews').update({ ...body }).eq('id', id).select()
    return error ? res.status(500).json({ error: error.message }) : res.json(data[0])
  }

  if (method === 'DELETE') {
    const { error } = await supabaseServer.from('reviews').delete().eq('id', id)
    return error ? res.status(500).json({ error: error.message }) : res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  res.status(405).end('Method Not Allowed')
}

export default requireOwnerAdmin(handler)
