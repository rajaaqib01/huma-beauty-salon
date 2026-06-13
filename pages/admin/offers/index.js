import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'
import { getOfferScheduleStatus } from '../../../lib/offerConfig'

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
          <p className="text-slate-400 mt-3">Create offers with start/end dates — they auto show on home &amp; offers page when live.</p>
        </div>
        <div className="admin-card admin-card-cta">
          <button className="admin-button admin-button-primary" onClick={() => router.push('/admin/offers/new')}>Add New Offer</button>
        </div>
      </div>
      <div className="admin-grid-2">
        {offers.length === 0 ? (
          <div className="admin-empty-state">No offers available.</div>
        ) : offers.map((offer) => {
          const schedule = getOfferScheduleStatus(offer)
          return (
          <div key={offer.id} className="admin-card">
            <div className="admin-card-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="admin-offer-title-row">
                  <h3 className="text-2xl font-semibold">{offer.title}</h3>
                  <span className={`admin-offer-schedule admin-offer-schedule--${schedule.tone}`}>{schedule.label}</span>
                </div>
                <p className="text-slate-400 mt-2"><strong>Service:</strong> {offer.service_title || 'Not linked — will not show on public page'}</p>
                <p className="text-slate-400 mt-3">{offer.description}</p>
              </div>
              <div className="text-slate-400 text-right" style={{ minWidth: '160px' }}>
                <p className="text-sm">Discount: {String(offer.discount || '').replace(/[^\d.]/g, '') || '0'}%</p>
                {offer.original_price ? <p className="text-sm">Price: Rs. {Number(offer.original_price).toLocaleString('en-PK')}</p> : null}
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
          )
        })}
      </div>
    </AdminShell>
  )
}
