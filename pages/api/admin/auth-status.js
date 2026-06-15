import { getAdminAuthStatus } from '../../../lib/adminUsers'
import { list as localList } from '../../../lib/localDb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const status = getAdminAuthStatus()
  let jsonUserCount = 0
  try {
    const users = await localList('admin_users')
    jsonUserCount = users.filter((u) => u.active !== false).length
  } catch {
    jsonUserCount = 0
  }

  return res.status(200).json({
    ok: status.envEmailConfigured && status.envPasswordConfigured && status.sessionSecretConfigured,
    ...status,
    jsonUserCount,
    note: 'Does not expose emails or passwords — only whether server config is present.',
  })
}
