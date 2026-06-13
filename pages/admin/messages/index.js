import { useMemo, useState } from 'react'
import useSWR from 'swr'
import AdminShell from '../../../components/AdminShell'
import useAdminAuth from '../../../lib/useAdminAuth'
import { canAdminDelete } from '../../../lib/adminRoles'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

function messageDateKey(createdAt) {
  if (!createdAt) return ''
  const d = new Date(createdAt)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function messageCardClass(read) {
  const readState = read ? 'read' : 'unread'
  return `admin-message-card admin-message-card--${readState}`
}

export default function Messages() {
  const { admin } = useAdminAuth()
  const allowDelete = canAdminDelete(admin?.role)
  const { data, error, mutate } = useSWR('/api/admin/messages', fetcher)
  const messages = Array.isArray(data) ? data : []
  const [filterDate, setFilterDate] = useState('')

  const filtered = useMemo(() => {
    if (!filterDate) return messages
    return messages.filter((m) => messageDateKey(m.created_at) === filterDate)
  }, [messages, filterDate])

  const updateMessage = async (id, patch) => {
    const res = await fetch(`/api/admin/messages?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (!res.ok) return
    const updated = await res.json()
    mutate(
      messages.map(m => (String(m.id) === String(id) ? { ...m, ...updated, ...patch } : m)),
      false
    )
  }

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' })
    if (!res.ok) return
    mutate(messages.filter(m => String(m.id) !== String(id)), false)
  }

  return (
    <AdminShell title="Messages">
      <div className="admin-card admin-messages-filters">
        <div className="admin-messages-filters-row">
          <div className="admin-form-row">
            <label className="admin-field-label" htmlFor="messages-date-filter">Filter by date</label>
            <input
              id="messages-date-filter"
              type="date"
              className="admin-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          {filterDate ? (
            <button type="button" className="admin-button admin-button-warning" onClick={() => setFilterDate('')}>
              Clear filter ({filterDate})
            </button>
          ) : null}
        </div>
        {filterDate ? (
          <p className="admin-page-subtitle" style={{ marginTop: 12, marginBottom: 0 }}>
            Showing {filtered.length} message{filtered.length === 1 ? '' : 's'} from {filterDate}
          </p>
        ) : null}
      </div>

      <div className="admin-grid-2 admin-card-list-grid">
        {error ? (
          <div className="admin-empty-state">Unable to load messages. Please refresh.</div>
        ) : filtered.length > 0 ? (
          filtered.map(m => {
            const isRead = Boolean(m.read)
            return (
              <div key={m.id} className={messageCardClass(isRead)}>
                <div className="admin-message-card-header">
                  <div>
                    <div className="admin-message-card-topline">
                      <h3 className="admin-message-card-title">{m.subject || 'No Subject'}</h3>
                      {!isRead && <span className="admin-message-badge admin-message-badge-new">New</span>}
                      <span className={`admin-message-badge admin-message-badge-${isRead ? 'read' : 'unread'}`}>
                        {isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <p className="admin-message-card-meta">{m.name} • {m.email} • {m.phone}</p>
                  </div>
                  <p className="admin-message-card-date">{new Date(m.created_at).toLocaleString()}</p>
                </div>
                <p className="admin-message-card-body">{m.message}</p>
                <div className="admin-section-actions">
                  <button onClick={() => updateMessage(m.id, { read: true })} className="admin-button admin-button-primary">Mark Read</button>
                  <button onClick={() => updateMessage(m.id, { read: false })} className="admin-button admin-button-warning">Mark Unread</button>
                  {allowDelete ? (
                    <button onClick={() => deleteMessage(m.id)} className="admin-button admin-button-danger">Delete</button>
                  ) : null}
                </div>
              </div>
            )
          })
        ) : (
          <div className="admin-empty-state">
            No messages found{filterDate ? ` for ${filterDate}` : ''}.
          </div>
        )}
      </div>
    </AdminShell>
  )
}
