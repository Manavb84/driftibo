#!/usr/bin/env node
// Driftibo Visual Bank — recognizable-landmark images for every Destinations place.
// Reads scripts/visual-bank-prompts.json (the committed source of truth, authored by the
// visual-bank authoring workflow), renders each landmark to a temp PNG via pipeline/generate.mjs
// (Vertex/Gemini), then sips → web JPG at public/visual-bank/<catalog>/<slug>-N.jpg, and writes a
// browsable contact-sheet at public/visual-bank/index.html.
//
//   node scripts/gen-visual-bank.mjs                 # render everything that's missing
//   node scripts/gen-visual-bank.mjs agra            # only places whose slug/catalog contains "agra"
//   node scripts/gen-visual-bank.mjs international    # only the International catalog
//   node scripts/gen-visual-bank.mjs --force agra     # re-render even if the JPG exists
//   node scripts/gen-visual-bank.mjs --gallery-only   # just rebuild index.html from JSON + disk
//   node scripts/gen-visual-bank.mjs --selftest       # offline self-check of prompt/job/filter logic
//
// The key (VERTEX_AI_API_KEY) is read from pipeline/.env by generate.mjs itself — never copied here.
// Models scripts/gen-images.mjs's retry+sips pattern; adds a small async pool so ~249 calls finish in
// ~30–40 min instead of hours. ponytail: pool of 4, raise VB_POOL if Vertex tolerates it.

import { spawn } from 'node:child_process'
import assert from 'node:assert'
import { mkdirSync, mkdtempSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const PIPE = join(ROOT, 'driftibo-marketing/skills/instagram/pipeline')
const GEN = join(PIPE, 'generate.mjs')
const PROMPTS = join(ROOT, 'scripts/visual-bank-prompts.json')
const OUTROOT = join(ROOT, 'public/visual-bank')
const POOL = Number(process.env.VB_POOL) || 4
// ponytail: the Vertex image preview model has a per-minute quota — bursts trip 429 RESOURCE_EXHAUSTED.
// Gate the global request-start rate (one start per VB_INTERVAL ms ≈ 12/min) so the pool overlaps only
// on the slow response, not on fresh starts. Raise/lower VB_INTERVAL if the quota changes.
const MIN_INTERVAL = Number(process.env.VB_INTERVAL) || 5000
const ATTEMPTS = Number(process.env.VB_ATTEMPTS) || 5

// ── the locked brand suffix: palette clause + photoreal grade + shared negative block ──
// Lifted verbatim-ish from visual-prompts.md (slots 4/7/8) + gen-images.mjs's NO. Appended to every
// frame deterministically so the set is brand-consistent regardless of per-place agent variance.
const PALETTE =
  'Colour & grade: deep teal shadows, warm coral-amber highlights, soft-sky midtones; warm directional ' +
  'light versus cool shadow. Shot on full-frame 35mm, natural light, fine photographic grain, true-to-life ' +
  'dynamic range, matte filmic contrast, realistic micro-texture on stone, grass and water; editorial ' +
  'travel photography — photoreal, NOT dreamy-glow.'
const NEG =
  'Avoid: no text, no logos, no watermark, no captions, no UI; no warped or melting architecture, no ' +
  'impossible geometry, no duplicated structures; no extra fingers, no malformed hands, no distorted faces ' +
  '(faceless — no people in the foreground anyway); no modern cars, no power lines, no plastic litter, no ' +
  'anachronisms; no oversaturation, no HDR halos, no neon, no fake god-rays, no AI plastic skin or sheen; ' +
  'no invented features not present at the real place.'
const BRAND_SUFFIX = `${PALETTE}\n\n${NEG}`

const ASPECT_HINT = { '4:5': '4:5 vertical', '9:16': '9:16 tall vertical', '16:9': '16:9 wide' }

const buildPrompt = (scene, aspect) =>
  `${scene}\n\n${BRAND_SUFFIX}\n\nAspect ratio: ${ASPECT_HINT[aspect] || aspect}.`

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const is429 = (e) => /\b429\b|RESOURCE_EXHAUSTED|exhausted|quota/i.test(String((e && e.message) || e))

// global rate gate: serialize request *starts* to one per MIN_INTERVAL, regardless of pool size.
let nextSlot = 0
async function throttle() {
  const now = Date.now()
  const wait = Math.max(0, nextSlot - now)
  nextSlot = Math.max(now, nextSlot) + MIN_INTERVAL
  if (wait) await sleep(wait)
}

// promise wrapper around spawn — resolves on exit 0, rejects with captured stderr otherwise.
function run(cmd, cmdArgs, opts = {}) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, cmdArgs, { ...opts, stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('error', rej)
    p.on('close', (code) => (code === 0 ? res() : rej(new Error(`${cmd} exit ${code}: ${err.slice(0, 200)}`))))
  })
}

