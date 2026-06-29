'use client'

import { useEffect, useState } from 'react'
import { Clock, Check, XCircle, ExternalLink, Film, Droplets } from 'lucide-react'
import type { ScheduledPost } from '@/lib/types'

export default function SchedulePage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    fetch('/api/posts/scheduled', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => setPosts(d.posts || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 flex items-center justify-center h-64"><span className="spinner" /></div>

  const grouped = posts.reduce((acc: Record<string, ScheduledPost[]>, p) => {
    const date = new Date(p.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(p)
    return acc
  }, {})

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="heading-1">Schedule</h1>
        <p className="text-muted text-sm mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} auto-scheduled at optimal times</p>
      </div>

      {posts.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-text-tertiary" />
          </div>
          <h3 className="font-medium text-sm mb-1">No scheduled posts</h3>
          <p className="text-xs text-text-tertiary">Generate content and it will be auto-scheduled here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dayPosts]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-text-secondary mb-3">{date}</h3>
              <div className="space-y-2">
                {dayPosts.map((post) => (
                  <div key={post.id} className="card p-4 flex items-start gap-4">
                    <div className="w-10 h-10 bg-surface-2 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-text-secondary">
                        {new Date(post.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{post.seoTitle}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] text-text-tertiary">{post.platform}</span>
                        {post.niche && (
                          <>
                            <span className="text-[11px] text-text-tertiary">&middot;</span>
                            <span className="text-[11px] text-text-tertiary">{post.niche}</span>
                          </>
                        )}
                        <span className="text-[11px] text-text-tertiary">&middot;</span>
                        <span className={`text-[11px] flex items-center gap-1 ${post.status === 'posted' ? 'text-success' : post.status === 'failed' ? 'text-error' : 'text-accent'}`}>
                          {post.status === 'posted' ? <Check size={11} /> : post.status === 'failed' ? <XCircle size={11} /> : <Clock size={11} />}
                          {post.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {post.hashtags.slice(0, 4).map((tag, i) => (
                          <span key={i} className="text-[10px] text-text-tertiary">{tag}</span>
                        ))}
                        {post.hashtags.length > 4 && <span className="text-[10px] text-text-tertiary">+{post.hashtags.length - 4}</span>}
                      </div>
                    </div>
                    <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-surface-2 rounded transition-colors flex-shrink-0">
                      <ExternalLink size={14} className="text-text-tertiary" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
