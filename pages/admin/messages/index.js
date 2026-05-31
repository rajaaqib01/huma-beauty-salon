import useSWR from 'swr'
import AdminShell from '../../../components/AdminShell'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function Messages(){
  const { data } = useSWR('/api/admin/messages', fetcher)

  return (
    <AdminShell title="Messages">
      <div className="admin-grid-2">
        {data?.map(m=> (
          <div key={m.id} className="admin-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <h3 className="text-2xl font-semibold">{m.subject || 'No Subject'}</h3>
                <p className="text-slate-300">{m.name} • {m.email} • {m.phone}</p>
              </div>
              <p className="text-slate-400" style={{ fontSize: '0.95rem' }}>{new Date(m.created_at).toLocaleString()}</p>
            </div>
            <p className="text-slate-200" style={{ marginTop: '18px', whiteSpace: 'pre-wrap' }}>{m.message}</p>
            <div className="admin-section-actions">
              <button onClick={async()=>{ await fetch(`/api/admin/messages?id=${m.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ read: true }) }); window.location.reload() }} className="admin-button admin-button-primary">Mark Read</button>
              <button onClick={async()=>{ await fetch(`/api/admin/messages?id=${m.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ read: false }) }); window.location.reload() }} className="admin-button admin-button-warning">Mark Unread</button>
              <button onClick={async()=>{ if(confirm('Delete this message?')){ await fetch(`/api/admin/messages?id=${m.id}`, { method: 'DELETE' }); window.location.reload() }}} className="admin-button admin-button-danger">Delete</button>
            </div>
          </div>
        )) || <div className="admin-empty-state">No messages found.</div>}
      </div>
    </AdminShell>
  )
}
