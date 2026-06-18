import { list as localList, insert as localInsert, update as localUpdate } from './localDb'

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '')
}

export async function addLoyaltyPoints(phone, points = 10) {
  const normalized = normalizePhone(phone)
  if (!normalized) return null

  const all = await localList('loyalty')
  const existing = all.find((r) => normalizePhone(r.phone) === normalized)
  const now = new Date().toISOString()

  if (existing) {
    return localUpdate('loyalty', existing.id, {
      points: (existing.points || 0) + points,
      visits: (existing.visits || 0) + 1,
      updated_at: now,
    })
  }

  return localInsert('loyalty', {
    phone: normalized,
    points,
    visits: 1,
    created_at: now,
  })
}

export async function getLoyaltyByPhone(phone) {
  const normalized = normalizePhone(phone)
  if (!normalized) return null
  const all = await localList('loyalty')
  return all.find((r) => normalizePhone(r.phone) === normalized) || null
}