// flatten the prompt set into one job per image
function buildJobs(data) {
  const jobs = []
  for (const place of data) {
    for (const img of place.images) {
      jobs.push({
        catalog: place.catalog,
        slug: place.slug,
        name: place.name,
        n: img.n,
        landmark: img.landmark,
        aspect: img.aspect,
        scene: img.prompt,
        jpg: join(OUTROOT, place.catalog, `${place.slug}-${img.n}.jpg`),
        rel: `${place.catalog}/${place.slug}-${img.n}.jpg`,
        id: `${place.slug}-${img.n}`,
      })
    }
  }
  return jobs
}

// filter is a comma-separated list of slug/catalog substrings — a job matches if ANY token hits.
const matchesFilter = (job, f) => {
  if (!f) return true
  return f.split(',').map((s) => s.trim()).filter(Boolean)
    .some((t) => job.slug.includes(t) || job.catalog.includes(t))
}

// ── gallery: a self-contained contact sheet rendered from the JSON + what's on disk ──
const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function buildGallery(data) {
  const CAT_TITLE = {
    international: 'International',
    'india-popular': 'India · Popular',
    'india-offbeat': 'India · Offbeat',
    'india-spiritual': 'India · Spiritual',
  }
  const order = ['international', 'india-popular', 'india-offbeat', 'india-spiritual']
  let total = 0
  let onDisk = 0

  const sections = order
    .filter((cat) => data.some((p) => p.catalog === cat))
    .map((cat) => {
      const places = data.filter((p) => p.catalog === cat)
      const cards = places
        .map((p) => {
          const tiles = p.images
            .map((img) => {
              total++
              const rel = `${p.catalog}/${p.slug}-${img.n}.jpg`
              const has = existsSync(join(OUTROOT, cat, `${p.slug}-${img.n}.jpg`))
              if (has) onDisk++
              const ar = (img.aspect || '16:9').replace(':', ' / ')
              const inner = has
                ? `<a href="${rel}" target="_blank" rel="noopener"><img loading="lazy" src="${rel}" alt="${esc(img.landmark)}"></a>`
                : `<div class="missing">missing</div>`
              return `<figure style="--ar:${ar}">
            ${inner}
            <figcaption><span class="lm">${esc(img.landmark)}</span></figcaption>
          </figure>`
            })
            .join('\n')
          return `<article class="place">
        <h3>${esc(p.name)}</h3>
        <div class="tiles">${tiles}</div>
      </article>`
        })
        .join('\n')
      return `<section>
      <div class="sec-head"><h2>${esc(CAT_TITLE[cat] || cat)}</h2><span class="count">${places.length} places</span></div>
      ${cards}
    </section>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Driftibo · Visual Bank</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    background: oklch(0.18 0.03 230); color: oklch(0.95 0.01 230); }
  header { padding: 34px 28px 18px; border-bottom: 1px solid oklch(0.32 0.04 230); }
  h1 { margin: 0 0 6px; font-size: 26px; letter-spacing: -0.02em; }
  header p { margin: 0; color: oklch(0.74 0.03 220); font-size: 14px; }
  main { padding: 8px 28px 64px; max-width: 1500px; margin: 0 auto; }
  section { padding-top: 30px; }
  .sec-head { display: flex; align-items: baseline; gap: 12px; position: sticky; top: 0;
    background: oklch(0.18 0.03 230); padding: 10px 0; z-index: 2; border-bottom: 1px solid oklch(0.3 0.04 230); }
  h2 { margin: 0; font-size: 19px; color: oklch(0.86 0.07 70); }
  .count { color: oklch(0.6 0.03 220); font-size: 13px; }
  .place { padding: 18px 0; border-bottom: 1px solid oklch(0.26 0.03 230); }
  .place h3 { margin: 0 0 12px; font-size: 16px; font-weight: 600; }
  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
  figure { margin: 0; background: oklch(0.24 0.03 230); border-radius: 10px; overflow: hidden;
    border: 1px solid oklch(0.3 0.03 230); }
  figure img, figure .missing { display: block; width: 100%; aspect-ratio: var(--ar, 16 / 9);
    object-fit: cover; background: oklch(0.22 0.02 230); }
  .missing { display: grid; place-items: center; color: oklch(0.55 0.05 30);
    font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; }
  figcaption { display: flex; justify-content: space-between; align-items: center; gap: 8px;
    padding: 8px 11px; font-size: 12.5px; }
  .lm { color: oklch(0.9 0.01 230); }
  .ar { color: oklch(0.62 0.03 220); font-variant-numeric: tabular-nums; }
  a { text-decoration: none; }
</style>
</head>
<body>
<header>
  <h1>Driftibo · Visual Bank</h1>
  <p>${data.length} destinations · ${total} landmark frames · ${onDisk} rendered. Click any frame to open full-size. Each place: 3 recognizable landmarks, all <strong>16:9 masters</strong> — crop to 4:5 / 9:16 / 1:1 per post.</p>
</header>
<main>
${sections}
</main>
</body>
</html>`
}

function writeGallery(data) {
  mkdirSync(OUTROOT, { recursive: true })
  writeFileSync(join(OUTROOT, 'index.html'), buildGallery(data))
}

// ── offline self-check (no network) ──
function selftest() {
  const a = assert
  const p = buildPrompt('Taj Mahal at dawn over the Yamuna.', '9:16')
  a.ok(p.includes('Taj Mahal at dawn'), 'scene body present')
  a.ok(p.includes('deep teal shadows'), 'palette clause appended')
  a.ok(p.includes('no invented features'), 'negative block appended')
  a.ok(p.includes('Aspect ratio: 9:16 tall vertical.'), 'aspect hint appended')
  const jobs = buildJobs([
    { slug: 'agra', catalog: 'india-popular', name: 'Agra', images: [{ n: 1, landmark: 'Taj', aspect: '4:5', prompt: 'x' }] },
    { slug: 'egypt', catalog: 'international', name: 'Egypt', images: [{ n: 1, landmark: 'Pyramids', aspect: '16:9', prompt: 'y' }] },
  ])
  a.equal(jobs.length, 2)
  a.equal(jobs[0].rel, 'india-popular/agra-1.jpg')
  a.ok(matchesFilter(jobs[0], 'agra') && !matchesFilter(jobs[0], 'egypt'), 'slug filter')
  a.ok(matchesFilter(jobs[1], 'international'), 'catalog filter')
  a.ok(matchesFilter(jobs[0], 'egypt,agra') && matchesFilter(jobs[1], 'egypt,agra'), 'comma filter')
  console.log('selftest ok')
}

// ── main ──
async function main() {
  const argv = process.argv.slice(2)
  const force = argv.includes('--force')
  const galleryOnly = argv.includes('--gallery-only')
  const filter = argv.find((a) => !a.startsWith('--'))

  if (argv.includes('--selftest')) return selftest()

  if (!existsSync(PROMPTS)) {
    console.error(`Missing ${PROMPTS}. Run the authoring workflow first.`)
    process.exit(1)
  }
  const data = JSON.parse(readFileSync(PROMPTS, 'utf8'))

  if (galleryOnly) {
    writeGallery(data)
    console.log(`✓ gallery → ${join(OUTROOT, 'index.html')}`)
    return
  }

  const TMP = mkdtempSync(join(tmpdir(), 'driftibo-vbank-'))
  const allJobs = buildJobs(data).filter((j) => matchesFilter(j, filter))
  const todo = allJobs.filter((j) => force || !existsSync(j.jpg))
  const skipped = allJobs.length - todo.length

  // ensure catalog dirs exist
  for (const cat of new Set(todo.map((j) => j.catalog))) mkdirSync(join(OUTROOT, cat), { recursive: true })

  console.log(`Visual Bank: ${allJobs.length} frame(s) match${filter ? ` "${filter}"` : ''}, ${todo.length} to render, ${skipped} already on disk.\n`)

  const failures = []
  let done = 0

  async function render(job) {
    const png = join(TMP, `${job.catalog}-${job.id}.png`)
    const prompt = buildPrompt(job.scene, job.aspect)
    // Gemini preview endpoint flakes (429 quota / safety). Rate-gate the start, then retry with
    // exponential backoff + jitter — longer waits for 429 so we ride out the per-minute quota window.
    let lastErr
    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
      await throttle()
      try {
        await run('node', [GEN, '--prompt', prompt, '--out', png], { cwd: PIPE })
        lastErr = null
        break
      } catch (e) {
        lastErr = e
        if (attempt < ATTEMPTS) {
          const base = is429(e) ? 20000 : 3000
          await sleep(base * attempt + Math.floor(Math.random() * 4000))
        }
      }
    }
    if (lastErr) throw lastErr
    if (!existsSync(png)) throw new Error('no PNG produced')
    // sips: downscale (max edge 1600) + JPEG q80 — macOS native, same as gen-images.mjs.
    await run('sips', ['-Z', '1600', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', png, '--out', job.jpg])
  }

  // simple fixed-size async pool
  let cursor = 0
  async function worker() {
    while (cursor < todo.length) {
      const job = todo[cursor++]
      try {
        await render(job)
        console.log(`✓ ${job.rel}  [${job.aspect} · ${job.landmark}]  (${++done}/${todo.length})`)
      } catch (e) {
        console.error(`✗ ${job.rel} — ${String(e.message || e).slice(0, 160)}`)
        failures.push(job)
        done++
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(POOL, todo.length || 1) }, worker))

  writeGallery(data)
  console.log(`\nDone. ${todo.length - failures.length}/${todo.length} rendered. Gallery → public/visual-bank/index.html`)
  if (failures.length) {
    const slugs = [...new Set(failures.map((f) => f.slug))].join(' ')
    console.log(`Failed ${failures.length}: ${failures.map((f) => f.id).join(', ')}`)
    console.log(`Rerun: node scripts/gen-visual-bank.mjs ${slugs.split(' ')[0] || ''}`.trim())
    process.exit(1)
  }
}

main()
