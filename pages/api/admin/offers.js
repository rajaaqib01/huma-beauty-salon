import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'

async function handler(req, res) {
  if (!supabaseServer) {
    return res.status(500).json({ error: 'Supabase server configuration is missing' })
  }
  const { method } = req
  const { id } = req.query

  if (method === 'GET') {
    if (id) {
      const { data, error } = await supabaseServer.from('offers').select('*').eq('id', id).single()
      return error ? res.status(500).json({ error: error.message }) : res.json(data)
    }
    const { data, error } = await supabaseServer.from('offers').select('*').order('created_at', { ascending: false })
    return error ? res.status(500).json({ error: error.message }) : res.json(data)
  }

  if (method === 'POST') {
    const { data, error } = await supabaseServer.from('offers').insert([req.body]).select()
    return error ? res.status(500).json({ error: error.message }) : res.status(201).json(data[0])
  }

  if (method === 'PUT') {
    const { data, error } = await supabaseServer.from('offers').update({ ...req.body }).eq('id', id).select()
    return error ? res.status(500).json({ error: error.message }) : res.json(data[0])
  }

  if (method === 'DELETE') {
    const { error } = await supabaseServer.from('offers').delete().eq('id', id)
    return error ? res.status(500).json({ error: error.message }) : res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
