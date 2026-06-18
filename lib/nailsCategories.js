import { list as localList } from './localDb'
import { supabaseRead } from './supabaseRuntime'
import { normalizeCategoryLabel } from './makeupCategoryPresets'
import { NAILS_SERVICE_PRESETS, getNailsPresetsForGroup } from './nailsCategoryPresets'

export { NAILS_SERVICE_PRESETS, getNailsPresetsForGroup }

function decodeCategoryName(category) {
  if (!category) return category
  return { ...category, name: normalizeCategoryLabel(category.name) }
}

export async function fetchNailsCategories() {
  const items = await supabaseRead(
    'nails_categories',
    (db) => db.from('nails_categories').select('*').order('sort_order', { ascending: true }),
    () => localList('nails_categories'),
  )
  return items.map(decodeCategoryName).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}
