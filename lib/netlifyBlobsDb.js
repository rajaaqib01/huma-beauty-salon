import { getStore } from '@netlify/blobs'
import { githubList } from './githubDb'
import { getBundledCatalog } from './bundledCatalog'

const STORE_NAME = 'huma-salon-data'
const SYNC_META_KEY = '__repo_data_version'

/** Bump when bundled catalog changes — triggers Netlify Blobs re-sync. */
export const REPO_DATA_VERSION = 4

const CATEGORY_KEYS = [
  'makeup_categories',
  'hair_categories',
  'facial_categories',
  'nails_categories',
  'mehndi_categories',
  'waxing_categories',
]

let syncPromise = null

function getDataStore() {
  return getStore({ name: STORE_NAME, consistency: 'strong' })
}

async function seedFromFallback(name) {
  try {
    const fromGithub = await githubList(name)
    if (Array.isArray(fromGithub) && fromGithub.length > 0) {
      return fromGithub
    }
  } catch {
    // fall through to bundled catalog
  }
  return getBundledCatalog(name)
}

function serviceLabel(service) {
  return String(service?.title || service?.name || '').toLowerCase().trim()
}

function mergeServiceCatalog(blobServices, bundledServices) {
  if (!Array.isArray(bundledServices) || bundledServices.length === 0) {
    return Array.isArray(blobServices) ? blobServices : []
  }

  const mergedById = new Map()
  const labelToId = new Map()

  for (const service of Array.isArray(blobServices) ? blobServices : []) {
    mergedById.set(String(service.id), { ...service })
    const label = serviceLabel(service)
    if (label) labelToId.set(label, String(service.id))
  }

  for (const bundled of bundledServices) {
    const bundledId = String(bundled.id)
    const label = serviceLabel(bundled)
    const existingId = mergedById.has(bundledId)
      ? bundledId
      : (label ? labelToId.get(label) : null)
    const existing = existingId ? mergedById.get(existingId) : null

    if (existing) {
      const next = {
        ...bundled,
        ...existing,
        category: existing.category || bundled.category || '',
        subcategory: (existing.subcategory && String(existing.subcategory).trim())
          ? existing.subcategory
          : (bundled.subcategory || ''),
        title: existing.title || bundled.title || existing.name || '',
        price: existing.price || bundled.price,
        image_url: existing.image_url || bundled.image_url,
      }
      mergedById.set(String(existing.id), next)
      if (label) labelToId.set(label, String(existing.id))
      continue
    }

    mergedById.set(bundledId, bundled)
    if (label) labelToId.set(label, bundledId)
  }

  return Array.from(mergedById.values())
}

async function syncBundledCatalog(store) {
  const currentVersion = (await store.get(SYNC_META_KEY, { type: 'json' })) || 0
  if (currentVersion >= REPO_DATA_VERSION) return

  for (const key of CATEGORY_KEYS) {
    const bundled = getBundledCatalog(key)
    if (bundled.length > 0) {
      await store.setJSON(key, bundled)
    }
  }

  const bundledServices = getBundledCatalog('services')
  const blobServices = await store.get('services', { type: 'json' })
  const mergedServices = mergeServiceCatalog(blobServices, bundledServices)
  if (mergedServices.length > 0) {
    await store.setJSON('services', mergedServices)
  }

  await store.setJSON(SYNC_META_KEY, REPO_DATA_VERSION)
}

async function ensureBundledCatalogSync(store) {
  if (!syncPromise) {
    syncPromise = syncBundledCatalog(store).finally(() => {
      syncPromise = null
    })
  }
  await syncPromise
}

export function hasNetlifyBlobs() {
  return Boolean(process.env.NETLIFY)
}

export async function blobsList(name) {
  const store = getDataStore()
  await ensureBundledCatalogSync(store)

  const data = await store.get(name, { type: 'json' })
  if (data !== null) {
    return data
  }

  const seeded = await seedFromFallback(name)
  await store.setJSON(name, seeded)
  return seeded
}

export async function blobsWrite(name, data) {
  const store = getDataStore()
  await store.setJSON(name, data)
  return data
}

/** Force catalog sync on next read (e.g. after deploy). */
export async function resetCatalogSyncVersion() {
  if (!hasNetlifyBlobs()) return
  const store = getDataStore()
  await store.delete(SYNC_META_KEY)
}
