'use client'

import { useEffect, useState } from 'react'
import { BarChart3, PlusCircle, Library, Clock, Eye, Heart, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import type { AnalyticsData } from '@/lib/types'

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    fetch('/api/analytics/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 flex items-center justify-center h-64"><span className="spinner" /></div>

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Overview of your content pipeline</p>
        </div>
        <Link href="/create" className="btn-primary text-sm"><PlusCircle size={15} /> New Content</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Eye, label: 'Total Views', value: data?.stats.totalViews.toLocaleString() || '—', color: 'bg-accent/5 border-accent/10' },
          { icon: Heart, label: 'Total Likes', value: data?.stats.totalLikes.toLocaleString() || '—', color: 'bg-rose-500/5 border-rose-500/10' },
          { icon: Library, label: 'Content Generated', value: String(data?.stats.contentGenerated || 0), color: 'bg-emerald-500/5 border-emerald-500/10' },
          { icon: Clock, label: 'Scheduled', value: String(data?.stats.postsScheduled || 0), color: 'bg-amber-500/5 border-amber-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className={`card p-4 ${stat.color}`}>
              <div className="flex items-center gap-2 mb-3"><Icon size={15} className="text-text-secondary" /><span className="text-[11px] text-text-tertiary">{stat.label}</span></div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Link href="/create" className="card p-5 hover:border-accent/40 transition-colors group">
          <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
            <PlusCircle size={18} className="text-accent" />
          </div>
          <h3 className="font-semibold text-sm mb-1">Create Content</h3>
          <p className="text-xs text-text-tertiary">Paste up to 5 video links and auto-generate shorts content</p>
        </Link>

        <Link href="/content" className="card p-5 hover:border-accent/40 transition-colors group">
          <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
            <Library size={18} className="text-emerald-400" />
          </div>
          <h3 className="font-semibold text-sm mb-1">Content Library</h3>
          <p className="text-xs text-text-tertiary">Browse all your generated content and scheduled posts</p>
        </Link>

        <Link href="/analytics" className="card p-5 hover:border-accent/40 transition-colors group">
          <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-500/20 transition-colors">
            <BarChart3 size={18} className="text-amber-400" />
          </div>
          <h3 className="font-semibold text-sm mb-1">Analytics</h3>
          <p className="text-xs text-text-tertiary">Track performance across all your content</p>
        </Link>
      </div>

      {data && data.topContent.length > 0 && (
        <div className="card p-5">
          <h2 className="heading-2 mb-4">Top Performing Content</h2>
          <div className="space-y-2">
            {data.topContent.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-bg rounded-md border border-border-light">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-text-tertiary w-5 text-right">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.seoTitle}</p>
                    <p className="text-[11px] text-text-tertiary">{item.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span>{item.views.toLocaleString()} views</span>
                  <span>{item.likes.toLocaleString()} likes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
