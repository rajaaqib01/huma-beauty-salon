import { requireAdmin } from '../../../lib/adminSession'
import { sanitizeObject } from '../../../lib/apiUtils/security'
import { getSettings, saveSettings } from '../../../lib/settings'

async function handler(req, res) {
  const { method } = req

  if (method === 'GET') {
    try {
      const settings = await getSettings()
      return res.json(settings)
    } catch (e) {
      console.error('Settings load error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  if (method === 'PUT') {
    try {
      const payload = sanitizeObject(req.body)
      const updated = await saveSettings(payload)
      return res.json(updated)
    } catch (e) {
      console.error('Settings save error:', e)
      return res.status(500).json({ error: e.message })
    }
  }

  res.setHeader('Allow', 'GET,PUT')
  return res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
