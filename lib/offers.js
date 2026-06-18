import { list as localList } from './localDb'
import { supabaseRead } from './supabaseRuntime'
import { toDisplayOffer, isOfferActive, isPublicOffer } from './offerConfig'

export { toDisplayOffer, formatOfferDates, isOfferActive, isPublicOffer } from './offerConfig'

export async function fetchOffers() {
  return supabaseRead(
    'offers',
    (db) => db.from('offers').select('*').order('created_at', { ascending: false }),
    () => localList('offers'),
  )
}

export async function getPublicOffers() {
  const raw = await fetchOffers()
  let services = []
  try {
    const { fetchServices } = await import('./services')
    services = await fetchServices()
  } catch (e) {
    console.error('Offers page service price lookup failed:', e.message)
  }
  return raw
    .filter((offer) => isOfferActive(offer))
    .map((offer) => toDisplayOffer(offer, services))
    .filter((offer) => offer.active && isPublicOffer(offer))
}
