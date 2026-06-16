import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import {
  MAKEUP_SERVICE_PRESETS,
  normalizeCategoryLabel,
  getMakeupPresetsForGroup,
} from './makeupCategoryPresets'

export { MAKEUP_SERVICE_PRESETS, normalizeCategoryLabel, getMakeupPresetsForGroup }

export function decodeCategoryName(category) {
  if (!category) return category
  return {
    ...category,
    name: normalizeCategoryLabel(category.name),
  }
}

export async function fetchMakeupCategories() {
  let items = []
  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('makeup_categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    items = data || []
  } else {
    items = await localList('makeup_categories')
  }
  return items
    .map(decodeCategoryName)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}
