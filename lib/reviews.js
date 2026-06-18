import { list as localList } from './localDb'
import { supabaseRead } from './supabaseRuntime'

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'

export async function getApprovedReviews(limit = 8) {
  const raw = await supabaseRead(
    'reviews',
    (db) => db.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false }).limit(limit),
    async () => (await localList('reviews')).filter((r) => r.approved).slice(0, limit),
  )

  return raw.map(review => ({
    id: review.id,
    name: review.customer_name || review.name || 'Client',
    loc: review.location || 'Jhelum',
    text: review.comment || review.text || '',
    stars: Math.min(5, Math.max(1, Number(review.rating) || 5)),
    img: review.image_url || FALLBACK_AVATAR,
  })).filter(r => r.text.trim())
}
