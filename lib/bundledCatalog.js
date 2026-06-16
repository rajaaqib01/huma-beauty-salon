import services from '../data/services.json'
import makeupCategories from '../data/makeup_categories.json'
import hairCategories from '../data/hair_categories.json'
import facialCategories from '../data/facial_categories.json'
import nailsCategories from '../data/nails_categories.json'
import mehndiCategories from '../data/mehndi_categories.json'
import waxingCategories from '../data/waxing_categories.json'

const BUNDLED = {
  services,
  makeup_categories: makeupCategories,
  hair_categories: hairCategories,
  facial_categories: facialCategories,
  nails_categories: nailsCategories,
  mehndi_categories: mehndiCategories,
  waxing_categories: waxingCategories,
}

export function getBundledCatalog(name) {
  const data = BUNDLED[name]
  return Array.isArray(data) ? data : []
}

export function bundledCatalogKeys() {
  return Object.keys(BUNDLED)
}
