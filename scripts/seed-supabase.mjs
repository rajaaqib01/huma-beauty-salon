#!/usr/bin/env node
/**
 * Seed Supabase from local data/*.json (categories, services, settings).
 *
 * Prerequisites:
 * 1. Run sql/schema.sql in Supabase SQL Editor
 * 2. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage: npm run seed:supabase
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseUrl, getSupabaseServiceKey } from '../lib/supabaseEnv.js'

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

function normalizeSettings(row) {
  return {
    salon_name: row.salon_name || null,
    logo_url: row.logo_url || null,
    phone: row.phone || null,
    email: row.email || null,
    address: row.address || null,
    instagram: row.instagram || null,
    facebook: row.facebook || null,
    hero_title: row.hero_title || null,
    hero_subtitle: row.hero_subtitle || null,
    footer_text: row.footer_text || null,
    updated_at: row.updated_at || new Date().toISOString(),
  }
}

function normalizeCourse(row) {
  const syllabus = Array.isArray(row.syllabus)
    ? row.syllabus
    : String(row.syllabus || '').split('\n').map((s) => s.trim()).filter(Boolean)
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    category: row.category || null,
    duration: row.duration || null,
    fee: row.fee != null && row.fee !== '' ? Number(String(row.fee).replace(/[^\d.]/g, '')) : null,
    discount: row.discount != null && row.discount !== ''
      ? Number(String(row.discount).replace(/[^\d.]/g, ''))
      : null,
    seats: Number(row.seats) || 0,
    description: row.description || null,
    syllabus,
    image_url: row.image_url || null,
    badge: row.badge || null,
    sort_order: row.sort_order || 0,
    active: row.active !== false,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || row.created_at || new Date().toISOString(),
  }
}

function normalizeBlogPost(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug || null,
    excerpt: row.excerpt || null,
    content: row.content || null,
    image_url: row.image_url || null,
    published: row.published !== false,
    created_at: row.created_at || new Date().toISOString(),
  }
}

function normalizeStaff(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role || null,
    specialty: row.specialty || null,
    bio: row.bio || null,
    image_url: row.image_url || null,
    active: row.active !== false,
    created_at: row.created_at || new Date().toISOString(),
  }
}

async function upsertRows(supabase, table, rows, { onConflict = 'id' } = {}) {
  if (!rows.length) {
    console.log(`  ${table}: (empty, skipped)`)
    return
  }
  const probe = await supabase.from(table).select('id').limit(1)
  if (probe.error) {
    const hint = probe.error.message.includes('schema cache')
      ? '\n    → Run sql/migrations/004_add_runtime_tables.sql in Supabase SQL Editor, then retry.'
      : ''
    throw new Error(`${table}: ${probe.error.message}${hint}`)
  }
  const { error } = await supabase.from(table).upsert(rows, { onConflict })
  if (error) throw new Error(`${table}: ${error.message}`)
  console.log(`  ${table}: ${rows.length} rows`)
}

async function seedSettings(supabase) {
  const raw = loadJson('settings')
  const rows = [normalizeSettings(raw)]
  const { data: existing, error: readError } = await supabase.from('settings').select('id').limit(1)
  if (readError) throw new Error(`settings: ${readError.message}`)

  if (existing?.length) {
    const { error } = await supabase.from('settings').update(rows[0]).eq('id', existing[0].id)
    if (error) throw new Error(`settings: ${error.message}`)
    console.log('  settings: 1 row (updated)')
    return
  }

  const { error } = await supabase.from('settings').insert([rows[0]])
  if (error) throw new Error(`settings: ${error.message}`)
  console.log('  settings: 1 row (inserted)')
}

function applyEnv(env) {
  for (const [key, val] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = val
  }
}

async function main() {
  const env = {
    ...parseEnvFile(resolve(root, '.env')),
    ...parseEnvFile(resolve(root, '.env.local')),
  }
  applyEnv(env)
  const url = getSupabaseUrl()
  const key = getSupabaseServiceKey()

  if (!url || !key) {
    console.error('\nMissing Supabase keys in .env.local')
    console.error('Add SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY), then run again.\n')
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

  const courses = loadJson('courses').map(normalizeCourse)
  await upsertRows(supabase, 'courses', courses)

  const blogPosts = loadJson('blog_posts').map(normalizeBlogPost)
  await upsertRows(supabase, 'blog_posts', blogPosts)

  const staff = loadJson('staff').map(normalizeStaff)
  await upsertRows(supabase, 'staff', staff)

  await seedSettings(supabase)

  console.log('\nDone. Services, categories, courses, blog, staff, and settings are in Supabase.')
  console.log('Add the same Supabase env vars to Netlify, then redeploy.\n')
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
