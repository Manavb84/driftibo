-- Placeholder International + Spiritual product so EVERY lane has a real "Ready to
-- book" path. DUMMY prices/itineraries — the founder refines before real customers
-- see them. Slugs match existing catalog.json places + visual-bank images, so each
-- gets a working detail page, Explore card, and game route. Idempotent (on conflict).

-- ── International destinations (lane = international) ──
insert into public.destinations
  (slug, name, look_like, region, alt, tag, photo, scene, lede, rate, day_count, mood,
   catches, numbers, days, hero_image_url, portrait_image_url, status, sort_order, lane,
   inclusions, exclusions)
values
  ($x$bali$x$, $x$Bali$x$, $x$Temple-island calm$x$, $x$Indonesia$x$, $x$Sea level$x$,
   $x$Rice terraces & temple mornings · Indonesia$x$, $x$Bali · ref$x$, $x$s-dusk$x$,
   $x$Volcano-backed rice terraces, water temples at dawn, and a south coast built for slow days — visa-on-arrival easy, five-star scenery at three-star prices.$x$,
   $x$≈ from ₹62,000$x$, $x$6 days$x$, $x$Terraces, temples, then a beach you do not want to leave.$x$,
   array[$x$Tourist tax on arrival (small).$x$, $x$Ubud traffic is real — base smart.$x$, $x$Wet season Nov–Mar.$x$],
   array[$x$Best: Apr–Oct$x$, $x$Flight: ~6–8h via hub$x$, $x$Stay: 5–7 nights$x$],
   $j$[{"d":"Day 1","t":"Land in Ubud","p":"Settle into the rice-terrace heart, sunset over Tegallalang, a first slow dinner."},{"d":"Day 2","t":"Water temples at dawn","p":"Tirta Empul and a quiet east-coast temple before the crowds, then a waterfall afternoon."},{"d":"Day 3–6","t":"South to the coast","p":"Drift to Uluwatu and the Bukit beaches — cliff temples, surf-watching, buffer day built in."}]$j$::jsonb,
   $x$/visual-bank/international/bali-1.jpg$x$, $x$/visual-bank/international/bali-2.jpg$x$,
   $x$published$x$, 10, $x$international$x$,
   array[$x$Boutique stays in Ubud & Bukit$x$, $x$Private driver-guide days$x$, $x$Breakfast daily$x$, $x$Water-temple + waterfall guided day$x$],
   array[$x$International flights$x$, $x$Indonesia tourist tax$x$, $x$Most lunches & dinners$x$, $x$Travel insurance$x$]),

  ($x$switzerland$x$, $x$Switzerland$x$, $x$The original Alps$x$, $x$Switzerland$x$, $x$Alpine$x$,
   $x$Glacier rail & lake towns · Switzerland$x$, $x$Switzerland · ref$x$, $x$s-dusk$x$,
   $x$The mountains every Indian hill station is compared to — glacier trains, lake-mirror towns, and a Jungfrau morning that earns the Schengen visa.$x$,
   $x$≈ from ₹1,45,000$x$, $x$7 days$x$, $x$Rail, peaks, lakes — the postcard, in full.$x$,
   array[$x$Schengen visa needed — apply early.$x$, $x$Premium on everything; we pace the spend.$x$, $x$Peaks close in heavy weather.$x$],
   array[$x$Best: May–Sep$x$, $x$Flight: ~9–11h$x$, $x$Stay: 6–8 nights$x$],
   $j$[{"d":"Day 1","t":"Zurich to Lucerne","p":"Lakefront old town, Chapel Bridge, an easy first evening by the water."},{"d":"Day 2","t":"Up the Jungfrau line","p":"The glacier railway to the saddle of Europe, snow underfoot in summer."},{"d":"Day 3–7","t":"Interlaken & the lakes","p":"Grindelwald meadows, a lake-steamer day, and the slow rail back — buffer built in."}]$j$::jsonb,
   $x$/visual-bank/international/switzerland-1.jpg$x$, $x$/visual-bank/international/switzerland-2.jpg$x$,
   $x$published$x$, 11, $x$international$x$,
   array[$x$Lake-town & alpine stays$x$, $x$Swiss Travel Pass (rail)$x$, $x$Breakfast daily$x$, $x$Jungfrau excursion day$x$],
   array[$x$International flights$x$, $x$Schengen visa fee$x$, $x$Most lunches & dinners$x$, $x$Travel insurance$x$]),

  ($x$vietnam$x$, $x$Vietnam$x$, $x$Limestone bays & street food$x$, $x$Vietnam$x$, $x$Coastal$x$,
   $x$Ha Long Bay & old towns · Vietnam$x$, $x$Vietnam · ref$x$, $x$s-dusk$x$,
   $x$Emerald karst bays, lantern-lit old towns, and the best street food in Asia — e-visa simple, gentle on the wallet, big on wonder.$x$,
   $x$≈ from ₹58,000$x$, $x$8 days$x$, $x$Bay cruise, old-town nights, a bowl of pho at dawn.$x$,
   array[$x$E-visa online ahead.$x$, $x$North is cool Dec–Feb.$x$, $x$Domestic hops between regions.$x$],
   array[$x$Best: Oct–Apr$x$, $x$Flight: ~5–7h$x$, $x$Stay: 7–9 nights$x$],
   $j$[{"d":"Day 1","t":"Hanoi old quarter","p":"Lantern lanes, egg coffee, a first street-food crawl with a local host."},{"d":"Day 2","t":"Ha Long Bay cruise","p":"Overnight on the emerald water, kayaking through limestone karsts."},{"d":"Day 3–8","t":"Hoi An by lantern","p":"Tailor town and beach days down the coast, buffer day held in reserve."}]$j$::jsonb,
   $x$/visual-bank/international/vietnam-1.jpg$x$, $x$/visual-bank/international/vietnam-2.jpg$x$,
   $x$published$x$, 12, $x$international$x$,
   array[$x$Old-town & beach stays$x$, $x$Overnight Ha Long cruise$x$, $x$Breakfast daily$x$, $x$Guided street-food evening$x$],
   array[$x$International flights$x$, $x$Vietnam e-visa fee$x$, $x$Most lunches & dinners$x$, $x$Travel insurance$x$]),

  ($x$japan$x$, $x$Japan$x$, $x$Bullet trains & temple towns$x$, $x$Japan$x$, $x$Varied$x$,
   $x$Shinkansen & cherry season · Japan$x$, $x$Japan · ref$x$, $x$s-dusk$x$,
   $x$Neon Tokyo, temple-quiet Kyoto, and a bullet train between — a country that runs like clockwork and rewards every minute of the long flight.$x$,
   $x$≈ from ₹1,35,000$x$, $x$8 days$x$, $x$City lights, then a thousand torii gates, then a garden hush.$x$,
   array[$x$Visa needed — apply early.$x$, $x$Cherry season books out fast.$x$, $x$Cash still useful.$x$],
   array[$x$Best: Mar–May · Oct–Nov$x$, $x$Flight: ~9–12h$x$, $x$Stay: 7–9 nights$x$],
   $j$[{"d":"Day 1","t":"Tokyo arrival","p":"Shibuya crossing, an izakaya alley dinner, the city by night."},{"d":"Day 2","t":"Shinkansen to Kyoto","p":"Fushimi Inari at dawn, Arashiyama bamboo, a tea-house afternoon."},{"d":"Day 3–8","t":"Temple towns & gardens","p":"Nara deer park and Kyoto gardens, with a buffer day for the unplanned."}]$j$::jsonb,
   $x$/visual-bank/international/japan-1.jpg$x$, $x$/visual-bank/international/japan-2.jpg$x$,
   $x$published$x$, 13, $x$international$x$,
   array[$x$City & ryokan-style stays$x$, $x$Japan Rail Pass (bullet train)$x$, $x$Breakfast daily$x$, $x$Guided Kyoto temple day$x$],
   array[$x$International flights$x$, $x$Japan visa fee$x$, $x$Most lunches & dinners$x$, $x$Travel insurance$x$])
