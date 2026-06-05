import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import { SERVICE_SECTIONS, formatPrice, toDisplayService } from './serviceConfig'

export { SERVICE_SECTIONS, SERVICE_CATEGORIES, formatPrice, toDisplayService } from './serviceConfig'

export async function fetchServices() {
  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('services')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    return data || []
  }
  return localList('services')
}

export async function getGroupedServices() {
  const raw = await fetchServices()
  const grouped = {}
  for (const section of SERVICE_SECTIONS) {
    grouped[section.id] = raw
      .filter(s => String(s.category).toLowerCase() === section.category.toLowerCase())
      .map(toDisplayService)
  }
  return grouped
}

export async function getBookingServices() {
  const raw = await fetchServices()
  return raw.map(s => ({
    id: s.id,
    name: s.title,
    price: formatPrice(s.price),
    category: s.category || '',
  }))
}
