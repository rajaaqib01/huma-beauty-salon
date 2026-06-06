import { useEffect, useState } from 'react'
import AdminShell from '../../../components/AdminShell'
import { useRouter } from 'next/router'

export default function NewOfferPage() {
  const [form, setForm] = useState({
    title: '', description: '', discount: '', original_price: '',
    service_title: '', image_url: '', starts_at: '', ends_at: '',
  })
  const [services, setServices] = useState([])
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/services', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
  }, [])

  const handleServiceChange = (serviceTitle) => {
    const selected = services.find(s => s.title === serviceTitle)
    setForm(f => ({
      ...f,
      service_title: serviceTitle,
      original_price: selected?.price ? String(parseInt(String(selected.price).replace(/\D/g, ''), 10) || '') : f.original_price,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.service_title) {
      setError('Please select a service for this offer.')
      return
    }
    setError('')
    const res = await fetch('/api/admin/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to create offer')
      return
    }
    router.push('/admin/offers')
  }

  return (
    <AdminShell title="Create Offer">
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-3xl">
        <p className="text-slate-400 text-sm">
          Select one service from admin services. Only that service will show on the public offers page with this discount.
        </p>

        <div>
          <label className="text-sm text-slate-300 block mb-2">Service *</label>
          <select
            className="w-full rounded-2xl bg-slate-800 border border-white/10 p-3 text-slate-100"
            value={form.service_title}
            onChange={(e) => handleServiceChange(e.target.value)}
            required
          >
            <option value="">Select a service</option>
            {services.map(s => (
              <option key={s.id} value={s.title}>{s.title} — Rs. {Number(s.price || 0).toLocaleString('en-PK')}</option>
            ))}
          </select>
        </div>

        {[
          { field: 'title', label: 'Offer Title', type: 'text' },
          { field: 'description', label: 'Description', type: 'text' },
          { field: 'original_price', label: 'Original Price (Rs.)', type: 'number' },
          { field: 'discount', label: 'Discount (%)', type: 'number' },
          { field: 'image_url', label: 'Image URL', type: 'text' },
          { field: 'starts_at', label: 'Starts At', type: 'date' },
          { field: 'ends_at', label: 'Ends At', type: 'date' },
        ].map(({ field, label, type }) => (
          <div key={field}>
            <label className="text-sm text-slate-300 block mb-2">{label}</label>
            <input
              className="w-full rounded-2xl bg-slate-800 border border-white/10 p-3 text-slate-100"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              type={type}
            />
          </div>
        ))}

        {error ? <div className="admin-alert">{error}</div> : null}

        <button className="w-fit px-5 py-3 rounded-2xl bg-rose-500 text-white hover:bg-rose-400 transition">
          Create Offer
        </button>
      </form>
    </AdminShell>
  )
}
