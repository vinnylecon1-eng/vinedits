export const niches = {
  Fitness: {
    primaryTheme: 'Fitness',
    subThemes: ['Weight Training', 'Cardio', 'Flexibility', 'Nutrition'],
    uniqueAngle: 'Science-backed fitness for busy professionals',
    audience: { ageRange: '25-40', gender: '55% Male / 45% Female', location: 'USA, UK, Canada', topInterests: ['Health', 'Nutrition', 'Self-improvement', 'Sports'] },
    optimalPostingTimes: { monday: ['7am', '12pm', '6pm'], tuesday: ['7am', '6pm', '8pm'], wednesday: ['7am', '12pm', '6pm'], thursday: ['7am', '6pm', '8pm'], friday: ['7am', '12pm', '4pm'], saturday: ['9am', '11am', '2pm'], sunday: ['10am', '1pm', '5pm'] },
    contentPillars: ['Workout Tutorials', 'Nutrition Tips', 'Motivation', 'Science Explained'],
    competitors: ['@fitnessinfluencer', '@gymlife', '@healthcoach'],
    psychographics: ['Goal-oriented', 'Disciplined', 'Health-conscious', 'Early adopters'],
  },
  Tech: {
    primaryTheme: 'Technology',
    subThemes: ['AI & ML', 'Software Development', 'Gadgets', 'Cybersecurity'],
    uniqueAngle: 'Making complex tech simple for everyone',
    audience: { ageRange: '20-35', gender: '70% Male / 30% Female', location: 'USA, India, UK', topInterests: ['Programming', 'AI', 'Gaming', 'Startups'] },
    optimalPostingTimes: { monday: ['8am', '1pm', '7pm'], tuesday: ['9am', '2pm', '8pm'], wednesday: ['8am', '1pm', '7pm'], thursday: ['9am', '2pm', '8pm'], friday: ['8am', '12pm', '5pm'], saturday: ['10am', '1pm', '4pm'], sunday: ['11am', '2pm', '6pm'] },
    contentPillars: ['Tech Reviews', 'Tutorials', 'Industry News', 'Career Tips'],
    competitors: ['@techreviewer', '@coderlife', '@gadgetgeek'],
    psychographics: ['Curious', 'Analytical', 'Early adopters', 'Problem-solvers'],
  },
  Finance: {
    primaryTheme: 'Finance',
    subThemes: ['Investing', 'Personal Finance', 'Cryptocurrency', 'Real Estate'],
    uniqueAngle: 'Wealth building strategies for the modern age',
    audience: { ageRange: '25-50', gender: '60% Male / 40% Female', location: 'USA, UK, Australia', topInterests: ['Investing', 'Stocks', 'Real Estate', 'Entrepreneurship'] },
    optimalPostingTimes: { monday: ['7am', '12pm', '6pm'], tuesday: ['7am', '6pm', '8pm'], wednesday: ['7am', '12pm', '6pm'], thursday: ['7am', '6pm', '8pm'], friday: ['7am', '12pm', '3pm'], saturday: ['9am', '11am', '1pm'], sunday: ['10am', '12pm', '4pm'] },
    contentPillars: ['Investment Tips', 'Budgeting', 'Market Analysis', 'Wealth Mindset'],
    competitors: ['@financeguru', '@moneytips', '@investorlife'],
    psychographics: ['Ambitious', 'Risk-aware', 'Future-oriented', 'Detail-oriented'],
  },
  Entertainment: {
    primaryTheme: 'Entertainment',
    subThemes: ['Movies', 'Music', 'Gaming', 'Pop Culture'],
    uniqueAngle: 'Behind the scenes of your favorite entertainment',
    audience: { ageRange: '16-35', gender: '50% Male / 50% Female', location: 'Global', topInterests: ['Movies', 'Music', 'Gaming', 'Celebrities'] },
    optimalPostingTimes: { monday: ['12pm', '5pm', '8pm'], tuesday: ['12pm', '6pm', '9pm'], wednesday: ['12pm', '5pm', '8pm'], thursday: ['12pm', '6pm', '9pm'], friday: ['11am', '3pm', '7pm'], saturday: ['10am', '2pm', '8pm'], sunday: ['11am', '3pm', '7pm'] },
    contentPillars: ['Reviews', 'Trivia', 'News', 'Fan Theories'],
    competitors: ['@popculturefan', '@moviebuff', '@gamernation'],
    psychographics: ['Creative', 'Social', 'Trend-following', 'Nostalgic'],
  },
  Beauty: {
    primaryTheme: 'Beauty',
    subThemes: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance'],
    uniqueAngle: 'Clean beauty with visible results',
    audience: { ageRange: '18-40', gender: '85% Female / 15% Male', location: 'USA, UK, France', topInterests: ['Skincare', 'Makeup', 'Fashion', 'Wellness'] },
    optimalPostingTimes: { monday: ['9am', '1pm', '7pm'], tuesday: ['10am', '2pm', '8pm'], wednesday: ['9am', '1pm', '7pm'], thursday: ['10am', '2pm', '8pm'], friday: ['9am', '12pm', '5pm'], saturday: ['10am', '1pm', '4pm'], sunday: ['11am', '2pm', '6pm'] },
    contentPillars: ['Tutorials', 'Product Reviews', 'Routine Guides', 'Trends'],
    competitors: ['@beautyguru', '@skincareexpert', '@makeupartist'],
    psychographics: ['Aesthetic-driven', 'Detail-oriented', 'Trend-conscious', 'Quality-focused'],
  },
}

export const hookArchetypes = [
  { title: 'The Fortuneteller', description: 'Predict a future outcome or trend that grabs attention', archetype: 'Fortuneteller' },
  { title: 'The Experimenter', description: 'Challenge a common belief with a surprising experiment', archetype: 'Experimenter' },
  { title: 'The Teacher', description: 'Teach a valuable lesson in under 60 seconds', archetype: 'Teacher' },
  { title: 'The Magician', description: 'Show something seemingly impossible', archetype: 'Magician' },
  { title: 'The Investigator', description: 'Reveal a hidden truth or insider knowledge', archetype: 'Investigator' },
  { title: 'The Contrarian', description: 'Go against popular opinion with a bold stance', archetype: 'Contrarian' },
]

export const nicheNames = Object.keys(niches)
export const platforms = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'LinkedIn']
