import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'
import http from 'node:http'

const FPS = 60
const DURATION_SECONDS = 14
const TOTAL_FRAMES = FPS * DURATION_SECONDS
const WIDTH = 1080
const HEIGHT = 1920
const PORT = 4173

const root = process.cwd()
const renderRoot = path.join(root, 'renders', 'expat-onboarding')
const framesDir = path.join(renderRoot, 'frames')
const outputVideo = path.join(renderRoot, 'expat-onboarding.mp4')
const args = new Set(process.argv.slice(2))
const urlArg = process.argv.find((item) => item.startsWith('--url='))
const customUrl = urlArg ? urlArg.replace('--url=', '').trim() : ''
const basePageUrl = customUrl || `http://127.0.0.1:${PORT}/expat-onboarding`
const pageUrl = basePageUrl.includes('?')
  ? `${basePageUrl}&export=1`
  : `${basePageUrl}?export=1`

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function cleanFrames() {
  await fs.rm(framesDir, { recursive: true, force: true })
  await ensureDir(framesDir)
}

function spawnProcess(command, commandArgs, options = {}) {
  return spawn(command, commandArgs, {
    cwd: root,
    stdio: 'pipe',
    shell: false,
    ...options,
  })
}

function waitForServerReady(url, timeoutMs = 45_000) {
  const start = Date.now()

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume()
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
          resolve()
          return
        }
        retry()
      })

      req.on('error', retry)
      req.setTimeout(1200, () => {
        req.destroy()
        retry()
      })
    }

    const retry = () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timed out waiting for dev server at ${url}`))
        return
      }
      setTimeout(attempt, 250)
    }

    attempt()
  })
}

async function hasCommand(command) {
  return new Promise((resolve) => {
    const probe = spawnProcess(command, ['-version'])
    probe.on('error', () => resolve(false))
    probe.on('exit', (code) => resolve(code === 0))
  })
}

async function encodeMp4WithFfmpeg() {
  const ffmpegArgs = [
    '-y',
    '-framerate', String(FPS),
    '-i', path.join(framesDir, 'frame_%05d.png'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'high',
    '-crf', '16',
    '-movflags', '+faststart',
    outputVideo,
  ]

  console.log('Encoding mp4 with ffmpeg...')

  await new Promise((resolve, reject) => {
    const ffmpeg = spawnProcess('ffmpeg', ffmpegArgs, { stdio: 'inherit' })
    ffmpeg.on('error', reject)
    ffmpeg.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`ffmpeg exited with code ${code}`))
    })
  })
}

async function main() {
  await ensureDir(renderRoot)
  if (!args.has('--keep-frames')) {
    await cleanFrames()
  } else {
    await ensureDir(framesDir)
  }

  let chromium
  try {
    const playwright = await import('playwright')
    chromium = playwright.chromium
  } catch {
    throw new Error('Playwright is not installed. Run: npm install -D playwright')
  }

  let devServer = null
  if (!customUrl) {
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    devServer = spawnProcess(
      npmCommand,
      ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
      { stdio: 'pipe' }
    )

    devServer.stdout.on('data', () => {})
    devServer.stderr.on('data', () => {})
  }

  const teardown = async () => {
    if (devServer && !devServer.killed) {
      devServer.kill('SIGTERM')
    }
  }

  process.on('SIGINT', async () => {
    await teardown()
    process.exit(1)
  })

  try {
    await waitForServerReady(basePageUrl)

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    await page.goto(pageUrl, { waitUntil: 'networkidle' })

    console.log(`Capturing ${TOTAL_FRAMES} frames (${FPS}fps, ${DURATION_SECONDS}s)...`)

    for (let frame = 0; frame < TOTAL_FRAMES; frame += 1) {
      const t = frame / FPS
      await page.evaluate((time) => {
        if (typeof window.__setExpatOnboardingTime === 'function') {
          window.__setExpatOnboardingTime(time)
        }
      }, t)

      await page.screenshot({
        path: path.join(framesDir, `frame_${String(frame).padStart(5, '0')}.png`),
      })

      if (frame % 60 === 0) {
        console.log(`Frame ${frame}/${TOTAL_FRAMES}`)
      }
    }

    await browser.close()
    console.log(`Frames saved in: ${framesDir}`)

    const shouldEncode = args.has('--mp4') || !args.has('--frames-only')
    if (!shouldEncode) {
      return
    }

    const ffmpegAvailable = await hasCommand('ffmpeg')
    if (!ffmpegAvailable) {
      console.log('ffmpeg is not available in PATH. Skipping mp4 encode.')
      console.log(`To encode manually, run:`)
      console.log(
        `ffmpeg -y -framerate ${FPS} -i "${path.join(framesDir, 'frame_%05d.png')}" -c:v libx264 -pix_fmt yuv420p -profile:v high -crf 16 -movflags +faststart "${outputVideo}"`
      )
      return
    }

    await encodeMp4WithFfmpeg()
    console.log(`MP4 ready: ${outputVideo}`)
  } finally {
    await teardown()
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
