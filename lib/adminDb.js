import { list as localList } from './localDb'
import { supabaseRead } from './supabaseRuntime'

/** Admin read: Supabase when healthy, else bundled data/*.json */
export async function adminList(table, query) {
  const runQuery = query || ((db) => db.from(table).select('*'))
  const items = await supabaseRead(table, runQuery, () => localList(table))
  return Array.isArray(items) ? items : []
}

export async function adminFindById(table, id, query) {
  if (!id) return null
  const items = await adminList(table, query)
  return items.find((x) => String(x.id) === String(id)) || null
}
