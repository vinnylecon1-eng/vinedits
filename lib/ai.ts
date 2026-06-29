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
      signal: AbortSignal.timeout(30000),
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
      temperature: 0.8,
      max_tokens: 1000,
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

export async function generateShortContent(
  url: string,
  platform: string,
  niche: string,
  shortIndex: number,
  totalShorts: number
) {
  const systemPrompt = `You are an expert social media content strategist and viral video creator.
You specialize in short-form video content for Instagram Reels, TikTok, and YouTube Shorts.
Generate authentic, human-sounding content that doesn't sound AI-generated.
Write like a real creator — conversational, relatable, with personality.
Always respond with valid JSON only, no markdown, no code fences.`

  const userPrompt = `Generate metadata for short #${shortIndex} of ${totalShorts} based on this video.

URL: ${url}
Platform: ${platform}
Niche: ${niche}

Respond with valid JSON:
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
    raw = await callOllama(userPrompt, systemPrompt)
  }

  if (!raw && openaiClient) {
    raw = await callOpenAI(userPrompt, systemPrompt)
  }

  if (raw) {
    try {
      const parsed = JSON.parse(raw)
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
