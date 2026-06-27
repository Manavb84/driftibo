-- Seed the content tables with the exact current static-file copy + existing /images
-- paths, so the live site renders identically after the cutover to DB reads.
-- Dollar-quoted literals ($$...$$) avoid escaping the curly quotes / em-dashes in the copy.
-- Idempotent on slug (on conflict do nothing) so re-applying is safe.

-- ── destinations ──
insert into public.destinations
  (slug, name, look_like, region, alt, tag, photo, scene, rate, day_count, lede, mood, catches, numbers, days, hero_image_url, portrait_image_url, status, sort_order)
values
  ('chopta', 'Chopta', 'Mini-Switzerland', 'Uttarakhand', '2,680m', 'Mini-Switzerland · Uttarakhand', 'Chopta · ref ✓', 's-chopta', '≈ ₹6,800', '5 days',
   $$India’s mini-Switzerland: a pine ridge under the Tungnath peaks, base for the highest Shiva temple on earth and a Chandrashila sunrise that lines up four Himalayan giants.$$,
   $$Pines, then a temple in the clouds, then a meadow nobody geotags — and back, slowly.$$,
   array[$$Road snows over in deep winter.$$, $$Network drops past Ukhimath.$$, $$Limited stays — book ahead in peak.$$],
   array[$$Best: Apr–Jun · Sep–Nov$$, $$From Delhi: ~10h overnight$$, $$Stay: 3–5 nights$$],
   $$[{"d":"Day 1","t":"Into the pines","p":"Night train to Haridwar, road up as the deodar line begins. Ridge-side stay, first chai with a Tungnath view."},{"d":"Day 2","t":"Tungnath at dawn","p":"Climb to the highest Shiva temple on earth, push to Chandrashila for the crown line."},{"d":"Day 3","t":"The meadow nobody geotags","p":"Guided walk to Deoria Tal, Chaukhamba mirrored on still water."},{"d":"Day 4–5","t":"Drift back, slowly","p":"Forest-village morning, buffer day built in — the star never over-packs."}]$$::jsonb,
   '/images/chopta-hero.jpg', '/images/chopta-portrait.jpg', 'published', 1),

  ('spiti', 'Spiti', 'Looks like Iceland', 'Himachal', '3,800m', 'Looks like Iceland · Himachal', 'Spiti · ref ✓', 's-spiti', '≈ ₹7,400', '7 days',
   $$A cold high-desert of moonland switchbacks and thousand-year monasteries, where the night sky feels close enough to touch and the silence does the talking.$$,
   $$Switchbacks to gompas, prayer flags in thin air, a sky so dark it feels rude.$$,
   array[$$Altitude is real — acclimatise slowly.$$, $$Roads close with the first heavy snow.$$, $$Cash + fuel before you go remote.$$],
   array[$$Best: Jun–Sep$$, $$From Manali/Shimla: 2-day road$$, $$Stay: 6–8 nights$$],
   $$[{"d":"Day 1–2","t":"Climb slow","p":"Road in via Kinnaur, acclimatising as the green gives way to moonland."},{"d":"Day 3","t":"Key & Kibber","p":"Monastery morning, the highest villages, butter tea with monks."},{"d":"Day 4","t":"Chandratal","p":"The moon lake, a night under more stars than dark."},{"d":"Day 5–7","t":"Drift down","p":"Slow descent, hot springs, hand-back to the world."}]$$::jsonb,
   '/images/spiti-hero.jpg', '/images/spiti-portrait.jpg', 'published', 2),

  ('ziro', 'Ziro', 'Rice terraces to rival Bali', 'Arunachal', '1,500m', 'Rice terraces to rival Bali · Arunachal', 'Ziro · ref ✓', 's-ziro', '≈ ₹6,900', '6 days',
   $$A green Apatani valley farmed the old way — pine hills, paddy mosaics, and a music festival that turns the whole place into a song once a year.$$,
   $$Bali-green terraces by day, a valley that becomes a festival by night.$$,
   array[$$Inner Line Permit required (we sort it).$$, $$Roads are long and winding.$$, $$Festival dates book out months ahead.$$],
   array[$$Best: Mar–Oct (Sep for music)$$, $$From Guwahati: ~8h + train$$, $$Stay: 5–7 nights$$],
   $$[{"d":"Day 1","t":"Into the valley","p":"Train to Naharlagun, road up into pine and paddy."},{"d":"Day 2","t":"Apatani mornings","p":"Village walk, the old tattoos and tales, homestay food."},{"d":"Day 3","t":"Terrace light","p":"Cycle the paddy mosaic, kiwi orchards, slow afternoon."},{"d":"Day 4–6","t":"Sound & home","p":"A night of valley music, then a soft drift back."}]$$::jsonb,
   '/images/ziro-hero.jpg', '/images/ziro-portrait.jpg', 'published', 3),

  ('gokarna', 'Gokarna', 'Goa’s quieter coast', 'Karnataka', 'sea level', 'Goa’s quieter coast · Karnataka', 'Gokarna · ref ✓', 's-gokarna', '≈ ₹6,200', '5 days',
   $$Goa’s quieter sibling — a temple town with five beaches strung along a cliff path, where the only schedule is the tide and the light going gold.$$,
   $$Five beaches on a cliff path, a scooter, and nowhere you have to be.$$,
   array[$$Monsoon shuts the beach shacks (Jun–Sep).$$, $$Cliff walks need decent shoes.$$, $$It’s a pilgrimage town — dress kind near temples.$$],
   array[$$Best: Oct–Mar$$, $$From Goa: ~3h road$$, $$Stay: 4–6 nights$$],
   $$[{"d":"Day 1","t":"Temple town","p":"Settle in, the main beach at sunset, thali dinner."},{"d":"Day 2","t":"The cliff path","p":"Walk Kudle to Om to Half Moon, swim where you like it."},{"d":"Day 3","t":"Paradise & back","p":"Boat to the far cove, hammock hours, no plan."},{"d":"Day 4–5","t":"Slow gold","p":"Scooter the backroads, one last sunrise, drift home."}]$$::jsonb,
   '/images/gokarna-hero.jpg', '/images/gokarna-portrait.jpg', 'published', 4)
