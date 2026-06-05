import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

const hasServerClient = Boolean(supabaseUrl && supabaseServiceRole)

if (!hasServerClient) {
  console.warn('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseServer = hasServerClient
  ? createClient(supabaseUrl, supabaseServiceRole)
  : null

export function requireSupabaseServer() {
  if (!supabaseServer) {
    throw new Error('Supabase server configuration is missing. Please set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }
  return supabaseServer
}
