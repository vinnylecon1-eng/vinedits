import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/hash'

async function main() {
  let user = await prisma.user.findUnique({ where: { email: 'demo@vinedits.com' } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'demo@vinedits.com',
        name: 'Demo User',
        password: hashPassword('demo123'),
        subscription: 'pro',
      },
    })
  }

  const existingContent = await prisma.generatedContent.count({ where: { userId: user.id } })
  if (existingContent > 0) {
    console.log('Seed data already exists, skipping.')
    console.log('Login with: demo@vinedits.com / demo123')
    return
  }

  const demoShorts = [
    {
      sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'YouTube',
      niche: 'Tech',
      seoTitle: '5 AI Tools That Actually Work in 2026',
      hooks: JSON.stringify(['This AI tool blew my mind', 'Stop using outdated tools', 'The future of AI is here']),
      description: 'In this clip, I break down the exact AI tools that are changing how developers work. Save this one — you will want to come back to these later.',
      caption: 'This one\'s been sitting in my drafts for a while. Drop a comment if this hits home.',
      hashtags: JSON.stringify(['#tech', '#ai', '#coding', '#developer', '#productivity', '#tools', '#viral', '#fyp', '#shorts', '#trending', '#youtube', '#contentcreator']),
      thumbnailIdea: 'Bold text overlay — yellow background with "GAME CHANGER" text',
      clipDuration: '30 seconds',
      sourceDuration: 120,
      totalShorts: 3,
      shortIndex: 1,
      watermarkRemoved: true,
      hasVideo: false,
      videoUrl: null,
      status: 'scheduled',
    },
    {
      sourceUrl: 'https://www.instagram.com/reel/example1',
      platform: 'Instagram',
      niche: 'Fitness',
      seoTitle: 'The #1 Exercise 90% of People Skip',
      hooks: JSON.stringify(['The #1 exercise 90% of people skip', 'Stop doing crunches', '3 exercises for a stronger core']),
      description: 'This is hands down the most requested topic. I\'m sharing the complete framework that helped me get real results. Save this one for later.',
      caption: 'Not gonna lie, this took me way too long to figure out. Hope it saves you the headache.',
      hashtags: JSON.stringify(['#fitness', '#workout', '#gym', '#training', '#strength', '#health', '#fyp', '#viral', '#reels', '#instareels', '#fitnessmotivation', '#shorts']),
      thumbnailIdea: 'Before/after comparison — blue background with "THE TRUTH" text',
      clipDuration: '30 seconds',
      sourceDuration: 120,
      totalShorts: 3,
      shortIndex: 2,
      watermarkRemoved: true,
      hasVideo: false,
      videoUrl: null,
      status: 'scheduled',
    },
    {
      sourceUrl: 'https://www.tiktok.com/@demo/video/12345',
      platform: 'TikTok',
      niche: 'Finance',
      seoTitle: 'How I Saved $10K in 6 Months',
      hooks: JSON.stringify(['How I saved $10K in 6 months', 'The investing mistake 90% make', 'Why your 401K isn\'t enough']),
      description: 'After months of testing and tweaking, I finally cracked the code. Here\'s everything you need to know in under 60 seconds.',
      caption: 'This is your sign to finally make that change you\'ve been putting off. You\'ve got this.',
      hashtags: JSON.stringify(['#finance', '#money', '#investing', '#savings', '#budget', '#wealth', '#fyp', '#viral', '#tiktok', '#moneytok', '#financialfreedom', '#shorts']),
      thumbnailIdea: 'Number list — purple background with "STOP SCROLLING" text',
      clipDuration: '30 seconds',
      sourceDuration: 120,
      totalShorts: 3,
      shortIndex: 3,
      watermarkRemoved: true,
      hasVideo: false,
      videoUrl: null,
      status: 'scheduled',
    },
  ]

  const now = new Date()
  for (let i = 0; i < demoShorts.length; i++) {
    const short = demoShorts[i]
    const scheduledAt = new Date(now)
    scheduledAt.setDate(scheduledAt.getDate() + i)
    scheduledAt.setHours([8, 14, 20][i], 15, 0, 0)

    const created = await prisma.generatedContent.create({
      data: {
        id: `demo_short_${i + 1}`,
        userId: user.id,
        ...short,
        createdAt: new Date(now.getTime() - (i + 1) * 86400000),
        scheduledAt: scheduledAt.toISOString(),
      },
    })

    await prisma.scheduledPost.create({
      data: {
        id: `demo_post_${i + 1}`,
        userId: user.id,
        contentId: created.id,
        seoTitle: short.seoTitle,
        hashtags: short.hashtags,
        platform: short.platform,
        niche: short.niche,
        sourceUrl: short.sourceUrl,
        scheduledAt: scheduledAt.toISOString(),
        status: 'pending',
      },
    })
  }

  console.log(`Seeded user: ${user.email} (${user.id})`)
  console.log(`Seeded ${demoShorts.length} demo shorts + scheduled posts`)
  console.log('Login with: demo@vinedits.com / demo123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())