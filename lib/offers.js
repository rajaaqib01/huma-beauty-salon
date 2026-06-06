import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import { toDisplayOffer, isOfferActive, isPublicOffer } from './offerConfig'

export { toDisplayOffer, formatOfferDates, isOfferActive, isPublicOffer } from './offerConfig'

export async function fetchOffers() {
  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
  }
  return localList('offers')
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
    .filter(offer => isOfferActive(offer))
    .map(offer => toDisplayOffer(offer, services))
    .filter(isPublicOffer)
}
