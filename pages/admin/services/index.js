import useSWR from 'swr'
import Link from 'next/link'
import AdminShell from '../../../components/AdminShell'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function ServicesPage(){
  const { data, error } = useSWR('/api/admin/services', fetcher)
  const services = Array.isArray(data) ? data : []

  return (
    <AdminShell title="Services">
      <div className="admin-section-actions">
        <Link href="/admin/services/new" className="admin-button admin-button-primary">Add Service</Link>
      </div>
      <div className="admin-grid-3">
        {error ? (
          <div className="admin-empty-state">Unable to load services. Please refresh.</div>
        ) : services.length > 0 ? (
          services.map(s=> (
            <div key={s.id} className="admin-card">
            <img src={s.image_url} alt={s.title} className="w-full h-48 object-cover rounded-3xl mb-5" />
            <div>
              <h3 className="text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-slate-300">{s.category} • Rs. {s.price}</p>
              <p className="mt-4 text-slate-400">{s.description}</p>
            </div>
            <div className="admin-section-actions" style={{ marginTop: '20px' }}>
              <Link href={`/admin/services/${s.id}`} className="admin-button admin-button-secondary">Edit</Link>
              <button onClick={async()=>{
                if(!confirm('Delete service?')) return;
                await fetch(`/api/admin/services?id=${s.id}`, { method: 'DELETE' });
                window.location.reload();
              }} className="admin-button admin-button-danger">Delete</button>
            </div>
            </div>
          ))
        ) : (
            <div className="admin-empty-state">No services available.</div>
          )}
      </div>
    </AdminShell>
  )
}
