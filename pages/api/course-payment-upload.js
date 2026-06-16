import { savePaymentScreenshot } from '../../lib/savePaymentScreenshot'
import { rateLimit } from '../../lib/apiUtils/rateLimit'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { data, filename, mimeType } = req.body || {}
    const url = await savePaymentScreenshot({ data, filename, mimeType })
    return res.status(201).json({ url })
  } catch (e) {
    const message = e.message || 'Failed to upload screenshot'
    const status = message.includes('smaller') || message.includes('required') || message.includes('allowed') ? 400 : 500
    return res.status(status).json({ error: message })
  }
}

export default rateLimit(handler, 8, 60000)
