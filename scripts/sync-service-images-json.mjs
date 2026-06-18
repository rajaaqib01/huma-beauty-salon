#!/usr/bin/env node
/**
 * Ensures every uploaded service image file is linked in data/services.json
 * and writes the JSON back so the live site reads the same image_url values.
 */
import fs from 'fs/promises'
import path from 'path'

const servicesPath = path.join(process.cwd(), 'data', 'services.json')
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'services')

const services = JSON.parse(await fs.readFile(servicesPath, 'utf8'))
const uploadFiles = new Set(await fs.readdir(uploadsDir))
const now = new Date().toISOString()

let updated = 0
let linked = 0

for (const service of services) {
  const imageUrl = String(service.image_url || '').trim()
  if (!imageUrl.startsWith('/uploads/services/')) continue

  const filename = imageUrl.split('/').pop()
  if (!uploadFiles.has(filename)) {
    console.warn(`Missing file for ${service.title}: ${filename}`)
    continue
  }

  linked += 1
  if (!service.updated_at) {
    service.updated_at = now
    updated += 1
  }
}

await fs.writeFile(servicesPath, `${JSON.stringify(services, null, 2)}\n`, 'utf8')

console.log(`Services with upload images in JSON: ${linked}`)
console.log(`Added missing updated_at fields: ${updated}`)
console.log(`Saved ${servicesPath}`)

const referenced = new Set(
  services
    .map((service) => String(service.image_url || '').split('/').pop())
    .filter(Boolean)
)
const unlinked = [...uploadFiles].filter((file) => !referenced.has(file))
if (unlinked.length) {
  console.log('Upload files not linked in JSON yet:')
  for (const file of unlinked) console.log(`  - ${file}`)
}
