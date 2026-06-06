import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

export default function EditOfferPage() {
  const router = useRouter()
  const { id } = router.query
  const [offer, setOffer] = useState(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/offers?id=${id}`).then((res) => res.json()).then(setOffer)
  }, [id])

  if (!offer) {
    return <AdminShell title="Edit Offer"><div className="text-slate-300">Loading...</div></AdminShell>
  }

  const saveOffer = async () => {
    await fetch(`/api/admin/offers?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(offer) })
    router.push('/admin/offers')
  }

  return (
    <AdminShell title="Edit Offer">
      <div className="grid gap-4 max-w-3xl">
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
            <input className="w-full rounded-2xl bg-slate-800 border border-white/10 p-3 text-slate-100" value={offer[field] || ''} onChange={(e) => setOffer({ ...offer, [field]: e.target.value })} type={type} />
          </div>
        ))}
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={saveOffer} className="px-5 py-3 rounded-2xl bg-rose-500 text-white hover:bg-rose-400 transition">Save</button>
          <button type="button" className="px-5 py-3 rounded-2xl bg-slate-600 text-white hover:bg-slate-500 transition" onClick={() => router.push('/admin/offers')}>Cancel</button>
        </div>
      </div>
    </AdminShell>
  )
}
