import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

async function handler(req, res){
  if (!supabaseServer) {
    // Local fallback
    if (req.method === 'GET'){
      try{
        const items = await localList('messages')
        return res.json(items)
      } catch (e){
        console.error('Local messages load error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if(req.method === 'POST'){
      try{
        const obj = await localInsert('messages', sanitizeObject(req.body))
        return res.status(201).json(obj)
      } catch (e){
        console.error('Local message insert error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if(req.method === 'PUT'){
      const { id } = req.query
      try{
        const updated = await localUpdate('messages', id, sanitizeObject(req.body))
        return res.json(updated)
      } catch (e){
        console.error('Local message update error:', e)
        return res.status(500).json({ error: e.message })
      }
    }

    if(req.method === 'DELETE'){
      const { id } = req.query
      try{
        const ok = await localRemove('messages', id)
        if(!ok) return res.status(500).json({ error: 'Failed to delete message' })
        return res.status(204).end()
      } catch (e){
        console.error('Local message delete error:', e)
        return res.status(500).json({ error: e.message })
      }
    }
  }

  if(req.method === 'GET'){
    const { data, error } = await supabaseServer.from('messages').select('*').order('created_at', { ascending: false })
    if(error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  if(req.method === 'POST'){
    const body = sanitizeObject(req.body)
    const { data, error } = await supabaseServer.from('messages').insert([{ ...body }]).select()
    if(error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  if(req.method === 'PUT'){
    const { id } = req.query
    const body = sanitizeObject(req.body)
    const { data, error } = await supabaseServer.from('messages').update({ ...body }).eq('id', id).select()
    if(error) return res.status(500).json({ error: error.message })
    return res.json(data[0])
  }

  if(req.method === 'DELETE'){
    const { id } = req.query
    const { error } = await supabaseServer.from('messages').delete().eq('id', id)
    if(error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
