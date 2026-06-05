import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'
import localDb from '../../../lib/localDb'

async function handler(req, res){
  try{
    if (supabaseServer) {
      const [{ count: total_bookings }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true })
      const [{ count: pending }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true }).eq('status','pending')
      const [{ count: confirmed }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true }).eq('status','confirmed')
      const [{ count: cancelled }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true }).eq('status','cancelled')
      const [{ count: total_services }] = await supabaseServer.from('services').select('*', { count: 'exact', head: true })
      const [{ count: total_messages }] = await supabaseServer.from('messages').select('*', { count: 'exact', head: true })

      return res.json({ total_bookings, pending, confirmed, cancelled, total_services, total_messages })
    }

    // Local JSON fallback
    const bookings = await localDb.list('bookings')
    const services = await localDb.list('services')
    const messages = await localDb.list('messages')

    const total_bookings = bookings.length
    const pending = bookings.filter(b => String(b.status).toLowerCase() === 'pending').length
    const confirmed = bookings.filter(b => String(b.status).toLowerCase() === 'confirmed').length
    const cancelled = bookings.filter(b => String(b.status).toLowerCase() === 'cancelled').length
    const total_services = services.length
    const total_messages = messages.length

    return res.json({ total_bookings, pending, confirmed, cancelled, total_services, total_messages })
  }catch(err){
    return res.status(500).json({ error: 'Failed to load stats' })
  }
}

export default requireAdmin(handler)
