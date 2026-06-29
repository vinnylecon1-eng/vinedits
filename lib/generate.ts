import { generateShortContent, checkOllamaAvailable } from './ai'

const shortDurations = ['18-22 seconds', '22-28 seconds', '28-35 seconds', '35-40 seconds', '40-48 seconds', '48-55 seconds']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(n, arr.length))
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const niches = [
  { name: 'Fitness', keywords: ['fitness', 'workout', 'gym', 'exercise', 'training', 'muscle', 'weight loss', 'yoga', 'pilates', 'cardio', 'strength', 'bodybuilding', 'diet', 'nutrition'] },
  { name: 'Tech', keywords: ['tech', 'technology', 'coding', 'programming', 'software', 'app', 'startup', 'ai', 'gadget', 'review', 'developer', 'web', 'saas', 'digital'] },
  { name: 'Finance', keywords: ['finance', 'money', 'investing', 'crypto', 'stock', 'trading', 'budget', 'wealth', 'business', 'savings', 'passive income', 'financial'] },
  { name: 'Beauty', keywords: ['beauty', 'makeup', 'skincare', 'hair', 'cosmetic', 'fashion', 'style', 'nails', 'glow up', 'routine', 'tutorial beauty'] },
  { name: 'Entertainment', keywords: ['entertainment', 'movie', 'music', 'gaming', 'funny', 'comedy', 'prank', 'challenge', 'dance', 'trend', 'viral video', 'reaction'] },
  { name: 'Food', keywords: ['food', 'cooking', 'recipe', 'baking', 'kitchen', 'meal', 'dinner', 'tasty', 'delicious', 'chef', 'easy recipe', 'healthy food'] },
  { name: 'Travel', keywords: ['travel', 'trip', 'vacation', 'wanderlust', 'adventure', 'explore', 'tourism', 'flight', 'destination', 'hotel', 'backpacking'] },
  { name: 'Education', keywords: ['education', 'learn', 'study', 'course', 'tutorial', 'how to', 'guide', 'tips', 'knowledge', 'school', 'lesson', 'teach'] },
  { name: 'Gaming', keywords: ['gaming', 'game', 'twitch', 'stream', 'minecraft', 'fortnite', 'valorant', 'pubg', 'esports', 'gamer', 'playthrough'] },
  { name: 'Motivation', keywords: ['motivation', 'success', 'hustle', 'grind', 'inspiration', 'mindset', 'goals', 'discipline', 'growth', 'habits'] },
]

