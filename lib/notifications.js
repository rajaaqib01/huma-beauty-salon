import { getMailTransporter, getEmailRecipient } from './emailTransport'
import { getSettings } from './settings'

function normalizePhone(phone) {
  let digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('92')) return digits
  if (digits.startsWith('0') && digits.length >= 10) return `92${digits.slice(1)}`
  if (digits.length === 10 && digits.startsWith('3')) return `92${digits}`
  return digits
}

function buildBookingAdminText(booking) {
  return [
    '📅 New Booking — Huma Beauty Saloon',
    `Name: ${booking.customer_name || booking.name}`,
    `Phone: ${booking.phone}`,
    `Service: ${booking.service_title || booking.service}`,
    booking.offer_title ? `Offer: ${booking.offer_title}` : null,
    booking.price ? `Price: ${booking.price}` : null,
    `Date: ${booking.date}`,
    `Time: ${booking.time}`,
    booking.staff_name ? `Stylist: ${booking.staff_name}` : null,
    booking.referral_code ? `Referral: ${booking.referral_code}` : null,
  ].filter(Boolean).join('\n')
}

async function sendWhatsAppViaCallMeBot(phone, text) {
  const apiKey = process.env.CALLMEBOT_API_KEY?.trim()
  const target = normalizePhone(phone)
  if (!apiKey || !target) return false

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${target}&text=${encodeURIComponent(text)}&apikey=${apiKey}`
    const res = await fetch(url, { method: 'GET' })
    return res.ok
  } catch (e) {
    console.error('CallMeBot WhatsApp failed:', e.message)
    return false
  }
}

async function sendSmsViaTwilio(phone, text) {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim()
  const token = process.env.TWILIO_AUTH_TOKEN?.trim()
  const from = process.env.TWILIO_PHONE?.trim()
  const to = normalizePhone(phone)
  if (!sid || !token || !from || !to) return false

  try {
    const auth = Buffer.from(`${sid}:${token}`).toString('base64')
    const body = new URLSearchParams({ To: `+${to}`, From: from, Body: text })
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
    return res.ok
  } catch (e) {
    console.error('Twilio SMS failed:', e.message)
    return false
  }
}

export async function notifyAdminNewBooking(booking) {
  const settings = await getSettings()
  const adminText = buildBookingAdminText(booking)
  const adminPhone = normalizePhone(settings.admin_whatsapp || process.env.ADMIN_WHATSAPP || '923355462214')
  const transporter = getMailTransporter()

  const results = { email: false, whatsapp: false, sms: false }

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: getEmailRecipient(),
        subject: `New Booking: ${booking.service_title || booking.service} — ${booking.date}`,
        html: adminText.split('\n').map(line => `<p>${line}</p>`).join(''),
      })
      results.email = true
    } catch (e) {
      console.error('Admin booking email failed:', e.message)
    }
  }

  results.whatsapp = await sendWhatsAppViaCallMeBot(adminPhone, adminText)
  results.sms = await sendSmsViaTwilio(adminPhone, adminText)

  return results
}

export async function notifyCustomerBookingReceived(booking) {
  const transporter = getMailTransporter()
  const email = booking.email?.trim()
  if (!transporter || !email) return false

  const name = booking.customer_name || booking.name
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Request Received — Huma Beauty Saloon',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;color:#333">
          <h2 style="color:#0f4c45">Thank you, ${name}!</h2>
          <p>We received your booking request for <strong>${booking.service_title || booking.service}</strong> on <strong>${booking.date}</strong> at <strong>${booking.time}</strong>.</p>
          <p>Our team will confirm within <strong>2 hours</strong> via WhatsApp.</p>
          <p>Questions? WhatsApp us at <strong>+92 335 5462214</strong></p>
          <p>— Huma Beauty Saloon Team</p>
        </div>
      `,
    })
    return true
  } catch (e) {
    console.error('Customer confirmation email failed:', e.message)
    return false
  }
}

export async function notifyCustomerBookingStatus(booking, status) {
  const transporter = getMailTransporter()
  const email = booking.email?.trim()
  const name = booking.customer_name || booking.name
  const service = booking.service_title || booking.service

  let subject = 'Booking Update — Huma Beauty Saloon'
  let message = `Hi ${name}, your booking for ${service} on ${booking.date} at ${booking.time} was updated.`

  if (status === 'confirmed') {
    subject = 'Booking Confirmed — Huma Beauty Saloon'
    message = `Hi ${name}! Your booking for ${service} on ${booking.date} at ${booking.time} is CONFIRMED. See you at the salon!`
  } else if (status === 'cancelled') {
    subject = 'Booking Cancelled — Huma Beauty Saloon'
    message = `Hi ${name}, your booking for ${service} on ${booking.date} at ${booking.time} has been cancelled. Contact us on WhatsApp to rebook.`
  }

  let emailSent = false
  if (transporter && email) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px"><p>${message}</p><p>— Huma Beauty Saloon</p></div>`,
      })
      emailSent = true
    } catch (e) {
      console.error('Customer status email failed:', e.message)
    }
  }

  const customerPhone = normalizePhone(booking.phone)
  if (customerPhone.startsWith('92')) {
    await sendWhatsAppViaCallMeBot(customerPhone, message)
  }

  return emailSent
}

