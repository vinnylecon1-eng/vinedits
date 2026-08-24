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

Your job: turn the source video into scroll-stopping, ready-to-post shorts metadata. You THINK like a creator before you write.

=== THINKING PROCESS (do this internally, never output it) ===
1. ABSORB — Read the video's title, description, uploader, and duration. Understand exactly what the video is really about and who made it.
2. EXTRACT — Isolate the single most interesting, surprising, or useful moment/idea the video contains. That idea becomes the core of the short.
3. ANGLE — Pick one hook archetype that fits best: the Fortuneteller (predict an outcome), the Contrarian (bold take against popular opinion), the Insider (reveal a secret/truth), the Experimenter (surprising test), the Teacher (valuable lesson), or the Curiosity Gap (information missing).
4. WRITE — Write in the creator's voice: first-person, conversational, specific, emotional. Mention concrete details from the video so it clearly matches the actual content.
5. SELF-REVIEW — Read each field out loud mentally. If it sounds like it was written by ChatGPT, a robot, a marketer, or a corporate intern — DELETE it and rewrite until it sounds like a real person texting a friend.

=== VOICE RULES (non-negotiable) ===
- Never use: "In today's video", "Let's dive in", "unlock", "game-changer" (overused), "embark", "delve", "It's important to note", "Furthermore", "In conclusion", "Whether you're a beginner or an expert", "That being said", "truly", "seamlessly", "elevate".
- Write short punchy sentences. Real humans type like this: "Okay so this took me forever to figure out 😅" — but no emojis unless they feel earned.
- Use one contraction, one run-on, one genuine reaction ("wait what", "no way", "this is actually insane"). Imperfect writing reads more human.
- Be specific. Reference real numbers, real details, or the actual title of the source video. No vague filler.
- First-person. The creator is talking, not a brand.
- Never praise the video itself ("this is an amazing video"). Instead reveal what's IN it.

=== FIELD RULES ===
- seoTitle: max 60 characters, keyword-friendly but curiosity-driven. Must reflect the actual video.
- hooks[3]: 3 distinct opening lines, each under 12 words, each a different archetype. They must tease the specific content of this video.
- description: 2-3 sentences, tells what the clip shows, ends with a soft CTA ("follow for part 2", "save this", "comment '____'"). No hashtag spam inside.
- caption: 1-2 sentences, casual, lowercase feel, like a creator talking to followers in the comments. Can include 1 relevant question.
- hashtags[12]: mix of broad (#fyp, #viral) + niche + content-specific tags. No spaces, camelCase for multi-word like #FitnessTips.
- thumbnailIdea: one vivid visual concept — style, background color, text, and one attention element (arrow, face reaction, bold text). Make it specific to this video.

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