import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'

async function publicBookingHandler(req, res) {
  if (!supabaseServer) {
    // Fallback to local JSON store
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' })
    }
    const body = sanitizeObject(req.body)
    try {
      const obj = await localInsert('bookings', body)
      return res.status(201).json(obj)
    } catch (e) {
      console.error('Local booking create error:', e)
      return res.status(500).json({ error: 'Failed to create booking' })
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const body = sanitizeObject(req.body)
  const { data, error } = await supabaseServer.from('bookings').insert([{ ...body }]).select()
  if (error) return res.status(500).json({ error: 'Failed to create booking' })
  return res.status(201).json(data[0])
}

async function adminBookingHandler(req, res) {
  if (!supabaseServer) {
    // Local fallback handlers
    if (req.method === 'GET') {
      try {
        const items = await localList('bookings')
        return res.json(items)
      } catch (e) {
        console.error('Local bookings load error:', e)
        return res.status(500).json({ error: 'Failed to load bookings' })
      }
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'Missing booking id' })
      const body = sanitizeObject(req.body)
      try {
        const updated = await localUpdate('bookings', id, body)
        if (!updated) return res.status(500).json({ error: 'Failed to update booking' })
        return res.json(updated)
      } catch (e) {
        console.error('Local booking update error:', e)
        return res.status(500).json({ error: 'Failed to update booking' })
      }
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'Missing booking id' })
      try {
        const ok = await localRemove('bookings', id)
        if (!ok) return res.status(500).json({ error: 'Failed to delete booking' })
        return res.status(204).end()
      } catch (e) {
        console.error('Local booking delete error:', e)
        return res.status(500).json({ error: 'Failed to delete booking' })
      }
    }
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseServer.from('bookings').select('*').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: 'Failed to load bookings' })
    return res.json(data)
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Missing booking id' })
    const body = sanitizeObject(req.body)
    const { data, error } = await supabaseServer.from('bookings').update({ ...body }).eq('id', id).select()
    if (error) return res.status(500).json({ error: 'Failed to update booking' })
    return res.json(data[0])
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Missing booking id' })
    const { error } = await supabaseServer.from('bookings').delete().eq('id', id)
    if (error) return res.status(500).json({ error: 'Failed to delete booking' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return publicBookingHandler(req, res)
  }
  return requireAdmin(adminBookingHandler)(req, res)
}
