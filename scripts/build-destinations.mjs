#!/usr/bin/env node
// Renders docs/research/playbook/destinations-data.json -> the hub + 4 catalog HTML pages.
// Template-once-render-many: the JSON is the source of truth; re-run any time to regenerate.
//   node scripts/build-destinations.mjs
// ponytail: deterministic string templating, no framework — the playbook is a no-build static site.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLAYBOOK = join(ROOT, 'docs/research/playbook');
const DATA = join(PLAYBOOK, 'destinations-data.json');

// Visual Bank: 3 recognizable-landmark photos per place. Images live in the app's public/ and are
// served at driftibo.vercel.app/visual-bank/<catalog>/<slug>-N.jpg — referenced by absolute URL so the
// standalone playbook deploy shows them without duplicating ~99 MB into docs/research/playbook/.
const VBANK = join(ROOT, 'scripts/visual-bank-prompts.json');
const VBANK_BASE = 'https://driftibo.vercel.app/visual-bank';
const vbankBySlug = Object.fromEntries(
  JSON.parse(readFileSync(VBANK, 'utf8')).map((p) => [p.slug, p]));

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// the 4 catalogs: file, title, and (for international) the A/B section split
const CATALOGS = [
  { key:'international',    file:'dest-international.html',    title:'International',
    kicker:'Catalog · International', sectioned:true,
    sections:{ A:'A · Famous & commercial', B:'B · Offbeat & underrated — as beautiful, far cheaper' },
    lede:'Where to send a customer outside India — the commercial bucket-list names first, then the underrated places that look just as good for a fraction of the spend.' },
  { key:'india-popular',   file:'dest-india-popular.html',   title:'India · Popular',
    kicker:'Catalog · Domestic India', sectioned:false,
    lede:'The mainstream Indian destinations customers already ask for by name — the safe, high-demand core of what you sell.' },
  { key:'india-offbeat',   file:'dest-india-offbeat.html',   title:'India · Offbeat',
    kicker:'Catalog · Offbeat India', sectioned:false,
    lede:'Driftibo’s home turf: the under-the-radar Indian places that carry the surprise-trip promise. Four are already curated in your live inventory.' },
  { key:'india-spiritual', file:'dest-india-spiritual.html', title:'India · Spiritual',
    kicker:'Catalog · Spiritual India', sectioned:false,
    lede:'Pilgrimage and temple circuits — leaning to the offbeat and underrated, not only the obvious — for the faith-led customer.' },
];
const CAT_BY_KEY = Object.fromEntries(CATALOGS.map(c => [c.key, c]));

// ---- the 12-item global top nav (matches every existing playbook page) ----
function topNav(active) {
  const links = [
    ['index.html','Home'], ['plan.html','✦ Your plan'], ['destinations.html','✦ Destinations'],
    ['inventory.html','1 · Get inventory'], ['move-people.html','2 · Move people'],
    ['packages-docs.html','3 · Build &amp; price a trip'], ['legal-tax-permits.html','4 · Legal, tax &amp; permits'],
    ['money.html','5 · How agents earn'], ['international.html','6 · Go international'],
    ['growth-plan.html','7 · The $1M plan'], ['glossary.html','Glossary'], ['sources.html','Sources'],
  ];
  const inner = links.map(([href,label]) =>
    `    <a href="${href}"${href===active?' class="active"':''}>${label}</a>`).join('\n');
  return `<nav class="toc" aria-label="Chapters">\n  <div class="inner">\n${inner}\n  </div>\n</nav>`;
}

// ---- the secondary catalog strip (only on destination pages) ----
function subNav(activeFile) {
  const tabs = CATALOGS.map(c =>
    `  <a href="${c.file}"${c.file===activeFile?' class="active"':''}>${c.title}</a>`).join('\n');
  return `<nav class="dest-subnav" aria-label="Destination catalogs">\n` +
         `  <a href="destinations.html" class="hub">← Hub</a>\n${tabs}\n</nav>`;
}

const HEAD = (title, desc) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Driftibo Operator Playbook</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>`;

const FOOTER = `<footer>
  <div class="wrap">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
      <div class="seal"><span class="ring"></span><span class="star"></span></div>
      <div><b>Driftibo · Operator Playbook</b><br><span class="small" style="color:oklch(0.8 0.02 210)">Destinations reference — as of June 2026</span></div>
    </div>
    <div class="disclaimer" style="color:oklch(0.3 0.05 60)"><b>Typical ranges, not guarantees.</b>
      Climate figures are typical monthly highs/lows and vary year to year. Visa rules, area permits and seasonal
      road/temple closures change without notice — <b>reconfirm every one before you quote it to a customer.</b>
      This is a planning &amp; sales reference, not legal, visa or travel advice.</div>
  </div>
