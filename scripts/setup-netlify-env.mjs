#!/usr/bin/env node
/**
 * Sync env vars from .env.local to a Netlify site via CLI.
 * Usage: node scripts/setup-netlify-env.mjs humabeautysaloom
 * Requires: npx netlify login (same account that owns the site)
 *
 * Never commit secret values in this file — read only from .env.local.
 */
import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const site = process.argv[2] || 'humabeautysaloom'

function parseEnvFile(path) {
  if (!existsSync(path)) return {}
  const out = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

const local = parseEnvFile(resolve(root, '.env.local'))

/** Next.js admin auth — server-side only (do not use VITE_ prefix). */
const VARS = {
  ADMIN_EMAIL: local.ADMIN_EMAIL,
  ADMIN_PASSWORD: local.ADMIN_PASSWORD,
  ADMIN_SESSION_SECRET: local.ADMIN_SESSION_SECRET,
  ADMIN_2FA_ENABLED: local.ADMIN_2FA_ENABLED || 'false',
  ADMIN_WHATSAPP: local.ADMIN_WHATSAPP,
  EMAIL_USER: local.EMAIL_USER,
  EMAIL_PASSWORD: local.EMAIL_PASSWORD,
  EMAIL_RECIPIENT: local.EMAIL_RECIPIENT || local.EMAIL_USER,
  NEXT_PUBLIC_SALON_EMAIL: local.NEXT_PUBLIC_SALON_EMAIL || local.EMAIL_RECIPIENT || local.EMAIL_USER,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: local.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  GITHUB_REPO: local.GITHUB_REPO || 'rajaaqib01/huma-beauty-salon',
  GITHUB_BRANCH: local.GITHUB_BRANCH || 'main',
  GITHUB_TOKEN: local.GITHUB_TOKEN,
}

function redactLog(cmd) {
  return cmd.replace(/(gho_[A-Za-z0-9]+)/g, '***')
}

function run(cmd) {
  console.log(`> ${redactLog(cmd)}`)
  execSync(cmd, { stdio: 'inherit', cwd: root })
}

function tryUnset(name) {
  try {
    run(`npx netlify env:unset ${name} --site ${site}`)
  } catch {
    /* ignore missing */
  }
}

if (!existsSync(resolve(root, '.env.local'))) {
  console.error('Missing .env.local — create it from .env.example before running this script.')
  process.exit(1)
}

console.log(`\nSetting env vars on Netlify site: ${site}\n`)

for (const [key, value] of Object.entries(VARS)) {
  if (!value) {
    console.warn(`Skip ${key} (empty)`)
    continue
  }
  run(`npx netlify env:set ${key} "${String(value).replace(/"/g, '\\"')}" --site ${site}`)
}

// Remove legacy Vite-prefixed admin vars (Next.js does not use these).
for (const legacy of ['VITE_ADMIN_EMAIL', 'VITE_ADMIN_PASSWORD', 'VITE_ADMIN_PASSWOR']) {
  tryUnset(legacy)
}

console.log('\nTriggering deploy...')
run(`npx netlify deploy --site ${site} --prod --build`)

console.log('\nDone. Check: https://' + site + '.netlify.app/api/admin/auth-status')
