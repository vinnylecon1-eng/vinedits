import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const content = await prisma.generatedContent.findUnique({ where: { id } })
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.generatedContent.delete({ where: { id } })
    await prisma.scheduledPost.deleteMany({ where: { contentId: id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
