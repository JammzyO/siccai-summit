import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const puppeteer = require('C:/Users/User/AppData/Local/npm-cache/_npx/44da0de56d03135c/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const url = process.argv[2] || 'http://localhost:3006'

// Auto-increment output filename
const outDir = path.join(__dirname, 'temporary screenshots')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
const existing = fs.readdirSync(outDir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'))
const nextN = existing.length + 1
const outPath = path.join(outDir, `screenshot-${nextN}.png`)

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/User/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
await new Promise(r => setTimeout(r, 1000))

// Scroll through the page to trigger all IntersectionObserver animations
const pageHeight = await page.evaluate(() => document.body.scrollHeight)
const viewportHeight = 900
for (let y = 0; y < pageHeight; y += viewportHeight) {
  await page.evaluate(scrollY => window.scrollTo(0, scrollY), y)
  await new Promise(r => setTimeout(r, 300))
}
// Scroll back to top
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise(r => setTimeout(r, 500))

await page.screenshot({ path: outPath, fullPage: true })
await browser.close()

console.log(`Screenshot saved: ${outPath}`)
