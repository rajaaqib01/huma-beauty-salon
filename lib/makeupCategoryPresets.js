/** Client-safe makeup category labels and service title presets (no Node/fs imports). */

export const MAKEUP_SERVICE_PRESETS = {
  'Bridal Makeup': [
    'Bridal Makeup',
    'HD Bridal Makeup',
    'Airbrush Makeup',
    'Walima Makeup',
    'Engagement Makeup',
  ],
  'Party Makeup': [
    'Party Makeup',
    'Soft Glam Makeup',
    'Evening Makeup',
    'Day Makeup',
    'Natural Makeup',
  ],
  'Fashion / Model Makeup': [
    'Model Makeup',
    'Photoshoot Makeup',
    'Editorial Makeup',
    'Ramp Makeup',
  ],
  'HD & Airbrush': [
    'HD Makeup',
    'Airbrush Makeup',
    'Waterproof Makeup',
    'Long Lasting Makeup',
  ],
  'Casual Makeup': [
    'Daily Makeup',
    'Light Makeup',
    'No-Makeup Look',
    'Office Makeup',
  ],
}

export function normalizeCategoryLabel(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getMakeupPresetsForGroup(groupName) {
  const key = Object.keys(MAKEUP_SERVICE_PRESETS).find(
    (name) => normalizeCategoryLabel(name).toLowerCase() === normalizeCategoryLabel(groupName).toLowerCase()
  )
  return key ? MAKEUP_SERVICE_PRESETS[key] : []
}
