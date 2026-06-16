import { normalizeCategoryLabel } from './makeupCategoryPresets'

export const WAXING_SERVICE_PRESETS = {
  'Full Body Waxing': ['Full Body Wax', 'Half Body Wax', 'Full Arms Wax', 'Full Legs Wax'],
  'Face Waxing': ['Upper Lip Wax', 'Chin Wax', 'Forehead Wax', 'Full Face Wax'],
  'Body Part Waxing': ['Underarm Wax', 'Half Arms Wax', 'Half Legs Wax', 'Back Wax'],
  'Premium Waxing Services': ['Rica Wax', 'Chocolate Wax', 'Aloe Vera Wax', 'Honey Wax'],
  'Sensitive Skin Waxing': ['Sensitive Skin Wax', 'Organic Wax', 'Low-Heat Wax', 'Skin Soothing Treatment'],
  'Bridal Waxing Services': ['Pre-Bridal Full Body Wax', 'Bridal Face Wax', 'Bridal Grooming Package', 'Complete Bridal Waxing'],
  'After-Wax Care': ['Skin Soothing Treatment', 'Tan Removal Treatment', 'Moisturizing Care', 'Ingrown Hair Care'],
}

export function getWaxingPresetsForGroup(groupName) {
  const key = Object.keys(WAXING_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? WAXING_SERVICE_PRESETS[key] : []
}
