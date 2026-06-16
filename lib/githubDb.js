import { promises as fs } from 'fs'
import path from 'path'

const REPO = process.env.GITHUB_REPO || 'rajaaqib01/huma-beauty-salon'
const CODE_BRANCH = process.env.GITHUB_BRANCH || 'main'
const TOKEN = process.env.GITHUB_TOKEN?.trim()

const cache = new Map()
const CACHE_MS = 15_000

function dataBranch() {
  // On Netlify never write runtime JSON to main — avoids auto-redeploy on every save.
  if (process.env.NETLIFY) return 'live-data'
  return process.env.GITHUB_DATA_BRANCH?.trim() || 'live-data'
}

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

function cacheKey(branch, name) {
  return `${branch}:${name}`
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

async function ensureDataBranchExists() {
  const branch = dataBranch()
  if (branch === CODE_BRANCH) return

  const check = await fetch(
    `https://api.github.com/repos/${REPO}/git/ref/heads/${branch}`,
    { headers: authHeaders() }
  )
  if (check.ok) return

  const mainRef = await fetch(
    `https://api.github.com/repos/${REPO}/git/ref/heads/${CODE_BRANCH}`,
    { headers: authHeaders() }
  )
  if (!mainRef.ok) {
    throw new Error(`Could not read base branch ${CODE_BRANCH}: ${mainRef.status}`)
  }

  const mainJson = await mainRef.json()
  const create = await fetch(`https://api.github.com/repos/${REPO}/git/refs`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ref: `refs/heads/${branch}`,
      sha: mainJson.object.sha,
    }),
  })

  if (!create.ok && create.status !== 422) {
    const err = await create.text()
    throw new Error(`Could not create data branch ${branch}: ${create.status} ${err}`)
  }
}

async function fetchRemoteFromBranch(name, branch) {
  const key = cacheKey(branch, name)
  const cached = cache.get(key)
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return cached.data
  }

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${filePath(name)}?ref=${branch}`,
    { headers: authHeaders() }
  )

  if (res.status === 404) {
    const err = new Error(`GitHub file not found: ${filePath(name)}@${branch}`)
    err.code = 'NOT_FOUND'
    throw err
  }

  if (!res.ok) {
    throw new Error(`GitHub read failed for ${name}@${branch}: ${res.status}`)
  }

  const json = await res.json()
  const content = Buffer.from(json.content, 'base64').toString('utf8')
  const data = JSON.parse(content)
  cache.set(key, { data, sha: json.sha, at: Date.now() })
  return data
}

async function fetchRemote(name) {
  const branches = [dataBranch()]
  if (dataBranch() !== CODE_BRANCH) {
    branches.push(CODE_BRANCH)
  }

  for (const branch of branches) {
    try {
      return await fetchRemoteFromBranch(name, branch)
    } catch (e) {
      if (e.code !== 'NOT_FOUND') {
        console.error(`GitHub read error (${branch}):`, e.message)
      }
    }
  }

  return readBundled(name)
}

async function writeRemote(name, data) {
  const branch = dataBranch()
  if (process.env.NETLIFY && branch === CODE_BRANCH) {
    throw new Error('Refusing to write runtime data to main on Netlify')
  }

  await ensureDataBranchExists()

  const key = cacheKey(branch, name)
  const current = cache.get(key)
  let sha = current?.sha

  if (!sha) {
    try {
      await fetchRemoteFromBranch(name, branch)
      sha = cache.get(key)?.sha
    } catch (e) {
      if (e.code !== 'NOT_FOUND') {
        throw e
      }
    }
  }

  const body = {
    message: `Update ${filePath(name)} on ${branch}`,
    content: Buffer.from(JSON.stringify(data, null, 2), 'utf8').toString('base64'),
    branch,
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
    throw new Error(`GitHub write failed for ${name}@${branch}: ${res.status} ${err}`)
  }

  const json = await res.json()
  cache.set(key, { data, sha: json.content?.sha, at: Date.now() })
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
