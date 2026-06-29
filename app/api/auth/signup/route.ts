import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/hash'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashPassword(password),
        subscription: 'free',
      },
    })

    const token = signToken({ id: user.id, email: user.email })
    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, subscription: user.subscription, createdAt: user.createdAt.toISOString() },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Signup failed' }, { status: 500 })
  }
}