const nicheHooks: Record<string, string[]> = {
  Fitness: [
    'The #1 exercise 90% of people skip',
    'This 5-minute workout changed my body',
    'Stop doing crunches — try this instead',
    'How I lost 20lbs with this one trick',
    'The science of fat burning explained',
    '3 exercises for a stronger core',
    'Your form is wrong (fix this now)',
    'The truth about cardio vs weights',
    'Why rest days matter more than you think',
    'This one stretch will fix your back pain',
    'I did 100 pushups every day for a month',
    'The only 3 exercises you actually need',
    'Why you\'re not seeing results (and how to fix it)',
    '10 minute routine that changed my posture',
    'The breakfast that fuels my workouts',
    'Stop wasting time at the gym — do this instead',
    'How to stay fit without going to the gym',
    'The real reason you can\'t build muscle',
    'This mobility drill fixed my knee pain',
    'What happens to your body when you walk 10k steps',
  ],
  Tech: [
    'This AI tool blew my mind',
    'The coding trick that saved me 10 hours',
    'Stop using Chrome — try this instead',
    '5 apps I use every day',
    'How I built this in 24 hours',
    'The future of AI is here',
    'Your password is probably compromised',
    'This tech hack will change your workflow',
    'Why every developer needs this tool',
    'I replaced my entire workflow with AI',
    'The VS Code extension you\'re missing',
    'Stop writing code — let AI do it for you',
    'This hidden feature changed how I work',
    'The truth about working in tech',
    'How I automated my entire job',
    '3 tools that made me 10x more productive',
    'Why your website is slow (and how to fix it)',
    'The best free alternative to paid software',
    'I built an app in one weekend — here\'s how',
    'This keyboard shortcut will save you hours',
  ],
  Finance: [
    'The investing mistake 90% make',
    'How I saved $10K in 6 months',
    'This money hack changed everything',
    '3 stocks I\'m watching this week',
    'The truth about crypto in 2026',
    'Why your 401K isn\'t enough',
    'Budgeting doesn\'t have to suck',
    'How to start investing with $100',
    'The debt payoff method that works',
    'I retired at 30 using this strategy',
    'The 50/30/20 rule explained simply',
    'Why you\'re broke (and how to fix it)',
    'This one habit made me wealthy',
    'The truth about side hustles',
    'How to negotiate your salary like a pro',
    'Passive income streams that actually work',
    'The credit card hack most people don\'t know',
    'Why rent is wasting your money',
    'How I turned $500 into $50,000',
    'The tax write-off you\'re missing',
  ],
  Entertainment: [
    'This movie twist broke my brain',
    'The best shows to binge this weekend',
    'Never watch a bad movie again',
    '5 songs that changed my life',
    'The most underrated content right now',
    'Why this trend is taking over',
    'You missed this detail in your favorite show',
    'The creator behind the viral moment',
    'This challenge is harder than it looks',
    'I watched every Marvel movie in a week',
    'The scene that made me cry every time',
    'This deleted scene changes everything',
    'The most satisfying endings in film history',
    'Why this song went viral on TikTok',
    'The actor you didn\'t recognize in this movie',
    'This fan theory actually makes sense',
    'The worst movie I\'ve ever seen (and why you should watch it)',
    'How this creator went from 0 to 1M followers',
    'The most controversial episode ever',
    'Why practical effects are better than CGI',
  ],
  Beauty: [
    'The skincare mistake aging you',
    'This $10 product works better than luxury',
    'My 3-step morning routine',
    'The makeup hack that saves 20 minutes',
    'Why dermatologists recommend this',
    'Clean beauty brands that actually work',
    'Your hair routine is damaging it',
    'The product I swear by',
    'How to build a capsule makeup kit',
    'I stopped washing my face for a month',
    'The sunscreen everyone should use',
    'This ingredient changed my skin',
    'Drugstore vs high-end — the honest truth',
    'My nighttime routine for glowing skin',
    'The one brush you actually need',
    'How to find your perfect foundation shade',
    'This hair tool is worth every penny',
    'The lip color that suits everyone',
    'Why you should double cleanse',
    'The best-kept secret in Korean skincare',
  ],
  Food: [
    'This recipe is better than takeout',
    'I cooked for 30 days on a $50 budget',
    'The 5-ingredient meal that saved my week',
    'Why restaurant food tastes better (and how to fix it)',
    'This kitchen gadget is worth it',
    'The one knife every cook needs',
    'How to meal prep like a pro',
    'The pasta dish that takes 10 minutes',
    'I tried every viral recipe — these 3 are keepers',
    'The secret ingredient chefs won\'t tell you',
    'This breakfast changed my mornings',
    'How to make restaurant-quality pizza at home',
    'The perfect steak every time',
    'Why your bread isn\'t rising (and how to fix it)',
    'One-pot meals that taste gourmet',
    'The dessert that looks hard but is actually easy',
    'How to chop an onion like a chef',
    'This sauce goes with everything',
    'The healthiest fast food orders',
    'My grandmother\'s recipe that always gets compliments',
  ],
  Travel: [
    'This hidden gem is better than Paris',
    'How I traveled for 6 months on $5000',
    'The packing mistake 90% of travelers make',
    'This city will surprise you',
    'Why you should travel solo at least once',
    'The travel hack that saved me $1000',
    '3 destinations that look expensive but aren\'t',
    'This airline hack will save you money',
    'The most underrated country I\'ve visited',
    'What nobody tells you about backpacking',
    'The best time to visit popular destinations',
    'How to avoid tourist traps',
    'This travel insurance saved me thousands',
    'The hostel that changed how I travel',
    'Why slow travel is better than rushing',
    'The photography tip every traveler needs',
    'How I found $50 flights everywhere',
    'The safest destinations for solo female travelers',
    'This app made my trip 10x better',
    'Why you should visit during off-season',
  ],
  Education: [
    'The study technique that doubled my grades',
    'How I learned a language in 3 months',
    'This memory trick changed everything',
    'Why the 80/20 rule applies to learning',
    'The course that actually taught me something',
    'How to read 50 books a year',
    'This learning method is backed by science',
    'Why taking notes by hand is better',
    'The skill everyone should learn in 2026',
    'How I went from failing to straight As',
    'The study schedule that actually works',
    'Why you forget everything you learn (and how to fix it)',
    'This app made learning fun again',
    'The most useful thing I learned online',
    'How to focus for 4 hours straight',
    'The Pomodoro technique explained',
    'Why teaching others is the best way to learn',
    'The book that changed how I think',
    'How to learn anything in 20 hours',
    'This YouTube channel taught me more than school',
  ],
  Gaming: [
    'This game is incredibly underrated',
    'The strategy that got me to rank #1',
    'Stop making this noob mistake',
    'Why this game is still popular after 5 years',
    'The boss fight that took me 50 attempts',
    'This setting will improve your aim instantly',
    'The most satisfying gaming moments',
    'Why indie games are better than AAA',
    'This hidden level blew my mind',
    'How I built an insane base in 24 hours',
    'The weapon everyone is sleeping on',
    'Why competitive gaming changed my life',
    'The speedrun technique that broke the game',
    'This game has the best soundtrack ever',
    'How to win more matches with this one trick',
    'The most toxic gaming community (and why I love it)',
    'Why retro games are making a comeback',
    'This game mechanic is genius',
    'The gaming setup that changed everything',
    'I played the hardest game ever made',
  ],
  Motivation: [
    'The mindset shift that changed my life',
    'Why you\'re not reaching your goals',
    'This habit will change everything',
    'The truth about motivation',
    'Why discipline beats motivation every time',
    'How I stopped procrastinating',
    'The morning routine that changed my life',
    'Why you should start before you\'re ready',
    'This one belief is holding you back',
    'The power of showing up every day',
    'How I overcame my biggest fear',
    'The 5-second rule that works',
    'Why failure is actually a good thing',
    'The person you become matters more than the goal',
    'How to build unshakeable confidence',
    'The compound effect of small habits',
    'Why comparison is the thief of joy',
    'The art of letting go',
    'How to find your purpose',
    'The best advice I ever received',
  ],
}

