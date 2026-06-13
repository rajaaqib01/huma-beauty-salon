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
  google_reviews_url: '',
  admin_whatsapp: '923355462214',
  maps_url: 'https://maps.google.com/?q=Main+Market+Jhelum+Punjab+Pakistan',
  maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.0!2d73.727!3d32.934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDU2JzAyLjQiTiA3M8KwNDMnMzcuMiJF!5e0!3m2!1sen!2s!4v1',
  weekday_open: '09:00',
  weekday_close: '21:00',
  sunday_open: '10:00',
  sunday_close: '19:00',
  slot_minutes: '30',
  referral_code: 'HUMAFRIEND',
  referral_discount: '10',
  jazzcash_number: '03355462214',
  easypaisa_number: '03355462214',
  loyalty_points_per_booking: '10',
  instagram_username: 'huma_beauty.saloon',
  instagram_post_urls: '',
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
