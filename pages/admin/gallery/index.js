import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

export default function GalleryPage() {
  const [gallery, setGallery] = useState([])
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/admin/gallery', { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          console.error('Failed to fetch gallery:', data)
          if (mounted) setGallery([])
          return
        }
        const data = await res.json()
        if (mounted) setGallery(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Gallery fetch error:', e)
        if (mounted) setGallery([])
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <AdminShell title="Gallery">
      <div className="admin-grid-2">
        <div className="admin-card">
          <h2 className="text-xl font-semibold">Gallery Management</h2>
          <p className="text-slate-400 mt-3">Add or remove gallery images displayed on the website.</p>
        </div>
        <div className="admin-card admin-card-cta">
          <button className="admin-button admin-button-primary" onClick={() => router.push('/admin/gallery/new')}>Upload Image</button>
        </div>
      </div>
      <div className="admin-grid-2">
        {gallery.map((item) => (
          <div key={item.id} className="admin-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
              <img src={item.image_url} alt={item.title || 'Gallery item'} style={{ width: '100%', maxWidth: '220px', height: '160px', objectFit: 'cover', borderRadius: '22px' }} />
              <div style={{ flex: 1 }}>
                <h3 className="text-2xl font-semibold">{item.title || 'Untitled image'}</h3>
                <p className="text-slate-400 mt-3">Uploaded {new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="admin-section-actions" style={{ marginTop: '18px' }}>
              <button onClick={() => router.push(`/admin/gallery/${item.id}`)} className="admin-button admin-button-secondary">Edit</button>
              <button className="admin-button admin-button-danger" onClick={async () => {
                if (!confirm('Delete this gallery image?')) return
                await fetch(`/api/admin/gallery?id=${item.id}`, { method: 'DELETE' })
                setGallery((g) => g.filter((entry) => entry.id !== item.id))
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