const defaultHooks = [
  'You\'ve been doing it wrong this whole time',
  'The #1 mistake 90% of people make',
  'Stop scrolling — this changes everything',
  'I tried this for 7 days and couldn\'t believe it',
  'The secret technique nobody talks about',
  'Why experts won\'t tell you this',
  'This one trick changed my life',
  'What they don\'t want you to know',
  'The truth nobody talks about',
  '3 signs you\'re doing it right',
  'The exact method I used to go viral',
  'How I got 1M views with this simple hack',
  'Forget everything you know',
  'The science behind why this works',
  'Your audience needs to hear this',
  'The one thing I wish I knew sooner',
  'This is the most important video I\'ve made',
  'Why everyone is talking about this',
  'The simple habit that changed everything',
  'How I finally figured this out',
]

const descriptionTemplates = [
  'In this clip, I break down the exact strategy that took me from 0 to results. Whether you\'re just starting out or you\'ve been at it for a while, these insights will transform how you think about it. Stick around till the end — the game-changing tip is worth it.',
  'This is hands down the most requested topic. I\'m sharing the complete framework that helped me get real results. Save this one — you\'ll want to come back to these steps later.',
  'After months of testing and tweaking, I finally cracked the code. Here\'s everything you need to know in under 60 seconds. Tag someone who needs to see this.',
  'The algorithm shifted again, and most people are getting it wrong. Here\'s what\'s actually working right now. Follow along for more real-talk insights.',
  'This clip breaks down a system that has helped hundreds of people get results. Step 3 is the one almost everyone overlooks, but honestly? That\'s where the real magic happens.',
  'Stop scrolling for a sec and take notes. This is the exact blueprint I followed. Save it, implement it, and come back to thank me later.',
  'I spent months figuring this out so you don\'t have to. The best part? It\'s simpler than you think. Watch till the end for the full breakdown.',
  'This changed the game for me, and I think it\'ll do the same for you. Quick tip: the middle part is where everything clicks. Don\'t skip it.',
  'Everybody talks about the what, but nobody talks about the how. So here it is — the complete how, step by step. No fluff, just what works.',
  'I wish someone had shown me this years ago. Would\'ve saved me so much time and money. Share this with a friend who\'s just getting started.',
  'This is one of those things that sounds too good to be true — until you try it. I was skeptical too. Here\'s what happened when I actually gave it a shot.',
  'Breaking down the strategy that doubled my results in half the time. The secret? It\'s not about working harder. Watch and learn.',
  'I get asked about this literally every day. So here\'s the honest, unfiltered breakdown. No gatekeeping here.',
  'This might be controversial, but someone has to say it. Here\'s why the conventional wisdom is wrong, and what to do instead.',
  'Three things I changed that made all the difference. Number 2 is the one most people get wrong, but it\'s the easiest to fix.',
]

