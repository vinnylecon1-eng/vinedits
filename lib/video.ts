import { execFile, execFileSync } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execFileAsync = promisify(execFile)

const VIDEOS_DIR = path.join(process.cwd(), 'videos')
const DOWNLOADS_DIR = path.join(VIDEOS_DIR, 'downloads')
const CLIPS_DIR = path.join(VIDEOS_DIR, 'clips')

function tryResolve(...candidates: string[]): string | null {
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return candidate
      const resolved = execFileSync('where', [candidate], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      const first = resolved.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)[0]
      if (first && fs.existsSync(first)) return first
    } catch {
      continue
    }
  }
  return null
}

function resolveFfmpeg(): string | null {
  const npmBinary = path.join(process.cwd(), 'node_modules', '@ffmpeg-installer', 'win32-x64', 'ffmpeg.exe')
  return tryResolve(npmBinary, path.join(process.cwd(), 'ffmpeg.exe'), 'ffmpeg.exe', 'ffmpeg')
}

function resolveYtDlp(): string | null {
  return tryResolve(path.join(process.cwd(), 'yt-dlp.exe'), 'yt-dlp.exe', 'yt-dlp')
}

export function getVideoTools(): { ffmpeg: string | null; ytDlp: string | null } {
  return { ffmpeg: resolveFfmpeg(), ytDlp: resolveYtDlp() }
}

export function videoToolsAvailable(): boolean {
  const { ffmpeg, ytDlp } = getVideoTools()
  return !!(ffmpeg && ytDlp)
}

function ensureDirs() {
  if (!fs.existsSync(VIDEOS_DIR)) fs.mkdirSync(VIDEOS_DIR, { recursive: true })
  if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR, { recursive: true })
  if (!fs.existsSync(CLIPS_DIR)) fs.mkdirSync(CLIPS_DIR, { recursive: true })
}

export function getClipPath(shortId: string): string {
  return path.join(CLIPS_DIR, `${shortId}.mp4`)
}

export function clipExists(shortId: string): boolean {
  return fs.existsSync(getClipPath(shortId))
}

export interface VideoMetadata {
  title: string
  description: string
  uploader: string
  duration: number
  id?: string
}

export async function getVideoMetadata(url: string): Promise<VideoMetadata | null> {
  const { ytDlp } = getVideoTools()
  if (!ytDlp) return null

  try {
    const { stdout } = await execFileAsync(ytDlp, [
      url,
      '--dump-json',
      '--no-playlist',
      '--skip-download',
      '--no-warnings',
      '--quiet',
    ], { timeout: 60000, maxBuffer: 20 * 1024 * 1024 })

    const raw = stdout.trim()
    const line = raw.split(/\r?\n/).filter((l) => l.trim()).pop() || ''
    if (!line) return null
    const data = JSON.parse(line)
    return {
      title: String(data.title || ''),
      description: String(data.description || ''),
      uploader: String(data.uploader || data.channel || data.uploader_id || ''),
      duration: typeof data.duration === 'number' ? data.duration : 0,
      id: data.id ? String(data.id) : undefined,
    }
  } catch {
    return null
  }
}

export async function downloadVideo(url: string): Promise<string> {
  ensureDirs()

  const { ffmpeg, ytDlp } = getVideoTools()
  if (!ytDlp) throw new Error('yt-dlp is not installed. Download yt-dlp.exe into the project root to enable video downloads.')
  if (!ffmpeg) throw new Error('ffmpeg is not available')

  for (const file of fs.readdirSync(DOWNLOADS_DIR)) {
    try { fs.unlinkSync(path.join(DOWNLOADS_DIR, file)) } catch {}
  }

  const outputTemplate = path.join(DOWNLOADS_DIR, '%(id)s.%(ext)s')

  try {
    await execFileAsync(ytDlp, [
      url, '-o', outputTemplate,
      '--no-playlist',
      '--max-filesize', '200M',
      '--format', 'bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]',
      '--merge-output-format', 'mp4',
      '--ffmpeg-location', path.dirname(ffmpeg),
      '--quiet', '--no-warnings',
    ], { timeout: 300000, maxBuffer: 10 * 1024 * 1024 })

    const files = fs.readdirSync(DOWNLOADS_DIR)
    const latest = files
      .filter(f => f.endsWith('.mp4') || f.endsWith('.webm') || f.endsWith('.mkv'))
      .map((f) => path.join(DOWNLOADS_DIR, f))
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0]

    if (!latest) throw new Error('No video file found after download')

    const videoPath = latest

    if (!videoPath.endsWith('.mp4')) {
      const mp4Path = videoPath.replace(/\.\w+$/, '.mp4')
      await execFileAsync(ffmpeg, [
        '-i', videoPath,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-y', mp4Path,
      ], { timeout: 60000 })
      try { fs.unlinkSync(videoPath) } catch {}
      return mp4Path
    }

    return videoPath
  } catch (err: any) {
    throw new Error(`Download failed: ${err.message}`)
  }
}

export async function getVideoDuration(videoPath: string): Promise<number> {
  const { ffmpeg } = getVideoTools()
  if (!ffmpeg) return 0

  return new Promise((resolve) => {
    execFile(ffmpeg, ['-i', videoPath], { timeout: 30000 }, (err, stdout, stderr) => {
      const raw = stderr || (err && (err as any).stderr) || ''
      const match = raw.match(/Duration: (\d+):(\d+):(\d+)\.(\d+)/)
      if (match) {
        const hours = parseInt(match[1])
        const minutes = parseInt(match[2])
        const seconds = parseInt(match[3])
        resolve(hours * 3600 + minutes * 60 + seconds)
      } else {
        resolve(0)
      }
    })
  })
}

export async function splitIntoClips(
  videoPath: string,
  shortCount: number,
  intervalSec: number,
  removeWatermark: boolean = false
): Promise<{ clips: string[]; count: number }> {
  ensureDirs()
  const { ffmpeg } = getVideoTools()
  if (!ffmpeg) return { clips: [], count: 0 }

  const clips: string[] = []

  for (let i = 0; i < shortCount; i++) {
    const startTime = i * intervalSec
    const outputPath = path.join(CLIPS_DIR, `clip_${Date.now()}_${i}.mp4`)

    const args = [
      '-ss', startTime.toString(),
      '-i', videoPath,
      '-t', intervalSec.toString(),
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-c:a', 'aac',
      '-movflags', '+faststart',
      '-y', outputPath,
    ]

    if (removeWatermark) {
      args.splice(-2, 0, '-vf', 'delogo=x=10:y=10:w=120:h=60')
    }

    try {
      await execFileAsync(ffmpeg, args, { timeout: 120000 })
      if (fs.existsSync(outputPath)) {
        clips.push(outputPath)
      }
    } catch {
      continue
    }
  }

  return { clips, count: clips.length }
}

export async function cleanupVideo(videoPath: string): Promise<void> {
  try { if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath) } catch {}
}

export function cleanupAllClips(): void {
  if (!fs.existsSync(CLIPS_DIR)) return
  const files = fs.readdirSync(CLIPS_DIR)
  for (const file of files) {
    try { fs.unlinkSync(path.join(CLIPS_DIR, file)) } catch {}
  }
}

export function cleanupDownloads(): void {
  if (!fs.existsSync(DOWNLOADS_DIR)) return
  const files = fs.readdirSync(DOWNLOADS_DIR)
  for (const file of files) {
    try { fs.unlinkSync(path.join(DOWNLOADS_DIR, file)) } catch {}
  }
}