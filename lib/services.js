import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import { SERVICE_SECTIONS, HOME_FEATURED_SERVICES, formatPrice, toDisplayService } from './serviceConfig'

export { SERVICE_SECTIONS, SERVICE_CATEGORIES, HOME_FEATURED_SERVICES, formatPrice, toDisplayService } from './serviceConfig'

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

function groupByCategory(raw) {
  const grouped = {}
  for (const section of SERVICE_SECTIONS) {
    grouped[section.id] = raw
      .filter(s => String(s.category).toLowerCase() === section.category.toLowerCase())
      .map(toDisplayService)
  }
  return grouped
}

export async function getGroupedServices() {
  const raw = await fetchServices()
  return groupByCategory(raw)
}

export async function getHomeGroupedServices() {
  const raw = await fetchServices()
  const grouped = {}
  for (const section of SERVICE_SECTIONS) {
    const featured = HOME_FEATURED_SERVICES[section.id] || []
    const byTitle = new Map(
      raw
        .filter(s => String(s.category).toLowerCase() === section.category.toLowerCase())
        .map(s => [String(s.title).toLowerCase().trim(), s])
    )
    grouped[section.id] = featured
      .map(title => byTitle.get(String(title).toLowerCase().trim()))
      .filter(Boolean)
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
