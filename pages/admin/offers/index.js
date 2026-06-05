import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'

export default function OffersPage() {
  const [offers, setOffers] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/offers').then((res) => res.json()).then(setOffers)
  }, [])

  return (
    <AdminShell title="Offers">
      <div className="admin-grid-2">
        <div className="admin-card">
          <h2 className="text-xl font-semibold">Offers Management</h2>
          <p className="text-slate-400 mt-3">Create, edit, and remove promotional offers shown on the site.</p>
        </div>
        <div className="admin-card admin-card-cta">
          <button className="admin-button admin-button-primary" onClick={() => router.push('/admin/offers/new')}>Add New Offer</button>
        </div>
      </div>
      <div className="admin-grid-2">
        {offers.map((offer) => (
          <div key={offer.id} className="admin-card">
            <div className="admin-card-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <h3 className="text-2xl font-semibold">{offer.title}</h3>
                <p className="text-slate-400 mt-3">{offer.description}</p>
              </div>
              <div className="text-slate-400 text-right" style={{ minWidth: '160px' }}>
                <p className="text-sm">Discount: {offer.discount}%</p>
                <p className="text-sm">Valid: {offer.starts_at ? new Date(offer.starts_at).toLocaleDateString() : '-'} – {offer.ends_at ? new Date(offer.ends_at).toLocaleDateString() : '-'}</p>
              </div>
            </div>
            <div className="admin-section-actions" style={{ marginTop: '18px' }}>
              <button className="admin-button admin-button-secondary" onClick={() => router.push(`/admin/offers/${offer.id}`)}>Edit</button>
              <button className="admin-button admin-button-danger" onClick={async () => {
                if (!confirm('Delete this offer?')) return
                await fetch(`/api/admin/offers?id=${offer.id}`, { method: 'DELETE' })
                setOffers(offers.filter((item) => item.id !== offer.id))
              }}>Delete</button>
            </div>
          </div>
        )) || <div className="admin-empty-state">No offers available.</div>}
      </div>
    </AdminShell>
  )
}