on conflict (slug) do nothing;

-- ── articles ──
insert into public.articles
  (slug, kind, read, photo, scene, title, dek, body, hero_image_url, status, sort_order)
values
  ('switzerland-twins', 'Guide', '6 min', 'Chopta ridge · ref ✓', 's-chopta',
   $$9 places in India that look like Switzerland$$, $$And cost a tenth. A field-tested list, season by season.$$,
   $$[{"type":"p","text":"Everyone has the same saved folder: a green valley, a wooden chalet, a lake so still it doubles the sky. Almost none of them book the flight. It feels far, dear, and complicated."},{"type":"p","text":"It usually is not. The same picture — pine ridges, alpine meadows, snow lines — repeats across India for a fraction of the cost and none of the visa."},{"type":"h","text":"Start with Chopta"},{"type":"p","text":"A deodar ridge under Tungnath, the highest Shiva temple on earth. A Chandrashila sunrise lines up four Himalayan giants. People call it mini-Switzerland and, for once, the nickname earns its keep."},{"type":"q","text":"Same soul. A fraction of the price. Bookable now."},{"type":"h","text":"Then go further"},{"type":"p","text":"Spiti for the cold-desert greys of Iceland. Ziro for terraces that rival Bali. Dzükou for New Zealand greens. Gokarna for a quieter coast than the one everyone posts."},{"type":"p","text":"The trick is not the place. It is letting something else choose it, before the research kills the trip."}]$$::jsonb,
   '/images/chopta-hero.jpg', 'published', 1),

  ('why-we-stopped', 'Essay', '4 min', 'Forty open tabs', 's-spiti',
   $$Why we stopped letting people choose$$, $$On the tyranny of 40 open tabs.$$,
   $$[{"type":"p","text":"Everyone we talked to wanted to travel more and planned less than they meant to. Not for lack of options — for too many. The trip dies in the research."},{"type":"q","text":"So we built a star that decides, and a promise that what it picks is real."},{"type":"p","text":"Tell it your limits. It sends you somewhere true — anchored to a real reference photo, no phantom places. You stop choosing. You just go."},{"type":"p","text":"It turns out the freedom people wanted was not more choice. It was permission to stop."}]$$::jsonb,
   '/images/spiti-hero.jpg', 'published', 2),

  ('how-we-make-images', 'Honest', '3 min', 'Reference + render', 's-gokarna',
   $$How we make our images (and why we anchor them)$$, $$Generated images, real places — declared up front.$$,
   $$[{"type":"p","text":"Every location image on Driftibo is AI-generated. We say that plainly, because the alternative — pretending — is how phantom destinations end up in brochures."},{"type":"h","text":"The anchor rule"},{"type":"p","text":"A place only enters the spin pool once a real reference photo of that exact spot exists and the render is approved against it. Generated, yes. Invented, never."},{"type":"q","text":"No phantom destinations. Ever."},{"type":"p","text":"If the render drifts from the real place, it does not ship. That is the whole rule, and we are happy to be boring about it."}]$$::jsonb,
   '/images/gokarna-hero.jpg', 'published', 3)
