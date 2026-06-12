import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

const CATEGORIES = ['Makeup', 'Hair', 'Facial', 'Nails', 'Mehndi', 'Waxing']
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80'

export default function EditService() {
  const router = useRouter()
  const { id } = router.query
  const [service, setService] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/services?id=${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then(setService)
      .catch(() => setError('Failed to load service'))
  }, [id])

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(service),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save service')
      }
      router.push('/admin/services')
    } catch (err) {
      setError(err.message || 'Could not save service.')
    } finally {
      setLoading(false)
    }
  }

  if (!service) {
    return (
      <AdminShell title="Edit Service">
        <div className="admin-empty-state">{error || 'Loading…'}</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Edit Service">
      <form onSubmit={handleSave} className="admin-form admin-card" style={{ maxWidth: '720px' }}>
        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="edit-title">Title *</label>
          <input
            id="edit-title"
            className="admin-input"
            value={service.title || ''}
            onChange={(e) => setService({ ...service, title: e.target.value })}
            required
          />
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="edit-category">Category *</label>
          <select
            id="edit-category"
            className="admin-input"
            value={service.category || ''}
            onChange={(e) => setService({ ...service, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="edit-price">Price (Rs.) *</label>
          <input
            id="edit-price"
            className="admin-input"
            type="number"
            min="0"
            value={service.price || ''}
            onChange={(e) => setService({ ...service, price: e.target.value })}
            required
          />
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="edit-image">Image URL</label>
          <input
            id="edit-image"
            className="admin-input"
            value={service.image_url || ''}
            onChange={(e) => setService({ ...service, image_url: e.target.value })}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        {service.image_url ? (
          <div className="admin-form-row">
            <label className="admin-field-label">Preview</label>
            <img
              src={service.image_url}
              alt={service.title || 'Service'}
              style={{
                width: '100%',
                maxWidth: '280px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '16px',
                border: '1px solid rgba(15,76,69,0.12)',
              }}
              onError={(e) => { e.currentTarget.src = FALLBACK_IMG }}
            />
          </div>
        ) : null}

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="edit-description">Description</label>
          <textarea
            id="edit-description"
            className="admin-textarea"
            rows={5}
            value={service.description || ''}
            onChange={(e) => setService({ ...service, description: e.target.value })}
          />
        </div>

        {error ? <div className="admin-alert">{error}</div> : null}

        <div className="admin-section-actions">
          <button type="submit" className="admin-button admin-button-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={() => router.push('/admin/services')}
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminShell>
  )
}
