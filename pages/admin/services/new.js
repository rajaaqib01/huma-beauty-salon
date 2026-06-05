import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

const CATEGORIES = ['Makeup', 'Hair', 'Facial', 'Nails', 'Mehndi', 'Waxing']

export default function NewService(){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const router = useRouter()

  const handleCreate = async (e)=>{
    e.preventDefault()
    const body = { title, description, price, category, image_url: imageUrl }
    const res = await fetch('/api/admin/services', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)})
    if(res.ok) router.push('/admin/services')
  }

  return (
    <AdminShell title="Create Service">
      <form onSubmit={handleCreate} className="grid gap-4 max-w-3xl">
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-3xl bg-slate-800 border border-white/10 p-4 text-white" />
        <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full rounded-3xl bg-slate-800 border border-white/10 p-4 text-white">
          <option value="">Select Category</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Price (numbers only, e.g. 3000)" value={price} onChange={e=>setPrice(e.target.value)} className="w-full rounded-3xl bg-slate-800 border border-white/10 p-4 text-white" />
        <input placeholder="Image URL" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} className="w-full rounded-3xl bg-slate-800 border border-white/10 p-4 text-white" />
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} className="w-full min-h-[160px] rounded-3xl bg-slate-800 border border-white/10 p-4 text-white" />
        <button className="w-fit rounded-3xl bg-rose-500 px-6 py-3 text-white hover:bg-rose-400 transition">Create Service</button>
      </form>
    </AdminShell>
  )
}
