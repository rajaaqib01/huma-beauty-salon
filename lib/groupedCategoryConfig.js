import { getMakeupPresetsForGroup } from './makeupCategoryPresets'
import { getHairPresetsForGroup } from './hairCategoryPresets'
import { getFacialPresetsForGroup } from './facialCategoryPresets'
import { getNailsPresetsForGroup } from './nailsCategoryPresets'
import { getWaxingPresetsForGroup } from './waxingCategoryPresets'
import { getMehndiPresetsForGroup } from './mehndiCategoryPresets'

export const GROUPED_CATEGORIES = ['Makeup', 'Hair', 'Facial', 'Nails', 'Mehndi', 'Waxing']

const API_SLUG = {
  Makeup: 'makeup',
  Hair: 'hair',
  Facial: 'facial',
  Nails: 'nails',
  Mehndi: 'mehndi',
  Waxing: 'waxing',
}

export function getCategoryApiUrl(category) {
  const slug = API_SLUG[category]
  return slug ? `/api/${slug}-categories` : null
}

export function getAdminCategoryApiUrl(category) {
  const slug = API_SLUG[category]
  return slug ? `/api/admin/${slug}-categories` : null
}

export function getPresetsForGroup(category, groupName) {
  if (!groupName) return []
  if (category === 'Makeup') return getMakeupPresetsForGroup(groupName)
  if (category === 'Hair') return getHairPresetsForGroup(groupName)
  if (category === 'Facial') return getFacialPresetsForGroup(groupName)
  if (category === 'Nails') return getNailsPresetsForGroup(groupName)
  if (category === 'Mehndi') return getMehndiPresetsForGroup(groupName)
  if (category === 'Waxing') return getWaxingPresetsForGroup(groupName)
  return []
}
