import { useEffect, useState } from 'react'
import AdminShell from '../../../components/AdminShell'

export default function AdminStaffPage() {
  const [staff, setStaff] = useState([])
  const [form, setForm] = useState({ name: '', role: '', specialty: '', bio: '', image_url: '' })

  const load = () => fetch('/api/admin/staff', { credentials: 'include' }).then(r => r.json()).then(setStaff)
  useEffect(() => { load() }, [])

  const addStaff = async (e) => {
    e.preventDefault()
    await fetch('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    })
    setForm({ name: '', role: '', specialty: '', bio: '', image_url: '' })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete staff member?')) return
    await fetch(`/api/admin/staff?id=${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }

  return (
    <AdminShell title="Staff">
      <form onSubmit={addStaff} className="admin-form admin-card" style={{ marginBottom: 24 }}>
        <h3 className="text-xl font-semibold mb-4">Add Stylist</h3>
        {['name', 'role', 'specialty', 'bio', 'image_url'].map(field => (
          <div key={field} className="admin-form-row">
            <label className="admin-field-label">{field}</label>
            <input className="admin-input" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required={field === 'name'} />
          </div>
        ))}
        <button type="submit" className="admin-button admin-button-primary">Add Staff</button>
      </form>
      <div className="admin-grid-2">
        {staff.map(s => (
          <div key={s.id} className="admin-card">
            <img src={s.image_url} alt={s.name} className="w-full h-48 object-cover rounded-3xl mb-4" />
            <h3 className="text-xl font-semibold">{s.name}</h3>
            <p className="text-slate-400">{s.role} — {s.specialty}</p>
            <p className="text-slate-400 mt-2">{s.bio}</p>
            <button type="button" className="admin-button admin-button-danger mt-4" onClick={() => remove(s.id)}>Delete</button>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
