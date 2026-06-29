'use client'

import { useEffect, useState } from 'react'
import { Eye, Heart, MessageSquare, Share2, Bookmark, BarChart3, Library, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import type { AnalyticsData } from '@/lib/types'

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#22c55e']

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    fetch('/api/analytics/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 flex items-center justify-center h-64"><span className="spinner" /></div>
  if (!data) return <div className="p-6 text-text-tertiary text-sm">Failed to load analytics</div>

  const metrics = [
    { icon: Eye, label: 'Total Views', value: data.stats.totalViews.toLocaleString(), color: 'bg-accent/5 border-accent/10' },
    { icon: Heart, label: 'Likes', value: data.stats.totalLikes.toLocaleString(), color: 'bg-rose-500/5 border-rose-500/10' },
    { icon: MessageSquare, label: 'Comments', value: data.stats.totalComments.toLocaleString(), color: 'bg-cyan-500/5 border-cyan-500/10' },
    { icon: Share2, label: 'Shares', value: data.stats.totalShares.toLocaleString(), color: 'bg-emerald-500/5 border-emerald-500/10' },
    { icon: Bookmark, label: 'Saves', value: data.stats.totalSaves.toLocaleString(), color: 'bg-violet-500/5 border-violet-500/10' },
    { icon: BarChart3, label: 'Engagement Rate', value: `${data.stats.avgEngagementRate}%`, color: 'bg-amber-500/5 border-amber-500/10' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="heading-1">Analytics</h1>
        <p className="text-muted text-sm mt-1">Performance metrics across all your content</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((m, i) => {
          const Icon = m.icon
          return (
            <div key={i} className={`card p-4 ${m.color}`}>
              <div className="flex items-center gap-2 mb-3"><Icon size={15} className="text-text-secondary" /><span className="text-[11px] text-text-tertiary">{m.label}</span></div>
              <p className="text-2xl font-bold">{m.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="heading-2 mb-4">Views Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26262b" />
              <XAxis dataKey="date" stroke="#5c5c6a" fontSize={11} />
              <YAxis stroke="#5c5c6a" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e1e22', border: '1px solid #26262b', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
              <Line type="monotone" dataKey="likes" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h2 className="heading-2 mb-4">Engagement Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26262b" />
              <XAxis dataKey="date" stroke="#5c5c6a" fontSize={11} />
              <YAxis stroke="#5c5c6a" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e1e22', border: '1px solid #26262b', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="comments" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="shares" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              <Bar dataKey="saves" fill="#22c55e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <h2 className="heading-2 mb-4">Platforms</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.platformBreakdown} dataKey="percentage" nameKey="platform" cx="50%" cy="50%" outerRadius={70} label={({ platform, percentage }) => `${platform} ${percentage}%`}>
                {data.platformBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e1e22', border: '1px solid #26262b', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 card p-5">
          <h2 className="heading-2 mb-4">Top Content</h2>
          {data.topContent.length === 0 ? (
            <p className="text-xs text-text-tertiary">No content yet</p>
          ) : (
            <div className="space-y-2">
              {data.topContent.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-bg rounded-md border border-border-light">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-text-tertiary w-5 text-right">{i + 1}</span>
                    <div className="min-w-0"><p className="text-sm font-medium truncate">{item.seoTitle}</p><p className="text-[11px] text-text-tertiary">{item.platform}</p></div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <span>{item.views.toLocaleString()} views</span>
                    <span>{item.likes.toLocaleString()} likes</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="heading-2 mb-4">Daily Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-2.5 px-3 text-xs text-text-tertiary font-medium">Day</th>
              {['Views', 'Likes', 'Comments', 'Shares', 'Saves'].map(h => <th key={h} className="text-right py-2.5 px-3 text-xs text-text-tertiary font-medium">{h}</th>)}
            </tr></thead>
            <tbody>{data.daily.map((d, i) => (
              <tr key={i} className="border-b border-border-light hover:bg-surface-2/50">
                <td className="py-2.5 px-3 text-xs font-medium">{d.date}</td>
                <td className="text-right py-2.5 px-3 text-xs">{d.views.toLocaleString()}</td>
                <td className="text-right py-2.5 px-3 text-xs">{d.likes.toLocaleString()}</td>
                <td className="text-right py-2.5 px-3 text-xs">{d.comments.toLocaleString()}</td>
                <td className="text-right py-2.5 px-3 text-xs">{d.shares.toLocaleString()}</td>
                <td className="text-right py-2.5 px-3 text-xs">{d.saves.toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
