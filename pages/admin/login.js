import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      setErrorMessage(data.error || 'Login failed')
      return
    }

    router.push('/admin')
  }

  return (
    <div className="admin-login-shell">
      <form onSubmit={handleLogin} className="admin-login-card">
        <h2 className="admin-login-title">Admin Login</h2>
        <label className="admin-field-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-input"
          placeholder="admin@example.com"
        />
        <label className="admin-field-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
          placeholder="••••••••"
        />
        {errorMessage && <div className="admin-alert">{errorMessage}</div>}
        <button disabled={loading} type="submit" className="admin-button admin-button-primary">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        {process.env.NODE_ENV !== 'production' && (
          <p className="admin-login-note">Default admin credentials: <strong>admin@example.com</strong> / <strong>change-me</strong> (development fallback)</p>
        )}
      </form>
    </div>
  )
}
