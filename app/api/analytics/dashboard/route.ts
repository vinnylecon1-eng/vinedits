import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    verifyToken(auth.split(' ')[1])

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const daily = days.map((date) => ({
      date,
      views: Math.floor(Math.random() * 5000) + 500,
      likes: Math.floor(Math.random() * 800) + 50,
      comments: Math.floor(Math.random() * 150) + 5,
      shares: Math.floor(Math.random() * 300) + 10,
      saves: Math.floor(Math.random() * 400) + 20,
    }))

    const contentCount = await prisma.generatedContent.count()
    const postsCount = await prisma.scheduledPost.count()
    const topContent = await prisma.generatedContent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return NextResponse.json({
      daily,
      stats: {
        totalViews: daily.reduce((s, d) => s + d.views, 0),
        totalLikes: daily.reduce((s, d) => s + d.likes, 0),
        totalComments: daily.reduce((s, d) => s + d.comments, 0),
        totalShares: daily.reduce((s, d) => s + d.shares, 0),
        totalSaves: daily.reduce((s, d) => s + d.saves, 0),
        contentGenerated: contentCount,
        postsScheduled: postsCount,
        avgEngagementRate: +(Math.random() * 8 + 3).toFixed(1),
      },
      topContent: topContent.map((c) => ({
        seoTitle: c.seoTitle,
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 1000) + 100,
        platform: c.platform,
        date: c.createdAt.toISOString(),
      })),
      platformBreakdown: [
        { platform: 'Instagram', percentage: 38 },
        { platform: 'TikTok', percentage: 30 },
        { platform: 'YouTube', percentage: 18 },
        { platform: 'Facebook', percentage: 10 },
        { platform: 'Other', percentage: 4 },
      ],
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
