import { list as localList } from './localDb'
import { normalizeCategoryLabel } from './makeupCategoryPresets'
import { HAIR_SERVICE_PRESETS, getHairPresetsForGroup } from './hairCategoryPresets'

export { HAIR_SERVICE_PRESETS, getHairPresetsForGroup }

function decodeCategoryName(category) {
  if (!category) return category
  return {
    ...category,
    name: normalizeCategoryLabel(category.name),
  }
}

export async function fetchHairCategories() {
  const items = await localList('hair_categories')
  return items
    .map(decodeCategoryName)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}
