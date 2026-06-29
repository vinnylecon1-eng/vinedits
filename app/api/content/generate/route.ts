import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateShortsForUrl, generateOptimalSchedule } from '@/lib/generate'

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = verifyToken(auth.split(' ')[1])
    const { urls, durations, removeWatermarks } = await req.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'At least one URL is required' }, { status: 400 })
    }
    if (urls.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 URLs allowed' }, { status: 400 })
    }

    const validUrls = urls.filter((u: string) => {
      try { new URL(u); return true } catch { return false }
    })

    if (validUrls.length === 0) {
      return NextResponse.json({ error: 'No valid URLs provided' }, { status: 400 })
    }

    const allItems: any[] = []

    for (let i = 0; i < validUrls.length; i++) {
      const url = validUrls[i]
      const dur = (durations && durations[i]) || 15
      const removeWm = !!removeWatermarks
      const shorts = generateShortsForUrl(url, dur, removeWm)

      for (const short of shorts) {
        const id = Math.random().toString(36).substring(2, 15)
        const item = {
          id,
          ...short,
          status: 'scheduled' as const,
          scheduledAt: null,
          createdAt: new Date().toISOString(),
          userId: user.id,
        }
        db.content.push(item)
        allItems.push(item)
      }
    }

    const scheduleSlots = generateOptimalSchedule(allItems.length)
    allItems.forEach((item, idx) => {
      item.scheduledAt = scheduleSlots[idx] || null

      db.scheduledPosts.push({
        id: Math.random().toString(36).substring(2, 15),
        contentId: item.id,
        seoTitle: item.seoTitle,
        hashtags: item.hashtags,
        platform: item.platform,
        niche: item.niche,
        sourceUrl: item.sourceUrl,
        scheduledAt: scheduleSlots[idx] || new Date().toISOString(),
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        userId: user.id,
      })
    })

    return NextResponse.json({
      message: `${allItems.length} shorts generated and auto-scheduled`,
      items: allItems,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 })
  }
}