const captionTemplates = [
  'This one\'s been sitting in my drafts for a while, but I think you\'re ready for it. Drop a comment if this hits home.',
  'Someone asked me about this the other day and I realized I never properly explained it. Here\'s my take.',
  'Not gonna lie, this took me way too long to figure out. Hope it saves you the headache. Save this for later!',
  'Been getting a lot of DMs about this, so here you go. Let me know what you think in the comments.',
  'Honestly wish someone had told me this sooner. Share this with someone who needs to hear it today.',
  'This is one of those things that seems obvious once you see it, but most people never do. Mind-blowing stuff.',
  'I\'ve been testing this for the past month and the results are actually insane. Here\'s the breakdown.',
  'If you take nothing else from my content, let it be this. Game-changer.',
  'Real talk: I was skeptical too. But after trying it for myself? Completely changed my perspective.',
  'This is the kind of advice I wish I had when I was starting out. Hope it helps you skip the struggle.',
  'I don\'t normally post stuff like this, but this one felt too important not to share.',
  'Tag a friend who needs to hear this. Seriously. This could be the push they need.',
  'Took me years to learn this. You can learn it in 30 seconds. Life\'s funny like that.',
  'The more I think about this, the more I realize how many people get it wrong. Let\'s fix that.',
  'This is your sign to finally make that change you\'ve been putting off. You\'ve got this.',
  'Dropping this here because I know at least one person needs to hear it today. That person might be you.',
  'I\'ve been sitting on this for weeks. Decided to just put it out there. Let me know your thoughts.',
  'It\'s the simple things that make the biggest difference. This changed everything for me.',
  'If you\'re on the fence about this, let me push you off. In a good way. Trust me.',
  'This is the kind of content I wish existed when I was figuring things out. Making it so you don\'t have to struggle like I did.',
]

const hashtagSets = [
  ['#viral', '#trending', '#fyp', '#explore', '#shorts', '#reels', '#video', '#content', '#trendingaudio', '#foryou', '#explorepage', '#creator', '#grow', '#new', '#mustwatch', '#instareels'],
  ['#motivation', '#success', '#inspiration', '#goals', '#tips', '#hacks', '#howto', '#guide', '#expert', '#results', '#transformation', '#tipsandtricks', '#pro', '#winning', '#growth', '#mindset'],
  ['#viralvideo', '#trendingnow', '#watchthis', '#dailycontent', '#contentcreator', '#influencer', '#socialmedia', '#digitalcreator', '#newvideo', '#subscribe', '#likesharecomment', '#goforit'],
]

