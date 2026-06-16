import { supabaseServer } from './supabaseServer'
import { list as localList } from './localDb'
import { formatPrice } from './serviceConfig'

export function toDisplayCourse(course) {
  if (!course) return null
  const syllabus = Array.isArray(course.syllabus)
    ? course.syllabus
    : String(course.syllabus || '').split('\n').map((s) => s.trim()).filter(Boolean)
  return {
    id: course.id,
    slug: course.slug || course.id,
    title: course.title,
    category: course.category || '',
    duration: course.duration || '',
    fee: formatPrice(course.fee),
    feeRaw: String(course.fee || ''),
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
    if (error) throw new Error(error.message)
    return data || []
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
