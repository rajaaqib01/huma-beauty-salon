import { promises as fs } from 'fs'
import path from 'path'
import { supabaseServer } from './supabaseServer'

const settingsFile = path.join(process.cwd(), 'data', 'settings.json')

export const DEFAULT_SETTINGS = {
  id: 'settings-1',
  salon_name: 'Huma Beauty Saloon',
  logo_url: '',
  phone: '+92 335 5462214',
  email: 'humaaqi96@gmail.com',
  address: 'Main Market, Jhelum, Punjab, Pakistan',
  instagram: 'https://www.instagram.com/huma_beauty.saloon/',
  facebook: '',
  hero_title: 'Huma Beauty Saloon',
  hero_subtitle: 'Luxury beauty services crafted for your perfect moment',
  footer_text: 'Jhelum\'s premier beauty destination.',
}

async function readLocalSettings() {
  try {
    const txt = await fs.readFile(settingsFile, 'utf8')
    return { ...DEFAULT_SETTINGS, ...JSON.parse(txt) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

async function writeLocalSettings(patch) {
  const current = await readLocalSettings()
  const updated = { ...current, ...patch, updated_at: new Date().toISOString() }
  await fs.mkdir(path.dirname(settingsFile), { recursive: true })
  await fs.writeFile(settingsFile, JSON.stringify(updated, null, 2), 'utf8')
  return updated
}

export async function getSettings() {
  if (supabaseServer) {
    const { data, error } = await supabaseServer.from('settings').select('*').limit(1).single()
    if (!error && data) return { ...DEFAULT_SETTINGS, ...data }
  }
  return readLocalSettings()
}

export async function saveSettings(patch) {
  if (supabaseServer) {
    const exists = await supabaseServer.from('settings').select('*').limit(1).single()
    if (exists.error && exists.error.code !== 'PGRST116') {
      throw new Error(exists.error.message)
    }
    if (exists.data) {
      const { data, error } = await supabaseServer
        .from('settings')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', exists.data.id)
        .select()
      if (error) throw new Error(error.message)
      return { ...DEFAULT_SETTINGS, ...data[0] }
    }
    const { data, error } = await supabaseServer.from('settings').insert([{ ...patch }]).select()
    if (error) throw new Error(error.message)
    return { ...DEFAULT_SETTINGS, ...data[0] }
  }
  return writeLocalSettings(patch)
}
