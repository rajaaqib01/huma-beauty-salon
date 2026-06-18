import { requireAdmin } from '../../../lib/adminSession'
import { getStorageBackend, isProductionPersistentStorage } from '../../../lib/storageBackend'
import { adminList } from '../../../lib/adminDb'
import { SUPABASE_NETLIFY_SETUP_MSG } from '../../../lib/supabaseRuntime'
import { supabaseServer } from '../../../lib/supabaseServer'

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const backend = getStorageBackend()
  let servicesCount = 0
  let supabaseReadOk = true

  try {
    const items = await adminList('services', (db) =>
      db.from('services').select('*').order('created_at', { ascending: true })
    )
    servicesCount = items.length
    if (supabaseServer) {
      const probe = await supabaseServer.from('services').select('id').limit(1)
      supabaseReadOk = !probe.error
    }
  } catch (err) {
    return res.status(500).json({
      backend,
      persistent: isProductionPersistentStorage(),
      error: err.message || 'Could not read services',
    })
  }

  return res.json({
    backend,
    persistent: isProductionPersistentStorage(),
    is_netlify: Boolean(process.env.NETLIFY),
    services_count: servicesCount,
    supabase_read_ok: supabaseReadOk,
    needs_supabase: Boolean(process.env.NETLIFY) && (!supabaseReadOk || backend !== 'supabase'),
    setup_message: SUPABASE_NETLIFY_SETUP_MSG,
  })
}

export default requireAdmin(handler)
