import { requireOwnerAdmin } from '../../../lib/adminSession'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

function slugify(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  if (method === 'GET') {
    if (id) {
      const items = await localList('blog_posts')
      return res.json(items.find(x => String(x.id) === String(id)) || null)
    }
    return res.json(await localList('blog_posts'))
  }

  if (method === 'POST') {
    const body = sanitizeObject(req.body)
    const obj = await localInsert('blog_posts', {
      ...body,
      slug: body.slug || slugify(body.title),
      published: body.published !== false,
      created_at: new Date().toISOString(),
    })
    return res.status(201).json(obj)
  }

  if (method === 'PUT') {
    const body = sanitizeObject(req.body)
    const updated = await localUpdate('blog_posts', id, { ...body, updated_at: new Date().toISOString() })
    if (!updated) return res.status(404).json({ error: 'Not found' })
    return res.json(updated)
  }

  if (method === 'DELETE') {
    const ok = await localRemove('blog_posts', id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default requireOwnerAdmin(handler)
