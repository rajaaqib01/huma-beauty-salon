import { list as localList } from './localDb'
import { supabaseRead } from './supabaseRuntime'
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
  const items = await supabaseRead(
    'makeup_categories',
    (db) => db.from('makeup_categories').select('*').order('sort_order', { ascending: true }),
    () => localList('makeup_categories'),
  )
  return items
    .map(decodeCategoryName)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}
