import { promises as fs } from 'fs'
import path from 'path'
import { isServerless } from './isServerless'
import { genId } from './dbId'
import { supabaseServer } from './supabaseServer'
import { githubList, githubWrite, hasGithubStorage } from './githubDb'
import { blobsList, blobsWrite, hasNetlifyBlobs } from './netlifyBlobsDb'
import { SUPABASE_NETLIFY_SETUP_MSG } from './supabaseRuntime'

const dataDir = path.join(process.cwd(), 'data')

function useBlobStorage() {
  // Supabase is the production store; blobs are opt-in legacy only.
  return Boolean(
    process.env.USE_NETLIFY_BLOBS === 'true' &&
    isServerless() &&
    hasNetlifyBlobs() &&
    !supabaseServer
  )
}

function useGithubStorage() {
  return isServerless() && hasGithubStorage() && !useBlobStorage()
}

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch {
    // ignore
  }
}

async function readFile(name) {
  if (useBlobStorage()) {
    return blobsList(name)
  }

  if (useGithubStorage()) {
    return githubList(name)
  }

  await ensureDataDir()
  const file = path.join(dataDir, `${name}.json`)
  try {
    const txt = await fs.readFile(file, 'utf8')
    return JSON.parse(txt)
  } catch {
    return []
  }
}

async function writeFile(name, data) {
  if (useBlobStorage()) {
    await blobsWrite(name, data)
    return
  }

  if (process.env.NETLIFY && !supabaseServer) {
    throw new Error(SUPABASE_NETLIFY_SETUP_MSG)
  }

  if (useGithubStorage()) {
    await githubWrite(name, data)
    return
  }

  await ensureDataDir()
  const file = path.join(dataDir, `${name}.json`)
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8')
}

export async function list(name) {
  return readFile(name)
}

export async function insert(name, item) {
  const arr = await readFile(name)
  const obj = { id: item.id || genId(), ...item }
  arr.unshift(obj)
  await writeFile(name, arr)
  return obj
}

export async function update(name, id, patch) {
  const arr = await readFile(name)
  const idx = arr.findIndex(x => String(x.id) === String(id))
  if (idx === -1) return null
  arr[idx] = { ...arr[idx], ...patch }
  await writeFile(name, arr)
  return arr[idx]
}

export async function remove(name, id) {
  const arr = await readFile(name)
  const idx = arr.findIndex(x => String(x.id) === String(id))
  if (idx === -1) return false
  arr.splice(idx, 1)
  await writeFile(name, arr)
  return true
}

export default { list, insert, update, remove }
