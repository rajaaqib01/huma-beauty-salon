import { requireAdmin } from '../../../lib/adminSession'

async function handler(req, res) {
  return res.status(200).json({ user: { email: req.admin.email } })
}

export default requireAdmin(handler)
