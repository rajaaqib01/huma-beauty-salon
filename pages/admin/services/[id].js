import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

const CATEGORIES = ['Makeup', 'Hair', 'Facial', 'Nails', 'Mehndi', 'Waxing']
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80'

export default function EditService() {
  const router = useRouter()
  const { id } = router.query
  const [service, setService] = useState(null)
  const [preview, setPreview] = useState('')
  const [pendingFile, setPendingFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/services?id=${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then(setService)
      .catch(() => setError('Failed to load service'))
  }, [id])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, WEBP, GIF).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.')
      return
    }
    setError('')
    setPreview(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = () => {
      setPendingFile({
        data: reader.result,
        filename: file.name,
        mimeType: file.type,
      })
    }
    reader.readAsDataURL(file)
  }

  const uploadFileIfNeeded = async () => {
    if (!pendingFile) return service?.image_url || ''
    const res = await fetch('/api/admin/service-upload', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingFile),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Failed to upload image')
    return json.url
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const finalImageUrl = await uploadFileIfNeeded()
      const payload = { ...service, image_url: finalImageUrl }
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
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

  const displayPreview = preview || service.image_url || ''

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
          <label className="admin-field-label" htmlFor="edit-file">Upload New Picture</label>
          <input
            id="edit-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="admin-input admin-file-input"
            onChange={handleFileChange}
          />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', margin: 0 }}>
            Optional — replaces current image when you save.
          </p>
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="edit-image">Or Image URL</label>
          <input
            id="edit-image"
            className="admin-input"
            value={service.image_url || ''}
            onChange={(e) => {
              setService({ ...service, image_url: e.target.value })
              if (e.target.value) {
                setPreview('')
                setPendingFile(null)
              }
            }}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        {displayPreview ? (
          <div className="admin-form-row">
            <label className="admin-field-label">Preview</label>
            <img
              src={displayPreview}
              alt={service.title || 'Service'}
              className="admin-service-image-preview"
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
