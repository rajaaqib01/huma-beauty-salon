import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function useAdminAuth() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady) return

    const check = async () => {
      try {
        const response = await fetch('/api/admin/me', { credentials: 'include' })
        if (!response.ok) {
          setAdmin(null)
          router.replace('/admin/login')
          return
        }
        const data = await response.json()
        setAdmin(data.user)
      } catch (error) {
        setAdmin(null)
        router.replace('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    check()
  }, [router])

  return { admin, loading }
}
