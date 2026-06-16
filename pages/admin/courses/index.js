import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import AdminShell from '../../../components/AdminShell'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function AdminCoursesPage() {
  const { data, mutate } = useSWR('/api/admin/courses', fetcher)
  const courses = Array.isArray(data) ? data : []
  const [savingId, setSavingId] = useState('')
  const [error, setError] = useState('')

  const handleSave = async (course) => {
    setSavingId(course.id)
    setError('')
    try {
      const res = await fetch(`/api/admin/courses?id=${course.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fee: course.fee,
          duration: course.duration,
          seats: Number(course.seats) || 0,
          description: course.description,
          active: course.active !== false,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      await mutate()
    } catch (err) {
      setError(err.message || 'Could not save course.')
    } finally {
      setSavingId('')
    }
  }

  return (
    <AdminShell title="Academy Courses">
      <div className="admin-section-actions">
        <Link href="/admin/admissions" className="admin-button admin-button-secondary">View Admissions</Link>
        <Link href="/courses" className="admin-button admin-button-secondary" target="_blank">View Public Page</Link>
      </div>

      <p className="admin-page-subtitle" style={{ marginBottom: 20 }}>
        Edit course fees, duration, and seats. Course titles and syllabus are fixed in the academy program.
      </p>

      {error ? <div className="admin-alert">{error}</div> : null}

      {courses.length === 0 ? (
        <div className="admin-empty-state">No courses found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {courses.map((course, idx) => (
            <div key={course.id} className="admin-card" style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 12px' }}>{course.title}</h3>
              <div className="admin-form-row">
                <label className="admin-field-label">Fee (Rs.)</label>
                <input
                  className="admin-input"
                  value={course.fee || ''}
                  onChange={(e) => {
                    const next = [...courses]
                    next[idx] = { ...course, fee: e.target.value }
                    mutate(next, false)
                  }}
                />
              </div>
              <div className="admin-form-row">
                <label className="admin-field-label">Duration</label>
                <input
                  className="admin-input"
                  value={course.duration || ''}
                  onChange={(e) => {
                    const next = [...courses]
                    next[idx] = { ...course, duration: e.target.value }
                    mutate(next, false)
                  }}
                />
              </div>
              <div className="admin-form-row">
                <label className="admin-field-label">Seats</label>
                <input
                  className="admin-input"
                  type="number"
                  min="1"
                  value={course.seats ?? ''}
                  onChange={(e) => {
                    const next = [...courses]
                    next[idx] = { ...course, seats: e.target.value }
                    mutate(next, false)
                  }}
                />
              </div>
              <div className="admin-form-row">
                <label className="admin-field-label">Description</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={course.description || ''}
                  onChange={(e) => {
                    const next = [...courses]
                    next[idx] = { ...course, description: e.target.value }
                    mutate(next, false)
                  }}
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={course.active !== false}
                  onChange={(e) => {
                    const next = [...courses]
                    next[idx] = { ...course, active: e.target.checked }
                    mutate(next, false)
                  }}
                />
                Active on website
              </label>
              <button
                type="button"
                className="admin-button admin-button-primary"
                disabled={savingId === course.id}
                onClick={() => handleSave(courses[idx])}
              >
                {savingId === course.id ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
