/** Client-safe nails category labels and service title presets (no Node/fs imports). */

import { normalizeCategoryLabel } from './makeupCategoryPresets'

export const NAILS_SERVICE_PRESETS = {
  'Manicure': [
    'Basic Manicure',
    'Spa Manicure',
    'Gel Manicure',
  ],
  'Pedicure': [
    'Basic Pedicure',
    'Spa Pedicure',
    'Luxury Pedicure',
  ],
  'Nail Extensions': [
    'Acrylic Nails',
    'Gel Extensions',
    'Nail Tips',
  ],
  'Nail Art': [
    'Simple Nail Art',
    '3D Nail Art',
    'Bridal Nail Art',
  ],
  'Nail Care': [
    'Nail Repair',
    'Cuticle Care',
    'Nail Strengthening',
  ],
}

export function getNailsPresetsForGroup(groupName) {
  const key = Object.keys(NAILS_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? NAILS_SERVICE_PRESETS[key] : []
}
