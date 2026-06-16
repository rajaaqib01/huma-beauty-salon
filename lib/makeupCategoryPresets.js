/** Client-safe makeup category labels and service title presets (no Node/fs imports). */

export const MAKEUP_SERVICE_PRESETS = {
  'Bridal Makeup': [
    'Bridal Makeup Barat',
    'Bridal Makeup Walima',
    'Nikkah & Engagement Makeup',
    'Bridal Trial',
  ],
  'Event & Party Makeup': [
    'Party Makeup',
    'Mehndi Makeup',
    'Engagement Makeup',
    'Festive Makeup',
  ],
  'Everyday & Special Occasion Makeup': [
    'Everyday Makeup',
    'Office Makeup',
    'Photoshoot Makeup',
    'Editorial Makeup',
  ],
  'Correction & Touch-Up Services': [
    'Makeup Touch-Up',
    'Makeup Correction',
    'Makeup Removal & Refresh',
    'Makeup Fixing',
  ],
  'Specialized Makeup Services': [
    'HD Makeup',
    'Airbrush Makeup',
    'Bridal Party Makeup',
    'Consultation / Trial',
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
