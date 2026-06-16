import { requireAdmin } from '../../../lib/adminSession'
import { resetCatalogSyncVersion, REPO_DATA_VERSION } from '../../../lib/netlifyBlobsDb'
import { list as localList } from '../../../lib/localDb'

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await resetCatalogSyncVersion()
    const services = await localList('services')
    const makeupCategories = await localList('makeup_categories')
    const withSub = services.filter((s) => String(s.subcategory || '').trim()).length

    return res.json({
      ok: true,
      repo_data_version: REPO_DATA_VERSION,
      services_total: services.length,
      services_with_subcategory: withSub,
      makeup_category_groups: makeupCategories.length,
    })
  } catch (err) {
    console.error('Catalog sync error:', err)
    return res.status(500).json({ error: err.message || 'Sync failed' })
  }
}

export default requireAdmin(handler)
