import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import { normalizeCategoryLabel } from './makeupCategoryPresets'
import { MEHNDI_SERVICE_PRESETS, getMehndiPresetsForGroup } from './mehndiCategoryPresets'

export { MEHNDI_SERVICE_PRESETS, getMehndiPresetsForGroup }

function decodeCategoryName(category) {
  if (!category) return category
  return { ...category, name: normalizeCategoryLabel(category.name) }
}

export async function fetchMehndiCategories() {
  let items = []
  if (supabaseServer) {
    const { data, error } = await supabaseServer.from('mehndi_categories').select('*').order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    items = data || []
  } else {
    items = await localList('mehndi_categories')
  }
  return items.map(decodeCategoryName).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}