export async function notifyCustomerBookingReminder(booking) {
  const transporter = getMailTransporter()
  const email = booking.email?.trim()
  const name = booking.customer_name || booking.name
  const service = booking.service_title || booking.service
  const message = `Reminder: Hi ${name}! Your appointment at Huma Beauty Saloon is tomorrow (${booking.date}) at ${booking.time} for ${service}. We look forward to seeing you! Questions? WhatsApp +92 335 5462214.`

  const results = { email: false, whatsapp: false }

  if (transporter && email) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Appointment Reminder — Huma Beauty Saloon',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;color:#333">
            <h2 style="color:#0f4c45">Appointment Reminder</h2>
            <p>Hi ${name},</p>
            <p>This is a friendly reminder that your appointment is <strong>tomorrow</strong>:</p>
            <p><strong>Service:</strong> ${service}<br/>
            <strong>Date:</strong> ${booking.date}<br/>
            <strong>Time:</strong> ${booking.time}</p>
            <p>See you at Huma Beauty Saloon, Main Market Jhelum!</p>
            <p>— Huma Beauty Saloon Team</p>
          </div>
        `,
      })
      results.email = true
    } catch (e) {
      console.error('Customer reminder email failed:', e.message)
    }
  }

  const customerPhone = normalizePhone(booking.phone)
  if (customerPhone.startsWith('92')) {
    results.whatsapp = await sendWhatsAppViaCallMeBot(customerPhone, message)
  }

  return results
}

function buildAdmissionAdminText(admission) {
  return [
    '🎓 New Course Admission — Huma Beauty Saloon',
    `Name: ${admission.student_name || admission.name}`,
    `Phone: ${admission.phone}`,
    `Email: ${admission.email || '—'}`,
    `Course: ${admission.course_title}`,
    `Fee: Rs. ${admission.course_fee}`,
    `Batch: ${admission.batch}`,
    `Txn ID: ${admission.transaction_id}`,
    admission.city ? `City: ${admission.city}` : null,
  ].filter(Boolean).join('\n')
}

export async function notifyAdminNewAdmission(admission) {
  const settings = await getSettings()
  const adminText = buildAdmissionAdminText(admission)
  const adminPhone = normalizePhone(settings.admin_whatsapp || process.env.ADMIN_WHATSAPP || '923355462214')
  const transporter = getMailTransporter()

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: getEmailRecipient(),
        subject: `New Course Admission: ${admission.course_title} — ${admission.student_name || admission.name}`,
        html: adminText.split('\n').map((line) => `<p>${line}</p>`).join(''),
      })
    } catch (e) {
      console.error('Admin admission email failed:', e.message)
    }
  }

  await sendWhatsAppViaCallMeBot(adminPhone, adminText)
}

export async function notifyStudentAdmissionReceived(admission) {
  const transporter = getMailTransporter()
  const email = admission.email?.trim()
  if (!transporter || !email) return false

  const name = admission.student_name || admission.name
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Course Admission Received — Huma Beauty Academy',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;color:#333">
          <h2 style="color:#0f4c45">Thank you, ${name}!</h2>
          <p>We received your admission application for <strong>${admission.course_title}</strong>.</p>
          <p>Our team will verify your JazzCash payment and confirm your seat within <strong>24–48 hours</strong> via WhatsApp.</p>
          <p>— Huma Beauty Saloon Academy</p>
        </div>
      `,
    })
    return true
  } catch (e) {
    console.error('Student admission email failed:', e.message)
    return false
  }
}

export async function notifyStudentAdmissionStatus(admission, status) {
  const transporter = getMailTransporter()
  const email = admission.email?.trim()
  const name = admission.student_name || admission.name
  const course = admission.course_title

  let subject = 'Admission Update — Huma Beauty Academy'
  let message = `Hi ${name}, your admission for ${course} was updated.`

  if (status === 'approved') {
    subject = 'Admission Approved — Huma Beauty Academy'
    message = `Hi ${name}! Your admission for ${course} is APPROVED. Welcome to Huma Beauty Academy! We will contact you with batch start details.`
  } else if (status === 'rejected') {
    subject = 'Admission Not Approved — Huma Beauty Academy'
    message = `Hi ${name}, we could not verify your admission for ${course}. Please WhatsApp us at +92 335 5462214 for assistance.`
  }

  if (transporter && email) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px"><p>${message}</p></div>`,
      })
    } catch (e) {
      console.error('Student admission status email failed:', e.message)
    }
  }

  const phone = normalizePhone(admission.phone)
  if (phone.startsWith('92')) {
    await sendWhatsAppViaCallMeBot(phone, message)
  }
}
