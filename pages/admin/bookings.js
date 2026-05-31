import { useState } from 'react'
import useSWR from 'swr'
import AdminShell from '../../components/AdminShell'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function AdminBookings() {
  const { data: bookings, error, mutate } = useSWR('/api/admin/bookings', fetcher)
  const [loadingId, setLoadingId] = useState(null)
  const [actionError, setActionError] = useState(null)

  const updateBookingStatus = async (id, status) => {
    setActionError(null)
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/bookings?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const payload = await res.json()
        throw new Error(payload?.error || 'Failed to update booking')
      }
      await mutate()
    } catch (err) {
      console.error(err)
      setActionError(err.message)
    } finally {
      setLoadingId(null)
    }
  }

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return
    setActionError(null)
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/bookings?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const payload = await res.json()
        throw new Error(payload?.error || 'Failed to delete booking')
      }
      await mutate()
    } catch (err) {
      console.error(err)
      setActionError(err.message)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <AdminShell title="Bookings">
      <div className="admin-card admin-card-cta">
        <p className="admin-panel-label">Booking records are saved automatically when a customer submits the booking form.</p>
      </div>

      {error && <div className="admin-alert">Unable to load bookings. Please refresh the page.</div>}
      {actionError && <div className="admin-alert">{actionError}</div>}

      {!bookings ? (
        <div className="admin-empty-state">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="admin-empty-state">No bookings yet. They will appear here when customers submit the booking form.</div>
      ) : (
        <div className="admin-grid-2">
          {bookings.map((booking) => (
            <div key={booking.id} className="admin-card">
              <div className="admin-card-cta">
                <p className="admin-panel-label">{booking.service}</p>
                <p className="text-xl font-semibold">{booking.name}</p>
                <p className="text-sm text-slate-400">{booking.email} · {booking.phone}</p>
              </div>
              <div style={{ marginTop: '16px' }}>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{booking.status || 'pending'}</span></p>
              </div>
              <div className="admin-section-actions" style={{ marginTop: '20px' }}>
                <button
                  className="admin-button admin-button-success"
                  disabled={loadingId === booking.id}
                  type="button"
                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                >
                  {loadingId === booking.id ? 'Saving…' : 'Confirm'}
                </button>
                <button
                  className="admin-button admin-button-warning"
                  disabled={loadingId === booking.id}
                  type="button"
                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                >
                  {loadingId === booking.id ? 'Saving…' : 'Cancel'}
                </button>
                <button
                  className="admin-button admin-button-danger"
                  disabled={loadingId === booking.id}
                  type="button"
                  onClick={() => deleteBooking(booking.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
