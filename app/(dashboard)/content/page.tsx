'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Clock, Check, Trash2, Film, Droplets, Hash } from 'lucide-react'
import { toast } from 'sonner'
import type { GeneratedContent } from '@/lib/types'

export default function ContentPage() {
  const [items, setItems] = useState<GeneratedContent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      })
      const data = await res.json()
      setItems(data.items || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchContent() }, [])

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/content/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      })
      setItems(items.filter(i => i.id !== id))
      toast.success('Content deleted')
    } catch { toast.error('Failed to delete') }
  }

  if (loading) return <div className="p-6 flex items-center justify-center h-64"><span className="spinner" /></div>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1">My Content</h1>
          <p className="text-muted text-sm mt-1">{items.length} short{items.length !== 1 ? 's' : ''} generated from {new Set(items.map(i => i.sourceUrl)).size} source{new Set(items.map(i => i.sourceUrl)).size !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </div>
          <h3 className="font-medium text-sm mb-1">No content yet</h3>
          <p className="text-xs text-text-tertiary">Generate your first short from a video link.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex items-start gap-3">
              <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Film size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{item.seoTitle}</p>
                  <span className="text-[11px] text-text-tertiary flex-shrink-0">#{item.shortIndex}/{item.totalShorts}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[11px] text-text-tertiary">{item.platform}</span>
                  <span className="text-[11px] text-text-tertiary">&middot;</span>
                  <span className="text-[11px] text-text-tertiary">{item.niche}</span>
                  <span className="text-[11px] text-text-tertiary">&middot;</span>
                  <span className="text-[11px] text-text-tertiary">{item.clipDuration}</span>
                  {item.watermarkRemoved && (
                    <>
                      <span className="text-[11px] text-text-tertiary">&middot;</span>
                      <span className="text-[11px] text-accent flex items-center gap-0.5">
                        <Droplets size={10} /> No watermark
                      </span>
                    </>
                  )}
                  <span className="text-[11px] text-text-tertiary">&middot;</span>
                  <span className="text-[11px] text-text-tertiary">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className={`text-[11px] flex items-center gap-1 ${item.status === 'scheduled' ? 'text-accent' : item.status === 'posted' ? 'text-success' : 'text-text-tertiary'}`}>
                    {item.status === 'scheduled' ? <Clock size={11} /> : item.status === 'posted' ? <Check size={11} /> : null}
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-surface-2 rounded transition-colors">
                  <ExternalLink size={14} className="text-text-tertiary" />
                </a>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-surface-2 rounded transition-colors">
                  <Trash2 size={14} className="text-text-tertiary hover:text-error" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
