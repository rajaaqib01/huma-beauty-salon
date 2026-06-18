#!/usr/bin/env node
/**
 * Verify Supabase connection and required tables for Huma Beauty Salon.
 *
 * Usage: npm run check:supabase
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const REQUIRED_TABLES = [
  'services',
  'makeup_categories',
  'hair_categories',
  'facial_categories',
  'nails_categories',
  'mehndi_categories',
  'waxing_categories',
  'bookings',
  'settings',
  'courses',
  'admissions',
  'blog_posts',
  'staff',
  'loyalty',
]

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

async function main() {
  const env = {
    ...parseEnvFile(resolve(root, '.env')),
    ...parseEnvFile(resolve(root, '.env.local')),
  }
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY

  if (!url || !key) {
    console.error('\n❌ Missing Supabase keys')
    console.error('Add to .env.local:')
    console.error('  SUPABASE_URL=https://YOUR_PROJECT.supabase.co')
    console.error('  SUPABASE_SERVICE_ROLE_KEY=... (or SUPABASE_SECRET_KEY)')
    console.error('  NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co')
    console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=... (or SUPABASE_PUBLISHABLE_KEY)\n')
    process.exit(1)
  }

  const supabase = createClient(url, key)
  console.log('\nChecking Supabase…\n')

  let ok = true
  for (const table of REQUIRED_TABLES) {
    const { data, error } = await supabase.from(table).select('id').limit(1)
    if (error) {
      ok = false
      const hint = error.message.includes('schema cache')
        ? ' (run sql/migrations/004_add_runtime_tables.sql in Supabase SQL Editor)'
        : ''
      console.error(`  ❌ ${table}: ${error.message}${hint}`)
      continue
    }
    const { count, error: countError } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    const rowCount = countError ? (data?.length ?? 0) : (count ?? data?.length ?? 0)
    console.log(`  ✓ ${table}: ${rowCount} rows`)
  }

  if (!ok) {
    console.error('\n❌ Run sql/schema.sql (or missing migrations in sql/migrations/), then: npm run seed:supabase\n')
    process.exit(1)
  }

  const { count: serviceCount } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })

  if (!serviceCount) {
    console.warn('\n⚠ services table is empty — run: npm run seed:supabase')
  } else {
    console.log(`\n✓ Supabase ready (${serviceCount} services in database)\n`)
  }
}

main().catch((err) => {
  console.error('\nCheck failed:', err.message)
  process.exit(1)
})
