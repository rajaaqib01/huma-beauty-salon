/** Client-safe mehndi category labels and service title presets (no Node/fs imports). */

import { normalizeCategoryLabel } from './makeupCategoryPresets'

export const MEHNDI_SERVICE_PRESETS = {
  'Bridal Mehndi': [
    'Full Hand Mehndi',
    'Full Feet Mehndi',
    'Arabic Bridal Mehndi',
  ],
  'Casual Mehndi': [
    'Simple Mehndi',
    'Arabic Mehndi',
    'Indo-Arabic Mehndi',
  ],
  'Event Mehndi': [
    'Eid Mehndi',
    'Party Mehndi',
    'Engagement Mehndi',
  ],
}

export function getMehndiPresetsForGroup(groupName) {
  const key = Object.keys(MEHNDI_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? MEHNDI_SERVICE_PRESETS[key] : []
}
