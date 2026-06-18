import { list as localList } from './localDb'
import { normalizeCategoryLabel } from './makeupCategoryPresets'
import { WAXING_SERVICE_PRESETS, getWaxingPresetsForGroup } from './waxingCategoryPresets'

export { WAXING_SERVICE_PRESETS, getWaxingPresetsForGroup }

function decodeCategoryName(category) {
  if (!category) return category
  return { ...category, name: normalizeCategoryLabel(category.name) }
}

export async function fetchWaxingCategories() {
  const items = await localList('waxing_categories')
  return items.map(decodeCategoryName).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}
