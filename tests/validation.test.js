import { describe, it, expect } from 'vitest'
import { validateContactForm, validateBookingForm } from '../lib/apiUtils/validation.js'

describe('validateContactForm', () => {
  it('validates a correct contact form', () => {
    const data = {
      name: 'Alice',
      phone: '+92 300 1234567',
      email: 'alice@example.com',
      message: 'Hello, I would like to book an appointment.'
    }

    const result = validateContactForm(data)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('rejects invalid phone and short message', () => {
    const data = {
      name: 'B',
      phone: 'abc123',
      email: 'not-an-email',
      message: 'Hi'
    }

    const result = validateContactForm(data)
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('name')
    expect(result.errors).toHaveProperty('phone')
    expect(result.errors).toHaveProperty('email')
    expect(result.errors).toHaveProperty('message')
  })
})

describe('validateBookingForm', () => {
  it('validates a correct booking form', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 2)
    const dateStr = tomorrow.toISOString()

    const data = {
      name: 'Client',
      phone: '+923001234567',
      email: 'client@example.com',
      service: 'Haircut',
      date: dateStr,
      time: '14:30'
    }

    const result = validateBookingForm(data)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('rejects past date and invalid time', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 2)
    const dateStr = yesterday.toISOString()

    const data = {
      name: 'Client',
      phone: '03001234567',
      email: 'client@example.com',
      service: 'Massage',
      date: dateStr,
      time: '25:00'
    }

    const result = validateBookingForm(data)
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('date')
    expect(result.errors).toHaveProperty('time')
  })
})
