import { list as localList } from './localDb'
import { supabaseRead } from './supabaseRuntime'

export async function fetchStaff() {
  return supabaseRead(
    'staff',
    (db) => db.from('staff').select('*').order('created_at', { ascending: false }),
    () => localList('staff'),
  )
}

export async function getPublicStaff() {
  const all = await fetchStaff()
  return all.filter(s => s.active !== false).map(s => ({
    id: s.id,
    name: s.name,
    role: decodeText(s.role) || 'Stylist',
    specialty: decodeText(s.specialty) || '',
    bio: decodeText(s.bio) || '',
    img: s.image_url || 'https://images.unsplash.com/photo-1560066984-138daaa56d8c?w=400&q=80',
  }))
}

function decodeText(value) {
  if (!value || typeof value !== 'string') return value || ''
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
}