on conflict (slug) do nothing;

-- ── Spiritual destinations (lane = spiritual; Char Dham already seeded) ──
insert into public.destinations
  (slug, name, look_like, region, alt, tag, photo, scene, lede, rate, day_count, mood,
   catches, numbers, days, hero_image_url, portrait_image_url, status, sort_order, lane,
   inclusions, exclusions)
values
  ($x$varanasi$x$, $x$Varanasi$x$, $x$The oldest living city$x$, $x$Uttar Pradesh$x$, $x$Riverine$x$,
   $x$Ganga aarti & dawn boats · Kashi$x$, $x$Varanasi · ref$x$, $x$s-dusk$x$,
   $x$Kashi — the city of light. Dawn boats over the ghats, the fire of the evening aarti, and Sarnath where the Buddha first taught, a short drive away.$x$,
   $x$≈ from ₹14,500$x$, $x$4 days$x$, $x$A dawn boat, a sea of lamps at dusk, the oldest streets on earth.$x$,
   array[$x$Ghats are crowded at festivals.$x$, $x$Lanes are narrow — go on foot.$x$, $x$Summer is very hot.$x$],
   array[$x$Best: Oct–Mar$x$, $x$From Delhi: ~1.5h flight$x$, $x$Stay: 3–4 nights$x$],
   $j$[{"d":"Day 1","t":"Arrive on the ghats","p":"Riverside stay, evening Ganga aarti at Dashashwamedh from a boat."},{"d":"Day 2","t":"Dawn on the water","p":"Sunrise boat past the bathing ghats, then the old-city temple walk."},{"d":"Day 3–4","t":"Sarnath & quiet","p":"Where the Buddha first taught, a museum morning, a slow last evening."}]$j$::jsonb,
   $x$/visual-bank/india-spiritual/varanasi-1.jpg$x$, $x$/visual-bank/india-spiritual/varanasi-2.jpg$x$,
   $x$published$x$, 20, $x$spiritual$x$,
   array[$x$Riverside heritage stay$x$, $x$Private dawn & dusk boat$x$, $x$Breakfast daily$x$, $x$Guided old-city + Sarnath day$x$],
   array[$x$Flight/train to Varanasi$x$, $x$Most meals$x$, $x$Personal expenses & tips$x$, $x$Travel insurance$x$]),

  ($x$rishikesh-haridwar$x$, $x$Rishikesh & Haridwar$x$, $x$Yoga capital on the Ganga$x$, $x$Uttarakhand$x$, $x$Foothills$x$,
   $x$Ganga aarti & yoga mornings · Uttarakhand$x$, $x$Rishikesh · ref$x$, $x$s-dusk$x$,
   $x$Where the Ganga leaves the mountains — Haridwar aarti at Har Ki Pauri, Rishikesh yoga mornings, suspension bridges, and the Beatles Ashram.$x$,
   $x$≈ from ₹16,000$x$, $x$5 days$x$, $x$River, chant, a yoga mat at sunrise, the foothills above.$x$,
   array[$x$Dry towns — no alcohol.$x$, $x$Monsoon swells the river.$x$, $x$Weekends are busy.$x$],
   array[$x$Best: Sep–Apr$x$, $x$From Delhi: ~6h road$x$, $x$Stay: 4–5 nights$x$],
   $j$[{"d":"Day 1","t":"Haridwar aarti","p":"Har Ki Pauri at dusk — the lamps set on the river, the crowd singing."},{"d":"Day 2","t":"Rishikesh mornings","p":"Sunrise yoga, the suspension bridges, a riverside cafe afternoon."},{"d":"Day 3–5","t":"Ashrams & rapids","p":"Beatles Ashram, an optional rafting day, buffer time on the sand."}]$j$::jsonb,
   $x$/visual-bank/india-spiritual/rishikesh-haridwar-1.jpg$x$, $x$/visual-bank/india-spiritual/rishikesh-haridwar-2.jpg$x$,
   $x$published$x$, 21, $x$spiritual$x$,
   array[$x$Riverside ashram-style stay$x$, $x$Private transfers$x$, $x$Breakfast daily$x$, $x$Guided aarti + yoga session$x$],
   array[$x$Flight/train to Dehradun/Haridwar$x$, $x$Most meals$x$, $x$Rafting (optional)$x$, $x$Travel insurance$x$]),

  ($x$amritsar$x$, $x$Amritsar$x$, $x$The Golden Temple$x$, $x$Punjab$x$, $x$Plains$x$,
   $x$Harmandir Sahib & langar · Punjab$x$, $x$Amritsar · ref$x$, $x$s-dusk$x$,
   $x$Harmandir Sahib glowing on its pool at night, the world largest free kitchen, and the Wagah border ceremony at dusk — Punjab at its warmest.$x$,
   $x$≈ from ₹13,000$x$, $x$3 days$x$, $x$Gold on still water, a shared meal for thousands, a border that roars.$x$,
   array[$x$Cover your head at the temple.$x$, $x$Summers are extreme.$x$, $x$Wagah seats fill early.$x$],
   array[$x$Best: Oct–Mar$x$, $x$From Delhi: ~1h flight$x$, $x$Stay: 2–3 nights$x$],
   $j$[{"d":"Day 1","t":"The Golden Temple","p":"Evening darshan as the gold lights up, a turn at langar seva."},{"d":"Day 2","t":"Wagah at dusk","p":"Jallianwala Bagh by day, the border-closing ceremony at sunset."},{"d":"Day 3","t":"Slow morning","p":"A last dawn at the temple, Amritsari breakfast, unhurried departure."}]$j$::jsonb,
   $x$/visual-bank/india-spiritual/amritsar-1.jpg$x$, $x$/visual-bank/india-spiritual/amritsar-2.jpg$x$,
   $x$published$x$, 22, $x$spiritual$x$,
   array[$x$Stay near the temple$x$, $x$Private transfers incl. Wagah$x$, $x$Breakfast daily$x$, $x$Guided heritage walk$x$],
   array[$x$Flight/train to Amritsar$x$, $x$Most meals$x$, $x$Personal expenses & tips$x$, $x$Travel insurance$x$])
