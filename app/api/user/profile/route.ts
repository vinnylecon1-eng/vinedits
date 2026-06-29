import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(auth.split(' ')[1])
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({
      id: user.id, email: user.email, name: user.name,
      subscription: user.subscription, createdAt: user.createdAt.toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
