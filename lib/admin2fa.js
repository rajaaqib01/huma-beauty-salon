import crypto from 'crypto'
import { list as localList, insert as localInsert, update as localUpdate, remove as localRemove } from './localDb'
import { getMailTransporter } from './emailTransport'

const EMAIL_SETUP_ERROR =
  'Gmail email is not configured. Set EMAIL_USER and EMAIL_PASSWORD (Gmail App Password) in .env.local, then restart the server.'

const CHALLENGE_STORE = 'admin_2fa_challenges'
const OTP_TTL_MS = 10 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000
const MAX_ATTEMPTS = 5

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || 'dev-admin-session-secret'
}

export function is2faEnabled() {
  const v = process.env.ADMIN_2FA_ENABLED?.trim().toLowerCase()
  if (v === 'true' || v === '1' || v === 'yes') return true
  return false
}

function hashOtp(challengeId, code) {
  return crypto.createHmac('sha256', getSecret()).update(`${challengeId}:${String(code).trim()}`).digest('hex')
}

function genOtp() {
  return String(crypto.randomInt(100000, 999999))
}

function genChallengeId() {
  return crypto.randomBytes(16).toString('hex')
}

export function maskEmail(email) {
  const value = String(email || '').trim()
  const [local, domain] = value.split('@')
  if (!local || !domain) return 'your email'
  const visible = local.slice(0, Math.min(3, local.length))
  return `${visible}${'*'.repeat(Math.max(2, local.length - visible.length))}@${domain}`
}

async function loadChallenges() {
  const rows = await localList(CHALLENGE_STORE)
  return Array.isArray(rows) ? rows : []
}

async function saveChallenge(record) {
  await localInsert(CHALLENGE_STORE, record)
  return record
}

async function purgeExpired() {
  const now = Date.now()
  const rows = await loadChallenges()
  const expired = rows.filter((r) => !r.expires_at || new Date(r.expires_at).getTime() <= now)
  await Promise.all(expired.map((r) => localRemove(CHALLENGE_STORE, r.id)))
}

export async function createLoginChallenge(user) {
  await purgeExpired()

  const code = genOtp()
  const id = genChallengeId()
  const now = new Date()
  const record = {
    id,
    email: user.email,
    role: user.role || 'owner',
    name: user.name || user.email,
    code_hash: hashOtp(id, code),
    attempts: 0,
    resend_available_at: new Date(now.getTime() + RESEND_COOLDOWN_MS).toISOString(),
    expires_at: new Date(now.getTime() + OTP_TTL_MS).toISOString(),
    created_at: now.toISOString(),
  }

  await saveChallenge(record)
  const sent = await sendOtpEmail(user.email, code, user.name)

  if (!sent.ok) {
    await localRemove(CHALLENGE_STORE, id)
    return {
      error: sent.error || EMAIL_SETUP_ERROR,
      status: 503,
      emailSent: false,
    }
  }

  return {
    challengeId: id,
    maskedEmail: maskEmail(user.email),
    emailSent: true,
  }
}

export async function resendLoginChallenge(challengeId) {
  const rows = await loadChallenges()
  const row = rows.find((r) => String(r.id) === String(challengeId))
  if (!row) return { error: 'Verification session expired. Please sign in again.', status: 404 }

  const now = Date.now()
  if (row.resend_available_at && new Date(row.resend_available_at).getTime() > now) {
    const waitSec = Math.ceil((new Date(row.resend_available_at).getTime() - now) / 1000)
    return { error: `Please wait ${waitSec}s before requesting a new code.`, status: 429 }
  }

  if (new Date(row.expires_at).getTime() <= now) {
    await localRemove(CHALLENGE_STORE, row.id)
    return { error: 'Verification session expired. Please sign in again.', status: 410 }
  }

  const code = genOtp()
  const patch = {
    code_hash: hashOtp(row.id, code),
    attempts: 0,
    resend_available_at: new Date(now + RESEND_COOLDOWN_MS).toISOString(),
    expires_at: new Date(now + OTP_TTL_MS).toISOString(),
  }
  await localUpdate(CHALLENGE_STORE, row.id, patch)

  const sent = await sendOtpEmail(row.email, code, row.name)
  if (!sent.ok) {
    return {
      error: sent.error || EMAIL_SETUP_ERROR,
      status: 503,
      emailSent: false,
    }
  }

  return {
    challengeId: row.id,
    maskedEmail: maskEmail(row.email),
    emailSent: true,
  }
}

