import { useState } from 'react'
import AdminShell from '../../../components/AdminShell'
import { useRouter } from 'next/router'

export default function NewOfferPage() {
  const [form, setForm] = useState({ title: '', description: '', discount: '', image_url: '', starts_at: '', ends_at: '' })
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/admin/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    router.push('/admin/offers')
  }

  return (
    <AdminShell title="Create Offer">
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-3xl">
        {['title', 'description', 'discount', 'image_url', 'starts_at', 'ends_at'].map((field) => (
          <div key={field}>
            <label className="text-sm text-slate-300 block mb-2 capitalize">{field.replace('_', ' ')}</label>
            <input className="w-full rounded-2xl bg-slate-800 border border-white/10 p-3 text-slate-100" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} type={field.includes('at') ? 'date' : 'text'} />
          </div>
        ))}
        <button className="w-fit px-5 py-3 rounded-2xl bg-rose-500 text-white hover:bg-rose-400 transition">Create Offer</button>
      </form>
    </AdminShell>
  )
}
