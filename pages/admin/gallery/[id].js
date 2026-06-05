import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

export default function EditGalleryPage() {
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/gallery?id=${id}`).then((res) => res.json()).then(setItem)
  }, [id])

  if (!item) {
    return <AdminShell title="Edit Gallery"><div className="text-slate-300">Loading...</div></AdminShell>
  }

  const save = async () => {
    await fetch(`/api/admin/gallery?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
    router.push('/admin/gallery')
  }

  return (
    <AdminShell title="Edit Gallery Image">
      <div className="grid gap-4 max-w-3xl">
        <div>
          <label className="text-sm text-slate-300 block mb-2">Title</label>
          <input className="w-full rounded-2xl bg-slate-800 border border-white/10 p-3 text-slate-100" value={item.title || ''} onChange={(e) => setItem({ ...item, title: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-slate-300 block mb-2">Image URL</label>
          <input className="w-full rounded-2xl bg-slate-800 border border-white/10 p-3 text-slate-100" value={item.image_url || ''} onChange={(e) => setItem({ ...item, image_url: e.target.value })} />
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={save} className="px-5 py-3 rounded-2xl bg-rose-500 text-white hover:bg-rose-400 transition">Save</button>
          <button onClick={() => router.push('/admin/gallery')} className="px-5 py-3 rounded-2xl bg-slate-600 text-white hover:bg-slate-500 transition">Cancel</button>
        </div>
      </div>
    </AdminShell>
  )
}
