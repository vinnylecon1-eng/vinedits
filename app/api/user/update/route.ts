import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword } from '@/lib/hash'

export async function PUT(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(auth.split(' ')[1])
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { email, name, currentPassword, newPassword } = await req.json()
    const data: Record<string, string> = {}
    if (currentPassword && newPassword) {
      if (!verifyPassword(currentPassword, user.password)) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }
      data.password = hashPassword(newPassword)
    }
    if (email) data.email = email
    if (name) data.name = name

    const updated = await prisma.user.update({ where: { id: user.id }, data })
    return NextResponse.json({
      user: { id: updated.id, email: updated.email, name: updated.name, subscription: updated.subscription, createdAt: updated.createdAt.toISOString() },
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
