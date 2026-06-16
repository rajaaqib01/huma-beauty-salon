/** Client-safe waxing category labels and service title presets (no Node/fs imports). */

import { normalizeCategoryLabel } from './makeupCategoryPresets'

export const WAXING_SERVICE_PRESETS = {
  'Body Waxing': [
    'Full Body Wax',
    'Half Body Wax',
  ],
  'Arms & Legs': [
    'Full Arms Wax',
    'Half Arms Wax',
    'Full Legs Wax',
    'Half Legs Wax',
  ],
  'Face Wax': [
    'Upper Lip',
    'Chin Wax',
    'Full Face Wax',
  ],
  'Special Wax': [
    'Rica Wax',
    'Chocolate Wax',
    'Hard Wax',
  ],
}

export function getWaxingPresetsForGroup(groupName) {
  const key = Object.keys(WAXING_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? WAXING_SERVICE_PRESETS[key] : []
}
