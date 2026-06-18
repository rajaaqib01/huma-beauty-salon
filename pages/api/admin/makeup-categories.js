import { requireAdmin } from '../../../lib/adminSession'
import { rejectUnlessCanDelete } from '../../../lib/adminRoles'
import { supabaseServer } from '../../../lib/supabaseServer'
import { insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { adminList } from '../../../lib/adminDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

async function handler(req, res) {
  if (req.method === 'GET') {
    const items = await adminList('makeup_categories', (db) =>
      db.from('makeup_categories').select('*').order('sort_order', { ascending: true })
    )
    return res.json([...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
  }

  if (req.method === 'POST') {
    const body = sanitizeObject(req.body)
    if (!body.name?.trim()) {
      return res.status(400).json({ error: 'Category name is required' })
    }
    const payload = {
      name: body.name.trim(),
      sort_order: Number(body.sort_order) || 0,
    }
    if (!supabaseServer) {
      try {
        const obj = await localInsert('makeup_categories', payload)
        return res.status(201).json(obj)
      } catch (e) {
        console.error('Local makeup category insert error:', e)
        return res.status(500).json({ error: e.message })
      }
    }
    const { data, error } = await supabaseServer.from('makeup_categories').insert([payload]).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    const body = sanitizeObject(req.body)
    if (!id) return res.status(400).json({ error: 'Category id is required' })
    const payload = {
      ...(body.name != null ? { name: String(body.name).trim() } : {}),
      ...(body.sort_order != null ? { sort_order: Number(body.sort_order) || 0 } : {}),
    }
    if (!supabaseServer) {
      try {
        const updated = await localUpdate('makeup_categories', id, payload)
        return res.json(updated)
      } catch (e) {
        console.error('Local makeup category update error:', e)
        return res.status(500).json({ error: e.message })
      }
    }
    const { data, error } = await supabaseServer
      .from('makeup_categories')
      .update(payload)
      .eq('id', id)
      .select()
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data[0])
  }

  if (req.method === 'DELETE') {
    if (rejectUnlessCanDelete(req, res)) return
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Category id is required' })
    if (!supabaseServer) {
      try {
        const ok = await localRemove('makeup_categories', id)
        if (!ok) return res.status(404).json({ error: 'Category not found' })
        return res.status(204).end()
      } catch (e) {
        console.error('Local makeup category delete error:', e)
        return res.status(500).json({ error: e.message })
      }
    }
    const { error } = await supabaseServer.from('makeup_categories').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
