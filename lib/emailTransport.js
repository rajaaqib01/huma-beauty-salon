import nodemailer from 'nodemailer'

export function getMailTransporter() {
  const user = process.env.EMAIL_USER?.trim()
  const pass = process.env.EMAIL_PASSWORD?.trim()
  if (!user || !pass) return null

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
