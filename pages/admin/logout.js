import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function LogoutPage() {
  const router = useRouter()
  const [message, setMessage] = useState('Signing out...')

  useEffect(() => {
    const logout = async () => {
      await fetch('/api/admin/logout', { method: 'POST' })
      setMessage('Signed out successfully.')
      router.replace('/admin/login')
    }
    logout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="rounded-3xl bg-white/10 border border-white/10 p-10 backdrop-blur">{message}</div>
    </div>
  )
}
