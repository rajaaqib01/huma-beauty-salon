import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const hasClient = Boolean(supabaseUrl && supabaseAnonKey)

if (!hasClient) {
  console.warn('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = hasClient
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function requireSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase client configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }
  return supabase
}
