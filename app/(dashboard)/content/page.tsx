'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Clock, Check, Trash2, Film, Droplets, Hash, Search, Video, Play } from 'lucide-react'
import { toast } from 'sonner'
import type { GeneratedContent } from '@/lib/types'

export default function ContentPage() {
  const [items, setItems] = useState<GeneratedContent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedShort, setSelectedShort] = useState<string | null>(null)

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

  const filtered = items.filter(i =>
    !search || i.seoTitle?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="skeleton h-8 w-48 mb-2" />
      <div className="skeleton h-4 w-64 mb-6" />
      {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
    </div>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1">My Content</h1>
          <p className="text-muted text-sm mt-1">{items.length} short{items.length !== 1 ? 's' : ''} from {new Set(items.map(i => i.sourceUrl)).size} source{new Set(items.map(i => i.sourceUrl)).size !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="input pl-9 text-sm w-full sm:w-72"
          />
        </div>
      )}

      {items.length === 0 ? (
        <div className="card p-12 sm:p-16 text-center fade-in">
          <div className="w-14 h-14 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Video size={26} className="text-accent/60" />
          </div>
          <h3 className="font-semibold text-sm mb-1.5">No content yet</h3>
          <p className="text-xs text-text-tertiary">Generate your first short — paste a video link and let AI do the rest.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center fade-in">
          <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Search size={20} className="text-text-tertiary" />
          </div>
          <h3 className="font-medium text-sm mb-1">No matches</h3>
          <p className="text-xs text-text-tertiary">Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="card p-4 flex items-start gap-3 card-hover"
              style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                item.status === 'posted' ? 'bg-success/10' : item.status === 'scheduled' ? 'bg-accent/10' : 'bg-surface-2'
              }`}>
                {item.status === 'posted' ? <Play size={16} className="text-success" /> : <Film size={16} className="text-accent" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{item.seoTitle}</p>
                  <span className="text-[11px] text-text-tertiary flex-shrink-0 font-mono">#{item.shortIndex}/{item.totalShorts}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[11px] text-text-tertiary">{item.platform}</span>
                  <span className="text-[11px] text-text-tertiary">·</span>
                  <span className="text-[11px] text-text-tertiary">{item.niche}</span>
                  <span className="text-[11px] text-text-tertiary">·</span>
                  <span className="text-[11px] text-text-tertiary">{item.clipDuration}</span>
                  {item.watermarkRemoved && (
                    <>
                      <span className="text-[11px] text-text-tertiary">·</span>
                      <span className="text-[11px] text-accent flex items-center gap-0.5">
                        <Droplets size={10} /> Clean
                      </span>
                    </>
                  )}
                  <span className="text-[11px] text-text-tertiary">·</span>
                  <span className="text-[11px] text-text-tertiary">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className={`text-[11px] flex items-center gap-1 px-1.5 py-0.5 rounded-full ${
                    item.status === 'scheduled' ? 'bg-accent/8 text-accent' :
                    item.status === 'posted' ? 'bg-success/8 text-success' :
                    'bg-surface-2 text-text-tertiary'
                  }`}>
                    {item.status === 'scheduled' ? <Clock size={10} /> : item.status === 'posted' ? <Check size={10} /> : null}
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors">
                  <ExternalLink size={14} className="text-text-tertiary" />
                </a>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors group">
                  <Trash2 size={14} className="text-text-tertiary group-hover:text-error transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
