import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../utils/security'

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
    const { data, error } = await supabaseServer.from('services').insert([{ ...body }]).select()
    if(error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  if(req.method === 'PUT'){
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
    const { data, error } = await supabaseServer.from('services').update({ ...body, updated_at: new Date() }).eq('id', id).select()
    if(error) return res.status(500).json({ error: error.message })
    return res.json(data[0])
  }

  if(req.method === 'DELETE'){
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
