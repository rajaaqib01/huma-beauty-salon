import { requireAdmin } from '../../../lib/adminSession'
import { supabaseServer } from '../../../lib/supabaseServer'

async function handler(req, res){
  if (!supabaseServer) {
    return res.status(500).json({ error: 'Supabase server configuration is missing' })
  }
  try{
    const [{ count: total_bookings }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true })
    const [{ count: pending }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true }).eq('status','pending')
    const [{ count: confirmed }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true }).eq('status','confirmed')
    const [{ count: cancelled }] = await supabaseServer.from('bookings').select('*', { count: 'exact', head: true }).eq('status','cancelled')
    const [{ count: total_services }] = await supabaseServer.from('services').select('*', { count: 'exact', head: true })
    const [{ count: total_messages }] = await supabaseServer.from('messages').select('*', { count: 'exact', head: true })

    return res.json({ total_bookings, pending, confirmed, cancelled, total_services, total_messages })
  }catch(err){
    return res.status(500).json({ error: 'Failed to load stats' })
  }
}

export default requireAdmin(handler)
