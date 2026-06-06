import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

export default function EditOfferPage() {
  const router = useRouter()
  const { id } = router.query
  const [offer, setOffer] = useState(null)
  const [services, setServices] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/services', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
  }, [])

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/offers?id=${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(setOffer)
  }, [id])

  if (!offer) {
    return <AdminShell title="Edit Offer"><div className="text-slate-300">Loading...</div></AdminShell>
  }

  const handleServiceChange = (serviceTitle) => {
    const selected = services.find(s => s.title === serviceTitle)
    setOffer(o => ({
      ...o,
      service_title: serviceTitle,
      original_price: selected?.price
        ? String(parseInt(String(selected.price).replace(/\D/g, ''), 10) || o.original_price || '')
        : o.original_price,
    }))
  }

  const saveOffer = async () => {
    if (!offer.service_title) {
      setError('Please select a service for this offer.')
      return
    }
    setError('')
    const res = await fetch(`/api/admin/offers?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(offer),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to save offer')
      return
    }
    router.push('/admin/offers')
  }

  return (
    <AdminShell title="Edit Offer">
      <div className="grid gap-4 max-w-3xl">
        <div>
          <label className="text-sm text-slate-300 block mb-2">Service *</label>
          <select
            className="w-full rounded-2xl bg-slate-800 border border-white/10 p-3 text-slate-100"
            value={offer.service_title || ''}
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
              value={offer[field] || ''}
              onChange={(e) => setOffer({ ...offer, [field]: e.target.value })}
              type={type}
            />
          </div>
        ))}

        {error ? <div className="admin-alert">{error}</div> : null}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={saveOffer} className="px-5 py-3 rounded-2xl bg-rose-500 text-white hover:bg-rose-400 transition">Save</button>
          <button type="button" className="px-5 py-3 rounded-2xl bg-slate-600 text-white hover:bg-slate-500 transition" onClick={() => router.push('/admin/offers')}>Cancel</button>
        </div>
      </div>
    </AdminShell>
  )
}
