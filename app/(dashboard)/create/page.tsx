'use client'

import { useState } from 'react'
import { Plus, X, Link as LinkIcon, Sparkles, Check, Clock, ExternalLink, Hash, Type, MessageSquare, Image, Droplets } from 'lucide-react'
import { toast } from 'sonner'
import type { GeneratedContent } from '@/lib/types'

interface UrlEntry {
  url: string
  duration: number
}

export default function CreatePage() {
  const [entries, setEntries] = useState<UrlEntry[]>([{ url: '', duration: 15 }])
  const [removeWatermarks, setRemoveWatermarks] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<GeneratedContent[]>([])
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set())

  const addUrl = () => { if (entries.length < 5) setEntries([...entries, { url: '', duration: 15 }]) }
  const removeUrl = (i: number) => { const e = entries.filter((_, idx) => idx !== i); setEntries(e.length ? e : [{ url: '', duration: 15 }]) }
  const updateUrl = (i: number, v: string) => { const e = [...entries]; e[i] = { ...e[i], url: v }; setEntries(e) }
  const updateDuration = (i: number, v: number) => { const e = [...entries]; e[i] = { ...e[i], duration: Math.max(1, Math.min(1440, v)) }; setEntries(e) }

  const validCount = entries.filter(e => e.url.trim().length > 0).length

  const toggleSource = (url: string) => {
    const next = new Set(expandedSources)
    if (next.has(url)) next.delete(url)
    else next.add(url)
    setExpandedSources(next)
  }

  const handleGenerate = async () => {
    const filled = entries.filter(e => e.url.trim())
    if (filled.length === 0) { toast.error('Paste at least one video link'); return }

    setGenerating(true)
    setResults([])

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
      toast.success(`${data.items.length} shorts generated and auto-scheduled`)
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

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="heading-1">Create Content</h1>
        <p className="text-muted text-sm mt-1">Paste up to 5 video links. We'll generate shorts based on duration.</p>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-2">Video Links</h2>
          {entries.length < 5 && (
            <button onClick={addUrl} className="btn-ghost text-xs gap-1">
              <Plus size={14} /> Add link ({entries.length}/5)
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {entries.map((entry, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <span className="text-xs text-text-tertiary w-5 text-right flex-shrink-0">{i + 1}.</span>
              <div className="relative flex-1">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="url"
                  value={entry.url}
                  onChange={(e) => updateUrl(i, e.target.value)}
                  placeholder="Paste video URL (Instagram, TikTok, YouTube...)"
                  className="input pl-9 text-sm"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <input
                  type="number"
                  value={entry.duration}
                  onChange={(e) => updateDuration(i, parseInt(e.target.value) || 1)}
                  min={1}
                  max={1440}
                  className="input w-16 text-xs text-center"
                />
                <span className="text-[11px] text-text-tertiary w-12">min</span>
              </div>
              {entries.length > 1 && (
                <button onClick={() => removeUrl(i)} className="p-1.5 hover:bg-surface-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} className="text-text-tertiary" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setRemoveWatermarks(!removeWatermarks)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-colors ${
              removeWatermarks
                ? 'bg-accent/10 border-accent/20 text-accent'
                : 'bg-transparent border-border text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <Droplets size={13} />
            Remove watermarks
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-text-tertiary">
            {validCount > 0 ? `${validCount} link${validCount > 1 ? 's' : ''} ready` : 'No links added yet'}
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating || validCount === 0}
            className="btn-primary text-sm disabled:opacity-40"
          >
            {generating ? (
              <><span className="spinner" /> Generating...</>
            ) : (
              <><Sparkles size={15} /> Generate Content</>
            )}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-4 fade-in">
          <div className="flex items-center justify-between">
            <h2 className="heading-2">Generated Content</h2>
            <span className="text-xs text-text-tertiary">Auto-scheduled at optimal times</span>
          </div>

          {Object.entries(groupedByUrl).map(([sourceUrl, shorts]) => {
            const isExpanded = expandedSources.has(sourceUrl)
            const first = shorts[0]
            return (
              <div key={sourceUrl} className="card overflow-hidden">
                <button
                  onClick={() => toggleSource(sourceUrl)}
                  className="w-full p-4 flex items-center justify-between hover:bg-surface-1/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-bold text-xs">{first.platform[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-text-tertiary truncate">{sourceUrl}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {shorts[0].niche} &middot; {shorts.length} short{shorts.length > 1 ? 's' : ''} &middot; {shorts[0].sourceDuration} min source
                        {shorts[0].watermarkRemoved && ' \u00b7 Watermarks removed'}
                      </p>
                    </div>
                  </div>
                  <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4">
                    {shorts.map((item, idx) => (
                      <div key={item.id} className="bg-bg rounded-lg border border-border-light p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-accent">Short #{item.shortIndex} of {item.totalShorts}</span>
                            <span className="text-[11px] text-text-tertiary">&middot;</span>
                            <span className="text-[11px] text-text-tertiary">{item.clipDuration}</span>
                          </div>
                          <span className="badge bg-success/10 text-success text-[11px] flex items-center gap-1">
                            <Check size={11} /> Scheduled
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm">{item.seoTitle}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-text-tertiary">{item.platform}</span>
                              <span className="text-[11px] text-text-tertiary">&middot;</span>
                              <span className="text-[11px] text-accent flex items-center gap-1">
                                <Clock size={11} />
                                {item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' }) : 'Unscheduled'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Type size={12} className="text-accent" />
                              <span className="text-[11px] font-medium text-text-primary">SEO Title</span>
                            </div>
                            <p className="text-sm text-text-primary bg-surface-1 rounded-md p-2.5 border border-border-light">{item.seoTitle}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Image size={12} className="text-accent" />
                              <span className="text-[11px] font-medium text-text-primary">Thumbnail</span>
                            </div>
                            <p className="text-sm text-text-secondary bg-surface-1 rounded-md p-2.5 border border-border-light">{item.thumbnailIdea}</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Sparkles size={12} className="text-accent" />
                            <span className="text-[11px] font-medium text-text-primary">Attention Hooks</span>
                          </div>
                          <div className="space-y-1">
                            {item.hooks.map((hook, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-sm text-text-secondary bg-surface-1 rounded-md p-2.5 border border-border-light">
                                <span className="text-accent font-medium text-xs mt-0.5">{i + 1}.</span>
                                <span>"{hook}"</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <MessageSquare size={12} className="text-accent" />
                            <span className="text-[11px] font-medium text-text-primary">Description</span>
                          </div>
                          <p className="text-sm text-text-secondary bg-surface-1 rounded-md p-2.5 border border-border-light leading-relaxed">{item.description}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Hash size={12} className="text-accent" />
                            <span className="text-[11px] font-medium text-text-primary">Hashtags</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.hashtags.map((tag, i) => (
                              <span key={i} className="px-2 py-0.5 bg-accent/5 border border-accent/10 rounded text-[11px] text-accent">{tag}</span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border-light flex items-center justify-between">
                          <span className="text-[11px] text-text-tertiary">Clip: {item.clipDuration}</span>
                          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-accent hover:underline flex items-center gap-1">
                            <ExternalLink size={11} /> Source
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
