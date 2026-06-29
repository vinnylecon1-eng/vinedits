import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name } = body
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    if (db.users.find((u) => u.email === email)) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const user = {
      id: Math.random().toString(36).substring(2, 15),
      email, name: name || email.split('@')[0],
      password, subscription: 'free' as const,
      createdAt: new Date().toISOString(),
    }
    db.users.push(user)
    const token = signToken({ id: user.id, email: user.email })
    return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name, subscription: user.subscription, createdAt: user.createdAt } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Signup failed' }, { status: 500 })
  }
}
