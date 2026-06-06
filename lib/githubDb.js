import { promises as fs } from 'fs'
import path from 'path'

const REPO = process.env.GITHUB_REPO || 'rajaaqib01/huma-beauty-salon'
const BRANCH = process.env.GITHUB_BRANCH || 'main'
const TOKEN = process.env.GITHUB_TOKEN?.trim()

const cache = new Map()
const CACHE_MS = 15_000

function authHeaders() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function filePath(name) {
  return `data/${name}.json`
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

async function fetchRemote(name) {
  const cached = cache.get(name)
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return cached.data
  }

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${filePath(name)}?ref=${BRANCH}`,
    { headers: authHeaders() }
  )

  if (res.status === 404) {
    const empty = []
    cache.set(name, { data: empty, at: Date.now() })
    return empty
  }

  if (!res.ok) {
    throw new Error(`GitHub read failed for ${name}: ${res.status}`)
  }

  const json = await res.json()
  const content = Buffer.from(json.content, 'base64').toString('utf8')
  const data = JSON.parse(content)
  cache.set(name, { data, sha: json.sha, at: Date.now() })
  return data
}

async function writeRemote(name, data) {
  const current = cache.get(name)
  let sha = current?.sha

  if (!sha) {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${filePath(name)}?ref=${BRANCH}`,
      { headers: authHeaders() }
    )
    if (res.ok) {
      const json = await res.json()
      sha = json.sha
    }
  }

  const body = {
    message: `Update ${filePath(name)} via admin`,
    content: Buffer.from(JSON.stringify(data, null, 2), 'utf8').toString('base64'),
    branch: BRANCH,
  }
  if (sha) body.sha = sha

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${filePath(name)}`,
    {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub write failed for ${name}: ${res.status} ${err}`)
  }

  const json = await res.json()
  cache.set(name, { data, sha: json.content?.sha, at: Date.now() })
  return data
}

export function hasGithubStorage() {
  return Boolean(TOKEN)
}

export async function githubList(name) {
  if (!TOKEN) return readBundled(name)
  try {
    return await fetchRemote(name)
  } catch (e) {
    console.error('GitHub read fallback to bundled JSON:', e.message)
    return readBundled(name)
  }
}

export async function githubWrite(name, data) {
  if (!TOKEN) {
    throw new Error('GITHUB_TOKEN is required to save data in production')
  }
  return writeRemote(name, data)
}
