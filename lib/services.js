import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import { fetchMakeupCategories } from './makeupCategories'
import { fetchHairCategories } from './hairCategories'
import { fetchFacialCategories } from './facialCategories'
import { fetchNailsCategories } from './nailsCategories'
import { fetchWaxingCategories } from './waxingCategories'
import { fetchMehndiCategories } from './mehndiCategories'
import { normalizeCategoryLabel } from './makeupCategoryPresets'
import { SERVICE_SECTIONS, HOME_FEATURED_SERVICES, formatPrice, toDisplayService, sortServicesByPrice } from './serviceConfig'

export { SERVICE_SECTIONS, SERVICE_CATEGORIES, HOME_FEATURED_SERVICES, formatPrice, toDisplayService, parsePriceNumber, sortServicesByPrice } from './serviceConfig'

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
    grouped[section.id] = sortServicesByPrice(
      raw.filter(s => String(s.category).toLowerCase() === section.category.toLowerCase())
    ).map(toDisplayService)
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
    const inCategory = raw
      .filter(s => String(s.category).toLowerCase() === section.category.toLowerCase())
      .map(toDisplayService)

    // Prefer curated titles when they exist, otherwise show all admin services in category
    const featured = HOME_FEATURED_SERVICES[section.id] || []
    const byTitle = new Map(
      inCategory.map(s => [String(s.name).toLowerCase().trim(), s])
    )
    const curated = featured
      .map(title => byTitle.get(String(title).toLowerCase().trim()))
      .filter(Boolean)

    const list = curated.length > 0 ? curated : inCategory.slice(0, 8)
    grouped[section.id] = sortServicesByPrice(list, 'price')
  }
  return grouped
}

export async function getBookingServices() {
  const raw = await fetchServices()
  return sortServicesByPrice(raw).map(s => ({
    id: s.id,
    name: s.title,
    price: formatPrice(s.price),
    category: s.category || '',
  }))
}

export async function getMakeupGroupedBySubcategory() {
  return getCategoryGroupedBySubcategory('makeup', fetchMakeupCategories, 'Other Makeup Services')
}

export async function getHairGroupedBySubcategory() {
  return getCategoryGroupedBySubcategory('hair', fetchHairCategories, 'Other Hair Services')
}

export async function getFacialGroupedBySubcategory() {
  return getCategoryGroupedBySubcategory('facial', fetchFacialCategories, 'Other Facial Services')
}

export async function getNailsGroupedBySubcategory() {
  return getCategoryGroupedBySubcategory('nails', fetchNailsCategories, 'Other Nails Services')
}

export async function getWaxingGroupedBySubcategory() {
  return getCategoryGroupedBySubcategory('waxing', fetchWaxingCategories, 'Other Waxing Services')
}

export async function getMehndiGroupedBySubcategory() {
  return getCategoryGroupedBySubcategory('mehndi', fetchMehndiCategories, 'Other Mehndi Services')
}

async function getCategoryGroupedBySubcategory(categoryKey, fetchCategories, otherLabel) {
  const [raw, categories] = await Promise.all([fetchServices(), fetchCategories()])
  const categoryRaw = raw.filter((s) => String(s.category).toLowerCase() === categoryKey)

  const groups = categories.map((cat) => {
    const catName = normalizeCategoryLabel(cat.name)
    return {
      id: cat.id,
      name: catName,
      sort_order: cat.sort_order || 0,
      services: sortServicesByPrice(
        categoryRaw.filter((s) => normalizeCategoryLabel(s.subcategory).toLowerCase() === catName.toLowerCase())
      ).map(toDisplayService),
    }
  })

  const assignedIds = new Set(groups.flatMap((g) => g.services.map((s) => s.id)))
  const uncategorized = categoryRaw
    .filter((s) => !assignedIds.has(s.id))
    .map(toDisplayService)

  if (uncategorized.length > 0) {
    groups.push({
      id: 'uncategorized',
      name: otherLabel,
      sort_order: 999,
      services: sortServicesByPrice(uncategorized, 'price'),
    })
  }

  return groups.filter((g) => g.services.length > 0)
}
