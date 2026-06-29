-- Reproducibility fix: char-dham (destination) + char-dham-circuit (package) existed in
-- the live DB before the migration history captured them, so a FRESH replay of 0001→0012
-- would 404 the slug that bookableSlugs/DEST_TO_PACKAGE advertise. Seed them idempotently
-- (no-op on the live DB via on conflict). lane='spiritual'. Data mirrors the live rows.
insert into public.destinations
  (slug, name, look_like, region, alt, tag, photo, scene, lede, rate, day_count, mood,
   catches, numbers, days, hero_image_url, portrait_image_url, status, sort_order, lane,
   inclusions, exclusions)
values
  ($x$char-dham$x$, $x$Char Dham$x$, $x$India's four sacred Himalayan shrines$x$, $x$Uttarakhand$x$,
   $x$Yamunotri · Gangotri · Kedarnath · Badrinath$x$,
   $x$The four-shrine Himalayan circuit — private, at your own pace$x$, $x$s-chopta$x$, $x$s-chardham$x$,
   $x$The four high shrines — Yamunotri, Gangotri, Kedarnath, Badrinath — done as a private circuit, not a packed bus. Drive the valleys or add a helicopter leg; sleep in real stays, with acclimatisation built in.$x$,
   $x$≈ ₹9,500$x$, $x$10 days$x$, $x$Snowmelt rivers, ringing bells, deodar switchbacks. Reverence without the crush.$x$,
   array[$x$Altitude is real — Kedarnath sits at 3,580m; we build in acclimatisation$x$, $x$Roads are mountain roads — weather can shift a day$x$, $x$Peak season (May–Jun) is busy and heli slots book out early$x$],
   array[$x$4 shrines$x$, $x$~1,600 km of Himalayan road$x$, $x$3,580m at Kedarnath$x$, $x$10–12 days for all four$x$],
   $j$[{"d":"Day 1","t":"Haridwar → Barkot","p":"Meet at Haridwar, drive up the Yamuna valley, overnight at Barkot."},{"d":"Day 2","t":"Yamunotri","p":"Trek or pony to the first shrine, hot springs at Janki Chatti, back to Barkot."},{"d":"Day 3","t":"Gangotri","p":"Cross to Uttarkashi and on to Gangotri, the Ganga's origin temple."},{"d":"Day 4","t":"Toward Kedarnath","p":"Mountain drive to Sonprayag/Guptkashi; rest and acclimatise."},{"d":"Day 5","t":"Kedarnath","p":"Trek or helicopter to Kedarnath at 3,580m; evening aarti."},{"d":"Day 6","t":"Badrinath","p":"Descend and drive to Badrinath, the last of the four; Mana village."},{"d":"Day 7","t":"Return","p":"Drive back down the valleys to Haridwar/Rishikesh."}]$j$::jsonb,
   $x$/images/char-dham-hero.jpg$x$, $x$/images/char-dham-portrait.jpg$x$, $x$published$x$, 5, $x$spiritual$x$,
   array[$x$Private vehicle for the full circuit$x$, $x$Stays in vetted hotels & guesthouses$x$, $x$Breakfast + dinner daily$x$, $x$A travel host through the yatra$x$, $x$All registrations & permits$x$],
   array[$x$Train/flight to Dehradun/Haridwar$x$, $x$Helicopter tickets (add-on)$x$, $x$Pony/palki & porters at the shrines$x$, $x$Personal expenses & tips$x$])
on conflict (slug) do nothing;

insert into public.packages
  (slug, kicker, name, region, photo, glow, rate, nights, tags, blurb, cta, context, even,
   well_scene, portrait_image_url, sort_order, tiers, departures, lane)
values
  ($x$char-dham-circuit$x$, $x$Drift 05 · Uttarakhand$x$, $x$Char Dham Circuit$x$, $x$Uttarakhand · 9–11 nights$x$,
   $x$s-chopta$x$, $x$glow-teal$x$, $x$≈ ₹9,500$x$, $x$10 nights$x$,
   array[$x$Pilgrimage$x$, $x$Private circuit$x$, $x$Road or heli$x$, $x$Small group$x$],
   $x$The four sacred shrines — Yamunotri, Gangotri, Kedarnath, Badrinath — as a private, well-paced circuit. Drive the valleys or add a helicopter leg. Real stays, acclimatisation built in, and a host the whole way.$x$,
   $x$Take the Char Dham Circuit$x$, $x$the Char Dham Circuit package (private, road or heli)$x$, false,
   $x$s-chardham$x$, $x$/images/char-dham-portrait.jpg$x$, 5,
   $j$[{"key":"budget","label":"Do Dham","priceINR":42000,"nights":"6 nights","blurb":"Kedarnath + Badrinath by road — the two that matter most, in a week.","inclusions":["Private vehicle, Haridwar to Haridwar","6 nights in vetted hotels & guesthouses","Breakfast + dinner daily","A travel host for the full yatra","Registrations & permits"],"exclusions":["Train/flight to Dehradun/Haridwar","Helicopter tickets","Pony/palki & porters","Personal expenses & tips"]},{"key":"comfort","label":"Char Dham by road","priceINR":68000,"nights":"10 nights","blurb":"All four shrines, driven at a humane pace with acclimatisation built in.","inclusions":["Private vehicle for the full four-shrine circuit","10 nights in vetted hotels & guesthouses","Breakfast + dinner daily","A travel host the whole way","Acclimatisation days built in","Registrations & permits"],"exclusions":["Train/flight to Dehradun/Haridwar","Helicopter tickets (ask us to add)","Pony/palki & porters at shrines","Personal expenses & tips"]},{"key":"luxury","label":"Char Dham + Heli","priceINR":145000,"nights":"7 nights","blurb":"All four with helicopter legs — the whole yatra in a week, knees intact.","inclusions":["Helicopter legs for the shrine hops","Private vehicle between the valleys","7 nights in the best available stays","All meals","VIP darshan assistance where offered","A dedicated host, registrations & permits"],"exclusions":["Train/flight to Dehradun","Pony/palki where heli does not reach","Personal expenses & tips"]}]$j$::jsonb,
   $x$May–Jun & Sep–Oct (shrines open Akshaya Tritiya → Diwali) · fixed departures weekly in season · custom dates on request$x$, $x$spiritual$x$)
on conflict (slug) do nothing;

notify pgrst, 'reload schema';
