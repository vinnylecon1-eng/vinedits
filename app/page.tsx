'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { toast } from 'sonner'

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const body = isLogin ? { email, password } : { email, password, name: name || email.split('@')[0] }
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      login(data.token, data.user)
      toast.success(isLogin ? 'Good to see you again' : 'Welcome aboard')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <nav className="border-b border-border px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-sm">Vinedits</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setIsLogin(true); setError('') }} className="text-sm text-text-secondary hover:text-text-primary transition-colors">Sign in</button>
            <button onClick={() => { setIsLogin(false); setError('') }} className="text-sm px-4 py-1.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">Get started</button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Turn any video into
              <span className="text-accent block sm:inline"> viral shorts</span>
            </h1>
            <p className="text-text-secondary text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Drop your links, pick your niche, and let the magic happen. Titles, hooks, captions, and hashtags — all auto-generated and scheduled at the best times.
            </p>
          </div>

          <div className="max-w-sm mx-auto">
            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-semibold mb-1">{isLogin ? 'Welcome back' : 'Join the crew'}</h2>
              <p className="text-xs text-text-secondary mb-5">{isLogin ? 'Sign in to pick up where you left off' : 'No credit card needed. Start creating in minutes.'}</p>

              {error && <div className="mb-4 p-2.5 bg-error/10 border border-error/20 rounded-md text-xs text-error">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {!isLogin && (
                  <div>
                    <label className="label">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" />
                  </div>
                )}
                <div>
                  <label className="label">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="At least 6 characters" required minLength={6} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full text-sm">
                  {loading ? <><span className="spinner" /> Hang tight...</> : isLogin ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <div className="mt-5 text-center">
                <p className="text-xs text-text-tertiary">
                  {isLogin ? "Don't have an account? " : 'Already have one? '}
                  <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-accent hover:underline">
                    {isLogin ? 'Create one' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
