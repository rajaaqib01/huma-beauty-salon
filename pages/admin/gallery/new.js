import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

export default function NewGalleryPage() {
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [preview, setPreview] = useState('')
  const [pendingFile, setPendingFile] = useState(null)
  const [category, setCategory] = useState('general')
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

    const res = await fetch('/api/admin/gallery-upload', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingFile),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Failed to upload image file')
    return json.url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const finalUrl = await uploadFileIfNeeded()

      if (!finalUrl) {
        setError('Please upload an image file or paste an image URL.')
        setLoading(false)
        return
      }

      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, image_url: finalUrl, category }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save gallery image')
      }

      router.push('/admin/gallery')
    } catch (err) {
      setError(err.message || 'Could not add image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const displayPreview = preview || imageUrl

  return (
    <AdminShell title="Upload Gallery Image">
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: '720px' }}>
        <p className="admin-page-subtitle" style={{ marginBottom: '20px' }}>
          Upload a photo from your computer or paste an image link. It will appear on the admin gallery and the public <strong>/gallery</strong> page.
        </p>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="gallery-title">Title</label>
          <input
            id="gallery-title"
            className="admin-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Bridal Makeup Look"
          />
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="gallery-category">Category</label>
          <select
            id="gallery-category"
            className="admin-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="before_after">Before & After</option>
          </select>
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="gallery-file">Upload Image *</label>
          <input
            id="gallery-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="admin-input"
            onChange={handleFileChange}
          />
        </div>

        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="gallery-url">Or Image URL</label>
          <input
            id="gallery-url"
            className="admin-input"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
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
              alt="Preview"
              style={{ width: '100%', maxWidth: '320px', height: '220px', objectFit: 'cover', borderRadius: '20px', border: '1px solid rgba(15,76,69,0.12)' }}
            />
          </div>
        ) : null}

        {error ? <div className="admin-alert">{error}</div> : null}

        <div className="admin-section-actions">
          <button type="submit" className="admin-button admin-button-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Add to Gallery'}
          </button>
          <button type="button" className="admin-button admin-button-secondary" onClick={() => router.push('/admin/gallery')}>
            Cancel
          </button>
        </div>
      </form>
    </AdminShell>
  )
}
