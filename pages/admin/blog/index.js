import { useEffect, useState } from 'react'
import AdminShell from '../../../components/AdminShell'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', image_url: '' })

  const load = () => fetch('/api/admin/blog', { credentials: 'include' }).then(r => r.json()).then(setPosts)
  useEffect(() => { load() }, [])

  const addPost = async (e) => {
    e.preventDefault()
    await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    })
    setForm({ title: '', excerpt: '', content: '', image_url: '' })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete post?')) return
    await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }

  return (
    <AdminShell title="Blog">
      <form onSubmit={addPost} className="admin-form admin-card" style={{ marginBottom: 24 }}>
        <h3 className="text-xl font-semibold mb-4">New Blog Post</h3>
        <div className="admin-form-row"><label className="admin-field-label">Title</label><input className="admin-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="admin-form-row"><label className="admin-field-label">Excerpt</label><input className="admin-input" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
        <div className="admin-form-row"><label className="admin-field-label">Content</label><textarea className="admin-textarea" rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required /></div>
        <div className="admin-form-row"><label className="admin-field-label">Image URL</label><input className="admin-input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
        <button type="submit" className="admin-button admin-button-primary">Publish</button>
      </form>
      <div className="admin-grid-2">
        {posts.map(p => (
          <div key={p.id} className="admin-card">
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="text-slate-400 mt-2">{p.excerpt}</p>
            <button type="button" className="admin-button admin-button-danger mt-4" onClick={() => remove(p.id)}>Delete</button>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
