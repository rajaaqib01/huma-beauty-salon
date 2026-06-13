import { useMemo, useState } from 'react'
import useSWR from 'swr'
import AdminShell from '../../../components/AdminShell'
import { formatPrice } from '../../../lib/bookingSales'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

const emptyManual = {
  customer_name: '',
  phone: '',
  email: '',
  service_title: '',
  price: '',
  date: '',
  time: '10:00',
  notes: '',
}

function monthLabel(ym) {
  if (!ym) return '—'
  const [y, m] = ym.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })
}

function dayLabel(ymd) {
  if (!ymd) return '—'
  const [y, m, d] = ymd.split('-')
  const dt = new Date(Number(y), Number(m) - 1, Number(d))
  return dt.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BookingSalesPage() {
  const [month, setMonth] = useState('')
  const [date, setDate] = useState('')
  const [service, setService] = useState('')
  const [source, setSource] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [manualForm, setManualForm] = useState(emptyManual)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (date) params.set('date', date)
    else if (month) params.set('month', month)
    if (service) params.set('service', service)
    if (source) params.set('source', source)
    const qs = params.toString()
    return `/api/admin/bookings/sales${qs ? `?${qs}` : ''}`
  }, [month, date, service, source])

  const { data, error: loadError, mutate } = useSWR(query, fetcher)

  const sales = data?.sales || []
  const monthlyTotals = data?.monthlyTotals || []
  const services = data?.services || []
  const monthSummary = data?.monthSummary
  const daySummary = data?.daySummary

  const handleDateChange = (value) => {
    setDate(value)
    if (value) setMonth(value.slice(0, 7))
  }

  const clearFilters = () => {
    setMonth('')
    setDate('')
    setService('')
    setSource('')
  }

  const resetManual = () => {
    setManualForm(emptyManual)
    setEditing(null)
    setShowAdd(false)
    setError('')
  }

  const saveManual = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/bookings/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(manualForm),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Failed to add sale')
      resetManual()
      mutate()
    } catch (err) {
      setError(err.message || 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    if (!editing?.id) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/bookings/sales?id=${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(manualForm),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Failed to update sale')
      resetManual()
      mutate()
    } catch (err) {
      setError(err.message || 'Could not update')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (row) => {
    setEditing(row)
    setShowAdd(true)
    setManualForm({
      customer_name: row.customer_name,
      phone: row.phone,
      email: row.email,
      service_title: row.service_title,
      price: row.sale_amount || row.price,
      date: row.date,
      time: row.time || '10:00',
      notes: row.notes,
    })
    setError('')
  }

  return (
    <AdminShell title="Online Booking Sales">
      <p className="admin-page-subtitle" style={{ marginBottom: 20 }}>
        Confirmed online & manual booking sales — filter by date, month, service, or source.
      </p>

      {/* Summary */}
      <div className="admin-grid-3" style={{ marginBottom: 24 }}>
        {daySummary ? (
          <>
            <div className="admin-stat-card admin-stat-card--confirmed">
              <p className="admin-stat-label">{dayLabel(daySummary.date)} Total</p>
              <p className="admin-stat-value">{formatPrice(daySummary.total)}</p>
            </div>
            <div className="admin-stat-card admin-stat-card--bookings">
              <p className="admin-stat-label">Day Sales</p>
              <p className="admin-stat-value">{daySummary.count}</p>
            </div>
            <div className="admin-stat-card admin-stat-card--services">
              <p className="admin-stat-label">Online / Manual</p>
              <p className="admin-stat-value" style={{ fontSize: '1.1rem' }}>
                {formatPrice(daySummary.online)} / {formatPrice(daySummary.manual)}
              </p>
            </div>
          </>
        ) : monthSummary ? (
          <>
            <div className="admin-stat-card admin-stat-card--confirmed">
              <p className="admin-stat-label">{monthLabel(monthSummary.month)} Total</p>
              <p className="admin-stat-value">{formatPrice(monthSummary.total)}</p>
            </div>
            <div className="admin-stat-card admin-stat-card--bookings">
              <p className="admin-stat-label">Confirmed Bookings</p>
              <p className="admin-stat-value">{monthSummary.count}</p>
            </div>
            <div className="admin-stat-card admin-stat-card--services">
              <p className="admin-stat-label">Online / Manual</p>
              <p className="admin-stat-value" style={{ fontSize: '1.1rem' }}>
                {formatPrice(monthSummary.online)} / {formatPrice(monthSummary.manual)}
              </p>
            </div>
          </>
        ) : (
          <div className="admin-stat-card admin-stat-card--bookings">
            <p className="admin-stat-label">All-time confirmed sales</p>
            <p className="admin-stat-value">
              {formatPrice(monthlyTotals.reduce((s, m) => s + m.total, 0))}
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="admin-card admin-sales-filters">
        <div className="admin-sales-filters-grid">
          <div className="admin-form-row">
            <label className="admin-field-label" htmlFor="sales-date">Date</label>
            <input
              id="sales-date"
              type="date"
              className="admin-input"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>
          <div className="admin-form-row">
            <label className="admin-field-label" htmlFor="sales-month">Month</label>
            <select
              id="sales-month"
              className="admin-input"
              value={month}
              onChange={(e) => { setMonth(e.target.value); setDate('') }}
              disabled={Boolean(date)}
            >
              <option value="">All months</option>
              {monthlyTotals.map((m) => (
                <option key={m.month} value={m.month}>{monthLabel(m.month)} ({formatPrice(m.total)})</option>
              ))}
            </select>
          </div>
          <div className="admin-form-row">
            <label className="admin-field-label" htmlFor="sales-service">Service</label>
            <select id="sales-service" className="admin-input" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">All services</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-row">
            <label className="admin-field-label" htmlFor="sales-source">Source</label>
            <select id="sales-source" className="admin-input" value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">Online + Manual</option>
              <option value="online">Online only</option>
              <option value="manual">Manual only</option>
            </select>
          </div>
        </div>
        <div className="admin-section-actions" style={{ marginTop: 16 }}>
          <button type="button" className="admin-button admin-button-primary" onClick={() => { setShowAdd(true); setEditing(null); setManualForm(emptyManual) }}>
            + Add Manual Sale
          </button>
          {(date || month || service || source) ? (
            <button type="button" className="admin-button admin-button-secondary" onClick={clearFilters}>
              Clear filters
            </button>
          ) : null}
        </div>
        {date ? (
          <p className="admin-page-subtitle" style={{ marginTop: 12, marginBottom: 0 }}>
            Showing {sales.length} sale{sales.length === 1 ? '' : 's'} for {dayLabel(date)}
          </p>
        ) : null}
      </div>

      {/* Monthly history */}
      {monthlyTotals.length > 0 ? (
        <div className="admin-card" style={{ marginTop: 20, marginBottom: 20 }}>
          <h3 className="text-xl font-semibold" style={{ marginBottom: 16 }}>Monthly Sales History</h3>
          <div className="admin-sales-monthly-grid">
            {monthlyTotals.map((m) => (
              <button
                key={m.month}
                type="button"
                className={`admin-sales-month-chip${month === m.month && !date ? ' admin-sales-month-chip--active' : ''}`}
                onClick={() => { setMonth(m.month); setDate('') }}
              >
                <strong>{monthLabel(m.month)}</strong>
                <span>{m.count} bookings</span>
                <span>{formatPrice(m.total)}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Add / Edit form */}
      {showAdd ? (
        <form onSubmit={editing ? saveEdit : saveManual} className="admin-form admin-card" style={{ marginBottom: 24 }}>
          <h3 className="text-xl font-semibold">{editing ? 'Edit Sale Record' : 'Add Manual Booking Sale'}</h3>
          <div className="admin-sales-form-grid">
            {[
              { key: 'customer_name', label: 'Customer Name *', type: 'text' },
              { key: 'phone', label: 'Phone', type: 'text' },
              { key: 'email', label: 'Email', type: 'email' },
              { key: 'service_title', label: 'Service Name *', type: 'text' },
              { key: 'price', label: 'Price (Rs.) *', type: 'number' },
              { key: 'date', label: 'Date *', type: 'date' },
              { key: 'time', label: 'Time', type: 'time' },
            ].map(({ key, label, type }) => (
              <div key={key} className="admin-form-row">
                <label className="admin-field-label">{label}</label>
                <input
                  className="admin-input"
                  type={type}
                  value={manualForm[key]}
                  onChange={(e) => setManualForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={label.includes('*')}
                />
              </div>
            ))}
          </div>
          <div className="admin-form-row">
            <label className="admin-field-label">Notes</label>
            <textarea className="admin-textarea" rows={3} value={manualForm.notes} onChange={(e) => setManualForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          {error ? <div className="admin-alert">{error}</div> : null}
          <div className="admin-section-actions">
            <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Sale'}
            </button>
            <button type="button" className="admin-button admin-button-secondary" onClick={resetManual}>Cancel</button>
          </div>
        </form>
      ) : null}

      {/* Sales table */}
      <div className="admin-card admin-sales-table-wrap">
        {loadError ? (
          <div className="admin-empty-state">Unable to load sales. Please refresh.</div>
        ) : sales.length === 0 ? (
          <div className="admin-empty-state">No confirmed sales found{date ? ` for ${date}` : ''}.</div>
        ) : (
          <table className="admin-sales-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Service Name</th>
                <th>Price (Rs.)</th>
                <th>Date</th>
                <th>Time</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((row) => (
                <tr key={row.id}>
                  <td>{row.customer_name || '—'}</td>
                  <td>{row.phone || '—'}</td>
                  <td>{row.email || '—'}</td>
                  <td>{row.service_title || '—'}</td>
                  <td><strong>{formatPrice(row.sale_amount)}</strong></td>
                  <td>{row.date || '—'}</td>
                  <td>{row.time || '—'}</td>
                  <td>
                    <span className={`admin-sales-badge admin-sales-badge--${row.source}`}>
                      {row.source === 'manual' ? 'Manual' : 'Online'}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="admin-button admin-button-secondary" onClick={() => startEdit(row)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}><strong>Total ({sales.length} sales)</strong></td>
                <td><strong>{formatPrice(sales.reduce((s, r) => s + (r.sale_amount || 0), 0))}</strong></td>
                <td colSpan={4} />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
