#!/usr/bin/env node
/**
 * Regenerate category JSON + services.json from the salon catalog structure.
 */
import { writeFileSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = resolve(root, 'data')

const CATALOG = {
  Makeup: {
    slug: 'makeup',
    groups: [
      { name: 'Bridal Makeup', services: ['Bridal Makeup', 'HD Bridal Makeup', 'Airbrush Makeup', 'Walima Makeup', 'Engagement Makeup'] },
      { name: 'Party Makeup', services: ['Party Makeup', 'Soft Glam Makeup', 'Evening Makeup', 'Day Makeup', 'Natural Makeup'] },
      { name: 'Fashion / Model Makeup', services: ['Model Makeup', 'Photoshoot Makeup', 'Editorial Makeup', 'Ramp Makeup'] },
      { name: 'HD & Airbrush', services: ['HD Makeup', 'Airbrush Makeup', 'Waterproof Makeup', 'Long Lasting Makeup'] },
      { name: 'Casual Makeup', services: ['Daily Makeup', 'Light Makeup', 'No-Makeup Look', 'Office Makeup'] },
    ],
  },
  Facial: {
    slug: 'facial',
    groups: [
      { name: 'Basic Facial', services: ['Clean Up', 'Basic Facial'] },
      { name: 'Whitening Facial', services: ['Whitening Facial'] },
      { name: 'Advanced Facial', services: ['Gold Facial', 'Diamond Facial', 'Pearl Facial', 'Hydra Facial'] },
      { name: 'Skin Treatment', services: ['Acne Treatment', 'Anti-Aging Facial', 'Skin Polishing', 'Whitening Treatment'] },
      { name: 'Luxury Facial', services: ['Dermalogica Facial', 'Organic Facial', 'Herbal Facial'] },
    ],
  },
  Hair: {
    slug: 'hair',
    groups: [
      { name: 'Hair Cutting', services: ['Ladies Hair Cut', 'Layer Cut', 'Step Cut', 'Trim'] },
      { name: 'Hair Styling', services: ['Blow Dry', 'Hair Straightening', 'Hair Curling', 'Hair Setting'] },
      { name: 'Hair Treatments', services: ['Keratin Treatment', 'Smoothening', 'Rebonding', 'Hair Spa'] },
      { name: 'Hair Coloring', services: ['Full Hair Color', 'Root Touch Up', 'Highlights', 'Balayage'] },
    ],
  },
  Mehndi: {
    slug: 'mehndi',
    groups: [
      { name: 'Bridal Mehndi', services: ['Full Hand Mehndi', 'Full Feet Mehndi', 'Arabic Bridal Mehndi'] },
      { name: 'Casual Mehndi', services: ['Simple Mehndi', 'Arabic Mehndi', 'Indo-Arabic Mehndi'] },
      { name: 'Event Mehndi', services: ['Eid Mehndi', 'Party Mehndi', 'Engagement Mehndi'] },
    ],
  },
  Waxing: {
    slug: 'waxing',
    groups: [
      { name: 'Body Waxing', services: ['Full Body Wax', 'Half Body Wax'] },
      { name: 'Arms & Legs', services: ['Full Arms Wax', 'Half Arms Wax', 'Full Legs Wax', 'Half Legs Wax'] },
      { name: 'Face Wax', services: ['Upper Lip', 'Chin Wax', 'Full Face Wax'] },
      { name: 'Special Wax', services: ['Rica Wax', 'Chocolate Wax', 'Hard Wax'] },
    ],
  },
  Nails: {
    slug: 'nails',
    groups: [
      { name: 'Manicure', services: ['Basic Manicure', 'Spa Manicure', 'Gel Manicure'] },
      { name: 'Pedicure', services: ['Basic Pedicure', 'Spa Pedicure', 'Luxury Pedicure'] },
      { name: 'Nail Extensions', services: ['Acrylic Nails', 'Gel Extensions', 'Nail Tips'] },
      { name: 'Nail Art', services: ['Simple Nail Art', '3D Nail Art', 'Bridal Nail Art'] },
      { name: 'Nail Care', services: ['Nail Repair', 'Cuticle Care', 'Nail Strength ening'] },
    ],
  },
}

// fix typo
CATALOG.Nails.groups[4].services[2] = 'Nail Strengthening'

const DEFAULT_IMAGES = {
  Makeup: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80',
  Hair: 'https://i.pinimg.com/1200x/7e/ee/ce/7eeece0d44b374dfe75cc09232162440.jpg?w=600&q=80',
  Facial: 'https://i.pinimg.com/1200x/cc/1a/4e/cc1a4e2f556732f7a884890488a64290.jpg?w=600&q=80',
  Nails: 'https://i.pinimg.com/736x/f5/7a/07/f57a0701d73af79030afb2626dd87f56.jpg?w=600&q=80',
  Mehndi: 'https://i.pinimg.com/736x/2d/86/59/2d86596f9bbb18306ac58f16ac9baf17.jpg?w=600&q=80',
  Waxing: 'https://i.pinimg.com/736x/a4/42/73/a44273bd520404bffe87317d0da80abf.jpg?w=600&q=80',
}

let existingByTitle = {}
try {
  const existing = JSON.parse(readFileSync(resolve(dataDir, 'services.json'), 'utf8'))
  existingByTitle = Object.fromEntries(existing.map((s) => [s.title, s]))
} catch {
  existingByTitle = {}
}

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function defaultPrice(category, title) {
  const prev = existingByTitle[title]?.price
  if (prev) return String(prev).replace(/[^\d]/g, '') || prev

  const t = title.toLowerCase()
  if (category === 'Makeup') {
    if (t.includes('bridal') && !t.includes('party')) return '15000'
    if (t.includes('walima') || t.includes('engagement')) return '12000'
    if (t.includes('hd') || t.includes('airbrush')) return '10000'
    if (t.includes('party') || t.includes('glam') || t.includes('evening')) return '7000'
    if (t.includes('model') || t.includes('ramp') || t.includes('editorial') || t.includes('photoshoot')) return '9000'
    if (t.includes('waterproof') || t.includes('long lasting')) return '8500'
    if (t.includes('daily') || t.includes('office') || t.includes('light') || t.includes('natural') || t.includes('no-makeup')) return '3500'
    return '5000'
  }
  if (category === 'Facial') {
    if (t.includes('dermalogica') || t.includes('luxury') || t.includes('organic') || t.includes('herbal')) return '8000'
    if (t.includes('hydra') || t.includes('diamond') || t.includes('gold') || t.includes('pearl')) return '6500'
    if (t.includes('clean')) return '2500'
    if (t.includes('whitening') || t.includes('polishing')) return '5500'
    if (t.includes('acne') || t.includes('anti-aging')) return '6000'
    return '4500'
  }
  if (category === 'Hair') {
    if (t.includes('keratin') || t.includes('rebonding') || t.includes('smoothening')) return '15000'
    if (t.includes('balayage') || t.includes('highlights')) return '8000'
    if (t.includes('color')) return '6000'
    if (t.includes('cut') || t.includes('trim') || t.includes('layer') || t.includes('step')) return '1500'
    if (t.includes('spa')) return '5000'
    if (t.includes('blow') || t.includes('curl') || t.includes('straight') || t.includes('setting')) return '2000'
    return '3000'
  }
  if (category === 'Mehndi') {
    if (t.includes('bridal') || t.includes('full hand') || t.includes('full feet')) return '12000'
    if (t.includes('engagement')) return '8000'
    if (t.includes('arabic') && t.includes('bridal')) return '10000'
    if (t.includes('simple') || t.includes('eid')) return '1500'
    return '3500'
  }
  if (category === 'Waxing') {
    if (t.includes('full body')) return '8000'
    if (t.includes('half body')) return '5000'
    if (t.includes('full legs') || t.includes('full arms')) return '2500'
    if (t.includes('half legs') || t.includes('half arms')) return '1500'
    if (t.includes('upper lip')) return '500'
    if (t.includes('full face')) return '2000'
    if (t.includes('rica') || t.includes('chocolate') || t.includes('hard wax')) return '3500'
    return '1200'
  }
  if (category === 'Nails') {
    if (t.includes('bridal')) return '8000'
    if (t.includes('acrylic') || t.includes('gel extension') || t.includes('nail tips')) return '6000'
    if (t.includes('3d')) return '4500'
    if (t.includes('luxury pedicure')) return '5000'
    if (t.includes('spa')) return '3500'
    if (t.includes('repair') || t.includes('cuticle') || t.includes('strengthening')) return '2000'
    return '2500'
  }
  return '3000'
}

function defaultDescription(category, title) {
  const prev = existingByTitle[title]?.description
  if (prev) return prev
  return `Professional ${title.toLowerCase()} service at Huma Beauty Saloon, Jhelum.`
}

function defaultImage(category, title) {
  return existingByTitle[title]?.image_url || DEFAULT_IMAGES[category]
}

const allServices = []
const categoryFiles = {}

for (const [category, config] of Object.entries(CATALOG)) {
  const categories = config.groups.map((group, index) => ({
    id: `${config.slug}-${slugify(group.name).slice(0, 24)}`,
    name: group.name,
    sort_order: index + 1,
  }))
  categoryFiles[`${config.slug}_categories`] = categories

  for (const group of config.groups) {
    for (const title of group.services) {
      const id = existingByTitle[title]?.id || `svc-${config.slug}-${slugify(title)}`
      allServices.push({
        id,
        title,
        description: defaultDescription(category, title),
        price: defaultPrice(category, title),
        category,
        subcategory: group.name,
        image_url: defaultImage(category, title),
        created_at: existingByTitle[title]?.created_at || new Date().toISOString(),
      })
    }
  }
}

writeFileSync(resolve(dataDir, 'services.json'), JSON.stringify(allServices, null, 2) + '\n')
for (const [name, items] of Object.entries(categoryFiles)) {
  writeFileSync(resolve(dataDir, `${name}.json`), JSON.stringify(items, null, 2) + '\n')
}

console.log('Generated', allServices.length, 'services')
for (const [cat, cfg] of Object.entries(CATALOG)) {
  const count = allServices.filter((s) => s.category === cat).length
  console.log(`  ${cat}: ${cfg.groups.length} groups, ${count} services`)
}
