import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

export default function NewGalleryPage() {
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, image_url: imageUrl }) })
    router.push('/admin/gallery')
  }

  return (
    <AdminShell title="Upload Gallery Image">
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-3xl">
        <div>
          <label className="text-sm text-slate-300 block mb-2">Title</label>
          <input className="w-full rounded-2xl bg-slate-800 border border-white/10 p-3 text-slate-100" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-slate-300 block mb-2">Image URL</label>
          <input className="w-full rounded-2xl bg-slate-800 border border-white/10 p-3 text-slate-100" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <button className="w-fit px-5 py-3 rounded-2xl bg-rose-500 text-white hover:bg-rose-400 transition">Upload</button>
      </form>
    </AdminShell>
  )
}
