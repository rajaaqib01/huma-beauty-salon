import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import { normalizeCategoryLabel } from './makeupCategoryPresets'
import { WAXING_SERVICE_PRESETS, getWaxingPresetsForGroup } from './waxingCategoryPresets'

export { WAXING_SERVICE_PRESETS, getWaxingPresetsForGroup }

function decodeCategoryName(category) {
  if (!category) return category
  return { ...category, name: normalizeCategoryLabel(category.name) }
}

export async function fetchWaxingCategories() {
  let items = []
  if (supabaseServer) {
    const { data, error } = await supabaseServer.from('waxing_categories').select('*').order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    items = data || []
  } else {
    items = await localList('waxing_categories')
  }
  return items.map(decodeCategoryName).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}
