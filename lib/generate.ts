function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length))
}

const niches = [
  { name: 'Fitness', keywords: ['fitness', 'workout', 'gym', 'exercise', 'training', 'muscle', 'weight loss', 'yoga', 'pilates'] },
  { name: 'Tech', keywords: ['tech', 'technology', 'coding', 'programming', 'software', 'app', 'startup', 'ai', 'gadget', 'review'] },
  { name: 'Finance', keywords: ['finance', 'money', 'investing', 'crypto', 'stock', 'trading', 'budget', 'wealth', 'business'] },
  { name: 'Beauty', keywords: ['beauty', 'makeup', 'skincare', 'hair', 'cosmetic', 'fashion', 'style', 'nails'] },
  { name: 'Entertainment', keywords: ['entertainment', 'movie', 'music', 'gaming', 'funny', 'comedy', 'prank', 'challenge', 'dance'] },
  { name: 'Food', keywords: ['food', 'cooking', 'recipe', 'baking', 'kitchen', 'meal', 'dinner', 'tasty'] },
  { name: 'Travel', keywords: ['travel', 'trip', 'vacation', 'wanderlust', 'adventure', 'explore', 'tourism'] },
  { name: 'Education', keywords: ['education', 'learn', 'study', 'course', 'tutorial', 'how to', 'guide', 'tips'] },
  { name: 'Gaming', keywords: ['gaming', 'game', 'twitch', 'stream', 'minecraft', 'fortnite', 'valorant', 'pubg'] },
  { name: 'Motivation', keywords: ['motivation', 'success', 'hustle', 'grind', 'inspiration', 'mindset', 'goals'] },
]

const nicheHooks: Record<string, string[][]> = {
  Fitness: [
    ['The #1 exercise 90% of people skip', 'This 5-minute workout changed my body', 'Stop doing crunches — try this instead'],
    ['How I lost 20lbs with this one trick', 'The science of fat burning explained', '3 exercises for a stronger core'],
    ['Your form is wrong (fix this now)', 'The truth about cardio vs weights', 'Why rest days matter more than you think'],
  ],
  Tech: [
    ['This AI tool blew my mind', 'The coding trick that saved me 10 hours', 'Stop using Chrome — try this instead'],
    ['5 apps I use every day', 'How I built this in 24 hours', 'The future of AI is here'],
    ['Your password is probably compromised', 'This tech hack will change your workflow', 'Why every developer needs this tool'],
  ],
  Finance: [
    ['The investing mistake 90% make', 'How I saved $10K in 6 months', 'This money hack changed everything'],
    ['3 stocks I\'m watching this week', 'The truth about crypto in 2026', 'Why your 401K isn\'t enough'],
    ['Budgeting doesn\'t have to suck', 'How to start investing with $100', 'The debt payoff method that works'],
  ],
  Entertainment: [
    ['This movie twist broke my brain', 'The best shows to binge this weekend', 'Never watch a bad movie again'],
    ['5 songs that changed my life', 'The most underrated content right now', 'Why this trend is taking over'],
    ['You missed this detail in your favorite show', 'The creator behind the viral moment', 'This challenge is harder than it looks'],
  ],
  Beauty: [
    ['The skincare mistake aging you', 'This $10 product works better than luxury', 'My 3-step morning routine'],
    ['The makeup hack that saves 20 minutes', 'Why dermatologists recommend this', 'Clean beauty brands that actually work'],
    ['Your hair routine is damaging it', 'The product I swear by', 'How to build a capsule makeup kit'],
  ],
}

const defaultHooks = [
  ['You\'ve been doing it wrong this whole time', 'The #1 mistake 90% of people make', 'Stop scrolling — this changes everything'],
  ['I tried this for 7 days and couldn\'t believe it', 'The secret technique nobody talks about', 'Why experts won\'t tell you this'],
  ['This one trick changed my life', 'What they don\'t want you to know', 'The truth nobody talks about'],
  ['3 signs you\'re doing it right', 'The exact method I used to go viral', 'How I got 1M views with this simple hack'],
  ['Forget everything you know', 'The science behind why this works', 'Your audience needs to hear this'],
]

const descriptionTemplates = [
  `In this clip, I break down the exact strategy that took me from 0 to results. Whether you're a beginner or experienced, these insights will transform your approach. Watch until the end for the game-changing tip.`,
  `This is the most requested topic. I'm sharing the complete framework that helped me achieve real results. Save this for later — you'll want to reference these steps.`,
  `After months of testing, I finally cracked the code. Here's everything you need to know about [topic] in under 60 seconds. Share this with someone who needs to hear it.`,
  `The algorithm changed again, and most people are getting it wrong. Here's what's actually working right now. Follow for more insights.`,
  `This clip breaks down the proven system that has helped thousands get results. Step 3 is the one most people overlook, but it's where the magic happens.`,
  `Stop scrolling and take notes. This is the exact blueprint I followed. Save this, implement it, and thank me later.`,
]

const hashtagSets = [
  ['#viral', '#trending', '#fyp', '#explore', '#shorts', '#reels', '#video', '#content', '#trendingaudio', '#foryou', '#explorepage', '#creator', '#grow', '#new'],
  ['#motivation', '#success', '#inspiration', '#goals', '#tips', '#hacks', '#howto', '#guide', '#expert', '#results', '#transformation', '#tipsandtricks', '#pro', '#winning'],
]

