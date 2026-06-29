import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = verifyToken(auth.split(' ')[1])
    const { content, title, platform, scheduledAt, hashtags } = await req.json()
    if (!content || !scheduledAt) return NextResponse.json({ error: 'Content and scheduled time are required' }, { status: 400 })

    const post = {
      id: Math.random().toString(36).substring(2, 15),
      content, title: title || 'Untitled Post', platform: platform || 'Instagram',
      scheduledAt, status: 'pending' as const, hashtags: hashtags || [],
      userId: user.id, createdAt: new Date().toISOString(),
    }
    db.scheduledPosts.push(post)
    return NextResponse.json({ message: 'Post scheduled successfully', postId: post.id })
  } catch {
    return NextResponse.json({ error: 'Scheduling failed' }, { status: 500 })
  }
}
