import { requireAdmin } from '../../../lib/adminSession'
import { getStorageBackend, isProductionPersistentStorage } from '../../../lib/storageBackend'
import { SUPABASE_NETLIFY_SETUP_MSG } from '../../../lib/supabaseRuntime'
import { list as localList } from '../../../lib/localDb'
import { supabaseServer } from '../../../lib/supabaseServer'

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const backend = getStorageBackend()
  let servicesCount = 0

  try {
    if (supabaseServer) {
      const { count, error } = await supabaseServer
        .from('services')
        .select('*', { count: 'exact', head: true })
      if (error) throw new Error(error.message)
      servicesCount = count || 0
    } else {
      const items = await localList('services')
      servicesCount = Array.isArray(items) ? items.length : 0
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
    needs_supabase: Boolean(process.env.NETLIFY) && backend !== 'supabase',
    setup_message: SUPABASE_NETLIFY_SETUP_MSG,
  })
}

export default requireAdmin(handler)
