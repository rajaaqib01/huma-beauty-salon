import { requireAdmin } from '../../../lib/adminSession'
import { rejectUnlessCanDelete } from '../../../lib/adminRoles'
import { supabaseServer } from '../../../lib/supabaseServer'
import { list as localList, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'
import { notifyCustomerBookingStatus } from '../../../lib/notifications'
import { parsePriceAmount, formatPrice } from '../../../lib/bookingSales'

function enrichBookingPatch(body, previous) {
  const patch = { ...body }
  if (patch.status === 'confirmed' && previous?.status !== 'confirmed') {
    patch.confirmed_at = new Date().toISOString()
    if (!previous?.source) patch.source = 'online'
    const priceLabel = patch.price ?? previous?.price
    if (priceLabel) {
      const amount = parsePriceAmount(priceLabel)
      patch.sale_amount = amount
      patch.price = formatPrice(amount)
    }
  }
  if (patch.price !== undefined && patch.sale_amount === undefined) {
    patch.sale_amount = parsePriceAmount(patch.price)
  }
  return patch
}

async function handleStatusNotify(previous, updated) {
  if (!updated || !previous) return
  if (previous.status === updated.status) return
  if (updated.status === 'confirmed' || updated.status === 'cancelled') {
    setImmediate(() => notifyCustomerBookingStatus(updated, updated.status).catch(console.error))
  }
}

async function adminBookingHandler(req, res) {
  if (!supabaseServer) {
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
        const all = await localList('bookings')
        const previous = all.find(b => String(b.id) === String(id))
        const patch = enrichBookingPatch(body, previous)
        const updated = await localUpdate('bookings', id, patch)
        if (!updated) return res.status(404).json({ error: 'Booking not found' })
        if (body.status) await handleStatusNotify(previous, updated)
        return res.json(updated)
      } catch (e) {
        console.error('Local booking update error:', e)
        return res.status(500).json({ error: 'Failed to update booking' })
      }
    }

    if (req.method === 'DELETE') {
      if (rejectUnlessCanDelete(req, res)) return
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'Missing booking id' })
      try {
        const ok = await localRemove('bookings', id)
        if (!ok) return res.status(404).json({ error: 'Booking not found' })
        return res.status(204).end()
      } catch (e) {
        console.error('Local booking delete error:', e)
        return res.status(500).json({ error: 'Failed to delete booking' })
      }
    }

    res.setHeader('Allow', 'GET,PUT,DELETE')
    return res.status(405).end('Method Not Allowed')
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

    const { data: prevData } = await supabaseServer.from('bookings').select('*').eq('id', id).single()
    const patch = enrichBookingPatch(body, prevData)
    const { data, error } = await supabaseServer.from('bookings').update({ ...patch }).eq('id', id).select()
    if (error) return res.status(500).json({ error: 'Failed to update booking' })
    if (body.status && prevData) await handleStatusNotify(prevData, data[0])
    return res.json(data[0])
  }

  if (req.method === 'DELETE') {
    if (rejectUnlessCanDelete(req, res)) return
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Missing booking id' })
    const { error } = await supabaseServer.from('bookings').delete().eq('id', id)
    if (error) return res.status(500).json({ error: 'Failed to delete booking' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default requireAdmin(adminBookingHandler)
