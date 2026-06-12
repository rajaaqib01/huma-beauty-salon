import useSWR from 'swr'
import Link from 'next/link'
import AdminShell from '../../../components/AdminShell'
import useAdminAuth from '../../../lib/useAdminAuth'
import { canAdminDelete } from '../../../lib/adminRoles'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80'

export default function ServicesPage() {
  const { admin } = useAdminAuth()
  const allowDelete = canAdminDelete(admin?.role)
  const { data, error } = useSWR('/api/admin/services', fetcher)
  const services = Array.isArray(data) ? data : []

  return (
    <AdminShell title="Services">
      <div className="admin-section-actions">
        <Link href="/admin/services/new" className="admin-button admin-button-primary">Add Service</Link>
      </div>

      {error ? (
        <div className="admin-empty-state">Unable to load services. Please refresh.</div>
      ) : services.length > 0 ? (
        <div className="services-grid admin-services-grid">
          {services.map((s) => (
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
              </div>
              <div className="service-card-body">
                <div className="service-card-name">{s.title}</div>
                {s.description ? (
                  <div className="service-card-desc">{s.description}</div>
                ) : null}
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
          ))}
        </div>
      ) : (
        <div className="admin-empty-state">No services available.</div>
      )}
    </AdminShell>
  )
}