on conflict (slug) do nothing;

-- ── packages ──
insert into public.packages
  (slug, kicker, name, region, photo, glow, rate, nights, tags, blurb, cta, context, even, well_scene, portrait_image_url, sort_order)
values
  ('cold-desert', 'Drift 01 · Himachal', 'The Cold Desert', 'Spiti · 7 nights', 'Spiti · real anchored photo', 'glow-teal', '≈ ₹7,400', '7 nights',
   array[$$High desert$$, $$Monastery silence$$, $$Big skies$$],
   $$Moonland switchbacks, thousand-year gompas, and nights so dark the Milky Way feels rude. The kind of quiet that resets you for a year.$$,
   $$Take The Cold Desert$$, $$the Spiti — Cold Desert package (7 nights)$$, true, 's-spiti', '/images/spiti-portrait.jpg', 1),

  ('slow-coast', 'Drift 02 · Karnataka', 'Slow Coast', 'Gokarna · 5 nights', 'Gokarna · real anchored photo', 'glow-coral', '≈ ₹6,200', '5 nights',
   array[$$Five beaches$$, $$No plan$$, $$Scooter days$$],
   $$Goa’s quieter sibling — five beaches strung on a cliff path, temple town at the centre, and absolutely nowhere you have to be. Drift until the light turns gold.$$,
   $$Take Slow Coast$$, $$the Gokarna — Slow Coast package (5 nights)$$, false, 's-gokarna', '/images/gokarna-portrait.jpg', 2),

  ('rice-and-fog', 'Drift 03 · Arunachal', 'Rice & Fog', 'Ziro · 6 nights', 'Ziro · real anchored photo', 'glow-teal', '≈ ₹6,900', '6 nights',
   array[$$Apatani valley$$, $$Music country$$, $$Rice terraces$$],
   $$Bali-green terraces farmed the old way, pine hills, and a valley that turns into a festival once a year. People, sound, and a story worth bringing home.$$,
   $$Take Rice & Fog$$, $$the Ziro — Rice & Fog package (6 nights)$$, true, 's-ziro', '/images/ziro-portrait.jpg', 3),

  ('temple-ridge', 'Drift 04 · Uttarakhand', 'Temple Ridge', 'Chopta · 5 nights', 'Chopta · real anchored photo', 'glow-coral', '≈ ₹6,800', '5 nights',
   array[$$Mini-Switzerland$$, $$Highest Shiva temple$$, $$Meadow walks$$],
   $$A deodar ridge under Tungnath, the highest Shiva temple on earth, and a Chandrashila sunrise lining up four Himalayan giants. Slow, soft, sized for a squad.$$,
   $$Take Temple Ridge$$, $$the Chopta — Temple Ridge package (5 nights)$$, false, 's-chopta', '/images/chopta-portrait.jpg', 4)
on conflict (slug) do nothing;

-- ── offerings ──
insert into public.offerings (slug, name, photo, descr, form_sub, image_url, sort_order)
values
  ('/surprise', 'Surprise me', 'Let the star choose',
   $$Let the star pick — we book the trip it sends, end to end.$$,
   $$Give us your limits — we’ll let the star do the choosing.$$, '/images/offering-surprise.jpg', 1),
  ('/custom', 'Custom & honeymoon', 'Tailored to you',
   $$You have a place in mind. We tailor it around the two of you.$$,
   $$Tell us the place and the occasion. We tailor every day.$$, '/images/offering-honeymoon.jpg', 2),
  ('/concierge', 'Concierge', 'Hands-off, premium',
   $$Premium and hands-off. We carry every detail so you carry none.$$,
   $$Tell us the broad strokes. We handle the rest, invisibly.$$, '/images/offering-concierge.jpg', 3),
  ('/corporate', 'Corporate offsites', 'Teams & logistics',
   $$Teams, logistics, one point of contact. We run the whole offsite.$$,
   $$Team size and goals — we design the offsite around them.$$, '/images/offering-corporate.jpg', 4)
on conflict (slug) do nothing;
