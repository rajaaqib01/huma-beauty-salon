import useSWR from 'swr'
import AdminShell from '../../../components/AdminShell'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

function bookingCardClass(status, read) {
  const normalized = status === 'confirmed' ? 'confirmed' : status === 'cancelled' ? 'cancelled' : 'pending'
  const readState = read ? 'read' : 'unread'
  return `admin-booking-card admin-booking-card--${normalized} admin-booking-card--${readState}`
}

function statusLabel(status) {
  if (status === 'confirmed') return 'Confirmed'
  if (status === 'cancelled') return 'Cancelled'
  return 'Pending'
}

export default function Bookings() {
  const { data, error, mutate } = useSWR('/api/admin/bookings', fetcher)
  const bookings = Array.isArray(data) ? data : []

  const updateBooking = async (id, patch) => {
    const res = await fetch(`/api/admin/bookings?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (!res.ok) return
    const updated = await res.json()
    mutate(
      bookings.map(b => (String(b.id) === String(id) ? { ...b, ...updated, ...patch } : b)),
      false
    )
  }

  const deleteBooking = async (id) => {
    if (!confirm('Delete booking?')) return
    const res = await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' })
    if (!res.ok) return
    mutate(bookings.filter(b => String(b.id) !== String(id)), false)
  }

  return (
    <AdminShell title="Bookings">
      <div className="admin-grid-2">
        {error ? (
          <div className="admin-empty-state">Unable to load bookings. Please refresh.</div>
        ) : bookings.length > 0 ? (
          bookings.map(b => {
            const isRead = Boolean(b.read)
            return (
              <div key={b.id} className={bookingCardClass(b.status, isRead)}>
                <div className="admin-booking-card-header">
                  <div>
                    <div className="admin-booking-card-topline">
                      <h3 className="admin-booking-card-title">{b.customer_name || b.name}</h3>
                      {!isRead && <span className="admin-booking-badge admin-booking-badge-new">New</span>}
                      <span className={`admin-booking-badge admin-booking-badge-${b.status === 'confirmed' ? 'confirmed' : b.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                        {statusLabel(b.status)}
                      </span>
                      <span className={`admin-booking-badge admin-booking-badge-${isRead ? 'read' : 'unread'}`}>
                        {isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <p className="admin-booking-card-subtitle">{b.service_title || b.service}</p>
                    {b.offer_title ? <p className="admin-booking-card-price"><strong>Offer:</strong> {b.offer_title}</p> : null}
                    {b.price ? <p className="admin-booking-card-price"><strong>Price:</strong> {b.price}</p> : null}
                  </div>
                  <div className="admin-booking-card-id">ID: {b.id}</div>
                </div>

                <div className="admin-booking-card-details">
                  <p><strong>Email:</strong> {b.email}</p>
                  <p><strong>Phone:</strong> {b.phone}</p>
                  <p><strong>Date:</strong> {b.date}</p>
                  <p><strong>Time:</strong> {b.time}</p>
                </div>

                <p className="admin-booking-card-notes">{b.notes || 'No notes provided'}</p>

                <div className="admin-section-actions">
                  <button onClick={() => updateBooking(b.id, { status: 'confirmed', read: true })} className="admin-button admin-button-success">Confirm</button>
                  <button onClick={() => updateBooking(b.id, { status: 'pending', read: true })} className="admin-button admin-button-warning">Pending</button>
                  <button onClick={() => updateBooking(b.id, { status: 'cancelled', read: true })} className="admin-button admin-button-danger">Cancel</button>
                  <button onClick={() => deleteBooking(b.id)} className="admin-button admin-button-secondary">Delete</button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="admin-empty-state">No bookings found.</div>
        )}
      </div>
    </AdminShell>
  )
}
