import { useEffect, useState } from 'react'
import AdminShell from '../../../components/AdminShell'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'reception' })

  const load = () => fetch('/api/admin/users', { credentials: 'include' }).then(r => r.json()).then(setUsers)
  useEffect(() => { load() }, [])

  const addUser = async (e) => {
    e.preventDefault()
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    })
    setForm({ name: '', email: '', password: '', role: 'reception' })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete user?')) return
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }

  return (
    <AdminShell title="Admin Users">
      <form onSubmit={addUser} className="admin-form admin-card" style={{ marginBottom: 24 }}>
        <h3 className="text-xl font-semibold mb-4">Add Admin User</h3>
        {['name', 'email', 'password'].map(field => (
          <div key={field} className="admin-form-row">
            <label className="admin-field-label">{field}</label>
            <input className="admin-input" type={field === 'password' ? 'password' : 'text'} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required />
          </div>
        ))}
        <div className="admin-form-row">
          <label className="admin-field-label">role</label>
          <select className="admin-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="owner">Owner</option>
            <option value="reception">Reception</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <button type="submit" className="admin-button admin-button-primary">Add User</button>
      </form>
      <div className="admin-grid-2">
        {users.map(u => (
          <div key={u.id} className="admin-card">
            <h3 className="text-xl font-semibold">{u.name}</h3>
            <p className="text-slate-400">{u.email} — {u.role}</p>
            <button type="button" className="admin-button admin-button-danger mt-4" onClick={() => remove(u.id)}>Delete</button>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
