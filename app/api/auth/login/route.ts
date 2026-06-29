import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/hash'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = signToken({ id: user.id, email: user.email })
    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, subscription: user.subscription, createdAt: user.createdAt.toISOString() },
    })
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
