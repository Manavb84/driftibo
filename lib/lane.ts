// THE LANE SPINE — one source of truth for what each intent *experiences*. Pick a
// lane and the whole site reorients off this: hero scenes + copy, home "Real places" /
// packages headings, the value-proof (no rupee anchor abroad), footer tagline, Explore
// blurb + curated editorial picks, and the micro-trust line. Surfaces branch on LANE[i].
//
// CLIENT-SAFE: imports only the Intent *type* (erased at build) — HeroStage and other
// client islands import this, so it must never pull in catalog.json. Image URLs are
// plain strings into /public/visual-bank; slugs are plain strings resolved elsewhere.
import type { Intent } from "./intent";

export type LaneScene = { name: string; tag: string; blurb: string; image: string };

export type Lane = {
  // Hero
  scenes: LaneScene[];
  heroSubhead: string; // value-prop line under "Stop choosing. Start packing."
  heroEyebrow: string; // "Your star could send you to —"
  // Home — "Real places" proof + packages teaser
  realPlacesKicker: string;
  realPlacesHead: string;
  packagesHead: string;
  // Home — value-proof moment (figure=null ⇒ qualitative card, no ₹ anchor)
  valueProof: { kicker: string; head: string; figure: string | null; unit: string; note: string };
  // Chrome
  footerTagline: string;
  footerFineprint: string;
  microTrust: string;
  // Explore
  exploreBlurb: string;
  editorialHead: string;
  editorialBlurb: string;
  editorialSlugs: string[]; // catalog slugs (info-only is fine) for the curated strip
};

const VB = "/visual-bank";

