'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { toast } from 'sonner'

const niches = ['Fitness', 'Cooking', 'Tech', 'Business', 'Travel', 'Fashion', 'Gaming', 'Music', 'Art', 'Finance']
const stats = [
  { label: 'Videos processed', value: 1247, suffix: '+' },
  { label: 'Active creators', value: 486, suffix: '' },
  { label: 'Shorts generated', value: 8231, suffix: '+' },
  { label: 'Avg. engagement', value: 340, suffix: '%', prefix: '' },
]

function AnimatedCounter({ target, suffix, prefix }: { target: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    let start = 0
    const duration = 1500
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { start = target; clearInterval(timer) }
      setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [visible, target])

  return <span ref={ref} className="tabular-nums">{prefix || ''}{count.toLocaleString()}{suffix}</span>
}

function FloatingOrb({ className, size, delay }: { className: string; size: number; delay: number }) {
  return (
    <div
      className={`absolute rounded-full opacity-20 ${className}`}
      style={{
        width: size, height: size,
        animation: `float ${5 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  useEffect(() => setMounted(true), [])

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
    <div className="min-h-screen bg-bg flex flex-col overflow-x-hidden">
      <FloatingOrb className="bg-accent top-[10%] left-[8%]" size={300} delay={0} />
      <FloatingOrb className="bg-indigo-500 top-[30%] right-[12%]" size={200} delay={1} />
      <FloatingOrb className="bg-pink-500 bottom-[25%] left-[20%]" size={250} delay={2} />
      <FloatingOrb className="bg-emerald-400 top-[60%] right-[25%]" size={180} delay={1.5} />

      <nav className="relative z-10 border-b border-border/50 px-4 sm:px-6 py-3 glass">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-sm">Vinedits</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setIsLogin(true); setError('') }} className="text-sm text-text-secondary hover:text-text-primary transition-colors">Sign in</button>
            <button onClick={() => { setIsLogin(false); setError('') }} className="text-sm px-4 py-1.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-all hover:shadow-lg hover:shadow-accent/20">Get started</button>
          </div>
        </div>
      </nav>

      <section className="relative z-10 flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-6xl mx-auto">
          <div className={`max-w-3xl mx-auto text-center mb-12 sm:mb-20 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/8 border border-accent/15 text-accent text-xs font-medium mb-6 fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Now with real video processing
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-[1.1]">
              Turn any video into{' '}
              <span className="animate-gradient bg-clip-text text-transparent">viral shorts</span>
            </h1>
            <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Drop your links, pick your niche, and let the magic happen. Titles, hooks, captions, and hashtags — all auto-generated and scheduled at the best times.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {niches.map((n, i) => (
                <span
                  key={n}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-text-secondary"
                  style={{ animation: `fadeIn 0.4s ease-out ${i * 0.08}s both` }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className={`max-w-xl mx-auto transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="card p-5 sm:p-7 glow-border">
              <h2 className="text-lg font-semibold mb-1">{isLogin ? 'Welcome back' : 'Join the crew'}</h2>
              <p className="text-xs text-text-secondary mb-5">{isLogin ? 'Sign in to pick up where you left off' : 'No credit card needed. Start creating in minutes.'}</p>

              {error && <div className="mb-4 p-2.5 bg-error/10 border border-error/20 rounded-md text-xs text-error animate-shimmer">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {!isLogin && (
                  <div className="fade-in">
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

          <div className={`max-w-4xl mx-auto mt-20 sm:mt-28 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="card p-4 sm:p-5 text-center card-hover">
                  <div className="text-xl sm:text-2xl font-bold text-accent">
                    <AnimatedCounter target={s.value} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <div className="text-xs text-text-secondary mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`max-w-5xl mx-auto mt-20 sm:mt-28 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight mb-10">How it works</h2>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { step: '01', title: 'Paste your links', desc: 'Up to 5 video URLs from any platform. Set duration per video and toggle watermark removal.' },
                { step: '02', title: 'AI does the heavy lifting', desc: 'We download, split, and generate SEO metadata — titles, hooks, captions, hashtags, descriptions.' },
                { step: '03', title: 'Auto-schedule & publish', desc: 'Every short gets scheduled at peak engagement times. Review, tweak, or publish instantly.' },
              ].map((item, i) => (
                <div key={i} className="card p-5 sm:p-6 card-hover fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="text-3xl font-bold text-accent/30 mb-2">{item.step}</div>
                  <h3 className="font-semibold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`max-w-5xl mx-auto mt-20 sm:mt-28 pb-16 transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight mb-10">Everything you need</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Smart watermarks', desc: 'Automatic watermark removal from known platforms with intelligent area detection.' },
                { title: 'Niche targeting', desc: '10+ niches with tailored hooks, captions, and SEO patterns for maximum reach.' },
                { title: 'Optimal scheduling', desc: 'Shorts auto-scheduled at peak hours — 8 AM, 11 AM, 2 PM, 5 PM, 8 PM, 10 PM.' },
                { title: 'Analytics dashboard', desc: 'Track total shorts, scheduled posts, engagement metrics, and weekly trends.' },
              ].map((item, i) => (
                <div key={i} className="card p-5 sm:p-6 card-hover fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/30 py-6 text-center text-xs text-text-tertiary glass">
        Vinedits — Turn videos into shorts. No credit card required.
      </footer>
    </div>
  )
}
