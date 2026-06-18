import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import { formatPrice } from './serviceConfig'

function parseAmount(value) {
  const num = parseInt(String(value || '').replace(/[^\d]/g, ''), 10)
  return Number.isFinite(num) ? num : 0
}

function getCoursePrices(course) {
  const original = parseAmount(course.fee)
  const discount = parseFloat(String(course.discount || '').replace(/[^\d.]/g, '')) || 0
  const sale = original && discount
    ? Math.max(0, Math.round(original - (original * discount / 100)))
    : original
  return { original, sale, discount }
}

export function toDisplayCourse(course) {
  if (!course) return null
  const syllabus = Array.isArray(course.syllabus)
    ? course.syllabus
    : String(course.syllabus || '').split('\n').map((s) => s.trim()).filter(Boolean)
  const { original, sale, discount } = getCoursePrices(course)
  const hasDiscount = discount > 0 && sale < original
  return {
    id: course.id,
    slug: course.slug || course.id,
    title: course.title,
    category: course.category || '',
    duration: course.duration || '',
    fee: formatPrice(hasDiscount ? sale : original),
    feeRaw: String(hasDiscount ? sale : original),
    originalFee: formatPrice(original),
    originalFeeRaw: String(original),
    discount: discount ? `${discount}% OFF` : '',
    discountValue: discount,
    hasDiscount,
    seats: Number(course.seats) || 0,
    description: course.description || '',
    syllabus,
    img: course.image_url || '',
    badge: course.badge || '',
    sort_order: course.sort_order || 0,
    active: course.active !== false,
  }
}

export async function fetchCourses() {
  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('courses')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error && data) return data
    if (error) console.error('Supabase courses read fallback:', error.message)
  }
  return localList('courses')
}

export async function getActiveCourses() {
  const raw = await fetchCourses()
  return raw
    .filter((c) => c.active !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map(toDisplayCourse)
}

export async function getCourseBySlug(slug) {
  const courses = await getActiveCourses()
  return courses.find((c) => c.slug === slug || c.id === slug) || null
}

export async function getCourseById(id) {
  const raw = await fetchCourses()
  const found = raw.find((c) => String(c.id) === String(id))
  return found ? toDisplayCourse(found) : null
}
