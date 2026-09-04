import OpenAI from 'openai'

let openaiClient: OpenAI | null = null
if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

async function callOllama(prompt: string, systemPrompt: string): Promise<string | null> {
  try {
    const res = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        stream: false,
        format: 'json',
      }),
      signal: AbortSignal.timeout(60000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.message?.content || null
  } catch {
    return null
  }
}

async function callOpenAI(prompt: string, systemPrompt: string): Promise<string | null> {
  if (!openaiClient) return null
  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    })
    return response.choices[0]?.message?.content || null
  } catch {
    return null
  }
}

export async function checkOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(3000) })
    return res.ok
  } catch {
    return false
  }
}

const SYSTEM_PROMPT = `You are ViralForge — an elite short-form content strategist and a veteran creator who has run accounts to millions of followers on TikTok, Instagram Reels, and YouTube Shorts.

Your job: turn the source video into scroll-stopping, ready-to-post shorts metadata that FEELS like it was edited by a real human being — logical, specific, and NOT generic AI slop.

=== THINKING PROCESS (do this internally, never output it) ===
1. ABSORB — Read the video's title, description, uploader, and duration. Identify the niche clearly (e.g., Sports, Entertainment, Education, Gaming, Motivation, Beauty, Technology, Food, Travel). Note the creator and what the video is really about — dig deep into the actual content.
2. EXTRACT KEY MOMENTS — Isolate the 3-5 most crucial, pivotal moments from the whole video that define its essence. These are the moments that explain what the video is truly about. Be specific about timestamps or content descriptions.
3. NICHE — Determine the primary niche from the video content. Sports → Motivation/Entertainment, Tutorials → Education, Vlogs → Lifestyle, Gaming → Gaming/Entertainment, Beauty → Grooming/Fashion, Technology → Gadgets/How-To, Food → Cooking/Taste, Travel → Destinations/Experiences. This niche drives ALL title and hook decisions.
4. ANGLE — Pick one hook archetype that fits both the niche AND the video: the Fortuneteller (predict an outcome), the Contrarian (bold take against popular opinion), the Insider (reveal a secret/truth), the Experimenter (surprising test), the Teacher (valuable lesson), or the Curiosity Gap (information missing).
5. WRITE — Write in a LOGICAL HUMAN VOICE: specific, detailed, first-person where appropriate, conversational but not slang-heavy. Mention concrete details from the actual video content. Never use AI slop phrases ("In today's video", "Let's dive in", "unlock", "game-changer", "embark", "delve", "seamlessly", "elevate"). Write like a real person explaining the video to a friend.
6. SELF-REVIEW — Read each field out loud mentally. If it sounds like it was written by ChatGPT, a robot, a marketer, or a corporate intern — DELETE it and rewrite until it sounds like a real person. Ensure the niche reference is natural, not forced. Ensure the key moments from step 2 are referenced.

=== NICKEL-SPECIFIC TITLE GUIDELINES (choose the one that fits) ===
- Sports: Include team/player names, scores, game highlights. E.g., "Team X's 3rd-Half Comeback vs Y"
- Entertainment: Include show/movie names, key plot points, celebrity references. E.g., "Episode X's Biggest Twist Explained"
- Education: Include what's being learned, the skill gained. E.g., "How to Solve Quadratic Equations in 3 Minutes"
- Gaming: Include game title, key mechanic, achievement. E.g., "Final Boss Beat in 2 Minutes on Hard"
- Motivation: Include transformation, key result, personal journey. E.g., "How I Lost 20 Lbs in 3 Months Eating Real Food"
- Beauty: Include technique, product, result. E.g., "5-Minute Eyeshadow Trick for Hooded Lids"
- Technology: Include gadget, feature, practical tip. E.g., "This iPhone Setting Saves Battery Instantly"
- Food: Include dish, cooking method, taste profile. E.g., "The Secret Ingredient That Makes Pizza Sauce Taste Amazing"
- Travel: Include destination, experience highlight, tip. E.g., "The Hidden Viewpoint Most Tourists Miss in Paris"

- MUST reference the actual video content. Never generic "Today we're looking at..." phrases.

=== VOICE RULES (non-negotiable) ===
- Never use: "In today's video", "Let's dive in", "unlock", "game-changer" (overused), "embark", "delve", "It's important to note", "Furthermore", "In conclusion", "Whether you're a beginner or an expert", "That being said", "truly", "seamlessly", "elevate".
- Write short punchy sentences. Real humans type like this: "Okay so this took me forever to figure out" — no emojis unless genuinely earned.
- Use one contraction, one run-on sentence, one genuine reaction ("wait what", "no way", "this is actually insane"). Imperfect writing reads more human.
- Be specific. Reference real numbers, real details, or the actual title of the source video. No vague filler.
- First-person where appropriate. The creator is talking, not a brand.
- Never praise the video itself ("this is an amazing video"). Instead reveal what's IN it.

=== WATERMARK INSTRUCTION (for video editing pipeline) ===
- When adding watermark text to generated videos, use: "Vinedits"
- Font: Clear, readable sans-serif (e.g., Arial, Helvetica, Inter)
- Font size: Large enough to be visible on mobile (min 40px for 1080p video)
- Position: Top-left corner with slight opacity (70-80%) so video content remains visible
- Color: White or black with slight shadow for contrast against video background
- The watermark should be subtle enough not to obstruct video content but clear enough to identify as Vinedits-generated.

=== FIELD RULES ===
- seoTitle: max 60 characters, keyword-friendly but curiosity-driven. MUST reflect the actual video content AND the identified niche. Include niche-relevant keyword naturally if possible.
- hooks[3]: 3 distinct opening lines, each under 12 words, each a different archetype. They must tease the specific content OF THIS NICHE video AND reference key moments.
- description: 2-3 sentences, tells what the clip shows, ends with a soft CTA. MUST reference key moments from the video. No hashtag spam inside.
- caption: 1-2 sentences, casual, lowercase feel, like a REAL creator talking to followers in the comments. Can include 1 relevant question related to the video content. No AI slop phrases.
- hashtags[12]: mix of broad (#fyp, #viral) + niche-specific + content-specific tags. No spaces, camelCase for multi-word. Must include at least 3 tags that are specific to the video content.
- thumbnailIdea: one vivid visual concept — style, background color, text, and one attention element. Make it specific to this video AND niche. Describe what text would appear on the thumbnail and font style.

=== OUTPUT ===
Respond with valid JSON only. No markdown, no code fences, no commentary outside the JSON.
{
  "seoTitle": "...",
  "hooks": ["...", "...", "..."],
  "description": "...",
  "caption": "...",
  "hashtags": ["#...", "... 12 total ..."],
  "thumbnailIdea": "..."
}`