const seoTitleTemplates = [
  'How to [action] in [timeframe]',
  '[number] [topic] Tips That Actually Work',
  'The Ultimate [topic] Guide for Beginners',
  'I Tried [method] — Here\'s What Happened',
  'Why Your [topic] Approach Is Wrong',
  'This [topic] Hack Will Save You Time',
  'The Secret to [result] Revealed',
  'How I Got [result] With This Simple Method',
  'Stop [badHabit] — Do This Instead',
  'The [topic] Trick Nobody Talks About',
  'What Nobody Tells You About [topic]',
  'This Is the Best [topic] Advice You\'ll Hear',
  'I Wish I Knew This [topic] Hack Sooner',
  'Why Everyone Is Switching to [method]',
  'The [timeframe] [topic] Challenge That Works',
  'My [number]-Step [topic] Routine',
  'The Real Reason Your [topic] Isn\'t Working',
  'How to Master [topic] in [timeframe]',
  'The Only [topic] Video You Need to Watch',
  '[number] Things I Wish I Knew About [topic]',
]

const nicheActions: Record<string, string[]> = {
  Fitness: ['build muscle fast', 'lose belly fat', 'get in shape', 'train smarter', 'transform your body', 'start working out', 'get stronger', 'burn fat', 'build a routine'],
  Tech: ['code faster', 'build your first app', 'learn AI', 'optimize your workflow', 'automate your work', 'learn to program', 'use AI tools', 'secure your data', 'build a website'],
  Finance: ['save money daily', 'invest wisely', 'build wealth', 'budget better', 'make money online', 'retire early', 'pay off debt', 'grow your income', 'manage your money'],
  Beauty: ['upgrade your routine', 'glow up naturally', 'apply makeup perfectly', 'care for your skin', 'style your hair', 'build a skincare routine', 'find your style', 'look younger', 'save money on beauty'],
  Entertainment: ['find your next binge', 'discover hidden gems', 'enjoy content better', 'stay entertained', 'find new music', 'watch better movies', 'go viral', 'make content', 'grow your audience'],
  Food: ['cook healthier', 'meal prep like a pro', 'make restaurant food at home', 'eat better daily', 'save money cooking', 'cook faster', 'bake like a pro', 'eat well on a budget', 'prepare meals ahead'],
  Travel: ['travel on a budget', 'plan the perfect trip', 'explore like a local', 'save money traveling', 'pack smarter', 'find cheap flights', 'travel solo', 'document your journey', 'stay safe traveling'],
  Education: ['learn anything faster', 'study more effectively', 'master new skills', 'retain more info', 'focus better', 'ace your exams', 'learn a language', 'read more books', 'think critically'],
  Gaming: ['dominate your lobbies', 'improve your aim', 'rank up faster', 'win more games', 'build better', 'stream like a pro', 'get more kills', 'climb the ladder', 'master your main'],
  Motivation: ['stay motivated daily', 'build better habits', 'achieve your goals', 'crush procrastination', 'change your life', 'build confidence', 'find purpose', 'grow as a person', 'overcome fear'],
}

