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
