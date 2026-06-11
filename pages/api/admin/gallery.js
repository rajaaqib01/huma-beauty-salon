import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  if (!supabaseServer) {
    if (method === 'GET') {
      try {
        const items = await localList('gallery')
        if (id) {
          const found = items.find(x => String(x.id) === String(id)) || null
          return res.json(found)
        }
        return res.json(items)
      } catch (e) {
        console.error('Local gallery load error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (method === 'POST') {
      try {
        const { title, image_url, category } = req.body || {}
        if (!image_url || !String(image_url).trim()) {
          return res.status(400).json({ error: 'Image URL or uploaded file is required' })
        }
        const obj = await localInsert('gallery', {
          title: title ? sanitizeObject({ title }).title : '',
          image_url: String(image_url).trim(),
          category: category === 'before_after' ? 'before_after' : 'general',
          created_at: new Date().toISOString(),
        })
        return res.status(201).json(obj)
      } catch (e) {
        console.error('Local gallery insert error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (method === 'PUT') {
      try {
        const { title, image_url, category } = req.body || {}
        const patch = { updated_at: new Date().toISOString() }
        if (title !== undefined) patch.title = sanitizeObject({ title }).title
        if (image_url !== undefined) patch.image_url = String(image_url).trim()
        if (category !== undefined) patch.category = category === 'before_after' ? 'before_after' : 'general'
        const updated = await localUpdate('gallery', id, patch)
        if (!updated) return res.status(404).json({ error: 'Gallery item not found' })
        return res.json(updated)
      } catch (e) {
        console.error('Local gallery update error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if (method === 'DELETE') {
      try {
        const ok = await localRemove('gallery', id)
        if (!ok) return res.status(404).json({ error: 'Gallery item not found' })
        return res.status(204).end()
      } catch (e) {
        console.error('Local gallery delete error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    res.setHeader('Allow', 'GET,POST,PUT,DELETE')
    return res.status(405).end('Method Not Allowed')
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
    const { title, image_url, category } = req.body || {}
    if (!image_url || !String(image_url).trim()) {
      return res.status(400).json({ error: 'Image URL or uploaded file is required' })
    }
    const body = {
      title: title ? sanitizeObject({ title }).title : '',
      image_url: String(image_url).trim(),
      category: category === 'before_after' ? 'before_after' : 'general',
      created_at: new Date().toISOString(),
    }
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