export async function verifyLoginChallenge(challengeId, code) {
  const rows = await loadChallenges()
  const row = rows.find((r) => String(r.id) === String(challengeId))
  if (!row) return { error: 'Invalid or expired verification code.', status: 401 }

  const now = Date.now()
  if (new Date(row.expires_at).getTime() <= now) {
    await localRemove(CHALLENGE_STORE, row.id)
    return { error: 'Verification code expired. Please sign in again.', status: 410 }
  }

  if ((row.attempts || 0) >= MAX_ATTEMPTS) {
    await localRemove(CHALLENGE_STORE, row.id)
    return { error: 'Too many failed attempts. Please sign in again.', status: 429 }
  }

  const normalized = String(code || '').trim().replace(/\s/g, '')
  if (!/^\d{6}$/.test(normalized)) {
    await localUpdate(CHALLENGE_STORE, row.id, { attempts: (row.attempts || 0) + 1 })
    return { error: 'Enter the 6-digit verification code.', status: 400 }
  }

  if (hashOtp(row.id, normalized) !== row.code_hash) {
    const attempts = (row.attempts || 0) + 1
    await localUpdate(CHALLENGE_STORE, row.id, { attempts })
    const left = MAX_ATTEMPTS - attempts
    return {
      error: left > 0 ? `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.` : 'Too many failed attempts. Please sign in again.',
      status: 401,
    }
  }

  await localRemove(CHALLENGE_STORE, row.id)
  return {
    user: {
      email: row.email,
      role: row.role || 'owner',
      name: row.name || row.email,
    },
  }
}

function emailSendErrorMessage(err) {
  const msg = String(err?.message || err || '')
  if (/application-specific password|invalidsecondfactor|5\.7\.9/i.test(msg)) {
    return 'Gmail App Password required. Normal login password email ke liye kaam nahi karta. Google Account → Security → 2-Step Verification → App passwords se 16-digit password banao aur .env.local mein EMAIL_PASSWORD mein lagao, phir server restart karo.'
  }
  if (/invalid login|username and password|authentication/i.test(msg)) {
    return 'Gmail login failed. EMAIL_USER aur EMAIL_PASSWORD (.env.local) check karo — App Password use karo, normal password nahi.'
  }
  return 'Verification email send nahi ho saki. EMAIL_USER aur EMAIL_PASSWORD check karo aur server restart karo.'
}

async function sendOtpEmail(email, code, name) {
  const transporter = getMailTransporter()
  if (!transporter) {
    console.warn('[admin-2fa] Email not configured — OTP not sent')
    return { ok: false, error: EMAIL_SETUP_ERROR }
  }

  const from = process.env.EMAIL_USER?.trim() || 'noreply@humabeauty.local'
  const subject = 'Huma Beauty Salon — Admin login verification code'
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
      <h2 style="color:#0F4C45;margin:0 0 12px;">Admin Login Verification</h2>
      <p style="color:#444;line-height:1.6;">Hello ${name || 'Admin'},</p>
      <p style="color:#444;line-height:1.6;">Use this one-time code to complete your admin sign-in:</p>
      <p style="font-size:32px;font-weight:700;letter-spacing:0.3em;color:#0F4C45;margin:24px 0;">${code}</p>
      <p style="color:#767676;font-size:14px;">This code expires in 10 minutes. If you did not try to sign in, ignore this email.</p>
    </div>
  `

  try {
    await transporter.sendMail({ from, to: email, subject, html })
    return { ok: true }
  } catch (err) {
    console.error('[admin-2fa] Failed to send OTP email:', err.message)
    return { ok: false, error: emailSendErrorMessage(err) }
  }
}
