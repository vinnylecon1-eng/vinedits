import { useState } from 'react'
import { Zap, Brain, Clock, TrendingUp, ArrowRight } from 'lucide-react'

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('auth_token', data.token)
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Viral Agent</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setIsLogin(true)}
              className="px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-12">
          <h2 className="text-5xl font-bold mb-6">
            Transform Your <span className="gradient-text">Social Media</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            AI-powered niche analysis, viral content generation, and automatic posting at optimal times.
          </p>

          <div className="space-y-6">
            {[
              { icon: Brain, title: 'Niche Analysis', desc: 'Understand your audience deeply' },
              { icon: Zap, title: 'Content Generation', desc: '6 viral hooks, optimized titles & hashtags' },
              { icon: Clock, title: 'Optimal Posting', desc: 'Post when your audience is most active' },
              { icon: TrendingUp, title: 'Auto-Posting', desc: 'Automatic posting at best times' },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="flex gap-4 items-start">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 flex gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">40-60%</p>
              <p className="text-muted-foreground">Avg engagement increase</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">10+hrs</p>
              <p className="text-muted-foreground">Saved per week</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="glass p-8">
              <h3 className="text-2xl font-bold mb-2">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isLogin
                  ? 'Login to your account'
                  : 'Create your free account today'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline font-semibold"
                  >
                    {isLogin ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Free tier includes 1 account and 5 content generations/month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
