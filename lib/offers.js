import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import { toDisplayOffer, isOfferActive } from './offerConfig'

export { toDisplayOffer, formatOfferDates, isOfferActive } from './offerConfig'

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
  return raw.filter(offer => isOfferActive(offer)).map(toDisplayOffer)
}
