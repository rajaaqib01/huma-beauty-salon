import { normalizeCategoryLabel } from './makeupCategoryPresets'

export const MEHNDI_SERVICE_PRESETS = {
  'Bridal Mehndi': ['Full Hand Bridal Mehndi', 'Full Feet Bridal Mehndi', 'Arabic Bridal Mehndi', 'Customized Bridal Design'],
  'Engagement & Nikkah Mehndi': ['Engagement Mehndi', 'Nikkah Mehndi', 'Ring Ceremony Mehndi', 'Minimal Bridal Mehndi'],
  'Arabic Mehndi Designs': ['Simple Arabic Mehndi', 'Heavy Arabic Mehndi', 'Gulf Style Mehndi', 'Modern Arabic Design'],
  'Party & Event Mehndi': ['Party Mehndi', 'Eid Mehndi', 'Festival Mehndi', 'Family Function Mehndi'],
  'Traditional Mehndi Designs': ['Pakistani Mehndi', 'Indian Mehndi', 'Mughlai Mehndi', 'Cultural Mehndi Designs'],
  'Kids & Simple Mehndi': ['Kids Mehndi', 'Simple Hand Mehndi', 'Finger Mehndi', 'Quick Mehndi Design'],
  'Premium Mehndi Services': ['Luxury Bridal Mehndi', 'Glitter Mehndi', 'Colored Mehndi', 'Customized Premium Mehndi Design'],
}

export function getMehndiPresetsForGroup(groupName) {
  const key = Object.keys(MEHNDI_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? MEHNDI_SERVICE_PRESETS[key] : []
}
