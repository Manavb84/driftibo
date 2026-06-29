#!/usr/bin/env node
// Driftibo real-photo set — thin driver over pipeline/generate.mjs (Vertex/Gemini).
// Renders each row to a temp PNG, then sips → optimized web JPG in public/images/.
// Key is read from pipeline/.env by generate.mjs itself — never copied here.
//
//   node scripts/gen-images.mjs            # render all
//   node scripts/gen-images.mjs chopta     # render rows whose `out` contains "chopta"
//
// ponytail: aspect is a prompt hint + sips downscale (max edge 1600). CSS `cover`
// does final fitting, so we don't hard-crop and lose the composition the model framed.

import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const PIPE = join(ROOT, 'driftibo-marketing/skills/instagram/pipeline')
const GEN = join(PIPE, 'generate.mjs')
const OUTDIR = join(ROOT, 'public/images')
const TMP = mkdtempSync(join(tmpdir(), 'driftibo-img-'))
const CHOPTA_REF = 'anchors/chopta/chandrashila-ref-1280.jpg' // relative to PIPE

const NO = 'Premium travel photography, natural light, no people in foreground, no text, no captions, no logos, no watermark, no AI glow, no oversaturation.'

// Landmark-anchored prompts — each names the real iconic feature so the render reads as the true place.
const ROWS = [
  // ── Chopta (anchored to real reference) ──
  { out: 'chopta-hero', aspect: '16:9 wide', ref: CHOPTA_REF,
    prompt: `Cinematic dawn over Chopta meadow, Uttarakhand. The stone Tungnath temple on its ridge with Chandrashila peak catching first golden light, deodar pine forest, soft valley mist, snow Himalayan peaks on the horizon. ${NO}` },
  { out: 'chopta-portrait', aspect: '3:4 vertical', ref: CHOPTA_REF,
    prompt: `Vertical portrait of Chopta, Uttarakhand at sunrise — deodar pines rising toward the Tungnath ridge, snow Himalayan peaks above, drifting mist in the meadow below, warm golden light. ${NO}` },
  // ── Spiti ──
  { out: 'spiti-hero', aspect: '16:9 wide',
    prompt: `Spiti Valley, Himachal Pradesh — Key Monastery (Kye Gompa) stacked white on its conical hill above the braided Spiti river, cold high-desert moonland, ochre barren cliffs, deep blue sky, distant snow peaks. ${NO}` },
  { out: 'spiti-portrait', aspect: '3:4 vertical',
    prompt: `Vertical portrait of Spiti Valley high-desert — winding mountain switchback road through ochre moonland cliffs, a lone whitewashed Buddhist chorten, vast cold barren ranges, crisp blue sky. ${NO}` },
  // ── Ziro ──
  { out: 'ziro-hero', aspect: '16:9 wide',
    prompt: `Ziro Valley, Arunachal Pradesh — the Apatani green paddy-field mosaic on the flat valley floor, ringed by pine-covered ridges, low morning mist, soft overcast light. ${NO}` },
  { out: 'ziro-portrait', aspect: '3:4 vertical',
    prompt: `Vertical portrait of Ziro Valley, Arunachal — terraced emerald rice paddies stepping up to misty pine ridges, a thin trail, fresh humid green light. ${NO}` },
  // ── Gokarna ──
  { out: 'gokarna-hero', aspect: '16:9 wide',
    prompt: `Gokarna coast, Karnataka — Om Beach golden-hour, palm-topped laterite cliffs curving along the Arabian Sea, gentle surf, warm soft sunset light over the water. ${NO}` },
  { out: 'gokarna-portrait', aspect: '3:4 vertical',
    prompt: `Vertical portrait of Gokarna, Karnataka — a palm headland and cliff path above a quiet cove, Arabian Sea glowing at golden hour, soft warm light. ${NO}` },
  // ── Specials ──
  { out: 'gangtey-reveal', aspect: '16:10 wide',
    prompt: `Phobjikha (Gangtey) glacial valley, Bhutan — the broad U-shaped valley floor with the Gangtey Goenpa monastery on its forested spur, dwarf bamboo meadows, black-necked cranes in the distance, soft mountain light. ${NO}` },
  { out: 'chopta-reveal', aspect: '16:10 wide', ref: CHOPTA_REF,
    prompt: `Sweeping reveal of Chopta, Uttarakhand — emerald meadow rolling to the Tungnath ridge and Chandrashila summit, a long line of snow Himalayan peaks aglow at sunrise, deodar pines, drifting mist. ${NO}` },
  { out: 'chopta-story', aspect: '9:16 tall vertical', ref: CHOPTA_REF,
    prompt: `Tall vertical (9:16) of Chopta at dawn — the Tungnath temple ridge and Chandrashila peak in golden first light, deodar pines, snow Himalayan range, mist in the meadow. Composed for a phone story frame. ${NO}` },
  { out: 'dusk', aspect: '16:9 wide',
    prompt: `Evocative dusk travel mood — a glowing amber-to-violet twilight sky over soft layered silhouetted hills and low mist, a single faint star above. Dreamy, no identifiable landmark. ${NO}` },
  // ── Offering concepts (mood, no identifiable place) ──
  { out: 'offering-surprise', aspect: '16:9 wide',
    prompt: `Travel mood: a packed weekend bag by a window at golden hour with a blurred mountain road beyond — the feeling of a surprise trip about to begin. Warm, intimate, no identifiable landmark. ${NO}` },
  { out: 'offering-honeymoon', aspect: '16:9 wide',
    prompt: `Travel mood: a soft romantic golden-hour scene — two cups on a wooden balcony railing overlooking a misty valley, warm intimate light, dreamy bokeh. No identifiable landmark, no faces. ${NO}` },
  { out: 'offering-concierge', aspect: '16:9 wide',
    prompt: `Travel mood: a calm premium boutique-stay terrace at dusk — lanterns, linen, a view of layered hills, quiet luxury and care. Warm refined light, no identifiable landmark. ${NO}` },
  { out: 'offering-corporate', aspect: '16:9 wide',
    prompt: `Travel mood: a group offsite feeling — a wide deck or bonfire clearing at twilight in the hills, string lights, warm communal glow, layered ranges behind. No faces, no identifiable landmark. ${NO}` },
  // ── Char Dham pilgrimage circuit (Garhwal Himalaya — a temple circuit, NOT a meadow) ──
  { out: 'char-dham-hero', aspect: '16:9 wide',
    prompt: `Char Dham pilgrimage, Garhwal Himalaya, Uttarakhand — the stone Kedarnath temple on its glacial valley floor beneath the snow-capped Kedarnath peak, a snowmelt river over grey moraine, deodar forest on the lower slopes, clear cold high-altitude light. A Himalayan pilgrimage circuit, not a meadow. ${NO}` },
  { out: 'char-dham-portrait', aspect: '3:4 vertical',
    prompt: `Vertical travel photograph of the stone Kedarnath temple with its carved spire, standing on the glacial valley floor beneath the towering snow-capped Kedarnath peak, Garhwal Himalaya. Prayer flags, grey moraine and a snowmelt river, deodar slopes below, crisp thin-air light. Sacred and austere. ${NO}` },
  // ── Surprise-abroad lane (international mood, no identifiable Indian landmark) ──
  { out: 'offering-abroad', aspect: '16:9 wide',
    prompt: `Travel mood, international departure feeling — a sleek airport gate window at golden hour, a jet on the apron and a far unfamiliar coastline beyond, the calm sense of being sent somewhere beyond India. No identifiable landmark, no faces, no text. ${NO}` },
  // ── Game-brand frames (concrete photographic moods, no identifiable place) — for the play hubs ──
  { out: 'game-spin', aspect: '16:10 wide',
    prompt: `Long-exposure night-sky photograph — star trails wheeling around a single bright pole star over a deep indigo horizon with a faint warm amber afterglow low down. No land features, no people, no text. Dreamy cosmic mood. ${NO}` },
  { out: 'game-quiz', aspect: '16:10 wide',
    prompt: `Macro photograph of overlapping translucent watercolour washes — pine green, sea blue, warm sand and saffron bleeding into wet paper, soft daylight, gentle grain. No landmark, no faces, no text. ${NO}` },
  { out: 'game-dream', aspect: '16:10 wide',
    prompt: `Photograph of thick dawn fog drifting over faint layered hill silhouettes, soft pastel pink-and-blue sky, a single faint star, ethereal and weightless. No identifiable place, no faces, no text. ${NO}` },
  // ── Starbook — a star-filled night sky for the "passport" feature ──
  { out: 'starbook', aspect: '16:10 wide',
    prompt: `Astrophotography of the Milky Way arching over a faint dark horizon — deep indigo fading to violet, thousands of scattered bright stars and a few standout bright ones like a constellation, the soft dusty band of the galaxy overhead. No identifiable place, no people, no text. Crisp, calm, real night-sky photograph. ${NO}` },
  // ── Variety: one extra wide per core place (different vantage / time-of-day than the hero) ──
  { out: 'chopta-detail', aspect: '16:9 wide', ref: CHOPTA_REF,
    prompt: `Chopta, Uttarakhand — bright midday wide of the rolling Bugyal meadow and a grazing trail winding through deodar pines toward the Tungnath ridge, scattered cumulus over snow peaks, fresh green light. A different hour from the golden dawn hero. ${NO}` },
  { out: 'spiti-detail', aspect: '16:9 wide',
    prompt: `Spiti Valley, Himachal — late-afternoon warm light on the Dhankar monastery perched on ochre cliffs above the Spiti river confluence, prayer flags, vast cold ranges. A different vantage from the Key Monastery hero. ${NO}` },
  { out: 'ziro-detail', aspect: '16:9 wide',
    prompt: `Ziro Valley, Arunachal — golden-hour wide of an Apatani village among pine groves, bamboo houses and terraced paddies glowing warm, low hills behind. A different hour from the misty-morning hero. ${NO}` },
  { out: 'gokarna-detail', aspect: '16:9 wide',
    prompt: `Gokarna coast, Karnataka at bright midday — a red-laterite cliff headland trail above a turquoise Arabian Sea cove, coconut palms, sunlit rock and clear blue sky. A different hour from the golden-sunset hero. ${NO}` },
]

