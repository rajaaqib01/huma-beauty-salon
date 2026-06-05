import { useEffect, useState } from 'react'
import AdminShell from '../../../components/AdminShell'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/admin/reviews', { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          console.error('Failed to fetch reviews:', data)
          if (mounted) setReviews([])
          return
        }
        const data = await res.json()
        if (mounted) setReviews(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Reviews fetch error:', e)
        if (mounted) setReviews([])
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <AdminShell title="Reviews">
      <div className="admin-grid-2">
        {reviews.length > 0 ? reviews.map((review) => (
          <div key={review.id} className="admin-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h3 className="text-2xl font-semibold">{review.customer_name || 'Customer'}</h3>
                <p className="text-slate-300 mt-3">{review.comment}</p>
              </div>
              <div className="text-right text-slate-400" style={{ minWidth: '120px' }}>
                <p>Rating: {review.rating || '-'}/5</p>
                <p>Status: {review.approved ? 'Approved' : 'Pending'}</p>
              </div>
            </div>
            <div className="admin-section-actions" style={{ marginTop: '18px' }}>
              <button className="admin-button admin-button-success" onClick={async () => {
                await fetch(`/api/admin/reviews?id=${review.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: true }) })
                setReviews(prev => prev.map((item) => item.id === review.id ? { ...item, approved: true } : item))
              }}>Approve</button>
              <button className="admin-button admin-button-warning" onClick={async () => {
                await fetch(`/api/admin/reviews?id=${review.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: false }) })
                setReviews(prev => prev.map((item) => item.id === review.id ? { ...item, approved: false } : item))
              }}>Reject</button>
              <button className="admin-button admin-button-danger" onClick={async () => {
                if (!confirm('Delete this review?')) return
                await fetch(`/api/admin/reviews?id=${review.id}`, { method: 'DELETE' })
                setReviews(prev => prev.filter((item) => item.id !== review.id))
              }}>Delete</button>
            </div>
          </div>
        )) : (
          <div className="admin-empty-state">No reviews available.</div>
        )}
      </div>
    </AdminShell>
  )
}
