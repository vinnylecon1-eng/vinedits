'use client'

import { useEffect, useState } from 'react'
import { Clock, Check, XCircle, ExternalLink, Film, Calendar } from 'lucide-react'
import type { ScheduledPost } from '@/lib/types'

export default function SchedulePage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    fetch('/api/posts/scheduled', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => setPosts(d.posts || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="skeleton h-8 w-48 mb-2" />
      <div className="skeleton h-4 w-64 mb-6" />
      {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
    </div>
  )

  const grouped = posts.reduce((acc: Record<string, ScheduledPost[]>, p) => {
    const date = new Date(p.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(p)
    return acc
  }, {})

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="fade-in">
        <h1 className="heading-1">Schedule</h1>
        <p className="text-muted text-sm mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} auto-scheduled at optimal times</p>
      </div>

      {posts.length === 0 ? (
        <div className="card p-12 sm:p-16 text-center fade-in">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar size={26} className="text-amber-400/60" />
          </div>
          <h3 className="font-semibold text-sm mb-1.5">No scheduled posts</h3>
          <p className="text-xs text-text-tertiary">Generate content and it will be auto-scheduled at peak engagement hours.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dayPosts]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                <Calendar size={13} />
                {date}
                <span className="text-[11px] text-text-tertiary font-normal">{dayPosts.length} post{dayPosts.length !== 1 ? 's' : ''}</span>
              </h3>
              <div className="space-y-2">
                {dayPosts.map((post, i) => (
                  <div key={post.id} className="card p-4 flex items-start gap-4 card-hover" style={{ animation: `fadeIn 0.3s ease-out ${i * 0.06}s both` }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-accent">
                        {new Date(post.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{post.seoTitle}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] text-text-tertiary">{post.platform}</span>
                        {post.niche && (
                          <>
                            <span className="text-[11px] text-text-tertiary">·</span>
                            <span className="text-[11px] text-text-tertiary">{post.niche}</span>
                          </>
                        )}
                        <span className="text-[11px] text-text-tertiary">·</span>
                        <span className={`text-[11px] flex items-center gap-1 px-1.5 py-0.5 rounded-full ${
                          post.status === 'posted' ? 'bg-success/8 text-success' :
                          post.status === 'failed' ? 'bg-error/8 text-error' :
                          'bg-accent/8 text-accent'
                        }`}>
                          {post.status === 'posted' ? <Check size={10} /> : post.status === 'failed' ? <XCircle size={10} /> : <Clock size={10} />}
                          {post.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {post.hashtags.slice(0, 4).map((tag, ti) => (
                          <span key={ti} className="text-[10px] text-text-tertiary bg-surface-2 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                        {post.hashtags.length > 4 && <span className="text-[10px] text-text-tertiary">+{post.hashtags.length - 4}</span>}
                      </div>
                    </div>
                    <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors flex-shrink-0">
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
