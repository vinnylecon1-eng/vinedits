import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const idx = db.scheduledPosts.findIndex((p) => p.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    db.scheduledPosts.splice(idx, 1)
    return NextResponse.json({ message: 'Post deleted' })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
