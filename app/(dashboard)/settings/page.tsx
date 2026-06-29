'use client'

import { useEffect, useState } from 'react'
import { User as UserIcon, Mail, Lock, Save, Loader, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import type { User } from '@/lib/types'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((data: User) => { setUser(data); setName(data.name); setEmail(data.email) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({ name, email, ...(currentPassword && newPassword ? { currentPassword, newPassword } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUser(data.user); setCurrentPassword(''); setNewPassword('')
      toast.success('Settings saved')
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="p-6 flex items-center justify-center h-64"><span className="spinner" /></div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div><h1 className="heading-1">Settings</h1><p className="text-muted text-sm mt-1">Manage your account</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <h2 className="heading-2 mb-5">Account</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label"><UserIcon size={13} className="inline mr-1" /> Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label"><Mail size={13} className="inline mr-1" /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </div>
            <hr className="border-border" />
            <div>
              <h3 className="text-sm font-medium mb-3"><Lock size={13} className="inline mr-1" /> Change password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="label">Current password</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input" placeholder="••••••••" /></div>
                <div><label className="label">New password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" placeholder="••••••••" minLength={6} /></div>
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary text-sm">
              {saving ? <><span className="spinner" /> Saving...</> : <><Save size={15} /> Save changes</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><CreditCard size={15} className="text-accent" /> Plan</h3>
            <p className="text-2xl font-bold mb-1 capitalize">{user?.subscription || 'Free'}</p>
            <p className="text-xs text-text-tertiary mb-4">
              {user?.subscription === 'free' ? '3 generations per month' : user?.subscription === 'pro' ? 'Unlimited generations' : 'Everything'}
            </p>
            {user?.subscription === 'free' && <button className="btn-primary text-xs w-full">Upgrade to Pro</button>}
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-3">Account info</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-text-tertiary">Member since</span><span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">ID</span><span className="font-mono">{user?.id?.slice(0, 8)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
