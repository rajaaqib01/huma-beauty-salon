import { useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { useRouter } from 'next/router'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) return []
  return res.json()
}

export default function AdminContent() {
  const router = useRouter()
  const [services, setServices] = useState([])
  const [gallery, setGallery] = useState([])
  const [offers, setOffers] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    Promise.all([
      fetcher('/api/admin/services').catch(() => []),
      fetcher('/api/admin/gallery').catch(() => []),
      fetcher('/api/admin/offers').catch(() => []),
      fetcher('/api/admin/reviews').catch(() => []),
    ]).then(([s, g, o, r]) => {
      if (!mounted) return
      setServices(s || [])
      setGallery(g || [])
      setOffers(o || [])
      setReviews(r || [])
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  const handleDelete = async (type, id) => {
    if (!confirm('Delete this item?')) return
    const res = await fetch(`/api/admin/${type}?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      if (type === 'services') setServices(prev => prev.filter(p => p.id !== id))
      if (type === 'gallery') setGallery(prev => prev.filter(p => p.id !== id))
      if (type === 'offers') setOffers(prev => prev.filter(p => p.id !== id))
      if (type === 'reviews') setReviews(prev => prev.filter(p => p.id !== id))
    } else {
      alert('Failed to delete item')
    }
  }

  if (loading) return (
    <AdminShell title="Content Manager"><div className="text-slate-300">Loading content…</div></AdminShell>
  )

  return (
    <AdminShell title="Content Manager">
      <div className="admin-grid-2">
        <section className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-xl font-semibold">Services</h3>
            <div>
              <button onClick={() => router.push('/admin/services/new')} className="admin-button admin-button-primary" style={{ marginRight: 8 }}>Add</button>
              <button onClick={() => router.push('/admin/services')} className="admin-button admin-button-secondary">View All</button>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            {services.length === 0 ? <div className="admin-empty-state">No services</div> : (
              services.slice(0,6).map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.title}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-mid)' }}>{s.category} • {s.price}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => router.push(`/admin/services/${s.id}`)} className="admin-button admin-button-secondary">Edit</button>
                    <button onClick={() => handleDelete('services', s.id)} className="admin-button admin-button-danger">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-xl font-semibold">Gallery</h3>
            <div>
              <button onClick={() => router.push('/admin/gallery/new')} className="admin-button admin-button-primary" style={{ marginRight: 8 }}>Add</button>
              <button onClick={() => router.push('/admin/gallery')} className="admin-button admin-button-secondary">View All</button>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            {gallery.length === 0 ? <div className="admin-empty-state">No gallery items</div> : (
              gallery.slice(0,6).map(g => (
                <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={g.image_url} alt={g.title || ''} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{g.title || 'Untitled'}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-mid)' }}>{new Date(g.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => router.push(`/admin/gallery/${g.id}`)} className="admin-button admin-button-secondary">Edit</button>
                    <button onClick={() => handleDelete('gallery', g.id)} className="admin-button admin-button-danger">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="admin-grid-2" style={{ marginTop: 20 }}>
        <section className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-xl font-semibold">Offers</h3>
            <div>
              <button onClick={() => router.push('/admin/offers/new')} className="admin-button admin-button-primary" style={{ marginRight: 8 }}>Add</button>
              <button onClick={() => router.push('/admin/offers')} className="admin-button admin-button-secondary">View All</button>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            {offers.length === 0 ? <div className="admin-empty-state">No offers</div> : (
              offers.slice(0,6).map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{o.title}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-mid)' }}>Discount: {o.discount}%</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => router.push(`/admin/offers/${o.id}`)} className="admin-button admin-button-secondary">Edit</button>
                    <button onClick={() => handleDelete('offers', o.id)} className="admin-button admin-button-danger">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-xl font-semibold">Reviews / Testimonials</h3>
            <div>
              <button onClick={() => router.push('/admin/reviews/new')} className="admin-button admin-button-primary" style={{ marginRight: 8 }}>Add</button>
              <button onClick={() => router.push('/admin/reviews')} className="admin-button admin-button-secondary">View All</button>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            {reviews.length === 0 ? <div className="admin-empty-state">No reviews</div> : (
              reviews.slice(0,6).map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.customer_name || r.name || 'Customer'}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-mid)' }}>{r.comment || r.text || ''}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => router.push(`/admin/reviews`)} className="admin-button admin-button-secondary">Edit</button>
                    <button onClick={() => handleDelete('reviews', r.id)} className="admin-button admin-button-danger">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

    </AdminShell>
  )
}
