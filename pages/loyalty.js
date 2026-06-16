import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function LoyaltyPage() {
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const check = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    const res = await fetch(`/api/loyalty?phone=${encodeURIComponent(phone)}`)
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Unable to check points')
      return
    }
    setResult(data)
  }

  return (
    <>
      <SEO
        title="Loyalty Points — Huma Beauty Saloon Jhelum"
        description="Check your Huma Beauty Saloon loyalty points in Jhelum. Earn rewards on bridal makeup, facials and salon bookings."
        keywords="salon loyalty points Jhelum, Huma Beauty Saloon rewards, beauty salon membership Jhelum"
        canonical="https://humabeautysaloon.site/loyalty"
        ogImage="https://images.unsplash.com/photo-1560066984-138daaa56d8c?w=1200&q=80"
      />
      <Navbar />
      <main className="page-main" style={{ padding: '100px 5% 80px', maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', marginBottom: 12 }}>Loyalty Points</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Enter your phone number to check earned points from salon bookings.</p>
        <form onSubmit={check} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0300-1234567" className="admin-input" style={{ flex: 1, minWidth: 200 }} required />
          <button type="submit" className="btn-rose"><span>Check Points</span></button>
        </form>
        {error ? <p style={{ color: '#c0392b', marginTop: 16 }}>{error}</p> : null}
        {result ? (
          <div className="admin-card" style={{ marginTop: 24 }}>
            <p><strong>Points:</strong> {result.points}</p>
            <p><strong>Visits:</strong> {result.visits}</p>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
