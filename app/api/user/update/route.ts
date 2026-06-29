import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(auth.split(' ')[1])
    const user = db.users.find((u) => u.id === decoded.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { email, name, currentPassword, newPassword } = await req.json()
    if (currentPassword && newPassword) {
      if (user.password !== currentPassword) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      user.password = newPassword
    }
    if (email) user.email = email
    if (name) user.name = name

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, subscription: user.subscription, createdAt: user.createdAt } })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