export const LANE: Record<Intent, Lane> = {
  international: {
    scenes: [
      { name: "Bali", tag: "Temple island · Indonesia", blurb: "Volcano-backed rice terraces, water temples at dawn, and a south coast built for slow days — visa-on-arrival easy.", image: `${VB}/international/bali-1.jpg` },
      { name: "Switzerland", tag: "The original Alps · Europe", blurb: "Glacier trains, lake-mirror towns, and a Jungfrau morning that earns every minute of the flight.", image: `${VB}/international/switzerland-1.jpg` },
      { name: "Vietnam", tag: "Emerald bays · Southeast Asia", blurb: "Limestone karst bays, lantern-lit old towns, and the best street food in Asia — e-visa simple.", image: `${VB}/international/vietnam-1.jpg` },
      { name: "Japan", tag: "Neon & temples · East Asia", blurb: "A bullet train from neon Tokyo to temple-quiet Kyoto — a country that runs like clockwork.", image: `${VB}/international/japan-1.jpg` },
    ],
    heroSubhead: "Visa-easy escapes beyond India — five-star scenery, three-star prices. You set the limits; we plan it and close it on WhatsApp.",
    heroEyebrow: "Your star could send you abroad to —",
    realPlacesKicker: "Real places, beyond the border",
    realPlacesHead: "The world, without the markup.",
    packagesHead: "Trips abroad, already dreamed up",
    valueProof: {
      kicker: "The calm part nobody shouts",
      head: "Five-star scenery. Three-star prices.",
      figure: null,
      unit: "",
      note: "Flights, stays, transfers and a guided day — itemised on WhatsApp before you commit. Visa-easy lanes first; we handle the paperwork list.",
    },
    footerTagline: "The best trips aren't planned. They're sent.",
    footerFineprint: "Planned in India · sent across the world",
    microTrust: "No forms. A real person confirms on WhatsApp — usually within the hour.",
    exploreBlurb: "Beyond India — visa-easy escapes that look like abroad because they are.",
    editorialHead: "Honeymoon-worthy",
    editorialBlurb: "Slow, swoon-worthy first trips abroad — the ones couples come back glowing from.",
    editorialSlugs: ["maldives", "thailand", "sri-lanka", "dubai"],
  },

  india: {
    scenes: [
      { name: "Chopta", tag: "Mini-Switzerland · Uttarakhand", blurb: "A deodar ridge under the highest Shiva temple on earth — pine, snow, and a sunrise that lines up four Himalayan giants.", image: `${VB}/india-offbeat/chopta-1.jpg` },
      { name: "Spiti", tag: "Looks like Iceland · Himachal", blurb: "Cold high-desert moonland, thousand-year monasteries, and a night sky so dark it feels rude to speak.", image: `${VB}/india-offbeat/spiti-1.jpg` },
      { name: "Ziro", tag: "Rice terraces to rival Bali · Arunachal", blurb: "Apatani paddy mosaics, pine hills, and a green valley that turns into a music festival once a year.", image: `${VB}/india-offbeat/ziro-1.jpg` },
      { name: "Gokarna", tag: "Goa's quieter coast · Karnataka", blurb: "Five quiet beaches strung along a cliff path — the only schedule is the tide and the light going gold.", image: `${VB}/india-offbeat/gokarna-1.jpg` },
    ],
    heroSubhead: "Surprise travel to India's hidden corners — you tell us your limits, we plan the trip and close it on WhatsApp.",
    heroEyebrow: "Your star could send you to —",
    realPlacesKicker: "Real places, star-sent",
    realPlacesHead: "Same soul. A fraction of the price.",
    packagesHead: "Trips, already dreamed up",
    valueProof: {
      kicker: "The calm part nobody shouts",
      head: "Looks like a lakh. Runs at ₹6,800 a day.",
      figure: "6,800",
      unit: "/ person / day",
      note: "Stay, transfers, a guided day. Verified, never inflated. The surprise game stays price-free on purpose.",
    },
    footerTagline: "The best trips aren't planned. They're sent.",
    footerFineprint: "Made in India · real corners of it",
    microTrust: "No forms. A real person confirms on WhatsApp — usually within the hour.",
    exploreBlurb: "The names you love and the corners you don't — classics and the offbeat.",
    editorialHead: "Classics worth the hype",
    editorialBlurb: "The India everyone means to see — done well, at the right time of year.",
    editorialSlugs: ["goa", "kerala-backwaters", "ladakh", "rajasthan"],
  },

  spiritual: {
    scenes: [
      { name: "Varanasi", tag: "City of light · Kashi", blurb: "Dawn boats over the ghats, the fire of the evening aarti, and the oldest living streets on earth.", image: `${VB}/india-spiritual/varanasi-1.jpg` },
      { name: "Kedarnath", tag: "Char Dham · Garhwal Himalaya", blurb: "A stone shrine under snow peaks at the end of a high pilgrim trail — the air thin, the quiet total.", image: `${VB}/india-spiritual/char-dham-1.jpg` },
      { name: "Rishikesh", tag: "Yoga on the Ganga · Uttarakhand", blurb: "Where the river leaves the mountains — aarti at dusk, yoga at sunrise, suspension bridges between.", image: `${VB}/india-spiritual/rishikesh-haridwar-1.jpg` },
      { name: "Golden Temple", tag: "Harmandir Sahib · Amritsar", blurb: "Gold glowing on still water at night, and the world's largest free kitchen feeding everyone who comes.", image: `${VB}/india-spiritual/amritsar-1.jpg` },
    ],
    heroSubhead: "Temple trails and pilgrim circuits — the offbeat ones included. You set the limits; we plan the journey and close it on WhatsApp.",
    heroEyebrow: "Your star could send you to —",
    realPlacesKicker: "Real places, on the trail",
    realPlacesHead: "The journey that changes the traveller.",
    packagesHead: "Pilgrim journeys, already shaped",
    valueProof: {
      kicker: "The calm part nobody shouts",
      head: "Sacred days, planned start to finish.",
      figure: null,
      unit: "",
      note: "Stays near the shrine, transfers, darshan timing and a guided day — itemised on WhatsApp. We handle the logistics so you keep the quiet.",
    },
    footerTagline: "Some trips you take. Some take you.",
    footerFineprint: "Made in India · its oldest paths",
    microTrust: "No forms. A real person confirms on WhatsApp — usually within the hour.",
    exploreBlurb: "Temple trails and pilgrim circuits — the offbeat ones included.",
    editorialHead: "Pilgrim trails",
    editorialBlurb: "The circuits worth the journey — east to west, ancient to alive.",
    editorialSlugs: ["bodh-gaya", "pushkar", "madurai", "rameswaram"],
  },
};

// The default lane used for SSR copy when the visitor has not chosen yet (organic
// landing). India keeps the homepage honest to the brand's heartland; the chooser
// still gates client-side, so an undecided visitor is invited to pick.
export const DEFAULT_LANE: Intent = "india";

export function lane(i: Intent | null): Lane {
  return LANE[i ?? DEFAULT_LANE];
}
