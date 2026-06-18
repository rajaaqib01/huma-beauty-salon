import { createClient } from '@supabase/supabase-js'
import { getSupabaseUrl, getSupabaseServiceKey } from './supabaseEnv'

const supabaseUrl = getSupabaseUrl()
const supabaseServiceRole = getSupabaseServiceKey()

const hasServerClient = Boolean(supabaseUrl && supabaseServiceRole)

if (!hasServerClient) {
  console.warn(
    'Missing Supabase server config. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY).'
  )
}

export const supabaseServer = hasServerClient
  ? createClient(supabaseUrl, supabaseServiceRole)
  : null

export function requireSupabaseServer() {
  if (!supabaseServer) {
    throw new Error(
      'Supabase server configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY).'
    )
  }
  return supabaseServer
}