</footer>
<script>
(function(){
  var terms=[].slice.call(document.querySelectorAll('.dfn[title]'));
  terms.forEach(function(el){ if(!el.getAttribute('data-tip')) el.setAttribute('data-tip', el.getAttribute('title')); });
  document.addEventListener('click',function(e){
    var d=e.target && e.target.closest ? e.target.closest('.dfn') : null;
    terms.forEach(function(el){ if(el!==d) el.classList.remove('tip-open'); });
    if(d){ d.classList.toggle('tip-open'); }
  });
})();
</script>
</body>
</html>`;

// ---- helpers ----
function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function chips(months) {
  if (!Array.isArray(months)) return '';
  return months.map(m => `<span class="chip">${esc(m)}</span>`).join('');
}
function list(items, cls='clean') {
  if (!Array.isArray(items) || !items.length) return '';
  return `<ul class="${cls}">` + items.map(i => `<li>${esc(i)}</li>`).join('') + '</ul>';
}
// split prose on blank/newline breaks into <p> blocks (permits notes can run a few sentences)
function paras(text) {
  return String(text ?? '').split(/\n+/).map(s => s.trim()).filter(Boolean)
    .map(s => `<p>${esc(s)}</p>`).join('');
}

function climateTable(climate) {
  if (!Array.isArray(climate) || !climate.length) return '';
  const rows = climate.map(c => {
    const rate = (c.rate || '').toLowerCase();
    const cls = rate === 'ideal' ? 'clim-ideal' : rate === 'avoid' ? 'clim-avoid' : 'clim-ok';
    const label = rate === 'ideal' ? 'Ideal' : rate === 'avoid' ? 'Avoid' : 'OK';
    return `<tr><td class="nowrap"><strong>${esc(c.m)}</strong></td><td>${esc(c.hi)}°</td><td>${esc(c.lo)}°</td>`
      + `<td><span class="clim ${cls}">${label}</span></td><td>${esc(c.note || '')}</td></tr>`;
  }).join('');
  return `<div class="tbl-wrap"><table><caption>Climate &amp; best time — typical monthly high / low</caption>`
    + `<thead><tr><th>Month</th><th>High</th><th>Low</th><th>Go?</th><th>Notes</th></tr></thead>`
    + `<tbody>${rows}</tbody></table></div>`;
}

function itinerary(it) {
  if (!it) return '';
  const card = (len, days) => {
    if (!Array.isArray(days) || !days.length) return '';
    const lis = days.map(d => `<li>${esc(d)}</li>`).join('');
    return `<div class="card"><div class="kicker">${len}</div><ol class="itin">${lis}</ol></div>`;
  };
  const cards = [card('3 days', it['3']), card('5 days', it['5']), card('7 days', it['7'])].filter(Boolean).join('');
  if (!cards) return '';
  return `<h4>Sample itineraries</h4><div class="grid3">${cards}</div>`;
}

function gettingThere(g) {
  if (!g) return '';
  const rows = [['Air',g.air],['Rail',g.rail],['Road',g.road]].filter(([,v]) => v)
    .map(([k,v]) => `<li><b>${k}:</b> ${esc(v)}</li>`).join('');
  return rows ? `<h4>Getting there</h4><ul class="clean">${rows}</ul>` : '';
}

// Landmark photo strip (3 × 16:9) for a place, pulled from the Visual Bank by slug.
function destGallery(p) {
  const vb = vbankBySlug[p.slug];
  if (!vb || !Array.isArray(vb.images) || !vb.images.length) return '';
  const figs = vb.images.map((img) => {
    const src = `${VBANK_BASE}/${vb.catalog}/${esc(p.slug)}-${img.n}.jpg`;
    return `<figure style="margin:0">`
      + `<a href="${src}" target="_blank" rel="noopener">`
      + `<img loading="lazy" src="${src}" alt="${esc(img.landmark)}" `
      + `style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;display:block"></a>`
      + `<figcaption class="small" style="margin-top:6px;text-align:center">${esc(img.landmark)}</figcaption>`
      + `</figure>`;
  }).join('');
  return `<h4>Landmarks</h4>`
    + `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:6px">`
    + figs + `</div>`;
}

