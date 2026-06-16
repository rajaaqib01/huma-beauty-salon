import { getStore } from '@netlify/blobs'
import { githubList } from './githubDb'
import { promises as fs } from 'fs'
import path from 'path'

const STORE_NAME = 'huma-salon-data'
const SYNC_META_KEY = '__repo_data_version'

/** Bump when bundled data/*.json catalog changes (categories, service subcategories). */
export const REPO_DATA_VERSION = 2

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

async function readBundled(name) {
  const file = path.join(process.cwd(), 'data', `${name}.json`)
  try {
    const txt = await fs.readFile(file, 'utf8')
    return JSON.parse(txt)
  } catch {
    return []
  }
}

async function seedFromFallback(name) {
  try {
    const fromGithub = await githubList(name)
    if (Array.isArray(fromGithub) && fromGithub.length > 0) {
      return fromGithub
    }
  } catch {
    // fall through to bundled JSON
  }
  return readBundled(name)
}

function mergeServiceCatalog(blobServices, bundledServices) {
  if (!Array.isArray(bundledServices) || bundledServices.length === 0) {
    return Array.isArray(blobServices) ? blobServices : []
  }
  if (!Array.isArray(blobServices) || blobServices.length === 0) {
    return bundledServices
  }

  const bundledById = new Map(bundledServices.map((s) => [String(s.id), s]))
  const bundledByTitle = new Map(
    bundledServices.map((s) => [String(s.title || '').toLowerCase().trim(), s])
  )

  return blobServices.map((service) => {
    const match =
      bundledById.get(String(service.id)) ||
      bundledByTitle.get(String(service.title || '').toLowerCase().trim())
    if (!match) return service
    return {
      ...service,
      category: service.category || match.category || '',
      subcategory: service.subcategory || match.subcategory || '',
    }
  })
}

async function syncBundledCatalog(store) {
  const currentVersion = (await store.get(SYNC_META_KEY, { type: 'json' })) || 0
  if (currentVersion >= REPO_DATA_VERSION) return

  for (const key of CATEGORY_KEYS) {
    const bundled = await readBundled(key)
    if (Array.isArray(bundled) && bundled.length > 0) {
      await store.setJSON(key, bundled)
    }
  }

  const bundledServices = await readBundled('services')
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