const seoTitleTemplates = [
  'How to [action] in [timeframe]',
  '[number] [topic] Tips That Work in 2026',
  'The Ultimate [topic] Short Guide',
  'I Tried [method] — Here\'s What Happened',
  'Why Your [topic] Approach Is Wrong',
  'This [topic] Hack Will Save You Time',
  'The Secret to [result] Revealed',
  'How I Got [result] With This Method',
]

const shortDurations = ['15-20 seconds', '20-25 seconds', '25-30 seconds', '30-35 seconds', '35-40 seconds', '40-45 seconds', '45-50 seconds']

export function extractDomain(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname.includes('instagram')) return 'Instagram'
    if (u.hostname.includes('tiktok')) return 'TikTok'
    if (u.hostname.includes('youtube')) return 'YouTube'
    if (u.hostname.includes('facebook')) return 'Facebook'
    if (u.hostname.includes('twitter') || u.hostname.includes('x.com')) return 'Twitter'
    return 'Instagram'
  } catch {
    return 'Instagram'
  }
}

function detectNiche(url: string): string {
  const lower = url.toLowerCase()
  const fullText = lower
  for (const niche of niches) {
    for (const kw of niche.keywords) {
      if (fullText.includes(kw)) return niche.name
    }
  }
  return pick(niches).name
}

function generateHooks(niche: string, count: number): string[] {
  const pool = nicheHooks[niche] || defaultHooks
  const flat = pickN(pool, 2).flat()
  return pickN(flat, count).map((h) => h.replace('[topic]', niche.toLowerCase()))
}

function generateSeoTitle(niche: string, index: number): string {
  const actions: Record<string, string[]> = {
    Fitness: ['build muscle fast', 'lose belly fat', 'get in shape', 'train smarter'],
    Tech: ['code faster', 'build your first app', 'learn AI', 'optimize your workflow'],
    Finance: ['save money daily', 'invest wisely', 'build wealth', 'budget better'],
    Beauty: ['upgrade your routine', 'glow up naturally', 'apply makeup perfectly', 'care for your skin'],
    Entertainment: ['find your next binge', 'discover hidden gems', 'enjoy content better', 'stay entertained'],
    Food: ['cook healthier', 'meal prep like a pro', 'make restaurant food at home', 'eat better daily'],
    Travel: ['travel on a budget', 'plan the perfect trip', 'explore like a local', 'save money traveling'],
    Education: ['learn anything faster', 'study more effectively', 'master new skills', 'retain more info'],
    Gaming: ['dominate your lobbies', 'improve your aim', 'rank up faster', 'win more games'],
    Motivation: ['stay motivated daily', 'build better habits', 'achieve your goals', 'crush procrastination'],
  }
  const nicheActions = actions[niche] || ['get better results', 'improve your game', 'level up']
  const action = pick(nicheActions)
  const timeframes = ['7 days', '14 days', '30 days', '90 days']
  const nums = ['3', '5', '7', '10']
  const methods = ['The Simple System', 'The 3-Step Framework', 'The Proven Method', 'The Expert Approach']
  const results = ['10K Followers', 'Viral Growth', 'Real Results', 'Massive Engagement', 'Your First 1000']

  const tmpl = seoTitleTemplates[index % seoTitleTemplates.length]
  return tmpl
    .replace('[action]', action)
    .replace('[timeframe]', pick(timeframes))
    .replace('[number]', pick(nums))
    .replace('[topic]', niche)
    .replace('[method]', pick(methods))
    .replace('[result]', pick(results))
}

export function generateShortsForUrl(url: string, durationMinutes: number, removeWatermark: boolean) {
  const platform = extractDomain(url)
  const niche = detectNiche(url)
  const shortCount = Math.max(1, Math.floor(durationMinutes / 15))
  const shorts: any[] = []

  for (let i = 0; i < shortCount; i++) {
    const seoTitle = generateSeoTitle(niche, i)
    const hooks = generateHooks(niche, 3)
    const description = pick(descriptionTemplates).replace('[topic]', niche.toLowerCase())
    const rawHashtags = [...new Set([...pick(hashtagSets), `#${niche.toLowerCase()}`, `#${platform.toLowerCase()}`, '#shorts', '#viralvideo'])]
    const hashtags = pickN(rawHashtags, 12)

    const thumbnailBg = pick(['yellow', 'blue', 'red', 'white', 'neon green', 'purple', 'orange'])
    const thumbnailText = pick(['SHOCKING', 'YOU NEED THIS', 'GAME CHANGER', 'STOP SCROLLING', 'LIFE HACK', 'MIND BLOWN', 'TRY THIS'])
    const thumbnailStyle = pick(['Bold text overlay', 'Split screen reaction', 'Before/after comparison', 'Text on solid background', 'Close-up face reaction'])
    const thumbnailIdea = `${thumbnailStyle} — ${thumbnailBg} background with "${thumbnailText}" text`

    shorts.push({
      sourceUrl: url,
      platform,
      niche,
      seoTitle,
      hooks,
      description,
      hashtags,
      thumbnailIdea,
      clipDuration: pick(shortDurations),
      sourceDuration: durationMinutes,
      totalShorts: shortCount,
      shortIndex: i + 1,
      watermarkRemoved: removeWatermark,
    })
  }

  return shorts
}

export function generateOptimalSchedule(count: number): string[] {
  const slots: string[] = []
  const now = new Date()
  const dayHours = [8, 11, 14, 17, 20]

  for (let i = 0; i < count; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + Math.floor(i / dayHours.length))
    date.setHours(dayHours[i % dayHours.length], Math.floor(Math.random() * 30), 0, 0)
    slots.push(date.toISOString())
  }

  return slots
}
