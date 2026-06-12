import nodemailer from 'nodemailer'

const PLACEHOLDER_PATTERNS = [
  /^your@/i,
  /^your-/i,
  /example\.com$/i,
  /change-me/i,
  /your-app-password/i,
  /your-strong-password/i,
]

function isPlaceholder(value) {
  const v = String(value || '').trim()
  if (!v) return true
  return PLACEHOLDER_PATTERNS.some((re) => re.test(v))
}

export function isEmailConfigured() {
  const user = process.env.EMAIL_USER?.trim()
  const pass = process.env.EMAIL_PASSWORD?.trim()
  return Boolean(user && pass && !isPlaceholder(user) && !isPlaceholder(pass))
}

export function getMailTransporter() {
  if (!isEmailConfigured()) return null
  const user = process.env.EMAIL_USER.trim()
  const pass = process.env.EMAIL_PASSWORD.trim()

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    connectionTimeout: 8000,
    socketTimeout: 8000,
  })
}

export function getEmailRecipient() {
  return process.env.EMAIL_RECIPIENT?.trim() || 'humaaqi96@gmail.com'
}