const filter = process.argv[2]
const rows = filter ? ROWS.filter((r) => r.out.includes(filter)) : ROWS

mkdirSync(OUTDIR, { recursive: true })
const failures = []
console.log(`Rendering ${rows.length} image(s) → ${OUTDIR}\n`)

for (const r of rows) {
  const png = join(TMP, `${r.out}.png`)
  const jpg = join(OUTDIR, `${r.out}.jpg`)
  const prompt = `${r.prompt}\n\nAspect ratio: ${r.aspect}.`
  try {
    const genArgs = ['--prompt', prompt, '--out', png]
    if (r.ref) genArgs.push('--ref', r.ref)
    // ponytail: the Gemini endpoint flakes intermittently (429/safety) — retry a few times.
    let lastErr
    for (let attempt = 1; attempt <= 4; attempt++) {
      try { execFileSync('node', [GEN, ...genArgs], { cwd: PIPE, stdio: 'pipe' }); lastErr = null; break }
      catch (e) { lastErr = e; execFileSync('sleep', [String(attempt * 3)]) }
    }
    if (lastErr) throw lastErr
    if (!existsSync(png)) throw new Error('no PNG produced')
    // sips: downscale (max edge 1600) + encode JPEG q80. Whatever's installed — macOS native.
    execFileSync('sips', ['-Z', '1600', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', png, '--out', jpg], { stdio: 'pipe' })
    console.log(`✓ ${r.out}.jpg`)
  } catch (e) {
    console.error(`✗ ${r.out} — ${String(e.message || e).slice(0, 200)}`)
    failures.push(r.out)
  }
}

console.log(`\nDone. ${rows.length - failures.length}/${rows.length} ok.`)
if (failures.length) {
  console.log(`Failed (rerun: node scripts/gen-images.mjs <name>): ${failures.join(', ')}`)
  process.exit(1)
}
