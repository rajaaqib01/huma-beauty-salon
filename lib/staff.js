import { list as localList } from './localDb'
import { supabaseServer } from './supabaseServer'

export async function fetchStaff() {
  if (supabaseServer) {
    const { data, error } = await supabaseServer.from('staff').select('*').order('created_at', { ascending: false })
    if (!error && data) return data
  }
  return localList('staff')
}

export async function getPublicStaff() {
  const all = await fetchStaff()
  return all.filter(s => s.active !== false).map(s => ({
    id: s.id,
    name: s.name,
    role: s.role || 'Stylist',
    specialty: s.specialty || '',
    bio: s.bio || '',
    img: s.image_url || 'https://images.unsplash.com/photo-1560066984-138daaa56d8c?w=400&q=80',
  }))
}
