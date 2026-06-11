import { list as localList, insert as localInsert, update as localUpdate } from './localDb'

export async function addLoyaltyPoints(phone, points = 10) {
  const normalized = String(phone || '').replace(/\D/g, '')
  if (!normalized) return null

  const all = await localList('loyalty')
  const existing = all.find(r => String(r.phone).replace(/\D/g, '') === normalized)

  if (existing) {
    return localUpdate('loyalty', existing.id, {
      points: (existing.points || 0) + points,
      visits: (existing.visits || 0) + 1,
      updated_at: new Date().toISOString(),
    })
  }

  return localInsert('loyalty', {
    phone: normalized,
    points,
    visits: 1,
    created_at: new Date().toISOString(),
  })
}

export async function getLoyaltyByPhone(phone) {
  const normalized = String(phone || '').replace(/\D/g, '')
  const all = await localList('loyalty')
  return all.find(r => String(r.phone).replace(/\D/g, '') === normalized) || null
}
