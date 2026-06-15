import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setErrorMessage(data.hint ? `${data.error}. ${data.hint}` : (data.error || 'Login failed'))
      return
    }

    router.push('/admin')
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin Login — Huma Beauty Salon</title>
      </Head>
      <div className="admin-login-page">
        <div className="admin-login-bg-shape admin-login-bg-shape--1" aria-hidden="true" />
        <div className="admin-login-bg-shape admin-login-bg-shape--2" aria-hidden="true" />
        <div className="admin-login-bg-shape admin-login-bg-shape--3" aria-hidden="true" />

        <div className="admin-login-layout">
          <aside className="admin-login-brand" aria-label="Salon branding">
            <div className="admin-login-brand-inner">
              <div className="admin-login-monogram" aria-hidden="true">HB</div>
              <div className="admin-login-brand-copy">
                <p className="admin-login-script">Huma Beauty</p>
                <h1 className="admin-login-brand-title">Salon Admin Portal</h1>
              </div>
              <p className="admin-login-brand-tagline">
                Manage bookings, services, sales & salon operations — securely and beautifully.
              </p>
              <ul className="admin-login-features">
                <li>Bookings & calendar</li>
                <li>Services & messages</li>
                <li>Sales & reports</li>
              </ul>
              <div className="admin-login-brand-footer">
                <span className="admin-login-secure-badge">🔒 Secure staff access</span>
              </div>
            </div>
          </aside>

          <main className="admin-login-main">
            <div className="admin-login-card">
              <div className="admin-login-card-mobile-brand" aria-hidden="true">
                <div className="admin-login-card-mobile-logo">HB</div>
                <div>
                  <p className="admin-login-card-mobile-script">Huma Beauty</p>
                  <p className="admin-login-card-mobile-title">Admin Portal</p>
                </div>
              </div>

              <div className="admin-login-card-body">
                <div className="admin-login-card-header">
                  <p className="admin-login-welcome">Welcome back</p>
                  <h2 className="admin-login-title">Sign in to continue</h2>
                  <p className="admin-login-subtitle">Enter your admin email and password.</p>
                </div>

                <form onSubmit={handleLogin} className="admin-login-form">
                <div className="admin-login-field">
                  <label className="admin-login-label" htmlFor="admin-email">Email address</label>
                  <div className="admin-login-input-wrap">
                    <span className="admin-login-input-icon" aria-hidden="true">✉</span>
                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="admin-login-input"
                      placeholder="you@humabeauty.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="admin-login-field">
                  <label className="admin-login-label" htmlFor="admin-password">Password</label>
                  <div className="admin-login-input-wrap">
                    <span className="admin-login-input-icon" aria-hidden="true">🔑</span>
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="admin-login-input admin-login-input--password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="admin-login-toggle-pw"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {errorMessage ? (
                  <div className="admin-login-error" role="alert">{errorMessage}</div>
                ) : null}

                <button disabled={loading} type="submit" className="admin-login-submit">
                  {loading ? (
                    <span className="admin-login-submit-inner">
                      <span className="admin-login-spinner" aria-hidden="true" />
                      Signing in…
                    </span>
                  ) : (
                    'Sign in to Dashboard'
                  )}
                </button>
              </form>

              <div className="admin-login-card-footer">
                <Link href="/" className="admin-login-back-link">← Back to website</Link>
              </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
