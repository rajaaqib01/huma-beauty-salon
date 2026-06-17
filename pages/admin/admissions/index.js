import { useState } from 'react'
import useSWR from 'swr'
import AdminShell from '../../../components/AdminShell'
import useAdminAuth from '../../../lib/useAdminAuth'
import { canAdminDelete } from '../../../lib/adminRoles'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

function admissionCardClass(status) {
  const normalized = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending'
  return `admin-admission-card admin-admission-card--${normalized}`
}

function statusLabel(status) {
  if (status === 'approved') return 'Approved'
  if (status === 'rejected') return 'Rejected'
  return 'Pending'
}

export default function AdmissionsPage() {
  const { admin } = useAdminAuth()
  const allowDelete = canAdminDelete(admin?.role)
  const { data, mutate } = useSWR('/api/admin/admissions', fetcher)
  const admissions = Array.isArray(data) ? data : []
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? admissions
    : admissions.filter((a) => a.status === filter)

  const updateAdmission = async (id, patch) => {
    const res = await fetch(`/api/admin/admissions?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(patch),
    })
    if (!res.ok) return
    const updated = await res.json()
    mutate(
      admissions.map((a) => (String(a.id) === String(id) ? { ...a, ...updated } : a)),
      false
    )
  }

  const deleteAdmission = async (id) => {
    if (!confirm('Delete this admission record?')) return
    const res = await fetch(`/api/admin/admissions?id=${id}`, { method: 'DELETE', credentials: 'include' })
    if (!res.ok) return
    mutate(admissions.filter((a) => String(a.id) !== String(id)), false)
  }

  return (
    <AdminShell title="Course Admissions">
      <p className="admin-page-subtitle" style={{ marginBottom: 16 }}>
        Verify Upaisa payments and approve or reject student applications.
      </p>

      <div className="services-filter-tabs" style={{ marginBottom: 20, position: 'static', boxShadow: 'none' }}>
        {['all', 'pending', 'approved', 'rejected'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`services-filter-tab${filter === tab ? ' services-filter-tab--active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'all' ? 'All' : statusLabel(tab)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty-state">No admissions in this filter.</div>
      ) : (
        <div className="admin-admissions-list">
          {filtered.map((a) => (
            <article key={a.id} className={admissionCardClass(a.status)}>
              <div className="admin-admission-card-header">
                <div className="admin-admission-card-intro">
                  <h3 className="admin-admission-card-title">{a.student_name || a.name}</h3>
                  <p className="admin-admission-card-subtitle">
                    {a.course_title} · {a.batch} batch · Rs. {a.course_fee}
                  </p>
                </div>
                <span className={`admin-admission-badge admin-admission-badge--${a.status === 'approved' ? 'approved' : a.status === 'rejected' ? 'rejected' : 'pending'}`}>
                  {statusLabel(a.status)}
                </span>
              </div>

              <ul className="admin-admission-card-meta">
                <li><span aria-hidden="true">📞</span> {a.phone}</li>
                <li><span aria-hidden="true">✉️</span> {a.email}</li>
                {a.city ? <li><span aria-hidden="true">📍</span> {a.city}</li> : null}
                <li><span aria-hidden="true">💳</span> Upaisa Txn: <strong>{a.transaction_id}</strong></li>
                {a.experience ? <li>Experience: {a.experience}</li> : null}
                {a.notes ? <li>Notes: {a.notes}</li> : null}
                <li className="admin-admission-card-date">
                  Applied: {a.created_at ? new Date(a.created_at).toLocaleString() : '—'}
                </li>
              </ul>

              {a.payment_screenshot ? (
                <a href={a.payment_screenshot} target="_blank" rel="noreferrer" className="admin-admission-card-screenshot">
                  <img src={a.payment_screenshot} alt="Payment screenshot" />
                </a>
              ) : null}

              <div className="admin-admission-card-actions admin-section-actions">
                {a.status !== 'approved' ? (
                  <button type="button" className="admin-button admin-button-primary" onClick={() => updateAdmission(a.id, { status: 'approved', read: true })}>
                    Approve
                  </button>
                ) : null}
                {a.status !== 'rejected' ? (
                  <button type="button" className="admin-button admin-button-warning" onClick={() => updateAdmission(a.id, { status: 'rejected', read: true })}>
                    Reject
                  </button>
                ) : null}
                {allowDelete ? (
                  <button type="button" className="admin-button admin-button-danger" onClick={() => deleteAdmission(a.id)}>
                    Delete
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
