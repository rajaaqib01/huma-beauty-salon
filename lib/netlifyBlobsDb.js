import { getStore } from '@netlify/blobs'
import { githubList } from './githubDb'
import { promises as fs } from 'fs'
import path from 'path'

const STORE_NAME = 'huma-salon-data'

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

export function hasNetlifyBlobs() {
  return Boolean(process.env.NETLIFY)
}

export async function blobsList(name) {
  const store = getDataStore()
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
