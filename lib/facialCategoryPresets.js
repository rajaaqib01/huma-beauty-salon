/** Client-safe facial category labels and service title presets (no Node/fs imports). */

import { normalizeCategoryLabel } from './makeupCategoryPresets'

export const FACIAL_SERVICE_PRESETS = {
  'Basic Facial': [
    'Clean Up',
    'Basic Facial',
  ],
  'Whitening Facial': [
    'Whitening Facial',
  ],
  'Advanced Facial': [
    'Gold Facial',
    'Diamond Facial',
    'Pearl Facial',
    'Hydra Facial',
  ],
  'Skin Treatment': [
    'Acne Treatment',
    'Anti-Aging Facial',
    'Skin Polishing',
    'Whitening Treatment',
  ],
  'Luxury Facial': [
    'Dermalogica Facial',
    'Organic Facial',
    'Herbal Facial',
  ],
}

export function getFacialPresetsForGroup(groupName) {
  const key = Object.keys(FACIAL_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? FACIAL_SERVICE_PRESETS[key] : []
}
