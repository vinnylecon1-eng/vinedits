import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execFileAsync = promisify(execFile)

const YT_DLP = path.join(process.cwd(), 'yt-dlp.exe')
const FFMPEG = path.join(process.cwd(), 'ffmpeg.exe')
const VIDEOS_DIR = path.join(process.cwd(), 'videos')
const DOWNLOADS_DIR = path.join(VIDEOS_DIR, 'downloads')
const CLIPS_DIR = path.join(VIDEOS_DIR, 'clips')

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

export async function downloadVideo(url: string): Promise<string> {
  ensureDirs()
  const outputTemplate = path.join(DOWNLOADS_DIR, '%(id)s.%(ext)s')

  try {
    await execFileAsync(YT_DLP, [
      url, '-o', outputTemplate,
      '--no-playlist',
      '--max-filesize', '200M',
      '--quiet', '--no-warnings',
    ], { timeout: 120000, maxBuffer: 10 * 1024 * 1024 })

    const files = fs.readdirSync(DOWNLOADS_DIR)
    const latest = files
      .filter(f => f.endsWith('.mp4') || f.endsWith('.webm') || f.endsWith('.mkv'))
      .sort()
      .pop()

    if (!latest) throw new Error('No video file found after download')

    const videoPath = path.join(DOWNLOADS_DIR, latest)

    if (!latest.endsWith('.mp4')) {
      const mp4Path = videoPath.replace(/\.\w+$/, '.mp4')
      await execFileAsync(FFMPEG, [
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
  try {
    await execFileAsync(FFMPEG, ['-i', videoPath, '-f', 'null', '-'], { timeout: 30000 })
    return 0
  } catch (err: any) {
    const match = err.stderr?.match(/Duration: (\d+):(\d+):(\d+)\.(\d+)/)
    if (match) {
      const hours = parseInt(match[1])
      const minutes = parseInt(match[2])
      const seconds = parseInt(match[3])
      return hours * 3600 + minutes * 60 + seconds
    }
    return 0
  }
}

export async function splitIntoClips(
  videoPath: string,
  shortCount: number,
  intervalSec: number,
  removeWatermark: boolean = false
): Promise<{ clips: string[]; count: number }> {
  ensureDirs()
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
      await execFileAsync(FFMPEG, args, { timeout: 120000 })
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