on conflict (slug) do nothing;

-- ── International packages (lane = international) ──
insert into public.packages
  (slug, kicker, name, region, photo, glow, rate, nights, tags, blurb, cta, context, even,
   well_scene, portrait_image_url, sort_order, tiers, departures, lane)
values
  ($x$bali-escape$x$, $x$Drift 06 · Indonesia$x$, $x$Bali Unwound$x$, $x$Bali · 6 nights$x$,
   $x$Bali · ref$x$, $x$glow-coral$x$, $x$≈ from ₹62,000$x$, $x$6 nights$x$,
   array[$x$Rice terraces$x$, $x$Temple mornings$x$, $x$Visa on arrival$x$],
   $x$Ubud rice terraces, water temples at dawn, and a slow drift south to the Bukit cliffs — the easiest first trip abroad, scenery that looks like a lakh.$x$,
   $x$Take Bali Unwound$x$, $x$the Bali Unwound package (6 nights)$x$, false, $x$s-dusk$x$,
   $x$/visual-bank/international/bali-3.jpg$x$, 10,
   $j$[{"key":"budget","label":"Budget","priceINR":62000,"nights":"6 nights","blurb":"Smart guesthouses, shared drivers, Bali raw and easy.","inclusions":["6 nights in Ubud & Bukit guesthouses","Airport + inter-region transfers","Breakfast daily","1 guided water-temple day"],"exclusions":["International flights","Indonesia tourist tax","Most meals","Travel insurance"]},{"key":"comfort","label":"Comfort","priceINR":89000,"nights":"6 nights","blurb":"Boutique pool stays and a private driver-guide throughout.","inclusions":["6 nights in boutique pool villas","Private driver-guide daily","Breakfast + 2 dinners","Water-temple + waterfall guided days"],"exclusions":["International flights","Indonesia tourist tax","Some meals","Travel insurance"]},{"key":"luxury","label":"Luxury","priceINR":145000,"nights":"7 nights","blurb":"Cliff-edge resorts, private everything, a host on call.","inclusions":["7 nights in premium resorts","Private car + guide throughout","All breakfasts + select dinners","Spa + private sunset cruise"],"exclusions":["International flights","Alcohol","Personal expenses"]}]$j$::jsonb,
   $x$Year-round · Apr–Oct driest · custom dates on request$x$, $x$international$x$),

  ($x$swiss-classic$x$, $x$Drift 07 · Switzerland$x$, $x$Swiss Skylines$x$, $x$Switzerland · 7 nights$x$,
   $x$Switzerland · ref$x$, $x$glow-teal$x$, $x$≈ from ₹1,45,000$x$, $x$7 nights$x$,
   array[$x$Alpine rail$x$, $x$Glacier day$x$, $x$Schengen$x$],
   $x$Lucerne lakefront, the Jungfrau glacier railway, and Interlaken meadows — the original Alps every hill station is measured against, done by rail.$x$,
   $x$Take Swiss Skylines$x$, $x$the Swiss Skylines package (7 nights)$x$, true, $x$s-dusk$x$,
   $x$/visual-bank/international/switzerland-3.jpg$x$, 11,
   $j$[{"key":"budget","label":"Budget","priceINR":145000,"nights":"7 nights","blurb":"Lake-town stays, second-class rail, the Alps on a sane budget.","inclusions":["7 nights in 3-star lake-town hotels","Swiss Travel Pass (2nd class)","Breakfast daily","1 alpine excursion"],"exclusions":["International flights","Schengen visa fee","Most meals","Travel insurance"]},{"key":"comfort","label":"Comfort","priceINR":195000,"nights":"7 nights","blurb":"4-star stays, first-class rail, the Jungfrau done right.","inclusions":["7 nights in 4-star hotels","Swiss Travel Pass (1st class)","Breakfast daily","Jungfrau + lake-steamer days"],"exclusions":["International flights","Schengen visa fee","Some meals","Travel insurance"]},{"key":"luxury","label":"Luxury","priceINR":320000,"nights":"8 nights","blurb":"Grand alpine hotels, private guides, the peaks at leisure.","inclusions":["8 nights in grand alpine hotels","1st-class rail + private transfers","All breakfasts + select dinners","Private guide for excursions"],"exclusions":["International flights","Schengen visa fee","Personal expenses"]}]$j$::jsonb,
   $x$May–Sep · best alpine window · custom dates on request$x$, $x$international$x$),

  ($x$vietnam-loop$x$, $x$Drift 08 · Vietnam$x$, $x$Vietnam, North to Coast$x$, $x$Vietnam · 8 nights$x$,
   $x$Vietnam · ref$x$, $x$glow-coral$x$, $x$≈ from ₹58,000$x$, $x$8 nights$x$,
   array[$x$Ha Long Bay$x$, $x$Street food$x$, $x$E-visa$x$],
   $x$Hanoi old quarter, an overnight on Ha Long Bay, and lantern-lit Hoi An down the coast — Asia best street food, gentle on the wallet, big on wonder.$x$,
   $x$Take this drift$x$, $x$the Vietnam, North to Coast package (8 nights)$x$, false, $x$s-dusk$x$,
   $x$/visual-bank/international/vietnam-3.jpg$x$, 12,
   $j$[{"key":"budget","label":"Budget","priceINR":58000,"nights":"8 nights","blurb":"Boutique hostels, a shared bay cruise, the country honest.","inclusions":["8 nights in boutique stays","Shared Ha Long overnight cruise","Breakfast daily","1 guided street-food evening"],"exclusions":["International flights","Vietnam e-visa","Most meals","Travel insurance"]},{"key":"comfort","label":"Comfort","priceINR":82000,"nights":"8 nights","blurb":"4-star stays, a private cruise cabin, drivers between regions.","inclusions":["8 nights in 4-star hotels","Private-cabin Ha Long cruise","Breakfast + 2 dinners","Guided Hanoi + Hoi An days"],"exclusions":["International flights","Vietnam e-visa","Some meals","Travel insurance"]},{"key":"luxury","label":"Luxury","priceINR":130000,"nights":"9 nights","blurb":"Luxury junk, beach resort finish, private guides throughout.","inclusions":["9 nights incl. beach resort","Luxury private junk cruise","All breakfasts + select dinners","Private guide throughout"],"exclusions":["International flights","Vietnam e-visa","Personal expenses"]}]$j$::jsonb,
   $x$Oct–Apr · driest in the north · custom dates on request$x$, $x$international$x$),

  ($x$japan-discovery$x$, $x$Drift 09 · Japan$x$, $x$Japan in Bloom$x$, $x$Japan · 8 nights$x$,
   $x$Japan · ref$x$, $x$glow-teal$x$, $x$≈ from ₹1,35,000$x$, $x$8 nights$x$,
   array[$x$Shinkansen$x$, $x$Temple towns$x$, $x$Cherry season$x$],
   $x$Neon Tokyo, temple-quiet Kyoto, Nara deer, and a bullet train stitching it together — a country that runs like clockwork and rewards every minute.$x$,
   $x$Take Japan in Bloom$x$, $x$the Japan in Bloom package (8 nights)$x$, true, $x$s-dusk$x$,
   $x$/visual-bank/international/japan-3.jpg$x$, 13,
   $j$[{"key":"budget","label":"Budget","priceINR":135000,"nights":"8 nights","blurb":"Business hotels, rail pass, Japan at a smart pace.","inclusions":["8 nights in business hotels","7-day Japan Rail Pass","Breakfast daily","1 guided Kyoto temple day"],"exclusions":["International flights","Japan visa fee","Most meals","Travel insurance"]},{"key":"comfort","label":"Comfort","priceINR":185000,"nights":"8 nights","blurb":"4-star + a ryokan night, reserved bullet seats, guided days.","inclusions":["8 nights incl. 1 ryokan night","Rail pass + reserved seats","Breakfast + onsen dinner","Guided Kyoto + Nara days"],"exclusions":["International flights","Japan visa fee","Some meals","Travel insurance"]},{"key":"luxury","label":"Luxury","priceINR":295000,"nights":"9 nights","blurb":"Premium hotels, ryokan stays, private guides, green-car rail.","inclusions":["9 nights incl. 2 ryokan nights","Green-car rail + private transfers","All breakfasts + kaiseki dinners","Private guide throughout"],"exclusions":["International flights","Japan visa fee","Personal expenses"]}]$j$::jsonb,
   $x$Mar–May & Oct–Nov · cherry/autumn · custom dates on request$x$, $x$international$x$)
