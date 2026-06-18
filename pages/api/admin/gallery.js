import { requireOwnerAdmin } from '../../../lib/adminSession'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
}

async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  if (method === 'GET') {
    try {
      const items = await localList('gallery')
      if (id) {
        return res.json(items.find((x) => String(x.id) === String(id)) || null)
      }
      return res.json(items)
    } catch (e) {
      console.error('Gallery load error:', e)
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
      console.error('Gallery insert error:', e)
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
      console.error('Gallery update error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  if (method === 'DELETE') {
    try {
      const ok = await localRemove('gallery', id)
      if (!ok) return res.status(404).json({ error: 'Gallery item not found' })
      return res.status(204).end()
    } catch (e) {
      console.error('Gallery delete error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default requireOwnerAdmin(handler)
