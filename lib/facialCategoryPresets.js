/** Client-safe facial category labels and service title presets (no Node/fs imports). */

import { normalizeCategoryLabel } from './makeupCategoryPresets'

export const FACIAL_SERVICE_PRESETS = {
  'Basic Facial Services': [
    'Cleanup Facial',
    'Fruit Facial',
    'Gold Facial',
    'Silver Facial',
  ],
  'Whitening / Brightening Facials': [
    'Whitening Facial',
    'Brightening Facial',
    'Glow Facial',
    'Instant Radiance Facial',
  ],
  'Advanced Facials': [
    'Hydra Facial',
    'Oxygen Facial',
    'Diamond Facial',
    'Anti-Aging Facial',
  ],
  'Skin Problem Facials': [
    'Acne Facial',
    'Pigmentation Facial',
    'Sensitive Skin Facial',
    'Pore Minimizing Facial',
  ],
  'Herbal / Organic Facials': [
    'Herbal Facial',
    'Organic Facial',
    'Aloe Vera Facial',
    'Natural Glow Facial',
  ],
  'Bridal Facials': [
    'Bridal Facial Package',
    'Pre-Bridal Facial',
    'Luxury Bridal Facial',
  ],
  'Premium / Salon Special Facials': [
    'Signature Facial',
    'Luxury Facial',
    'Premium Skin Therapy',
  ],
}

export function getFacialPresetsForGroup(groupName) {
  const key = Object.keys(FACIAL_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? FACIAL_SERVICE_PRESETS[key] : []
}
