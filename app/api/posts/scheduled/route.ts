import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = verifyToken(auth.split(' ')[1])
    const posts = await prisma.scheduledPost.findMany({
      where: { userId: user.id },
      orderBy: { scheduledAt: 'asc' },
    })
    return NextResponse.json({
      posts: posts.map((p) => ({
        ...p,
        hashtags: JSON.parse(p.hashtags),
        createdAt: p.createdAt.toISOString(),
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
