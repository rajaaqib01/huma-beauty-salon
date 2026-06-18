import { supabaseServer } from './supabaseServer'

export const SUPABASE_NETLIFY_SETUP_MSG =
  'Supabase is required on Netlify. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Site settings → Environment variables, run sql/schema.sql in Supabase, then npm run seed:supabase and redeploy.'

export function isNetlifyProduction() {
  return Boolean(process.env.NETLIFY)
}

export function supabaseConfigured() {
  return Boolean(supabaseServer)
}

export function requireSupabaseOnNetlify(res) {
  if (!isNetlifyProduction() || supabaseConfigured()) return false
  res.status(503).json({ error: SUPABASE_NETLIFY_SETUP_MSG })
  return true
}
