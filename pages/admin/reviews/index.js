import { useEffect, useState } from 'react'
import AdminShell from '../../../components/AdminShell'

const EMPTY_FORM = {
  customer_name: '',
  comment: '',
  rating: '5',
  location: 'Jhelum',
  approved: true,
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [googleReviewsUrl, setGoogleReviewsUrl] = useState('')
  const [savingLink, setSavingLink] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [savingReview, setSavingReview] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [reviewsRes, settingsRes] = await Promise.all([
          fetch('/api/admin/reviews', { credentials: 'include' }),
          fetch('/api/admin/settings', { credentials: 'include' }),
        ])
        if (reviewsRes.ok) {
          const data = await reviewsRes.json()
          if (mounted) setReviews(Array.isArray(data) ? data : [])
        }
        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          if (mounted) setGoogleReviewsUrl(settings.google_reviews_url || '')
        }
      } catch (e) {
        console.error('Reviews page load error:', e)
      }
    })()
    return () => { mounted = false }
  }, [])

  const startEdit = (review) => {
    setEditingId(review.id)
    setForm({
      customer_name: review.customer_name || review.name || '',
      comment: review.comment || review.text || '',
      rating: String(review.rating || 5),
      location: review.location || 'Jhelum',
      approved: Boolean(review.approved),
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const saveReview = async () => {
    if (!editingId) return
    setSavingReview(true)
    try {
      const res = await fetch(`/api/admin/reviews?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customer_name: form.customer_name.trim(),
          comment: form.comment.trim(),
          rating: Number(form.rating) || 5,
          location: form.location.trim() || 'Jhelum',
          approved: form.approved,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      const updated = await res.json()
      setReviews((prev) => prev.map((item) => (item.id === editingId ? updated : item)))
      cancelEdit()
    } catch (e) {
      alert('Could not save review. Try again.')
    } finally {
      setSavingReview(false)
    }
  }

  const saveGoogleLink = async () => {
    setSavingLink(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ google_reviews_url: googleReviewsUrl.trim() }),
      })
      if (!res.ok) throw new Error('Save failed')
      alert('Google review link saved.')
    } catch (e) {
      alert('Could not save link. Owner login required.')
    } finally {
      setSavingLink(false)
    }
  }

  return (
    <AdminShell title="Reviews">
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h2 className="text-xl font-semibold">Google Review Link</h2>
        <p className="text-slate-400 mt-2">Yeh link public /reviews page par &quot;Leave a Google Review&quot; button ke liye use hoti hai.</p>
        <div className="admin-form-row" style={{ marginTop: 16 }}>
          <input
            className="admin-input"
            value={googleReviewsUrl}
            onChange={(e) => setGoogleReviewsUrl(e.target.value)}
            placeholder="https://g.page/r/..."
          />
        </div>
        <button
          type="button"
          className="admin-button admin-button-primary"
          style={{ marginTop: 12 }}
          onClick={saveGoogleLink}
          disabled={savingLink}
        >
          {savingLink ? 'Saving…' : 'Save Google Link'}
        </button>
      </div>

      <div className="admin-grid-2 admin-reviews-grid">
        {reviews.length > 0 ? reviews.map((review) => (
          <div key={review.id} className="admin-card">
            {editingId === review.id ? (
              <div className="admin-form">
                <div className="admin-form-row">
                  <label className="admin-field-label">Customer Name</label>
                  <input className="admin-input" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                </div>
                <div className="admin-form-row">
                  <label className="admin-field-label">Location</label>
                  <input className="admin-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="admin-form-row">
                  <label className="admin-field-label">Rating (1–5)</label>
                  <input className="admin-input" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>
                <div className="admin-form-row">
                  <label className="admin-field-label">Review Text</label>
                  <textarea className="admin-textarea" rows={4} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
                </div>
                <label className="admin-checkbox-row">
                  <input type="checkbox" checked={form.approved} onChange={(e) => setForm({ ...form, approved: e.target.checked })} />
                  Show on website (approved)
                </label>
                <div className="admin-section-actions" style={{ marginTop: 16 }}>
                  <button type="button" className="admin-button admin-button-primary" onClick={saveReview} disabled={savingReview}>
                    {savingReview ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button type="button" className="admin-button admin-button-secondary" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="admin-reviews-card-header">
                  <div className="admin-reviews-card-body">
                    <h3 className="text-2xl font-semibold">{review.customer_name || 'Customer'}</h3>
                    <p className="text-slate-300 mt-3 admin-reviews-card-text">{review.comment}</p>
                    {review.location ? <p className="text-slate-400 mt-2">{review.location}</p> : null}
                  </div>
                  <div className="admin-reviews-card-meta">
                    <p>Rating: {review.rating || '-'}/5</p>
                    <p>Status: {review.approved ? 'Approved' : 'Pending'}</p>
                  </div>
                </div>
                <div className="admin-section-actions admin-reviews-card-actions">
                  <button type="button" className="admin-button admin-button-secondary" onClick={() => startEdit(review)}>Edit</button>
                  <button type="button" className="admin-button admin-button-success" onClick={async () => {
                    await fetch(`/api/admin/reviews?id=${review.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: true }) })
                    setReviews(prev => prev.map((item) => item.id === review.id ? { ...item, approved: true } : item))
                  }}>Approve</button>
                  <button type="button" className="admin-button admin-button-warning" onClick={async () => {
                    await fetch(`/api/admin/reviews?id=${review.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: false }) })
                    setReviews(prev => prev.map((item) => item.id === review.id ? { ...item, approved: false } : item))
                  }}>Reject</button>
                  <button type="button" className="admin-button admin-button-danger" onClick={async () => {
                    if (!confirm('Delete this review?')) return
                    await fetch(`/api/admin/reviews?id=${review.id}`, { method: 'DELETE' })
                    setReviews(prev => prev.filter((item) => item.id !== review.id))
                  }}>Delete</button>
                </div>
              </>
            )}
          </div>
        )) : (
          <div className="admin-empty-state">No reviews available.</div>
        )}
      </div>
    </AdminShell>
  )
}
