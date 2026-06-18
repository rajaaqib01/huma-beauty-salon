import { requireAdmin } from '../../../lib/adminSession'
import { rejectUnlessCanDelete } from '../../../lib/adminRoles'
import { list as localList, update as localUpdate, remove as localRemove } from '../../../lib/localDb'
import { sanitizeObject } from '../../../lib/apiUtils/security'
import { notifyStudentAdmissionStatus } from '../../../lib/notifications'

async function handler(req, res) {
  if (req.method === 'GET') {
    const items = await localList('admissions')
    return res.json(items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Admission id is required' })
    const body = sanitizeObject(req.body)

    const all = await localList('admissions')
    const previous = all.find((a) => String(a.id) === String(id))
    const patch = { ...body }
    if (patch.status === 'approved' && previous?.status !== 'approved') {
      patch.approved_at = new Date().toISOString()
    }

    const updated = await localUpdate('admissions', id, patch)
    if (!updated) return res.status(404).json({ error: 'Admission not found' })

    if (body.status && previous && previous.status !== body.status) {
      if (body.status === 'approved' || body.status === 'rejected') {
        setImmediate(() => notifyStudentAdmissionStatus(updated, body.status).catch(console.error))
      }
    }
    return res.json(updated)
  }

  if (req.method === 'DELETE') {
    if (rejectUnlessCanDelete(req, res)) return
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Admission id is required' })
    const ok = await localRemove('admissions', id)
    if (!ok) return res.status(404).json({ error: 'Admission not found' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,PUT,DELETE')
  return res.status(405).end('Method Not Allowed')
}

export default requireAdmin(handler)