function renderPlace(p) {
  const region = esc(p.region || '');
  const months = chips(p.bestMonths);
  const op = p.operator || {};
  const opNote = [
    op.costBand ? `<b>Cost band:</b> ${esc(op.costBand)}` : '',
    op.whoToSend ? `<b>Send to:</b> ${esc(op.whoToSend)}` : '',
    op.pairsWith ? `<b>Pairs well with:</b> ${esc(op.pairsWith)}` : '',
  ].filter(Boolean).map(x => `<p style="margin:4px 0">${x}</p>`).join('');

  const blocks = [
    destGallery(p),
    climateTable(p.climate),
    p.whyGo ? `<h4>Why go / vibe</h4><p>${esc(p.whyGo)}</p>` : '',
    Array.isArray(p.sights) && p.sights.length ? `<h4>Top sights &amp; places within</h4>${list(p.sights)}` : '',
    Array.isArray(p.activities) && p.activities.length ? `<h4>Activities menu</h4>${list(p.activities)}` : '',
    itinerary(p.itineraries),
    p.stay ? `<h4>Where to stay</h4><p>${esc(p.stay)}</p>` : '',
    Array.isArray(p.dayTrips) && p.dayTrips.length ? `<h4>Day trips &amp; nearby pairings</h4>${list(p.dayTrips)}` : '',
    p.pack ? `<h4>What to pack</h4><p>${esc(p.pack)}</p>` : '',
    gettingThere(p.gettingThere),
    p.permits ? `<h4>Permits / visa</h4>${paras(p.permits)}` : '',
    opNote ? `<div class="callout driftibo"><div class="ttl">✦ Operator note</div>${opNote}</div>` : '',
    Array.isArray(p.catches) && p.catches.length
      ? `<div class="callout warn"><div class="ttl">⚠ Catches — reconfirm before quoting</div>${list(p.catches,'')}</div>` : '',
  ].filter(Boolean).join('\n');

  return `<details class="dest" id="${esc(p.slug)}">
  <summary>
    <span class="dest-head">
      <span class="dest-name">${esc(p.name)}</span>
      <span class="dest-region">${region}</span>
    </span>
    <span class="dest-months">${months}</span>
    <span class="dest-pitch">${esc(p.pitch || '')}</span>
  </summary>
  <div class="dest-body">
${blocks}
  </div>
</details>`;
}

function renderCatalogPage(cat, places) {
  const head = HEAD(cat.title, cat.lede);
  let body;
  if (cat.sectioned) {
    const sectionKeys = Object.keys(cat.sections);
    body = sectionKeys.map(sk => {
      const inSec = places.filter(p => (p.section || 'A') === sk);
      if (!inSec.length) return '';
      return `<section>\n  <div class="sec-head"><span class="sec-num">${sk}</span><h2>${esc(cat.sections[sk].replace(/^[AB] · /,''))}</h2></div>\n`
        + inSec.map(renderPlace).join('\n') + `\n</section>`;
    }).filter(Boolean).join('\n');
  } else {
    body = `<section style="border-top:0">\n` + places.map(renderPlace).join('\n') + `\n</section>`;
  }
  return [
    head,
    topNav('destinations.html'),
    subNav(cat.file),
    `<main class="wrap">`,
    `<div class="pagehead">\n  <div class="kicker">${esc(cat.kicker)}</div>\n  <h1>${esc(cat.title)}</h1>\n  <p class="lede">${esc(cat.lede)}</p>\n  <p class="small">${places.length} places · tap any place to open its full brief — climate by month, activities, 3/5/7-day plans, stays, getting there, permits and the operator note.</p>\n</div>`,
    body,
    `</main>`,
    FOOTER,
  ].join('\n');
}

const CAT_LABEL = {
  'international': 'International',
  'india-popular': 'India · Popular',
  'india-offbeat': 'India · Offbeat',
  'india-spiritual': 'India · Spiritual',
};
const CAT_ORDER = ['international', 'india-popular', 'india-offbeat', 'india-spiritual'];

// month -> EVERY destination in its best season (climate rated "ideal"), grouped under its catalog
// section. No per-catalog cap and no top-N slice — every place that's in season that month shows,
// segregated by International / India·Popular / India·Offbeat / India·Spiritual.
function monthIndex(all) {
  return MONTHS.map(m => {
    const ideal = all.filter(p => {
      const c = (p.climate || []).find(x => x.m === m);
      return c && (c.rate || '').toLowerCase() === 'ideal';
    });
    const groups = CAT_ORDER.map(cat => {
      const inCat = ideal.filter(p => p._cat === cat);
      if (!inCat.length) return '';
      const links = inCat
        .map(p => `<a href="${CAT_BY_KEY[cat].file}#${esc(p.slug)}">${esc(p.name)}</a>`)
        .join(', ');
      return `<div style="margin:4px 0;line-height:1.55">`
        + `<span style="display:inline-block;min-width:122px;font-size:12px;font-weight:700;`
        + `letter-spacing:.04em;text-transform:uppercase;color:oklch(0.52 0.09 235);vertical-align:top">`
        + `${CAT_LABEL[cat]}</span> <span>${links}</span></div>`;
    }).filter(Boolean).join('');
    return { m, html: groups || '<span class="small">—</span>' };
  });
}

