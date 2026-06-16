import { normalizeCategoryLabel } from './makeupCategoryPresets'

export const NAILS_SERVICE_PRESETS = {
  'Manicure Services': ['Classic Manicure', 'Spa Manicure', 'Luxury Manicure'],
  'Pedicure Services': ['Classic Pedicure', 'Spa Pedicure', 'Deluxe Pedicure'],
  'Nail Extensions': ['Gel Extensions', 'Acrylic Extensions', 'French Extensions'],
  'Nail Art': ['Simple Nail Art', 'Bridal Nail Art', '3D Nail Art', 'Custom Nail Design'],
  'Gel & Acrylic Nails': ['Gel Nails', 'Acrylic Nails', 'Gel Polish'],
  'Bridal Nail Packages': ['Bridal Nails', 'Wedding Nail Art', 'Luxury Bridal Nails'],
  'Nail Care Treatments': ['Nail Repair', 'Cuticle Treatment', 'Nail Strengthening Treatment'],
}

export function getNailsPresetsForGroup(groupName) {
  const key = Object.keys(NAILS_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? NAILS_SERVICE_PRESETS[key] : []
}
