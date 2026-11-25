# Shaadi Mubarak — Falaknaaz & Raish Ahemad (bride's side)

Same wording as `../wedding-invite` (groom's side), with: bride first, the Reception at the bride's venue,
no "little request" card. New theme: royal emerald & antique gold.

## Content
- [x] Copy wedding-invite wording: hero, "We are delighted", calendar + celebrations, countdown + locations, wishes, contact
- [x] Bride first everywhere (names, crest ring, "With love", share title)
- [x] Reception → Surat Vankaneri Momin Jamat Hall, Salabatpura — Sunday 27 Dec, 12:00 PM (from the bride's printed card)
- [x] Remove the little princess (Haniya) card

## Theme, fonts, logo
- [x] Emerald ground with a gold eight-point-star lattice; ivory cards in gold filigree frames
- [x] Fonts: Great Vibes (script), Cinzel (capitals), Playfair Display (text)
- [x] Cover: emerald velvet doors with gilt damask, gold lace edges, gold cord, crimson seal with gilded F·R in an eight-point star
- [x] Hero: gold lace frame, Mughal arch drawn in, crest logo (F·R in an eight-point star, turning text ring, moving gold)
- [x] Icons, favicon and share card regenerated from the new seal

## Verify
- [x] Build passes, eslint 0 errors
- [x] Screenshots at 390×844: cover, opening, hero, every card; share cards (general + guest)

## Review
- Kept from the groom's card as asked: "The Wankanery Family" and the contact numbers (Raish, Zishan) — change in lib/markup.js if the bride's side wants others.
- Reception moved to 27 Dec 12:00 PM to match the bride's printed card (the groom's was 29 Dec at Dholka).

---
# Redesign after the reference (cream / sand / chocolate wedding page)
- [x] Same wording; "Shaadi Mubarak" removed from the cover (and from the share title/card); Wankanery -> Badi family
- [x] Full-width sections alternating light and dark; Great Vibes + Cormorant Garamond; fine line icons
- [x] Botanical F·R monogram; bronze seal with F R in a laurel wreath; white paper flowers (scripts/emboss.mjs)
- [x] Envelope with seal and flowers, satin blessing band, contact rows, keepsake seal, cypress hills at the end
- [x] Build passes; screenshots of cover, opening frames, every section, share cards
- Gotcha: a CSS filter on a picture inside or beside the turning 3D doors made Chrome stop drawing the cover mid-swing;
  the cover flowers now sit outside the doors with no CSS filter (their shadow is baked in).

---
# Final design: the stationery suite (after reference 2 — N|A lace suite)
- [x] Same wording, Badi family, no "Shaadi Mubarak" on the front
- [x] Palette: ivory satin, cotton paper #faf7f1, greige ink #564b43 / #7a6e64, hairlines #cfc3b3; Pinyon Script + Cormorant Garamond small caps
- [x] Cover: lace-lined envelope; cream sprig seal lifts, flap turns up on its lace, card slides out, page appears
- [x] Cards: deckle-edged paper (9-slice), invitation on floral lace doily with cotton twine + seal, F | R monogram with laurel
- [x] Props: ceramic dish with gold rings, dried baby's breath; satin drifts, sprigs and lines draw themselves
- [x] Share card + icons in the same style; build passes; no 404s; page exactly phone width (props clipped)

---
# Final: the approved design (from the reference video), built in
Design canvas (approved): https://claude.ai/artifact/KaAaP7cpbbmCf8cZzHhWuy
- [x] Artwork: sunlit ivory ground, sage chiffon, envelope back + flap (separate, so it turns), gold sprig seal, baby's breath, olive
- [x] Welcome: verse (An-Naba 78:8), envelope with chiffon and gold seal, guest name, glass CTA
- [x] Opening: seal cracks into four pieces, ribbon slips away, flap turns up, card rises out of the pocket into the invitation
- [x] Invitation: frosted acrylic — Bismillah, Badi family, blessing, names in Cinzel, date row; pocket and seal below
- [x] Letter + timeline of the day (built from events); Locations with gold line drawings and map pills
- [x] Calendar (gold disc on the 27) + countdown dials that fill in gold; wishes, call buttons, closing words, seal
- [x] Share card (~225 KB, under WhatsApp's limit) and seal icons; build passes; lint clean
- [x] QA agent pass across 360/390/430/768/1440 and guest-name edge cases — fixes:
  cover fits 375×548 (envelope sized by height too, sprig behind text), card now peeks out of the envelope and rises in
  front of the turned-up flap (inside of the flap drawn), page behind the cover inert until opened, aria-modal, "&" in
  Cormorant italic, contrast of small grey text raised, no sideways scroll, drapes masked (no hard edges), hero sits in
  its pocket on tall screens, music button hidden until opened, reduced motion opens straight to the card

## Review
- Verified: opening frames at 390×844; covers + heroes at 375×548, 360×640, 430×932, 768×1024; full page at 1440;
  long, "& Family" and Gujarati guest names; reduced motion; no console errors; eslint 0 errors; `next build` passes
- Still for the family to check: the Arabic (An-Naba 78:8, Bismillah)
- [x] Contacts set to the bride's side: Sarik Badi 96246 48486, Shebaz Badi 63534 86964

---
# Welcome without the verse; the card alone on the first screen; the F R monogram everywhere
- [x] Welcome: verse ("And we created / You in Pairs / Surah An-Naba 78:8") removed; the F R monogram sits above the envelope
- [x] First screen: the envelope pocket and its seal removed — the card that rose out of the envelope stands alone, centred
- [x] F R monogram (scripts/emboss.mjs, Cinzel, from `initials` in lib/config.js): gold-foil logo in a double ring with
      diamonds; the gold wax seal now has F | R standing up from it (envelope seal, closing seal, favicon, app icons, share card)
- [x] Logo on the welcome page, at the foot of the invitation card and above "We are delighted" (replacing the sprig)
- [x] Checked: opening frames 390×844; covers at 375×548, 360×640, 430×932, 768×1024; share card 234 KB; lint 0 errors; build passes

---
# F & R logo, and the welcome hands straight over to the first page
- [x] Logo redrawn: the F | R stem read as "FIR". Now F & R (Cinzel capitals, a classic Cormorant ampersand) inside a
      gold-foil laurel wreath with a diamond at crown and foot; the wax seal carries F & R too (favicon, icons, share card)
- [x] Hand-over with no gap: the first page waits under the cover; when the card is out of the envelope, the cover's
      ground melts, the envelope drops down the page growing as it falls, and the first page's card starts exactly at
      the envelope card's place and size (measured, --fx/--fy/--fs) and grows into place
- [x] Checked frame by frame at 390×844, 375×548, 1440×900; reduced motion; lint 0 errors; build passes
- [x] Follow-up: the envelope fell in FRONT of the card and its darker inside showed — now the first page comes in front
      at the hand-over, the envelope's pocket shape is cut from it and moves exactly with the falling envelope (Web
      Animations, same drop/growth/easing), the card starts solid ivory and settles to glass, and the envelope's inside
      closes away so only the light front pocket falls; verified frame by frame at 390×844, 375×548, 1440×900

---
# Music button on top; the envelope holds the first page's card; /admin link maker
- [x] Music button z-index 45 -> 70 (the page comes to z 60 at the hand-over and was covering it); checked with
      elementFromPoint over the contact card
- [x] The envelope's card is now the first page's card itself (lib/markup.js CARD used twice), laid out at the hero
      card's width and scaled down (--hw, --s, refitted on resize); the hand-over needs no crossfade — the same card grows
- [x] /admin (app/admin/page.js + components/LinkMaker.jsx, noindex): name -> link via slugFromName in lib/guest.js
      ("raish momin" -> Raish-Momin, "&" -> and, A.K./O'Brien/McDonald kept right, Gujarati kept), shows the greeting
      the invitation will use, Open (new tab) and Copy link (clipboard, with a fallback for plain-http phone addresses)
- [x] Checked: conversion round-trips, copy on localhost and on the LAN address, opened tab title, lint 0 errors, build
