import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

export default function EditService(){
  const router = useRouter()
  const { id } = router.query
  const [service, setService] = useState(null)

  useEffect(()=>{
    if(!id) return
    fetch(`/api/admin/services?id=${id}`).then(r=>r.json()).then(setService)
  },[id])

  const handleSave = async ()=>{
    await fetch(`/api/admin/services?id=${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(service) })
    router.push('/admin/services')
  }

  if(!service) return <AdminShell title="Edit Service"><div className="text-slate-300">Loading...</div></AdminShell>

  return (
    <AdminShell title="Edit Service">
      <div className="grid gap-4 max-w-3xl">
        <input value={service.title} onChange={e=>setService({...service, title: e.target.value})} className="w-full rounded-3xl bg-slate-800 border border-white/10 p-4 text-white" placeholder="Title" />
        <input value={service.category} onChange={e=>setService({...service, category: e.target.value})} className="w-full rounded-3xl bg-slate-800 border border-white/10 p-4 text-white" placeholder="Category" />
        <input value={service.price} onChange={e=>setService({...service, price: e.target.value})} className="w-full rounded-3xl bg-slate-800 border border-white/10 p-4 text-white" placeholder="Price" />
        <input value={service.image_url} onChange={e=>setService({...service, image_url: e.target.value})} className="w-full rounded-3xl bg-slate-800 border border-white/10 p-4 text-white" placeholder="Image URL" />
        <textarea value={service.description} onChange={e=>setService({...service, description: e.target.value})} className="w-full min-h-[160px] rounded-3xl bg-slate-800 border border-white/10 p-4 text-white" placeholder="Description" />
        <div className="flex flex-wrap gap-3">
          <button onClick={handleSave} className="px-5 py-3 rounded-3xl bg-rose-500 text-white">Save</button>
          <button onClick={()=>router.push('/admin/services')} className="px-5 py-3 rounded-3xl bg-slate-700 text-white">Cancel</button>
        </div>
      </div>
    </AdminShell>
  )
}
