// Single source of truth for the destinations grid + dynamic detail/itinerary routes.
// Extracted from audit/sources/Destinations.dc.html (the prototype DCLogic D array + sceneMap).

export type ItinDay = {
  d: string; // "Day 1", "Day 2–3", etc.
  t: string; // title
  p: string; // paragraph
};

export type Destination = {
  slug: string;
  name: string;
  /** e.g. "Mini-Switzerland · Uttarakhand" */
  lookLike: string;
  region: string;
  /** e.g. "2,680m" or "sea level" */
  alt: string;
  /** grid card tag line */
  tag: string;
  /** data-label for the well placeholder */
  photo: string;
  /** scene class e.g. "s-chopta" */
  scene: "s-chopta" | "s-spiti" | "s-ziro" | "s-gokarna" | "s-gangtey" | "s-dusk";
  /** lede paragraph shown in the detail overview */
  lede: string;
  /** estimated rate shown in the price badge */
  rate: string;
  /** day count label e.g. "5 days" */
  dayCount: string;
  /** one-sentence mood itinerary shown in the "Mood itinerary" poetry block */
  mood: string;
  catches: string[];
  numbers: string[];
  days: ItinDay[];
};

const destinations: Destination[] = [
  {
    slug: "chopta",
    name: "Chopta",
    lookLike: "Mini-Switzerland",
    region: "Uttarakhand",
    alt: "2,680m",
    tag: "Mini-Switzerland · Uttarakhand",
    photo: "Chopta · ref ✓",
    scene: "s-chopta",
    rate: "≈ ₹6,800",
    dayCount: "5 days",
    lede:
      "India’s mini-Switzerland: a pine ridge under the Tungnath peaks, base for the highest Shiva temple on earth and a Chandrashila sunrise that lines up four Himalayan giants.",
    catches: [
      "Road snows over in deep winter.",
      "Network drops past Ukhimath.",
      "Limited stays — book ahead in peak.",
    ],
    numbers: ["Best: Apr–Jun · Sep–Nov", "From Delhi: ~10h overnight", "Stay: 3–5 nights"],
    mood: "Pines, then a temple in the clouds, then a meadow nobody geotags — and back, slowly.",
    days: [
      {
        d: "Day 1",
        t: "Into the pines",
        p: "Night train to Haridwar, road up as the deodar line begins. Ridge-side stay, first chai with a Tungnath view.",
      },
      {
        d: "Day 2",
        t: "Tungnath at dawn",
        p: "Climb to the highest Shiva temple on earth, push to Chandrashila for the crown line.",
      },
      {
        d: "Day 3",
        t: "The meadow nobody geotags",
        p: "Guided walk to Deoria Tal, Chaukhamba mirrored on still water.",
      },
      {
        d: "Day 4–5",
        t: "Drift back, slowly",
        p: "Forest-village morning, buffer day built in — the star never over-packs.",
      },
    ],
  },
  {
    slug: "spiti",
    name: "Spiti",
    lookLike: "Looks like Iceland",
    region: "Himachal",
    alt: "3,800m",
    tag: "Looks like Iceland · Himachal",
    photo: "Spiti · ref ✓",
    scene: "s-spiti",
    rate: "≈ ₹7,400",
    dayCount: "7 days",
    lede:
      "A cold high-desert of moonland switchbacks and thousand-year monasteries, where the night sky feels close enough to touch and the silence does the talking.",
    catches: [
      "Altitude is real — acclimatise slowly.",
      "Roads close with the first heavy snow.",
      "Cash + fuel before you go remote.",
    ],
    numbers: ["Best: Jun–Sep", "From Manali/Shimla: 2-day road", "Stay: 6–8 nights"],
    mood: "Switchbacks to gompas, prayer flags in thin air, a sky so dark it feels rude.",
    days: [
      {
        d: "Day 1–2",
        t: "Climb slow",
        p: "Road in via Kinnaur, acclimatising as the green gives way to moonland.",
      },
      {
        d: "Day 3",
        t: "Key & Kibber",
        p: "Monastery morning, the highest villages, butter tea with monks.",
      },
      {
        d: "Day 4",
        t: "Chandratal",
        p: "The moon lake, a night under more stars than dark.",
      },
      {
        d: "Day 5–7",
        t: "Drift down",
        p: "Slow descent, hot springs, hand-back to the world.",
      },
    ],
  },
  {
    slug: "ziro",
    name: "Ziro",
    lookLike: "Rice terraces to rival Bali",
    region: "Arunachal",
    alt: "1,500m",
    tag: "Rice terraces to rival Bali · Arunachal",
    photo: "Ziro · ref ✓",
    scene: "s-ziro",
    rate: "≈ ₹6,900",
    dayCount: "6 days",
    lede:
      "A green Apatani valley farmed the old way — pine hills, paddy mosaics, and a music festival that turns the whole place into a song once a year.",
    catches: [
      "Inner Line Permit required (we sort it).",
      "Roads are long and winding.",
      "Festival dates book out months ahead.",
    ],
    numbers: ["Best: Mar–Oct (Sep for music)", "From Guwahati: ~8h + train", "Stay: 5–7 nights"],
    mood: "Bali-green terraces by day, a valley that becomes a festival by night.",
    days: [
      {
        d: "Day 1",
        t: "Into the valley",
        p: "Train to Naharlagun, road up into pine and paddy.",
      },
      {
        d: "Day 2",
        t: "Apatani mornings",
        p: "Village walk, the old tattoos and tales, homestay food.",
      },
      {
        d: "Day 3",
        t: "Terrace light",
        p: "Cycle the paddy mosaic, kiwi orchards, slow afternoon.",
      },
      {
        d: "Day 4–6",
        t: "Sound & home",
        p: "A night of valley music, then a soft drift back.",
      },
    ],
  },
  {
    slug: "gokarna",
    name: "Gokarna",
    lookLike: "Goa’s quieter coast",
    region: "Karnataka",
    alt: "sea level",
    tag: "Goa’s quieter coast · Karnataka",
    photo: "Gokarna · ref ✓",
    scene: "s-gokarna",
    rate: "≈ ₹6,200",
    dayCount: "5 days",
    lede:
      "Goa’s quieter sibling — a temple town with five beaches strung along a cliff path, where the only schedule is the tide and the light going gold.",
    catches: [
      "Monsoon shuts the beach shacks (Jun–Sep).",
      "Cliff walks need decent shoes.",
      "It’s a pilgrimage town — dress kind near temples.",
    ],
    numbers: ["Best: Oct–Mar", "From Goa: ~3h road", "Stay: 4–6 nights"],
    mood: "Five beaches on a cliff path, a scooter, and nowhere you have to be.",
    days: [
      {
        d: "Day 1",
        t: "Temple town",
        p: "Settle in, the main beach at sunset, thali dinner.",
      },
      {
        d: "Day 2",
        t: "The cliff path",
        p: "Walk Kudle to Om to Half Moon, swim where you like it.",
      },
      {
        d: "Day 3",
        t: "Paradise & back",
        p: "Boat to the far cove, hammock hours, no plan.",
      },
      {
        d: "Day 4–5",
        t: "Slow gold",
        p: "Scooter the backroads, one last sunrise, drift home.",
      },
    ],
  },
];

export default destinations;

/** Look up a destination by slug — returns undefined for unknown slugs. */
export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

/** All slugs — used by generateStaticParams. */
export function allSlugs(): string[] {
  return destinations.map((d) => d.slug);
}
