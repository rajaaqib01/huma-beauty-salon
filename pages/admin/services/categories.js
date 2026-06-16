import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AdminShell from '../../../components/AdminShell'
import useAdminAuth from '../../../lib/useAdminAuth'
import { canAdminDelete } from '../../../lib/adminRoles'
import { MAKEUP_SERVICE_PRESETS, normalizeCategoryLabel } from '../../../lib/makeupCategoryPresets'
import { HAIR_SERVICE_PRESETS } from '../../../lib/hairCategoryPresets'
import { FACIAL_SERVICE_PRESETS } from '../../../lib/facialCategoryPresets'
import { NAILS_SERVICE_PRESETS } from '../../../lib/nailsCategoryPresets'
import { WAXING_SERVICE_PRESETS } from '../../../lib/waxingCategoryPresets'
import { MEHNDI_SERVICE_PRESETS } from '../../../lib/mehndiCategoryPresets'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

const CATEGORY_TYPES = [
  { id: 'makeup', label: 'Makeup', presets: MAKEUP_SERVICE_PRESETS, otherLabel: 'Other Makeup Services' },
  { id: 'hair', label: 'Hair', presets: HAIR_SERVICE_PRESETS, otherLabel: 'Other Hair Services' },
  { id: 'facial', label: 'Facial', presets: FACIAL_SERVICE_PRESETS, otherLabel: 'Other Facial Services' },
  { id: 'nails', label: 'Nails', presets: NAILS_SERVICE_PRESETS, otherLabel: 'Other Nails Services' },
  { id: 'mehndi', label: 'Mehndi', presets: MEHNDI_SERVICE_PRESETS, otherLabel: 'Other Mehndi Services' },
  { id: 'waxing', label: 'Waxing', presets: WAXING_SERVICE_PRESETS, otherLabel: 'Other Waxing Services' },
]

export default function ServiceCategoriesPage() {
  const router = useRouter()
  const { admin } = useAdminAuth()
  const allowDelete = canAdminDelete(admin?.role)
  const activeType = String(router.query.type || 'makeup').toLowerCase()
  const typeConfig = CATEGORY_TYPES.find((t) => t.id === activeType) || CATEGORY_TYPES[0]

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const [newOrder, setNewOrder] = useState('')
  const [saving, setSaving] = useState(false)

  const adminApi = `/api/admin/${typeConfig.id}-categories`

  const loadCategories = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetcher(adminApi)
      setCategories(Array.isArray(data) ? data : [])
    } catch {
      setError(`Unable to load ${typeConfig.label.toLowerCase()} categories.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    loadCategories()
  }, [router.isReady, activeType])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(adminApi, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          sort_order: Number(newOrder) || categories.length + 1,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to create category')
      setNewName('')
      setNewOrder('')
      await loadCategories()
    } catch (err) {
      setError(err.message || 'Could not create category.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id, patch) => {
    setError('')
    try {
      const res = await fetch(`${adminApi}?id=${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to update category')
      await loadCategories()
    } catch (err) {
      setError(err.message || 'Could not save category.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm(`Delete this ${typeConfig.label.toLowerCase()} category? Services will move to ${typeConfig.otherLabel}.`)) return
    setError('')
    try {
      const res = await fetch(`${adminApi}?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete category')
      }
      await loadCategories()
    } catch (err) {
      setError(err.message || 'Could not delete category.')
    }
  }

  const tabHref = (typeId) => (typeId === 'makeup' ? '/admin/services/categories' : `/admin/services/categories?type=${typeId}`)

  const presetsFor = useMemo(() => typeConfig.presets, [typeConfig])

  return (
    <AdminShell title="Service Categories">
      <div className="admin-section-actions">
        <Link href="/admin/services" className="admin-button admin-button-secondary">← Back to Services</Link>
      </div>

      <div className="services-filter-tabs" style={{ marginBottom: '20px', position: 'static', boxShadow: 'none' }}>
        {CATEGORY_TYPES.map((type) => (
          <Link
            key={type.id}
            href={tabHref(type.id)}
            className={`services-filter-tab${activeType === type.id ? ' services-filter-tab--active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            {type.label}
          </Link>
        ))}
      </div>

      <p className="admin-page-subtitle" style={{ marginBottom: '20px' }}>
        Manage {typeConfig.label.toLowerCase()} groups shown on the services page. Each group shows its services as cards underneath on the website.
      </p>

      <form onSubmit={handleCreate} className="admin-form admin-card" style={{ maxWidth: '720px', marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0 }}>Add {typeConfig.label} Category</h3>
        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="cat-name">Category Name *</label>
          <input
            id="cat-name"
            className="admin-input"
            placeholder={`e.g. ${typeConfig.label === 'Hair' ? 'Hair Cut Services' : typeConfig.label === 'Facial' ? 'Basic Facial Services' : 'Bridal Makeup'}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <div className="admin-form-row">
          <label className="admin-field-label" htmlFor="cat-order">Sort Order</label>
          <input
            id="cat-order"
            className="admin-input"
            type="number"
            min="1"
            placeholder="1"
            value={newOrder}
            onChange={(e) => setNewOrder(e.target.value)}
          />
        </div>
        <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
          {saving ? 'Adding…' : 'Add Category'}
        </button>
      </form>

      {error ? <div className="admin-alert">{error}</div> : null}

      {loading ? (
        <div className="admin-empty-state">Loading categories…</div>
      ) : categories.length > 0 ? (
        <div className="admin-card" style={{ maxWidth: '720px' }}>
          {categories.map((cat) => {
            const presets = presetsFor[normalizeCategoryLabel(cat.name)] || []
            return (
              <div
                key={cat.id}
                style={{
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 100px auto',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <input
                    className="admin-input"
                    value={cat.name || ''}
                    onChange={(e) => {
                      setCategories((prev) => prev.map((item) => (
                        item.id === cat.id ? { ...item, name: e.target.value } : item
                      )))
                    }}
                    onBlur={() => handleUpdate(cat.id, { name: cat.name, sort_order: cat.sort_order })}
                  />
                  <input
                    className="admin-input"
                    type="number"
                    min="1"
                    value={cat.sort_order ?? ''}
                    onChange={(e) => {
                      const sort_order = Number(e.target.value) || 0
                      setCategories((prev) => prev.map((item) => (
                        item.id === cat.id ? { ...item, sort_order } : item
                      )))
                    }}
                    onBlur={() => handleUpdate(cat.id, { name: cat.name, sort_order: cat.sort_order })}
                  />
                  {allowDelete ? (
                    <button
                      type="button"
                      className="admin-button admin-button-danger"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
                {presets.length > 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '10px 0 0' }}>
                    Suggested services: {presets.join(' · ')}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="admin-empty-state">No {typeConfig.label.toLowerCase()} categories yet.</div>
      )}
    </AdminShell>
  )
}
