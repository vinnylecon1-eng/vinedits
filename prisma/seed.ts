import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/hash'

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'demo@vinedits.com' } })
  if (existing) {
    console.log('Seed data already exists, skipping.')
    return
  }

  const user = await prisma.user.create({
    data: {
      email: 'demo@vinedits.com',
      name: 'Demo User',
      password: hashPassword('demo123'),
      subscription: 'pro',
    },
  })

  console.log(`Seeded user: ${user.email} (${user.id})`)
  console.log('Login with: demo@vinedits.com / demo123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