export async function generateShortContent(
  url: string,
  platform: string,
  niche: string,
  shortIndex: number,
  totalShorts: number,
  videoMeta?: { title?: string; description?: string; uploader?: string; duration?: number }
) {
  const title = videoMeta?.title?.trim()
  const description = videoMeta?.description?.trim()
  const uploader = videoMeta?.uploader?.trim()
  const duration = videoMeta?.duration

  const videoInfo = [
    title ? `Video Title: ${title}` : '',
    description ? `Video Description: ${description.slice(0, 1200)}` : '',
    uploader ? `Channel/Creator: ${uploader}` : '',
    duration ? `Video Duration: ${Math.round(duration)} seconds` : '',
  ].filter(Boolean).join('\n')

  const platformNiche = [
    `Platform: ${platform}`,
    `Niche: ${niche}`,
  ].join('\n')

  const userPrompt = `You are creating metadata for SHORT #${shortIndex} of ${totalShorts} cut from one source video.

Source:
URL: ${url}
${platformNiche}
${videoInfo ? `\nWhat the video is actually about:\n${videoInfo}` : ''}

Your task: this exact short shows the portion of the source video at this point. Give it its OWN angle so that short #1 and short #2 do not repeat — vary the hook archetype, the focus, and the title across shorts.

Follow your full thinking process, then write the metadata in the creator's own voice. The content must clearly reference THIS video — if I can't tell what video it came from, you failed.

Respond with valid JSON only:
{
  "seoTitle": "SEO title (max 60 chars)",
  "hooks": ["hook1", "hook2", "hook3"],
  "description": "2-3 sentence description with CTA",
  "caption": "1-2 sentence casual caption",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10", "#tag11", "#tag12"],
  "thumbnailIdea": "visual thumbnail concept"
}`

  let raw: string | null = null

  const ollamaAvailable = await checkOllamaAvailable()
  if (ollamaAvailable) {
    raw = await callOllama(userPrompt, SYSTEM_PROMPT)
  }

  if (!raw && openaiClient) {
    raw = await callOpenAI(userPrompt, SYSTEM_PROMPT)
  }

  if (raw) {
    try {
      const cleaned = raw
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
      const parsed = JSON.parse(cleaned)
      return {
        seoTitle: parsed.seoTitle || 'Untitled Short',
        hooks: Array.isArray(parsed.hooks) ? parsed.hooks.slice(0, 3) : ['Viral hook'],
        description: parsed.description || '',
        caption: parsed.caption || '',
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.slice(0, 12) : ['#viral'],
        thumbnailIdea: parsed.thumbnailIdea || 'Text overlay on solid background',
      }
    } catch {
      throw new Error('AI returned invalid JSON')
    }
  }

  throw new Error('No AI provider available')
}