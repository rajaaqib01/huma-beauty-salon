/** Client-safe hair category labels and service title presets (no Node/fs imports). */

import { normalizeCategoryLabel } from './makeupCategoryPresets'

export const HAIR_SERVICE_PRESETS = {
  'Hair Cut Services': [
    'Ladies Hair Cut',
    'Layer Cut',
    'Step Cut',
    'Bob Cut',
  ],
  'Hair Coloring Services': [
    'Global Hair Color',
    'Root Touch Up',
    'Highlights',
    'Balayage',
  ],
  'Hair Treatment Services': [
    'Keratin Treatment',
    'Protein Treatment',
    'Hair Botox',
    'Deep Conditioning',
  ],
  'Hair Styling Services': [
    'Blow Dry',
    'Hair Straightening',
    'Curling',
    'Party Hairstyle',
  ],
  'Bridal Hair Services': [
    'Bridal Hairstyle',
    'Walima Hairstyle',
    'Mehndi Hairstyle',
    'Hair Accessories Setting',
  ],
  'Hair Care Services': [
    'Hair Spa',
    'Scalp Treatment',
    'Dandruff Treatment',
    'Hair Fall Treatment',
  ],
  'Advanced / Premium Services': [
    'Rebonding',
    'Smoothening',
    'Permanent Curls',
    'Hair Extensions',
  ],
}

export function getHairPresetsForGroup(groupName) {
  const key = Object.keys(HAIR_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? HAIR_SERVICE_PRESETS[key] : []
}
