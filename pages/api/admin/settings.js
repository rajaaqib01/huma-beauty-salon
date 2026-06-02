import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { sanitizeObject } from '../utils/security'

async function handler(req, res) {
  if (!supabaseServer) {
    return res.status(500).json({ error: 'Supabase server configuration is missing' })
  }
  const { method } = req
  const { id } = req.query

  if (method === 'GET') {
    const { data, error } = await supabaseServer.from('settings').select('*').limit(1).single()
    return error ? res.status(500).json({ error: error.message }) : res.json(data)
  }

  if (method === 'PUT') {
    const payload = sanitizeObject(req.body)
    const exists = await supabaseServer.from('settings').select('*').limit(1).single()
    if (exists.error) return res.status(500).json({ error: exists.error.message })
    if (exists.data) {
      const { data, error } = await supabaseServer.from('settings').update({ ...payload, updated_at: new Date() }).eq('id', exists.data.id).select()
      return error ? res.status(500).json({ error: error.message }) : res.json(data[0])
    }
    const { data, error } = await supabaseServer.from('settings').insert([{ ...payload }]).select()
    return error ? res.status(500).json({ error: error.message }) : res.json(data[0])
  }

  res.setHeader('Allow', 'GET,PUT')
  res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