on conflict (slug) do nothing;

-- ── Spiritual packages (lane = spiritual; Char Dham circuit already seeded) ──
insert into public.packages
  (slug, kicker, name, region, photo, glow, rate, nights, tags, blurb, cta, context, even,
   well_scene, portrait_image_url, sort_order, tiers, departures, lane)
values
  ($x$varanasi-ghats$x$, $x$Drift 10 · Uttar Pradesh$x$, $x$Kashi, City of Light$x$, $x$Varanasi · 4 nights$x$,
   $x$Varanasi · ref$x$, $x$glow-coral$x$, $x$≈ from ₹14,500$x$, $x$4 nights$x$,
   array[$x$Ganga aarti$x$, $x$Dawn boat$x$, $x$Sarnath$x$],
   $x$The oldest living city — a dawn boat over the ghats, the fire of the evening aarti, and Sarnath where the Buddha first taught. The trip that changes the traveller.$x$,
   $x$Take Kashi$x$, $x$the Kashi, City of Light package (4 nights)$x$, false, $x$s-dusk$x$,
   $x$/visual-bank/india-spiritual/varanasi-3.jpg$x$, 20,
   $j$[{"key":"budget","label":"Budget","priceINR":14500,"nights":"4 nights","blurb":"Clean ghat-side guesthouse, shared boat, the city honest.","inclusions":["4 nights ghat-side guesthouse","Shared dawn boat","Breakfast daily","1 guided old-city walk"],"exclusions":["Train/flight to Varanasi","Most meals","Tips","Travel insurance"]},{"key":"comfort","label":"Comfort","priceINR":22000,"nights":"4 nights","blurb":"Heritage riverside stay, private boat, a guide for the ghats.","inclusions":["4 nights heritage riverside stay","Private dawn & dusk boat","Breakfast + 2 dinners","Guided old-city + Sarnath day"],"exclusions":["Train/flight to Varanasi","Some meals","Tips","Travel insurance"]},{"key":"luxury","label":"Luxury","priceINR":38000,"nights":"5 nights","blurb":"Luxury river-view suite, private everything, priest-led aarti.","inclusions":["5 nights luxury river-view suite","Private boat + car throughout","All meals","Private aarti + Sarnath guide"],"exclusions":["Train/flight to Varanasi","Personal expenses","Tips"]}]$j$::jsonb,
   $x$Oct–Mar · cool & clear · custom dates on request$x$, $x$spiritual$x$),

  ($x$ganga-sadhana$x$, $x$Drift 11 · Uttarakhand$x$, $x$Ganga Sadhana$x$, $x$Rishikesh & Haridwar · 5 nights$x$,
   $x$Rishikesh · ref$x$, $x$glow-teal$x$, $x$≈ from ₹16,000$x$, $x$5 nights$x$,
   array[$x$Ganga aarti$x$, $x$Yoga mornings$x$, $x$Beatles Ashram$x$],
   $x$Where the Ganga leaves the mountains — Haridwar aarti at Har Ki Pauri, Rishikesh yoga mornings, the suspension bridges, and the Beatles Ashram.$x$,
   $x$Take Ganga Sadhana$x$, $x$the Ganga Sadhana package (5 nights)$x$, true, $x$s-dusk$x$,
   $x$/visual-bank/india-spiritual/rishikesh-haridwar-3.jpg$x$, 21,
   $j$[{"key":"budget","label":"Budget","priceINR":16000,"nights":"5 nights","blurb":"Riverside ashram stay, shared transfers, the simple path.","inclusions":["5 nights riverside ashram stay","Shared transfers","Breakfast daily","1 guided aarti + yoga session"],"exclusions":["Train/flight to Dehradun","Most meals","Rafting (optional)","Travel insurance"]},{"key":"comfort","label":"Comfort","priceINR":24000,"nights":"5 nights","blurb":"Boutique riverside stay, private cab, yoga + rafting day.","inclusions":["5 nights boutique riverside stay","Private cab throughout","Breakfast + 2 dinners","Guided aarti, yoga + rafting day"],"exclusions":["Train/flight to Dehradun","Some meals","Tips","Travel insurance"]},{"key":"luxury","label":"Luxury","priceINR":42000,"nights":"6 nights","blurb":"Luxury riverside resort, private guide, wellness sessions.","inclusions":["6 nights luxury riverside resort","Private car + guide","All meals","Daily yoga + spa + private aarti"],"exclusions":["Train/flight to Dehradun","Personal expenses","Tips"]}]$j$::jsonb,
   $x$Sep–Apr · river calm & clear · custom dates on request$x$, $x$spiritual$x$),

  ($x$golden-temple$x$, $x$Drift 12 · Punjab$x$, $x$Golden Temple Days$x$, $x$Amritsar · 3 nights$x$,
   $x$Amritsar · ref$x$, $x$glow-coral$x$, $x$≈ from ₹13,000$x$, $x$3 nights$x$,
   array[$x$Harmandir Sahib$x$, $x$Langar seva$x$, $x$Wagah border$x$],
   $x$Harmandir Sahib glowing on its pool at night, a turn at the world largest free kitchen, and the Wagah border ceremony at dusk — Punjab at its warmest.$x$,
   $x$Take Golden Temple Days$x$, $x$the Golden Temple Days package (3 nights)$x$, false, $x$s-dusk$x$,
   $x$/visual-bank/india-spiritual/amritsar-3.jpg$x$, 22,
   $j$[{"key":"budget","label":"Budget","priceINR":13000,"nights":"3 nights","blurb":"Clean stay near the temple, shared transfers, the warm path.","inclusions":["3 nights near the temple","Shared transfers incl. Wagah","Breakfast daily","Guided heritage walk"],"exclusions":["Train/flight to Amritsar","Most meals","Tips","Travel insurance"]},{"key":"comfort","label":"Comfort","priceINR":19500,"nights":"3 nights","blurb":"Boutique stay, private cab, a guide for temple and Wagah.","inclusions":["3 nights boutique stay","Private cab incl. Wagah","Breakfast + 2 dinners","Guided temple + Jallianwala day"],"exclusions":["Train/flight to Amritsar","Some meals","Tips","Travel insurance"]},{"key":"luxury","label":"Luxury","priceINR":33000,"nights":"4 nights","blurb":"Luxury heritage stay, private everything, priority darshan help.","inclusions":["4 nights luxury heritage stay","Private car + guide throughout","All meals","Darshan assistance + langar seva"],"exclusions":["Train/flight to Amritsar","Personal expenses","Tips"]}]$j$::jsonb,
   $x$Oct–Mar · cool & clear · custom dates on request$x$, $x$spiritual$x$)
on conflict (slug) do nothing;

notify pgrst, 'reload schema';