function renderHub(data) {
  const all = [];
  for (const cat of CATALOGS) for (const p of (data[cat.key] || [])) all.push({ ...p, _cat: cat.key });

  const idx = monthIndex(all);
  const idxRows = idx.map(r =>
    `<tr><td class="nowrap"><strong>${r.m}</strong></td><td>${r.html}</td></tr>`).join('');

  const cards = CATALOGS.map(cat => {
    const n = (data[cat.key] || []).length;
    return `    <div class="card">
      <div class="kicker">${esc(cat.kicker.replace(/^Catalog · /,''))}</div>
      <h3><a href="${cat.file}">${esc(cat.title)}</a></h3>
      <p class="small">${esc(cat.lede)}</p>
      <p class="small"><b>${n} places</b> · open →</p>
    </div>`;
  }).join('\n');

  return [
    HEAD('Destinations', 'A trip-planning & sales reference for Driftibo operators — where to send a customer and how to plan it, by month, climate, activities and budget.'),
    topNav('destinations.html'),
    `<main class="wrap">`,
    `<div class="pagehead">
  <div class="kicker">Reference · Destinations</div>
  <h1>Destinations — what to sell &amp; how to plan it</h1>
  <p class="lede">Open any place to brief a customer in seconds: best months &amp; temperature, what there is to do,
    ready-made 3/5/7-day plans, where to stay, how to get there, permits/visa, a budget band and who to send.
    This is your sales-and-planning shelf — the rest of the playbook is how to <em>source &amp; move</em> it.</p>
  <p class="small">${all.length} places across 4 catalogs · as of June 2026</p>
</div>`,
    `<section style="border-top:0;padding-top:22px">
  <div class="callout coral">
    <div class="ttl">How to use this</div>
    <p style="margin-top:2px">A customer asks <em>“where can you send me?”</em> or <em>“what’s a 3-day trip there?”</em> —
      open the catalog, tap the place, and read straight off the brief. Start with the <b>month index</b> below to see
      what’s in season <em>right now</em>, then jump to the catalog for the full kit.</p>
    <p class="small" style="margin-bottom:0">Every figure is a typical range as of <b>June 2026</b>. Visa, permit and
      closure facts move — reconfirm before you quote. <b>To add or edit a place:</b> edit
      <code>destinations-data.json</code>, run <code>node scripts/build-destinations.mjs</code>, then redeploy with
      <code>cd docs/research/playbook &amp;&amp; vercel deploy --prod</code>.</p>
  </div>
</section>`,
    `<section>
  <div class="sec-head"><span class="sec-num">☼</span><h2>Where to send right now — month index</h2></div>
  <p class="small">Every destination at its seasonal best each month (rated “ideal” in its climate table), grouped by catalog. Tap any place to open its full brief.</p>
  <div class="tbl-wrap"><table><caption>Month → every destination in season, by catalog</caption>
    <thead><tr><th>Month</th><th>In their best season — by catalog</th></tr></thead>
    <tbody>${idxRows}</tbody></table></div>
</section>`,
    `<section>
  <div class="sec-head"><span class="sec-num">→</span><h2>The four catalogs</h2></div>
  <div class="grid2">
${cards}
  </div>
</section>`,
    `</main>`,
    FOOTER,
  ].join('\n');
}

// ---- build ----
function build() {
  const data = JSON.parse(readFileSync(DATA, 'utf8'));
  let count = 0;

  writeFileSync(join(PLAYBOOK, 'destinations.html'), renderHub(data));
  count++;

  for (const cat of CATALOGS) {
    const places = data[cat.key] || [];
    writeFileSync(join(PLAYBOOK, cat.file), renderCatalogPage(cat, places));
    count++;
    console.log(`  ${cat.file.padEnd(28)} ${places.length} places`);
  }

  const total = CATALOGS.reduce((n, c) => n + (data[c.key] || []).length, 0);
  console.log(`✓ wrote ${count} HTML files · ${total} places total`);
}

build();
