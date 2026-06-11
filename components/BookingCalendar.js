import { useMemo, useState } from 'react'

export default function BookingCalendar({ bookings = [], onSelectDate }) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const countsByDate = useMemo(() => {
    const map = {}
    for (const b of bookings) {
      if (!b.date || b.status === 'cancelled') continue
      map[b.date] = (map[b.date] || 0) + 1
    }
    return map
  }, [bookings])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []

  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push({ day, dateStr, count: countsByDate[dateStr] || 0 })
  }

  const monthLabel = viewDate.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })

  return (
    <div className="booking-calendar">
      <div className="booking-calendar-header">
        <button type="button" className="admin-button admin-button-secondary" onClick={() => setViewDate(new Date(year, month - 1, 1))}>←</button>
        <h3>{monthLabel}</h3>
        <button type="button" className="admin-button admin-button-secondary" onClick={() => setViewDate(new Date(year, month + 1, 1))}>→</button>
      </div>
      <div className="booking-calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="booking-calendar-weekday">{d}</div>
        ))}
        {cells.map((cell, i) => (
          <button
            key={i}
            type="button"
            className={`booking-calendar-day${cell?.count ? ' booking-calendar-day--busy' : ''}${!cell ? ' booking-calendar-day--empty' : ''}`}
            disabled={!cell}
            onClick={() => cell && onSelectDate?.(cell.dateStr)}
          >
            {cell ? (
              <>
                <span>{cell.day}</span>
                {cell.count > 0 ? <small>{cell.count} appt{cell.count > 1 ? 's' : ''}</small> : null}
              </>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}
