import { useRouter } from 'next/router'
import useSWR from 'swr'
import AdminShell from '../../../components/AdminShell'
import { decodeGalleryUrl } from '../../../lib/galleryConfig'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to load gallery')
  }
  return res.json()
}

export default function GalleryPage() {
  const router = useRouter()
  const { data, error, mutate } = useSWR('/api/admin/gallery', fetcher, { revalidateOnFocus: true })
  const gallery = Array.isArray(data) ? data : []

  return (
    <AdminShell title="Gallery">
      <div className="admin-grid-2">
        <div className="admin-card">
          <h2 className="text-xl font-semibold">Gallery Management</h2>
          <p className="text-slate-400 mt-3">
            {gallery.length} image{gallery.length === 1 ? '' : 's'} — shown on the public gallery page.
          </p>
        </div>
        <div className="admin-card admin-card-cta">
          <button className="admin-button admin-button-primary" onClick={() => router.push('/admin/gallery/new')}>
            Upload Image
          </button>
        </div>
      </div>

      {error ? (
        <div className="admin-empty-state">Unable to load gallery. Please refresh or sign in again.</div>
      ) : gallery.length === 0 ? (
        <div className="admin-empty-state">No gallery images yet. Click Upload Image to add your first photo.</div>
      ) : (
        <div className="admin-grid-2">
          {gallery.map((item) => {
            const imgSrc = decodeGalleryUrl(item.image_url)
            return (
              <div key={item.id} className="admin-card">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
                  <img
                    src={imgSrc}
                    alt={item.title || 'Gallery item'}
                    style={{ width: '100%', maxWidth: '220px', height: '160px', objectFit: 'cover', borderRadius: '22px', background: '#f1f5f9' }}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 className="text-2xl font-semibold">{item.title || 'Untitled image'}</h3>
                    <p className="text-slate-400 mt-3" style={{ wordBreak: 'break-all', fontSize: '0.82rem' }}>{imgSrc}</p>
                    <p className="text-slate-400 mt-2">Uploaded {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
                <div className="admin-section-actions" style={{ marginTop: '18px' }}>
                  <button onClick={() => router.push(`/admin/gallery/${item.id}`)} className="admin-button admin-button-secondary">Edit</button>
                  <button
                    className="admin-button admin-button-danger"
                    onClick={async () => {
                      if (!confirm('Delete this gallery image?')) return
                      const res = await fetch(`/api/admin/gallery?id=${item.id}`, { method: 'DELETE', credentials: 'include' })
                      if (!res.ok) return
                      mutate(gallery.filter((entry) => entry.id !== item.id), false)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminShell>
  )
}
