import { useMemo, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import AdminShell from '../../../components/AdminShell'
import useAdminAuth from '../../../lib/useAdminAuth'
import { canAdminDelete } from '../../../lib/adminRoles'
import { normalizeCategoryLabel } from '../../../lib/makeupCategoryPresets'
import { sortServicesByPrice } from '../../../lib/serviceConfig'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80'
const FILTER_TABS = ['All', 'Makeup', 'Hair', 'Facial', 'Nails', 'Mehndi', 'Waxing']
const GROUPED_FILTERS = ['Makeup', 'Hair', 'Facial', 'Nails', 'Mehndi', 'Waxing']

function buildCategoryGroups(filteredServices, categories, otherLabel) {
  const cats = Array.isArray(categories) ? categories : []
  const groups = cats.map((cat) => ({
    id: cat.id,
    name: normalizeCategoryLabel(cat.name),
    services: sortServicesByPrice(
      filteredServices.filter(
        (s) => normalizeCategoryLabel(s.subcategory).toLowerCase() === normalizeCategoryLabel(cat.name).toLowerCase()
      ),
      'price'
    ),
  })).filter((g) => g.services.length > 0)

  const groupedIds = new Set(groups.flatMap((g) => g.services.map((s) => s.id)))
  const other = filteredServices.filter((s) => !groupedIds.has(s.id))
  if (other.length > 0) {
    groups.push({ id: 'other', name: otherLabel, services: sortServicesByPrice(other, 'price') })
  }
  return groups
}

function ServiceAdminCard({ s, allowDelete }) {
  return (
    <article key={s.id} className="service-card admin-service-card">
      <div className="service-card-img-wrap">
        <img
          src={s.image_url || FALLBACK_IMG}
          alt={s.title}
          className="service-card-img"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG }}
        />
        {s.category ? <span className="service-card-badge">{s.category}</span> : null}
        {s.subcategory ? (
          <span className="service-card-badge" style={{ right: 'auto', left: '12px' }}>
            {normalizeCategoryLabel(s.subcategory)}
          </span>
        ) : null}
      </div>
      <div className="service-card-body">
        <div className="service-card-name">{s.title}</div>
        {s.description ? <div className="service-card-desc">{s.description}</div> : null}
        <div className="service-card-price">Rs. {s.price}</div>
        <div className="admin-service-card-actions">
          <Link href={`/admin/services/${s.id}`} className="admin-button admin-button-secondary">
            Edit
          </Link>
          {allowDelete ? (
            <button
              type="button"
              onClick={async () => {
                if (!confirm('Delete service?')) return
                await fetch(`/api/admin/services?id=${s.id}`, { method: 'DELETE', credentials: 'include' })
                window.location.reload()
              }}
              className="admin-button admin-button-danger"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default function ServicesPage() {
  const { admin } = useAdminAuth()
  const allowDelete = canAdminDelete(admin?.role)
  const { data, error } = useSWR('/api/admin/services', fetcher)
  const { data: makeupCategories = [] } = useSWR('/api/makeup-categories', fetcher)
  const { data: hairCategories = [] } = useSWR('/api/hair-categories', fetcher)
  const { data: facialCategories = [] } = useSWR('/api/facial-categories', fetcher)
  const { data: nailsCategories = [] } = useSWR('/api/nails-categories', fetcher)
  const { data: mehndiCategories = [] } = useSWR('/api/mehndi-categories', fetcher)
  const { data: waxingCategories = [] } = useSWR('/api/waxing-categories', fetcher)
  const { data: storageHealth } = useSWR('/api/admin/storage-health', fetcher)
  const [activeFilter, setActiveFilter] = useState('All')
  const services = Array.isArray(data) ? data : []

  const filteredServices = useMemo(() => {
    const list = activeFilter === 'All'
      ? services
      : services.filter((s) => String(s.category).toLowerCase() === activeFilter.toLowerCase())
    return sortServicesByPrice(list, 'price')
  }, [services, activeFilter])

  const categoryGroups = useMemo(() => {
    const map = {
      Makeup: { categories: makeupCategories, otherLabel: 'Other Makeup Services' },
      Hair: { categories: hairCategories, otherLabel: 'Other Hair Services' },
      Facial: { categories: facialCategories, otherLabel: 'Other Facial Services' },
      Nails: { categories: nailsCategories, otherLabel: 'Other Nails Services' },
      Mehndi: { categories: mehndiCategories, otherLabel: 'Other Mehndi Services' },
      Waxing: { categories: waxingCategories, otherLabel: 'Other Waxing Services' },
    }
    const config = map[activeFilter]
    if (!config) return []
    return buildCategoryGroups(filteredServices, config.categories, config.otherLabel)
  }, [activeFilter, filteredServices, makeupCategories, hairCategories, facialCategories, nailsCategories, mehndiCategories, waxingCategories])

  return (
    <AdminShell title="Services">
      {storageHealth?.needs_supabase || storageHealth?.supabase_read_ok === false ? (
        <div className="admin-alert admin-alert-warning" style={{ marginBottom: '16px' }}>
          <strong>Supabase keys need fixing on live site.</strong>{' '}
          Admin can view catalog data, but new saves need correct Netlify env vars:
          <ol style={{ margin: '10px 0 0 18px', padding: 0, lineHeight: 1.6 }}>
            <li>Run <code>sql/schema.sql</code> in Supabase SQL Editor</li>
            <li>Add Supabase keys to <code>.env.local</code> and Netlify env vars</li>
            <li>Run <code>npm run seed:supabase</code> then redeploy Netlify</li>
          </ol>
        </div>
      ) : null}

      <div className="admin-section-actions">
        <Link href="/admin/services/new" className="admin-button admin-button-primary">Add Service</Link>
        <Link href="/admin/services/categories" className="admin-button admin-button-secondary">Service Categories</Link>
      </div>

      <p className="admin-page-subtitle" style={{ marginBottom: '16px' }}>
        For makeup, hair, facial, nails, mehndi, and waxing services, pick a <strong>Category Group</strong> then add each service card underneath on the website.
      </p>

      <div className="services-filter-tabs" style={{ marginBottom: '24px', position: 'static', boxShadow: 'none' }}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`services-filter-tab${activeFilter === tab ? ' services-filter-tab--active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {error ? (
        <div className="admin-empty-state">Unable to load services. Please refresh.</div>
      ) : filteredServices.length > 0 ? (
        activeFilter !== 'All' && GROUPED_FILTERS.includes(activeFilter) && categoryGroups.length > 0 ? (
          <div>
            {categoryGroups.map((group) => (
              <div key={group.id} className="makeup-category-group" style={{ marginBottom: '32px' }}>
                <h3 className="makeup-category-title">{group.name}</h3>
                <div className="services-grid admin-services-grid">
                  {group.services.map((s) => (
                    <ServiceAdminCard key={s.id} s={s} allowDelete={allowDelete} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="services-grid admin-services-grid">
            {filteredServices.map((s) => (
              <ServiceAdminCard key={s.id} s={s} allowDelete={allowDelete} />
            ))}
          </div>
        )
      ) : (
        <div className="admin-empty-state">No services in this category.</div>
      )}
    </AdminShell>
  )
}
