import { list as localList, insert as localInsert, update as localUpdate } from './localDb'
import { supabaseServer } from './supabaseServer'
import { genId } from './dbId'

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '')
}

export async function addLoyaltyPoints(phone, points = 10) {
  const normalized = normalizePhone(phone)
  if (!normalized) return null

  const now = new Date().toISOString()

  if (supabaseServer) {
    const { data: existing, error: readError } = await supabaseServer
      .from('loyalty')
      .select('*')
      .eq('phone', normalized)
      .maybeSingle()

    if (readError) {
      console.error('Supabase loyalty read error:', readError.message)
    } else if (existing) {
      const { data, error } = await supabaseServer
        .from('loyalty')
        .update({
          points: (existing.points || 0) + points,
          visits: (existing.visits || 0) + 1,
          updated_at: now,
        })
        .eq('id', existing.id)
        .select()
        .single()
      if (!error) return data
      console.error('Supabase loyalty update error:', error.message)
    } else {
      const { data, error } = await supabaseServer
        .from('loyalty')
        .insert([{
          id: genId(),
          phone: normalized,
          points,
          visits: 1,
          created_at: now,
          updated_at: now,
        }])
        .select()
        .single()
      if (!error) return data
      console.error('Supabase loyalty insert error:', error.message)
    }
  }

  const all = await localList('loyalty')
  const existing = all.find((r) => normalizePhone(r.phone) === normalized)

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

  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('loyalty')
      .select('*')
      .eq('phone', normalized)
      .maybeSingle()
    if (!error && data) return data
    if (error) console.error('Supabase loyalty lookup error:', error.message)
  }

  const all = await localList('loyalty')
  return all.find((r) => normalizePhone(r.phone) === normalized) || null
}
