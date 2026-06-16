import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import { normalizeCategoryLabel } from './makeupCategoryPresets'
import { FACIAL_SERVICE_PRESETS, getFacialPresetsForGroup } from './facialCategoryPresets'

export { FACIAL_SERVICE_PRESETS, getFacialPresetsForGroup }

function decodeCategoryName(category) {
  if (!category) return category
  return {
    ...category,
    name: normalizeCategoryLabel(category.name),
  }
}

export async function fetchFacialCategories() {
  let items = []
  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('facial_categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    items = data || []
  } else {
    items = await localList('facial_categories')
  }
  return items
    .map(decodeCategoryName)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}
