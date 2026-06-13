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
  const [preview, setPreview] = useState('')
  const [pendingFile, setPendingFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
    setImageUrl('')
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
    if (!pendingFile) return imageUrl.trim()
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
      const finalImageUrl = await uploadFileIfNeeded()
      const body = {
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        category,
        image_url: finalImageUrl,
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

  const displayPreview = preview || imageUrl.trim()

  return (
    <AdminShell title="Create Service">
      <form onSubmit={handleCreate} className="admin-form admin-card" style={{ maxWidth: '720px' }}>
        <p className="admin-page-subtitle" style={{ marginBottom: '8px' }}>
          Add a new service — upload a photo or paste a link. It will appear on the public services page and booking form.
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
          <label className="admin-field-label" htmlFor="service-file">Upload Picture</label>
          <input
            id="service-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="admin-input admin-file-input"
            onChange={handleFileChange}
          />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', margin: 0 }}>
            Optional — JPG, PNG, WEBP or GIF (max 5MB).
          </p>
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="service-image">Or Image URL</label>
          <input
            id="service-image"
            className="admin-input"
            placeholder="https://example.com/photo.jpg"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
              if (e.target.value) {
                setPreview('')
                setPendingFile(null)
              }
            }}
          />
        </div>

        {displayPreview ? (
          <div className="admin-form-row">
            <label className="admin-field-label">Preview</label>
            <img
              src={displayPreview}
              alt="Service preview"
              className="admin-service-image-preview"
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
