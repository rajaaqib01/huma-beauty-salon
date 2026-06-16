import { useEffect, useState } from 'react'
import AdminShell from '../../../components/AdminShell'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    salon_name: '', logo_url: '', phone: '', email: '', address: '', instagram: '', facebook: '',
    hero_title: '', hero_subtitle: '', footer_text: '',
    google_reviews_url: '',
    admin_whatsapp: '', maps_url: '', weekday_open: '09:00', weekday_close: '21:00',
    sunday_open: '10:00', sunday_close: '19:00', slot_minutes: '30',
    referral_code: 'HUMAFRIEND', referral_discount: '10',
    jazzcash_number: '', easypaisa_number: '', loyalty_points_per_booking: '10',
    instagram_username: 'huma_beauty.saloon',
    instagram_post_urls: '',
  })

  useEffect(() => {
    fetch('/api/admin/settings').then((res) => res.json()).then((data) => { if (data) setSettings(data) })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    alert('Settings saved.')
  }

  return (
    <AdminShell title="Website Settings">
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: '840px' }}>
        {[
          { key: 'salon_name', label: 'Salon Name' },
          { key: 'logo_url', label: 'Logo URL' },
          { key: 'phone', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'address', label: 'Address' },
          { key: 'admin_whatsapp', label: 'Admin WhatsApp (923...)' },
          { key: 'maps_url', label: 'Google Maps URL' },
          { key: 'google_reviews_url', label: 'Google Reviews Link (for /reviews page)' },
          { key: 'instagram', label: 'Instagram URL' },
          { key: 'instagram_username', label: 'Instagram Username (no @)' },
          { key: 'instagram_post_urls', label: 'Instagram Post URLs (one per line — auto thumbnails)', textarea: true },
          { key: 'facebook', label: 'Facebook' },
          { key: 'hero_title', label: 'Hero Title' },
          { key: 'hero_subtitle', label: 'Hero Subtitle' },
          { key: 'footer_text', label: 'Footer Text', textarea: true },
          { key: 'weekday_open', label: 'Weekday Open (24h)' },
          { key: 'weekday_close', label: 'Weekday Close (24h)' },
          { key: 'sunday_open', label: 'Sunday Open' },
          { key: 'sunday_close', label: 'Sunday Close' },
          { key: 'slot_minutes', label: 'Slot Duration (minutes)' },
          { key: 'referral_code', label: 'Referral Code' },
          { key: 'referral_discount', label: 'Referral Discount %' },
          { key: 'loyalty_points_per_booking', label: 'Loyalty Points per Booking' },
        ].map((field) => (
          <div key={field.key} className="admin-form-row">
            <label className="admin-field-label">{field.label}</label>
            {field.textarea ? (
              <textarea className="admin-textarea" value={settings[field.key] || ''} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} rows={5} />
            ) : (
              <input className="admin-input" value={settings[field.key] || ''} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} />
            )}
          </div>
        ))}
        <button type="submit" className="admin-button admin-button-primary">Save Settings</button>
      </form>
    </AdminShell>
  )
}
