import { requireAdmin } from '../../../lib/adminSession'
import { rejectUnlessCanDelete } from '../../../lib/adminRoles'
import { supabaseServer } from '../../../lib/supabaseServer'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'
import { genId } from '../../../lib/dbId'
import { requireSupabaseOnNetlify } from '../../../lib/supabaseRuntime'

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

async function handler(req, res){
  if (!supabaseServer) {
    // Local fallback
    if (req.method === 'GET'){
      const { id } = req.query
      if(id){
        try{
          const items = await localList('services')
          const item = items.find(x=> String(x.id) === String(id))
          return res.json(item || null)
        } catch (e){
          console.error('Local service load error:', e)
          return res.status(500).json({ error: e.message })
        }
      }
      try{
        const items = await localList('services')
        return res.json(items)
      } catch (e){
        console.error('Local services load error:', e)
        return res.status(500).json({ error: e.message })
      }
    }
  
  }
  if(req.method === 'GET'){
    const { id } = req.query
    if(id){
      const { data, error } = await supabaseServer.from('services').select('*').eq('id', id).single()
      if(error) return res.status(500).json({ error: error.message })
      return res.json(data)
    }
    const { data, error } = await supabaseServer.from('services').select('*').order('created_at', { ascending: false })
    if(error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  if(req.method === 'POST'){
    if (requireSupabaseOnNetlify(res)) return
    const body = sanitizeObject(req.body)
    if (!supabaseServer) {
      try{
        const obj = await localInsert('services', body)
        return res.status(201).json(obj)
      } catch (e){
        console.error('Local service insert error:', e)
        return res.status(500).json({ error: e.message })
      }
    }
    const payload = buildServicePayload(body)
    const { data, error } = await supabaseServer.from('services').insert([payload]).select()
    if(error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  if(req.method === 'PUT'){
    if (requireSupabaseOnNetlify(res)) return
    const { id } = req.query
    const body = sanitizeObject(req.body)
    if (!supabaseServer) {
      try{
        const updated = await localUpdate('services', id, { ...body, updated_at: new Date() })
        return res.json(updated)
      } catch (e){
        console.error('Local service update error:', e)
        return res.status(500).json({ error: e.message })
      }
    }
    const payload = buildServicePayload(body, { forUpdate: true })
    const { data, error } = await supabaseServer.from('services').update(payload).eq('id', id).select()
    if(error) return res.status(500).json({ error: error.message })
    return res.json(data[0])
  }

  if(req.method === 'DELETE'){
    if (requireSupabaseOnNetlify(res)) return
    if (rejectUnlessCanDelete(req, res)) return
    const { id } = req.query
    if (!supabaseServer) {
      try{
        const ok = await localRemove('services', id)
        if(!ok) return res.status(500).json({ error: 'Failed to delete service' })
        return res.status(204).end()
      } catch (e){
        console.error('Local service delete error:', e)
        return res.status(500).json({ error: e.message })
      }
    }
    const { error } = await supabaseServer.from('services').delete().eq('id', id)
    if(error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
