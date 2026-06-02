import useSWR from 'swr'
import AdminShell from '../../../components/AdminShell'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function Bookings(){
  const { data, error } = useSWR('/api/admin/bookings', fetcher)
  const bookings = Array.isArray(data) ? data : []

  return (
    <AdminShell title="Bookings">
      <div className="admin-grid-2">
        {error ? (
          <div className="admin-empty-state">Unable to load bookings. Please refresh.</div>
        ) : bookings.length > 0 ? (
          bookings.map(b => (
            <div key={b.id} className="admin-card" style={{ borderColor: b.status === 'confirmed' ? 'rgba(15, 76, 69, 0.35)' : b.status === 'pending' ? 'rgba(212, 175, 55, 0.35)' : 'rgba(231, 76, 60, 0.35)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <h3 className="text-2xl font-semibold">{b.customer_name}</h3>
                  <p className="text-slate-300">{b.service_title} • {b.status}</p>
                  {b.price ? (<p style={{ marginTop: 6 }}><strong>Price:</strong> {b.price}</p>) : null}
                </div>
                <div className="text-slate-400" style={{ fontSize: '0.9rem' }}>ID: {b.id}</div>
              </div>
              <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
                <p><strong>Email:</strong> {b.email}</p>
                <p><strong>Phone:</strong> {b.phone}</p>
                <p><strong>Date:</strong> {b.date}</p>
                <p><strong>Time:</strong> {b.time}</p>
              </div>
              <p className="text-slate-300" style={{ marginTop: '18px' }}>{b.notes || 'No notes provided'}</p>
              <div className="admin-section-actions">
                <button onClick={async ()=>{ await fetch(`/api/admin/bookings?id=${b.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: 'confirmed' })}); window.location.reload() }} className="admin-button admin-button-success">Confirm</button>
                <button onClick={async ()=>{ await fetch(`/api/admin/bookings?id=${b.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: 'pending' })}); window.location.reload() }} className="admin-button admin-button-warning">Pending</button>
                <button onClick={async ()=>{ await fetch(`/api/admin/bookings?id=${b.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: 'cancelled' })}); window.location.reload() }} className="admin-button admin-button-danger">Cancel</button>
                <button onClick={async ()=>{ if(confirm('Delete booking?')){ await fetch(`/api/admin/bookings?id=${b.id}`, { method: 'DELETE' }); window.location.reload() }}} className="admin-button admin-button-secondary">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-empty-state">No bookings found.</div>
        )}
      </div>
    </AdminShell>
  )
}