const nicheBadHabits: Record<string, string[]> = {
  Fitness: ['skipping leg day', 'using bad form', 'overtraining', 'eating junk', 'skipping warmups', 'doing the same routine', 'ignoring recovery'],
  Tech: ['using outdated tools', 'writing bad code', 'ignoring security', 'skipping documentation', 'copy-pasting blindly', 'using too many tools'],
  Finance: ['ignoring your budget', 'living paycheck to paycheck', 'using credit cards wrong', 'avoiding investments', 'buying things you don\'t need'],
  Beauty: ['sleeping with makeup on', 'using wrong products', 'over-exfoliating', 'skipping sunscreen', 'using dirty tools', 'following trends blindly'],
  Entertainment: ['watching bad movies', 'scrolling mindlessly', 'missing hidden gems', 'ignoring indie content', 'binge-watching everything'],
  Food: ['eating out too much', 'overcooking your food', 'using dull knives', 'ignoring seasoning', 'not prepping ahead', 'wasting ingredients'],
  Travel: ['overpacking', 'following tourist traps', 'ignoring travel insurance', 'booking last minute', 'staying in your comfort zone', 'overspending'],
  Education: ['cramming before exams', 'passive reading', 'multitasking while studying', 'ignoring rest', 'learning without practice'],
  Gaming: ['ignoring your team', 'tunneling too hard', 'not communicating', 'using bad settings', 'tilting after losses', 'ignoring the minimap'],
}

const nicheResults: Record<string, string[]> = {
  Fitness: ['a Beach Body', 'Six Pack Abs', 'More Energy', 'Better Posture', 'Real Results', 'Your Dream Physique'],
  Tech: ['a Promotion', 'Your First App', '10x Productivity', 'Better Code', 'More Clients', 'Dream Job'],
  Finance: ['Financial Freedom', 'Your First $10K', 'Passive Income', 'Early Retirement', 'Debt Freedom', 'Wealth'],
  Beauty: ['Glowing Skin', 'Perfect Makeup', 'Healthy Hair', 'Flawless Base', 'Natural Glow', 'Your Best Look'],
  Entertainment: ['Viral Fame', 'More Followers', 'Better Taste', 'Hidden Gems', 'Your Next Obsession'],
  Food: ['Restaurant Taste', 'Meal Prep Mastery', 'Better Health', 'More Savings', 'Chef Status', 'Perfect Dishes'],
  Travel: ['Cheaper Flights', 'Better Trips', 'More Adventures', 'Travel Freedom', 'Unforgettable Memories', 'Pro Traveler Status'],
  Education: ['Better Grades', 'New Skills', 'More Knowledge', 'Career Change', 'Expert Status', 'Lifelong Learning'],
  Gaming: ['Higher Rank', 'Better K/D', 'More Wins', 'Pro Status', 'Tournament Ready', 'Clutch Player'],
  Motivation: ['Your Best Self', 'More Confidence', 'Real Success', 'Inner Peace', 'Better Life', 'Fulfillment'],
}

const thumbnailBg = ['yellow', 'blue', 'red', 'neon green', 'purple', 'orange', 'pink', 'teal', 'coral', 'white', 'black', 'gradient']
const thumbnailTexts = ['SHOCKING', 'YOU NEED THIS', 'GAME CHANGER', 'STOP SCROLLING', 'LIFE HACK', 'MIND BLOWN', 'TRY THIS', 'WAIT TILL THE END', 'THIS CHANGES EVERYTHING', 'MOST PEOPLE MISS THIS', 'THE TRUTH', 'IT WORKS']
const thumbnailStyles = ['Bold text overlay', 'Split screen reaction', 'Before/after comparison', 'Text on solid background', 'Close-up face reaction', 'Arrow pointing to text', 'Number list', 'Question in big text', 'Circle highlight', 'Side-by-side comparison']

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
  for (const niche of niches) {
    for (const kw of niche.keywords) {
      if (lower.includes(kw)) return niche.name
    }
  }
  return pick(niches).name
}

