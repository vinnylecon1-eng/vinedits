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
      toast.success(isLogin ? 'Welcome back' : 'Account created')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-sm">ViralAgent</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setIsLogin(true); setError('') }} className="text-sm text-text-secondary hover:text-text-primary transition-colors">Sign in</button>
            <button onClick={() => { setIsLogin(false); setError('') }} className="text-sm px-4 py-1.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">Get started</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Turn any video link into<br />
            <span className="text-accent">viral shorts</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Paste up to 5 links. Get SEO-optimized titles, hooks, descriptions, and hashtags. Auto-scheduled at peak times.
          </p>
        </div>

        <div className="max-w-sm mx-auto">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-1">{isLogin ? 'Welcome back' : 'Create account'}</h2>
            <p className="text-xs text-text-secondary mb-5">{isLogin ? 'Sign in to your workspace' : 'Start creating viral content'}</p>

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
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" required minLength={6} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full text-sm">
                {loading ? <><span className="spinner" /> Processing...</> : isLogin ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-xs text-text-tertiary">
                {isLogin ? "Don't have an account? " : 'Already have one? '}
                <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-accent hover:underline">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
