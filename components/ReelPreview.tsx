'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface ReelPreviewProps {
  hook: string
  caption: string
  seoTitle: string
  niche: string
  platform: string
}

const PLATFORM_COLORS: Record<string, string[]> = {
  Instagram: ['#833AB4', '#FD1D1D', '#F77737'],
  TikTok: ['#00F2EA', '#FF0050', '#010101'],
  YouTube: ['#FF0000', '#282828', '#FFFFFF'],
  Facebook: ['#1877F2', '#166FE5', '#131313'],
}

export default function ReelPreview({ hook, caption, seoTitle, niche, platform }: ReelPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const animRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const totalDuration = 12000
  const sceneDuration = totalDuration / 4

  const colors = PLATFORM_COLORS[platform] || ['#3b82f6', '#6366f1', '#8b5cf6']

  const drawFrame = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const elapsed = timestamp - startTimeRef.current
    const t = Math.min(elapsed / totalDuration, 1)
    const scene = Math.min(Math.floor(elapsed / sceneDuration), 3)
    const sceneProgress = (elapsed % sceneDuration) / sceneDuration

    ctx.clearRect(0, 0, w, h)

    const grad = ctx.createLinearGradient(0, 0, w, h)
    const c1 = colors[Math.floor(scene) % colors.length]
    const c2 = colors[(Math.floor(scene) + 1) % colors.length]
    const c3 = colors[(Math.floor(scene) + 2) % colors.length]
    grad.addColorStop(0, c1)
    grad.addColorStop(0.5, c2)
    grad.addColorStop(1, c3)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    const particleCount = 8
    for (let i = 0; i < particleCount; i++) {
      const px = ((i * 137.5 + elapsed * 0.02) % w)
      const py = ((i * 97.3 + elapsed * 0.015) % h)
      const size = 4 + Math.sin(elapsed * 0.003 + i) * 3
      ctx.beginPath()
      ctx.arc(px, py, size, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.fill()
    }

    if (scene === 0) {
      ctx.save()
      const fontSize = Math.min(w * 0.065, 28)
      ctx.font = `700 ${fontSize}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      const y = h * 0.3 + (1 - sceneProgress) * 30
      const alpha = Math.min(sceneProgress * 2, 1)
      ctx.globalAlpha = alpha
      ctx.fillText(hook, w / 2 + 2, y + 2)
      ctx.fillStyle = '#ffffff'
      ctx.fillText(hook, w / 2, y)
      ctx.globalAlpha = 1
      ctx.restore()
    } else if (scene === 1) {
      ctx.save()
      const lines = seoTitle.split(' ').reduce((acc: string[][], word, i) => {
        const last = acc[acc.length - 1]
        if (!last || last.join(' ').length + word.length > 25) acc.push([word])
        else last.push(word)
        return acc
      }, [])
      const fontSize = Math.min(w * 0.045, 18)
      ctx.font = `600 ${fontSize}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const startY = h * 0.3
      const startAlpha = Math.min(sceneProgress * 2, 1)

      const bgGrad = ctx.createLinearGradient(0, startY - 60, 0, startY + lines.length * 30 + 60)
      bgGrad.addColorStop(0, 'rgba(0,0,0,0)')
      bgGrad.addColorStop(0.15, 'rgba(0,0,0,0.4)')
      bgGrad.addColorStop(0.85, 'rgba(0,0,0,0.4)')
      bgGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, startY - 40, w, lines.length * 30 + 80)

      lines.forEach((line, i) => {
        ctx.globalAlpha = Math.min(Math.max(sceneProgress * 3 - i * 0.3, 0), 1) * startAlpha
        ctx.fillStyle = '#ffffff'
        ctx.fillText(line.join(' '), w / 2, startY + i * 30)
      })
      ctx.globalAlpha = 1
      ctx.restore()
    } else if (scene === 2) {
      ctx.save()
      const fontSize = Math.min(w * 0.04, 14)
      ctx.font = `500 ${fontSize}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const charsPerLine = 28
      const words = caption.split(' ')
      const lines: string[] = []
      let current = ''
      words.forEach((word) => {
        if ((current + ' ' + word).length > charsPerLine) { lines.push(current.trim()); current = word }
        else current += ' ' + word
      })
      if (current.trim()) lines.push(current.trim())

      const visibleLines = Math.min(lines.length, Math.floor(sceneProgress * (lines.length + 2)))
      const startY = h * 0.25

      const bgGrad = ctx.createLinearGradient(0, h * 0.7, 0, h * 0.85)
      bgGrad.addColorStop(0, 'rgba(0,0,0,0)')
      bgGrad.addColorStop(0.2, 'rgba(0,0,0,0.6)')
      bgGrad.addColorStop(1, 'rgba(0,0,0,0.8)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, h * 0.7, w, h * 0.3)

      lines.slice(0, visibleLines).forEach((line, i) => {
        const alpha = Math.min(sceneProgress * 4 - (lines.length - visibleLines + i) * 0.2, 1)
        if (alpha > 0) {
          ctx.globalAlpha = Math.max(0, alpha)
          ctx.fillStyle = '#ffffff'
          ctx.fillText(line, w / 2, startY + i * (fontSize + 6))
        }
      })
      ctx.globalAlpha = 1
      ctx.restore()
    } else if (scene === 3) {
      ctx.save()
      const pulse = 0.8 + Math.sin(elapsed * 0.005) * 0.2
      ctx.globalAlpha = pulse

      const grad2 = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6)
      grad2.addColorStop(0, 'rgba(255,255,255,0.15)')
      grad2.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = grad2
      ctx.fillRect(0, 0, w, h)

      const fontSize = Math.min(w * 0.08, 32)
      ctx.font = `800 ${fontSize}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'

      const shrink = Math.max(0, 1 - sceneProgress * 0.5)
      ctx.setTransform(shrink, 0, 0, shrink, w / 2 * (1 - shrink), h / 2 * (1 - shrink))
      ctx.fillText('Follow for more', w / 2, h / 2)
      ctx.setTransform(1, 0, 0, 1, 0, 0)

      const subSize = Math.min(w * 0.035, 14)
      ctx.font = `500 ${subSize}px Inter, sans-serif`
      const subAlpha = Math.min(Math.max(sceneProgress * 3 - 1, 0), 1)
      ctx.globalAlpha = subAlpha
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.fillText('@vinedits', w / 2, h * 0.62)

      ctx.globalAlpha = 1
      ctx.restore()
    }

    ctx.save()
    const bottomGrad = ctx.createLinearGradient(0, h - 80, 0, h)
    bottomGrad.addColorStop(0, 'rgba(0,0,0,0)')
    bottomGrad.addColorStop(1, 'rgba(0,0,0,0.4)')
    ctx.fillStyle = bottomGrad
    ctx.fillRect(0, h - 80, w, 80)
    ctx.restore()

    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = `600 ${Math.min(w * 0.03, 11)}px Inter, sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    const nicheLabel = `${niche} · ${platform}`
    ctx.fillText(nicheLabel, 12, h - 14)
    ctx.restore()

    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = `500 ${Math.min(w * 0.025, 10)}px Inter, sans-serif`
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText(`${Math.ceil((totalDuration - elapsed) / 1000)}s`, w - 12, h - 14)
    ctx.restore()

    ctx.save()
    const barY = h - 4
    const barH = 3
    const barW = w - 24
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.beginPath()
    ctx.roundRect(12, barY, barW, barH, 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.beginPath()
    ctx.roundRect(12, barY, barW * t, barH, 2)
    ctx.fill()
    ctx.restore()

    setProgress(t)

    if (t < 1) {
      animRef.current = requestAnimationFrame(drawFrame)
    } else {
      setPlaying(false)
    }
  }, [hook, caption, seoTitle, niche, platform, colors, sceneDuration, totalDuration])

  const startAnim = useCallback(() => {
    startTimeRef.current = performance.now()
    animRef.current = requestAnimationFrame(drawFrame)
  }, [drawFrame])

  const togglePlay = () => {
    if (playing) {
      cancelAnimationFrame(animRef.current)
      setPlaying(false)
    } else {
      setPlaying(true)
      startAnim()
    }
  }

  const restart = useCallback(() => {
    cancelAnimationFrame(animRef.current)
    setProgress(0)
    setPlaying(true)
    startAnim()
  }, [startAnim])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * (window.devicePixelRatio || 1)
    canvas.height = rect.height * (window.devicePixelRatio || 1)
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
  }, [])

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const progressPct = Math.round(progress * 100)

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-3">
      <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl" style={{ width: 280, height: 500 }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          style={{ width: 280, height: 500 }}
          onClick={togglePlay}
        />

        {!playing && progress === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity" onClick={togglePlay}>
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all hover:scale-105">
              <Play size={28} className="text-white ml-1" />
            </div>
          </div>
        )}

        {!playing && progress > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity" onClick={togglePlay}>
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all hover:scale-105">
              <Play size={24} className="text-white ml-1" />
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-semibold text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {niche}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); setMuted(!muted) }}
            className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            {muted ? <VolumeX size={12} className="text-white/80" /> : <Volume2 size={12} className="text-white/80" />}
          </button>
        </div>

        {playing && (
          <div className="absolute bottom-2 left-0 right-0 px-3 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 rounded-full transition-all duration-200" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[10px] text-white/70 font-mono w-8 text-right">{Math.ceil((1 - progress) * totalDuration / 1000)}s</span>
          </div>
        )}
      </div>

      {!playing && progress > 0 && (
        <button onClick={restart} className="text-xs text-text-secondary hover:text-text-primary transition-colors">
          Replay
        </button>
      )}
    </div>
  )
}
