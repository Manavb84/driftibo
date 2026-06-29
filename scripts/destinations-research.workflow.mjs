export const meta = {
  name: 'destinations-research',
  description: 'Research ~79 travel destinations into structured JSON for the Driftibo Destinations reference',
  phases: [
    { title: 'Research', detail: 'one Sonnet agent per place → structured brief' },
    { title: 'Verify', detail: 'adversarial recheck of visa/permit/closure facts' },
    { title: 'Refill', detail: 'retry any dropped agents at low concurrency' },
  ],
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// --- entry lists (hard-seeded from the plan; the 4 curated offbeat places are authored separately) ---
const ENTRIES = [
  // international A — famous & commercial
  ...[['thailand','Thailand'],['bali','Bali (Indonesia)'],['vietnam','Vietnam'],['maldives','Maldives'],
      ['sri-lanka','Sri Lanka'],['dubai','Dubai (UAE)'],['bhutan','Bhutan'],['singapore','Singapore'],
      ['switzerland','Switzerland'],['italy','Italy'],['turkey','Turkey (Türkiye)'],['japan','Japan'],['egypt','Egypt']]
    .map(([slug,name]) => ({ cat:'international', section:'A', intl:true, slug, name })),
  // international B — offbeat & underrated
  ...[['georgia','Georgia'],['azerbaijan','Azerbaijan'],['uzbekistan','Uzbekistan'],['albania','Albania'],
      ['montenegro','Montenegro'],['kyrgyzstan','Kyrgyzstan'],['laos','Laos'],['palawan','Palawan (Philippines)'],
      ['oman','Oman'],['jordan','Jordan'],['slovenia','Slovenia'],['ha-giang','Ha Giang Loop (Vietnam)']]
    .map(([slug,name]) => ({ cat:'international', section:'B', intl:true, slug, name })),
  // domestic India — popular
  ...[['goa','Goa'],['kerala-backwaters','Kerala Backwaters'],['munnar','Munnar'],
      ['rajasthan','Rajasthan (Jaipur–Udaipur–Jaisalmer)'],['manali','Manali'],['shimla','Shimla'],
      ['kashmir','Kashmir Valley'],['ladakh','Ladakh (Leh)'],['andaman','Andaman Islands'],['coorg','Coorg'],
      ['rishikesh','Rishikesh'],['darjeeling','Darjeeling'],['agra','Agra'],['mussoorie','Mussoorie'],
      ['nainital','Nainital'],['ooty','Ooty'],['pondicherry','Puducherry'],['gangtok','Gangtok & East Sikkim'],
      ['mcleodganj','McLeodganj & Dharamshala'],['shillong','Shillong & Meghalaya']]
    .map(([slug,name]) => ({ cat:'india-popular', slug, name })),
  // offbeat India — new (curated chopta/spiti/ziro/gokarna authored separately)
  ...[['dzukou','Dzükou Valley'],['gurez','Gurez Valley'],['gandikota','Gandikota'],['mechuka','Mechuka'],
      ['sandakphu','Sandakphu'],['lahaul','Lahaul'],['nongriat','Nongriat'],['jibhi','Jibhi'],
      ['munsiyari','Munsiyari'],['mawlynnong','Mawlynnong'],['tawang','Tawang'],['wayanad','Wayanad'],
      ['khajjiar','Khajjiar'],['hampi','Hampi'],['kanatal','Kanatal'],['lansdowne','Lansdowne']]
    .map(([slug,name]) => ({ cat:'india-offbeat', slug, name })),
  // spiritual India — lean offbeat
  ...[['char-dham','Char Dham (Kedarnath–Badrinath–Gangotri–Yamunotri)'],['varanasi','Varanasi (Kashi)'],
      ['rishikesh-haridwar','Rishikesh & Haridwar'],['amritsar','Amritsar — Golden Temple'],['bodh-gaya','Bodh Gaya'],
      ['pattadakal-hampi','Hampi & Pattadakal'],['kamakhya','Kamakhya, Guwahati'],['rameswaram','Rameswaram'],
      ['pushkar','Pushkar'],['hemkund','Hemkund Sahib'],['tawang-monastery','Tawang Monastery'],
      ['spiti-gompas','Spiti Gompas — Key & Tabo'],['madurai','Madurai — Meenakshi'],['dwarka-somnath','Dwarka & Somnath'],
      ['shravanabelagola','Shravanabelagola'],['kanchipuram','Kanchipuram'],['velankanni','Velankanni'],['sabarimala','Sabarimala']]
    .map(([slug,name]) => ({ cat:'india-spiritual', slug, name })),
]

const CLIMATE_ITEM = {
  type:'object', additionalProperties:false,
  properties:{ m:{type:'string', enum:MONTHS}, hi:{type:'number'}, lo:{type:'number'},
    rate:{type:'string', enum:['ideal','ok','avoid']}, note:{type:'string'} },
  required:['m','hi','lo','rate','note'],
}
const RESEARCH_SCHEMA = {
  type:'object', additionalProperties:false,
  properties:{
    region:{type:'string'},
    bestMonths:{type:'array', items:{type:'string'}},
    pitch:{type:'string'},
    climate:{type:'array', items:CLIMATE_ITEM, minItems:12, maxItems:12},
    whyGo:{type:'string'},
    sights:{type:'array', items:{type:'string'}},
    activities:{type:'array', items:{type:'string'}},
    itineraries:{type:'object', additionalProperties:false, properties:{
      '3':{type:'array', items:{type:'string'}}, '5':{type:'array', items:{type:'string'}}, '7':{type:'array', items:{type:'string'}} },
      required:['3','5','7'] },
    stay:{type:'string'},
    dayTrips:{type:'array', items:{type:'string'}},
    pack:{type:'string'},
    gettingThere:{type:'object', additionalProperties:false, properties:{air:{type:'string'},rail:{type:'string'},road:{type:'string'}}, required:['air','rail','road']},
    permits:{type:'string'},
    operator:{type:'object', additionalProperties:false, properties:{costBand:{type:'string'},whoToSend:{type:'string'},pairsWith:{type:'string'}}, required:['costBand','whoToSend','pairsWith']},
    catches:{type:'array', items:{type:'string'}},
  },
  required:['region','bestMonths','pitch','climate','whyGo','sights','activities','itineraries','stay','dayTrips','pack','gettingThere','permits','operator','catches'],
}
const VERIFY_SCHEMA = {
  type:'object', additionalProperties:false,
  properties:{ permits:{type:'string'}, catches:{type:'array', items:{type:'string'}}, confident:{type:'boolean'} },
  required:['permits','catches','confident'],
}

const researchPrompt = (e) => {
  const ctx = e.intl
    ? 'This is an INTERNATIONAL destination sold to Indian travellers from India. Cost band = INR per person for a typical mid-range trip INCLUDING return flights from India.'
    : 'This is a destination within INDIA. Cost band = INR per person, LAND-ONLY (excluding flights), typical mid-range.'
  return `You are a senior travel-trade researcher writing an operator's planning + sales brief for "${e.name}".
${ctx}
Return ONLY structured data (it is validated). This is an internal reference whose figures are treated as "typical ranges" and reconfirmed before quoting — so give real, specific numbers, not hedges.

Fill every field accurately:
- region: short "Area / Country · altitude or 'sea level'" label.
- bestMonths: 3-6 month abbreviations (from Jan..Dec) that are genuinely best to visit.
- pitch: one vivid sales line an agent can read aloud to a customer.
- climate: EXACTLY 12 entries Jan..Dec, typical daytime high & night low in °C, rate ideal|ok|avoid, short note (monsoon/snow/closure/peak/heat). Ratings MUST agree with bestMonths.
- whyGo: 1-2 sentences on the vibe. sights: 4-6 named places within. activities: 4-6 things to do.
- itineraries: 3-day = 3 lines, 5-day = 5 lines, 7-day = 7 lines; one tight activity line per day.
- stay: stay zones + budget/comfort/luxury feel. dayTrips: 3-4 nearby pairings. pack: one line.
- gettingThere: air / rail / road, each with rough hours from the usual gateway.
- permits: for an INDIAN traveller — visa status (intl) OR inner-line/protected-area permits + seasonal road/temple closures (domestic). Be precise.
- operator: costBand (₹ range like "₹45–70k pp / 5-6 days"), whoToSend (customer type), pairsWith (places it combines with).
- catches: 3-5 real gotchas (closures, permits, altitude, dress code, scams, monsoon, crowds).
Keep every string tight — no filler, no marketing fluff beyond the pitch.`
}

const verifyPrompt = (e, r) => `Adversarially fact-check ONLY the riskiest facts in a travel brief for "${e.name}". The researcher wrote:
permits/visa: "${r.permits}"
catches: ${JSON.stringify(r.catches)}
For an INDIAN passport holder, skeptically reconfirm ${e.intl
  ? 'the ACTUAL visa situation (visa-free / visa-on-arrival / e-visa / embassy visa) and any recent change'
  : 'any inner-line or protected-area permit, restricted-zone rule, and seasonal road/temple closure window'}.
If the researcher is wrong, vague, or out of date, CORRECT it. Return a corrected permits string and an updated catches list (keep the accurate ones, fix or replace wrong ones, surface any missed visa/permit/closure gotcha). Set confident=false if you are not sure — prefer flagging uncertainty over false confidence.`

const attach = (e) => (r) => r ? { ...r, slug:e.slug, name:e.name, ...(e.section?{section:e.section}:{}), _cat:e.cat } : null
const riskyRe = /permit|ILP|RAP|protected|inner.?line|clos(e|ur)|restricted|seasonal|visa/i

phase('Research')
log(`Researching ${ENTRIES.length} destinations on Sonnet…`)

const results = await pipeline(ENTRIES,
  (e) => agent(researchPrompt(e), { label:`research:${e.slug}`, phase:'Research', schema:RESEARCH_SCHEMA, model:'sonnet' }).then(attach(e)),
  (r, e) => {
    if (!r) return null
    const risky = e.intl || riskyRe.test(r.permits || '')
    if (!risky) return r
    return agent(verifyPrompt(e, r), { label:`verify:${e.slug}`, phase:'Verify', schema:VERIFY_SCHEMA, model:'sonnet' })
      .then(v => v ? { ...r, permits: v.permits || r.permits, catches: (v.catches && v.catches.length) ? v.catches : r.catches } : r)
  },
)

// refill: retry dropped agents once, sequentially (low concurrency)
phase('Refill')
const out = []
for (let i = 0; i < ENTRIES.length; i++) {
  let r = results[i]
  if (!r) {
    const e = ENTRIES[i]
    log(`refill ${e.slug}`)
    r = await agent(researchPrompt(e), { label:`refill:${e.slug}`, phase:'Refill', schema:RESEARCH_SCHEMA, model:'sonnet' }).then(attach(e))
  }
  if (r) out.push(r)
}

const data = { international:[], 'india-popular':[], 'india-offbeat':[], 'india-spiritual':[] }
for (const r of out) { const { _cat, ...rest } = r; (data[_cat] ||= []).push(rest) }
log(`Done: ${out.length}/${ENTRIES.length} places researched`)
return data
