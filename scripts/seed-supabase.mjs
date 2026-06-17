#!/usr/bin/env node
/**
 * Seed Supabase from local data/*.json (categories + services).
 *
 * Prerequisites:
 * 1. Run sql/schema.sql (or sql/migrations/001_add_categories.sql) in Supabase SQL Editor
 * 2. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage: npm run seed:supabase
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = resolve(root, 'data')

const CATEGORY_TABLES = [
  'makeup_categories',
  'hair_categories',
  'facial_categories',
  'nails_categories',
  'mehndi_categories',
  'waxing_categories',
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

function loadJson(name) {
  const file = resolve(dataDir, `${name}.json`)
  return JSON.parse(readFileSync(file, 'utf8'))
}

function normalizeService(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || null,
    price: row.price != null && row.price !== '' ? Number(String(row.price).replace(/[^\d.]/g, '')) : null,
    category: row.category || null,
    subcategory: row.subcategory || null,
    image_url: row.image_url || null,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || row.created_at || new Date().toISOString(),
  }
}

async function upsertRows(supabase, table, rows) {
  if (!rows.length) {
    console.log(`  ${table}: (empty, skipped)`)
    return
  }
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' })
  if (error) throw new Error(`${table}: ${error.message}`)
  console.log(`  ${table}: ${rows.length} rows`)
}

async function main() {
  const env = parseEnvFile(resolve(root, '.env.local'))
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('\nMissing Supabase keys in .env.local')
    console.error('Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run again.\n')
    process.exit(1)
  }

  const supabase = createClient(url, key)
  console.log('\nSeeding Supabase from data/*.json\n')

  for (const table of CATEGORY_TABLES) {
    const rows = loadJson(table)
    await upsertRows(supabase, table, rows)
  }

  const services = loadJson('services').map(normalizeService)
  await upsertRows(supabase, 'services', services)

  console.log('\nDone. Categories and services are now in Supabase.\n')
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
