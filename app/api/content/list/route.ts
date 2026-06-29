import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = verifyToken(auth.split(' ')[1])
    const items = await prisma.generatedContent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({
      items: items.map((c) => ({
        ...c,
        hooks: JSON.parse(c.hooks),
        hashtags: JSON.parse(c.hashtags),
        createdAt: c.createdAt.toISOString(),
        scheduledAt: c.scheduledAt,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
