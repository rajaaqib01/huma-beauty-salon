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
  const items = await localList('facial_categories')
  return items
    .map(decodeCategoryName)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}
