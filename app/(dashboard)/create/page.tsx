'use client'

import { useState } from 'react'
import { Plus, X, Link as LinkIcon, Sparkles, Check, Clock, ExternalLink, Hash, MessageSquare, Quote, Globe, Play, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import type { GeneratedContent } from '@/lib/types'
import ReelPreview from '@/components/ReelPreview'

interface UrlEntry {
  url: string
  duration: number
}

export default function CreatePage() {
  const [entries, setEntries] = useState<UrlEntry[]>([{ url: '', duration: 15 }])
  const [removeWatermarks, setRemoveWatermarks] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<GeneratedContent[]>([])
  const [selectedShort, setSelectedShort] = useState<string | null>(null)
  const [showAllSources, setShowAllSources] = useState(true)

  const addUrl = () => { if (entries.length < 5) setEntries([...entries, { url: '', duration: 15 }]) }
  const removeUrl = (i: number) => { const e = entries.filter((_, idx) => idx !== i); setEntries(e.length ? e : [{ url: '', duration: 15 }]) }
  const updateUrl = (i: number, v: string) => { const e = [...entries]; e[i] = { ...e[i], url: v }; setEntries(e) }
  const updateDuration = (i: number, v: number) => { const e = [...entries]; e[i] = { ...e[i], duration: Math.max(1, Math.min(1440, v)) }; setEntries(e) }

  const validCount = entries.filter(e => e.url.trim().length > 0).length

  const handleGenerate = async () => {
    const filled = entries.filter(e => e.url.trim())
    if (filled.length === 0) { toast.error('Paste at least one video link'); return }

    setGenerating(true)
    setResults([])
    setSelectedShort(null)

    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({
          urls: filled.map(e => e.url),
          durations: filled.map(e => e.duration),
          removeWatermarks,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.items)
      if (data.items.length > 0) setSelectedShort(data.items[0].id)
      const count = data.items.length
      toast.success(`${count} ${count === 1 ? 'short is' : 'shorts are'} ready to preview`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const groupedByUrl = results.reduce((acc: Record<string, GeneratedContent[]>, item) => {
    if (!acc[item.sourceUrl]) acc[item.sourceUrl] = []
    acc[item.sourceUrl].push(item)
    return acc
  }, {})

  const selectedItem = results.find(r => r.id === selectedShort)

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create content</h1>
        <p className="text-sm text-text-secondary mt-1">Drop your video links below and we'll turn them into ready-to-post shorts.</p>
      </div>

      <div className="card p-4 sm:p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Video links</h2>
          {entries.length < 5 && (
            <button onClick={addUrl} className="btn-ghost text-xs gap-1">
              <Plus size={14} /> Add ({entries.length}/5)
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {entries.map((entry, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 group">
              <span className="hidden sm:block text-xs text-text-tertiary w-5 text-right flex-shrink-0">{i + 1}.</span>
              <div className="relative flex-1">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="url"
                  value={entry.url}
                  onChange={(e) => updateUrl(i, e.target.value)}
                  placeholder="Paste a video URL (Instagram, TikTok, YouTube...)"
                  className="input pl-9 text-sm w-full"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto sm:ml-0">
                <input
                  type="number"
                  value={entry.duration}
                  onChange={(e) => updateDuration(i, parseInt(e.target.value) || 1)}
                  min={1}
                  max={1440}
                  className="input w-16 text-xs text-center"
                />
                <span className="text-[11px] text-text-tertiary w-10">min</span>
              </div>
              {entries.length > 1 && (
                <button onClick={() => removeUrl(i)} className="p-1.5 hover:bg-surface-2 rounded transition-colors self-end sm:self-center">
                  <X size={14} className="text-text-tertiary" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setRemoveWatermarks(!removeWatermarks)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
              removeWatermarks
                ? 'bg-accent/10 border-accent/20 text-accent'
                : 'bg-transparent border-border text-text-tertiary hover:text-text-secondary hover:border-border'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>
            Remove watermarks
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-text-tertiary">
            {validCount > 0
              ? `${validCount} link${validCount > 1 ? 's' : ''} ready to go`
              : 'No links added yet'}
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating || validCount === 0}
            className="btn-primary text-sm disabled:opacity-40 w-full sm:w-auto"
          >
            {generating ? (
              <><span className="spinner" /> Working on it...</>
            ) : (
              <><Sparkles size={15} /> Generate shorts</>
            )}
          </button>
        </div>
      </div>

      {results.length > 0 && selectedItem && (
        <div className="space-y-6 fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h2 className="text-base font-semibold">Your shorts</h2>
            <span className="text-xs text-text-tertiary">{results.length} {results.length === 1 ? 'short' : 'shorts'} generated</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-[320px] flex-shrink-0">
              <div className="flex justify-center">
                <ReelPreview
                  key={selectedItem.id}
                  hook={selectedItem.hooks[0]}
                  caption={selectedItem.caption}
                  seoTitle={selectedItem.seoTitle}
                  niche={selectedItem.niche}
                  platform={selectedItem.platform}
                />
              </div>

              {results.length > 1 && (
                <div className="mt-4">
                  <h3 className="text-xs font-medium text-text-secondary mb-2.5">All shorts</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedShort(item.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                          selectedShort === item.id
                            ? 'bg-accent/10 border-accent/20 text-accent'
                            : 'bg-transparent border-border text-text-tertiary hover:text-text-secondary hover:border-border'
                        }`}
                      >
                        <Play size={10} />
                        {item.sourceUrl.includes('instagram') ? 'IG' : item.sourceUrl.includes('tiktok') ? 'TT' : item.sourceUrl.includes('youtube') ? 'YT' : 'Reel'} #{item.shortIndex}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              <div className="card p-4 sm:p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">Short #{selectedItem.shortIndex} of {selectedItem.totalShorts}</span>
                      <span className="text-[10px] text-text-tertiary">&middot;</span>
                      <span className="text-[10px] text-text-tertiary">{selectedItem.clipDuration}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold leading-snug">{selectedItem.seoTitle}</h3>
                  </div>
                  <span className="badge bg-success/10 text-success text-[11px] flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                    <Check size={11} /> Scheduled
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Globe size={12} />
                    {selectedItem.platform}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {selectedItem.scheduledAt
                      ? new Date(selectedItem.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' })
                      : 'Unscheduled'}
                  </span>
                  <a href={selectedItem.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accent hover:underline">
                    <ExternalLink size={12} /> Source
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Quote size={13} className="text-accent" />
                    <span className="text-xs font-medium text-text-primary">Hook</span>
                  </div>
                  <div className="text-sm text-text-secondary bg-bg rounded-lg p-3 border border-border-light leading-relaxed">
                    &ldquo;{selectedItem.hooks[0]}&rdquo;
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <MessageSquare size={13} className="text-accent" />
                    <span className="text-xs font-medium text-text-primary">Caption</span>
                  </div>
                  <p className="text-sm text-text-secondary bg-bg rounded-lg p-3 border border-border-light leading-relaxed whitespace-pre-line">
                    {selectedItem.caption}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <MessageSquare size={13} className="text-accent" />
                    <span className="text-xs font-medium text-text-primary">Description</span>
                  </div>
                  <p className="text-sm text-text-secondary bg-bg rounded-lg p-3 border border-border-light leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Hash size={13} className="text-accent" />
                    <span className="text-xs font-medium text-text-primary">Hashtags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.hashtags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 bg-accent/5 border border-accent/10 rounded-lg text-xs text-accent hover:bg-accent/10 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {Object.keys(groupedByUrl).length > 1 && (
            <div className="card overflow-hidden">
              <button
                onClick={() => setShowAllSources(!showAllSources)}
                className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-surface-1/50 transition-colors text-left"
              >
                <span className="text-xs font-medium text-text-secondary">More sources</span>
                <ChevronDown size={14} className={`text-text-tertiary transition-transform ${showAllSources ? 'rotate-180' : ''}`} />
              </button>
              {showAllSources && (
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2">
                  {Object.entries(groupedByUrl).map(([url, shorts]) => (
                    <div key={url} className="text-xs text-text-tertiary flex items-center gap-2">
                      <span className="truncate max-w-[200px] sm:max-w-[400px]">{url}</span>
                      <span className="text-text-secondary">{shorts.length} short{shorts.length > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
