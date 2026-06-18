import { requireOwnerAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'
import { genId } from '../../../lib/dbId'
import { requireSupabaseOnNetlify } from '../../../lib/supabaseRuntime'

async function listStaff() {
  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) return data
    if (error) console.error('Supabase staff read fallback:', error.message)
  }
  return localList('staff')
}

async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  if (method === 'GET') {
    if (id) {
      const items = await listStaff()
      return res.json(items.find((x) => String(x.id) === String(id)) || null)
    }
    return res.json(await listStaff())
  }

  if (method === 'POST') {
    if (requireSupabaseOnNetlify(res)) return
    const body = sanitizeObject(req.body)
    const payload = {
      ...body,
      id: body.id || genId(),
      active: body.active !== false,
      created_at: new Date().toISOString(),
    }

    if (supabaseServer) {
      const { data, error } = await supabaseServer.from('staff').insert([payload]).select()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data[0])
    }

    const obj = await localInsert('staff', payload)
    return res.status(201).json(obj)
  }

  if (method === 'PUT') {
    if (requireSupabaseOnNetlify(res)) return
    const body = sanitizeObject(req.body)
    const patch = { ...body, updated_at: new Date().toISOString() }

    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from('staff')
        .update(patch)
        .eq('id', id)
        .select()
        .single()
      if (error) return res.status(500).json({ error: error.message })
      if (!data) return res.status(404).json({ error: 'Not found' })
      return res.json(data)
    }

    const updated = await localUpdate('staff', id, patch)
    if (!updated) return res.status(404).json({ error: 'Not found' })
    return res.json(updated)
  }

  if (method === 'DELETE') {
    if (requireSupabaseOnNetlify(res)) return
    if (supabaseServer) {
      const { error } = await supabaseServer.from('staff').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(204).end()
    }

    const ok = await localRemove('staff', id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default requireOwnerAdmin(handler)
