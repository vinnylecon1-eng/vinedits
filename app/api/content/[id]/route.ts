import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const idx = db.content.findIndex((c: any) => c.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    db.content.splice(idx, 1)
    db.scheduledPosts = db.scheduledPosts.filter((p: any) => p.contentId !== id)
    return NextResponse.json({ message: 'Deleted' })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