function generateFallbackShortsForUrl(url: string, durationMinutes: number, removeWatermark: boolean) {
  const platform = extractDomain(url)
  const niche = detectNiche(url)
  const shortCount = Math.max(1, Math.floor(durationMinutes / 15))
  const shorts: any[] = []

  const actions = nicheActions[niche] || ['get better results', 'make progress', 'level up']
  const badHabits = nicheBadHabits[niche] || ['doing it wrong', 'wasting time', 'missing the point']
  const results = nicheResults[niche] || ['Amazing Results', 'Real Progress', 'Your Goals']
  const nicheHooksPool = nicheHooks[niche] || defaultHooks

  for (let i = 0; i < shortCount; i++) {
    const action = pick(actions)
    const badHabit = pick(badHabits)
    const result = pick(results)
    const timeframes = ['3 Days', '7 Days', '14 Days', '30 Days', '90 Days']
    const nums = ['3', '5', '7', '10', '12']
    const methods = ['The Simple System', 'The 3-Step Framework', 'The Proven Method', 'The Expert Approach', 'The Unconventional Way', 'The Science-Backed Method']

    const tmpl = seoTitleTemplates[i % seoTitleTemplates.length]
    const seoTitle = tmpl
      .replace('[action]', action)
      .replace('[timeframe]', pick(timeframes))
      .replace('[number]', pick(nums))
      .replace('[topic]', niche)
      .replace('[method]', pick(methods))
      .replace('[result]', result)
      .replace('[badHabit]', badHabit)

    const hooks = pickN(nicheHooksPool, 3)

    const description = pick(descriptionTemplates)
    const caption = pick(captionTemplates)

    const platformTag = `#${platform.toLowerCase()}`
    const nicheTag = `#${niche.toLowerCase().replace(/\s+/g, '')}`
    const topicTags = [
      `#${niche}Tips`,
      `#${niche}Life`,
      `#${niche}Hacks`,
      `#${niche}Community`,
      `#${niche}Journey`,
    ].map(t => t.toLowerCase().replace(/\s+/g, ''))

    const rawHashtags = [...new Set([
      ...pick(hashtagSets),
      platformTag,
      nicheTag,
      ...pickN(topicTags, 3),
      '#shorts',
      '#viralvideo',
      '#contentcreator',
    ])]
    const hashtags = pickN(rawHashtags, 12)

    const thumbnailIdea = `${pick(thumbnailStyles)} — ${pick(thumbnailBg)} background with "${pick(thumbnailTexts)}" text`

    shorts.push({
      sourceUrl: url,
      platform,
      niche,
      seoTitle,
      hooks,
      description,
      caption,
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

export async function generateShortsForUrl(url: string, durationMinutes: number, removeWatermark: boolean) {
  const platform = extractDomain(url)

  let aiAvailable = false
  try {
    aiAvailable = await checkOllamaAvailable()
  } catch {}

  const hasOpenAI = !!process.env.OPENAI_API_KEY

  if (!aiAvailable && !hasOpenAI) {
    return generateFallbackShortsForUrl(url, durationMinutes, removeWatermark)
  }

  const niche = detectNiche(url)
  const shortCount = Math.max(1, Math.floor(durationMinutes / 15))
  const shorts: any[] = []

  for (let i = 0; i < shortCount; i++) {
    try {
      const ai = await generateShortContent(url, platform, niche, i + 1, shortCount)
      shorts.push({
        sourceUrl: url,
        platform,
        niche,
        seoTitle: ai.seoTitle,
        hooks: ai.hooks,
        description: ai.description,
        caption: ai.caption,
        hashtags: ai.hashtags,
        thumbnailIdea: ai.thumbnailIdea,
        clipDuration: pick(shortDurations),
        sourceDuration: durationMinutes,
        totalShorts: shortCount,
        shortIndex: i + 1,
        watermarkRemoved: removeWatermark,
      })
    } catch {
      const fallback = generateFallbackShortsForUrl(url, durationMinutes, removeWatermark)
      shorts.push(fallback[i])
    }
  }

  return shorts
}

export function generateOptimalSchedule(count: number): string[] {
  const slots: string[] = []
  const now = new Date()
  const dayHours = [8, 11, 14, 17, 20, 22]

  for (let i = 0; i < count; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + Math.floor(i / dayHours.length))
    date.setHours(dayHours[i % dayHours.length], 15 + Math.floor(Math.random() * 30), 0, 0)
    slots.push(date.toISOString())
  }

  return slots
}
