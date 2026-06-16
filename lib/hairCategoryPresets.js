/** Client-safe hair category labels and service title presets (no Node/fs imports). */

import { normalizeCategoryLabel } from './makeupCategoryPresets'

export const HAIR_SERVICE_PRESETS = {
  'Hair Cutting': [
    'Ladies Hair Cut',
    'Layer Cut',
    'Step Cut',
    'Trim',
  ],
  'Hair Styling': [
    'Blow Dry',
    'Hair Straightening',
    'Hair Curling',
    'Hair Setting',
  ],
  'Hair Treatments': [
    'Keratin Treatment',
    'Smoothening',
    'Rebonding',
    'Hair Spa',
  ],
  'Hair Coloring': [
    'Full Hair Color',
    'Root Touch Up',
    'Highlights',
    'Balayage',
  ],
}

export function getHairPresetsForGroup(groupName) {
  const key = Object.keys(HAIR_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? HAIR_SERVICE_PRESETS[key] : []
}
