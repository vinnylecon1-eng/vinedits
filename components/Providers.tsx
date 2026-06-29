'use client'

import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/lib/store'

export function Providers({ children }: { children: React.ReactNode }) {
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((user) => {
          if (user?.id) login(token, user)
          else logout()
        })
        .catch(() => logout())
    }
  }, [])

  return (
    <>
      {children}
      <Toaster position="bottom-right" theme="dark" />
    </>
  )
}
