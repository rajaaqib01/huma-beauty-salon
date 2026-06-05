import { useEffect, useState } from 'react'
import AdminShell from '../../../components/AdminShell'

export default function SettingsPage() {
  const [settings, setSettings] = useState({ salon_name: '', logo_url: '', phone: '', email: '', address: '', instagram: '', facebook: '', hero_title: '', hero_subtitle: '', footer_text: '' })

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
          { key: 'instagram', label: 'Instagram' },
          { key: 'facebook', label: 'Facebook' },
          { key: 'hero_title', label: 'Hero Title' },
          { key: 'hero_subtitle', label: 'Hero Subtitle' },
          { key: 'footer_text', label: 'Footer Text', textarea: true },
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
