import { useState } from 'react'
import AdminShell from '../../../components/AdminShell'
import { useRouter } from 'next/router'

export default function NewOfferPage() {
  const [form, setForm] = useState({ title: '', description: '', discount: '', original_price: '', service_title: '', image_url: '', starts_at: '', ends_at: '' })
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/admin/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    router.push('/admin/offers')
  }

  return (
    <AdminShell title="Create Offer">
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-3xl">
        {[
          { field: 'title', label: 'Title', type: 'text' },
          { field: 'description', label: 'Description', type: 'text' },
          { field: 'original_price', label: 'Original Price (Rs.)', type: 'number' },
          { field: 'discount', label: 'Discount (%)', type: 'number' },
          { field: 'service_title', label: 'Linked Service Name (optional)', type: 'text' },
          { field: 'image_url', label: 'Image URL', type: 'text' },
          { field: 'starts_at', label: 'Starts At', type: 'date' },
          { field: 'ends_at', label: 'Ends At', type: 'date' },
        ].map(({ field, label, type }) => (
          <div key={field}>
            <label className="text-sm text-slate-300 block mb-2">{label}</label>
            <input className="w-full rounded-2xl bg-slate-800 border border-white/10 p-3 text-slate-100" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} type={type} />
          </div>
        ))}
        <button className="w-fit px-5 py-3 rounded-2xl bg-rose-500 text-white hover:bg-rose-400 transition">Create Offer</button>
      </form>
    </AdminShell>
  )
}
