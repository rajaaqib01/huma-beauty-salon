import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

const CATEGORIES = ['Makeup', 'Hair', 'Facial', 'Nails', 'Mehndi', 'Waxing']
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80'

export default function NewService() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Please enter a service title.')
      return
    }
    if (!category) {
      setError('Please select a category.')
      return
    }
    if (!price.trim()) {
      setError('Please enter a price.')
      return
    }

    setLoading(true)
    try {
      const body = {
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        category,
        image_url: imageUrl.trim(),
      }
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create service')
      }
      router.push('/admin/services')
    } catch (err) {
      setError(err.message || 'Could not create service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminShell title="Create Service">
      <form onSubmit={handleCreate} className="admin-form admin-card" style={{ maxWidth: '720px' }}>
        <p className="admin-page-subtitle" style={{ marginBottom: '8px' }}>
          Add a new service — it will appear on the public services page and booking form.
        </p>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="service-title">Title *</label>
          <input
            id="service-title"
            className="admin-input"
            placeholder="e.g. Bridal Makeup"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="service-category">Category *</label>
          <select
            id="service-category"
            className="admin-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="service-price">Price (Rs.) *</label>
          <input
            id="service-price"
            className="admin-input"
            type="number"
            min="0"
            placeholder="e.g. 3500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="service-image">Image URL</label>
          <input
            id="service-image"
            className="admin-input"
            placeholder="https://example.com/photo.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', margin: 0 }}>
            Paste a direct image link for the service card photo.
          </p>
        </div>

        {imageUrl.trim() ? (
          <div className="admin-form-row">
            <label className="admin-field-label">Preview</label>
            <img
              src={imageUrl.trim()}
              alt="Service preview"
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
          <label className="admin-field-label" htmlFor="service-description">Description</label>
          <textarea
            id="service-description"
            className="admin-textarea"
            rows={5}
            placeholder="Short description shown on the service card..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error ? <div className="admin-alert">{error}</div> : null}

        <div className="admin-section-actions">
          <button type="submit" className="admin-button admin-button-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create Service'}
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
