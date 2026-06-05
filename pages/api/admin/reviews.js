import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { sanitizeObject } from '../../../lib/apiUtils/security'

async function handler(req, res) {
  if (!supabaseServer) {
    return res.status(500).json({ error: 'Supabase server configuration is missing' })
  }
  const { method } = req
  const { id } = req.query

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

export default requireAdmin(handler)
