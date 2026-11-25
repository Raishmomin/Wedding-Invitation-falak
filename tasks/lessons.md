# Lessons

- **Source language ≠ output language.** The printed card was in Gujarati; the user wanted the invite in English
  (like the original project). When content comes from a regional-language source, default to the existing
  project's language and translate — ask only if there's no existing precedent.
- **No letter-spacing on Indic scripts.** Chrome drops ligatures when letter-spacing ≠ 0, which broke Gujarati
  conjuncts (મુ lost its consonant). Use word-spacing instead.
- **"Like the reference" ≠ minimal.** A faithful but quiet ivory-on-ivory take read as "too simple". For invitations,
  aim for rich contrast (deep ground, metallic accents, ornate frames) unless the user asks for minimal.
- **Bride/groom variants share wording.** When a second side's invite is requested, start from the existing
  invite's content and change only what differs (names order, venues), not from scratch.
- **Never `rm -rf .next` without checking for a running dev server** (`ss -ltnp`); the user had one on :3000. Next 16 keeps
  dev output in `.next/dev`, so `next build` can run beside it — deleting `.next` cannot.
- **Test 3D gate animations frame by frame.** A CSS `filter` on an element near rotating 3D doors made headless Chrome drop the whole cover; check frames at 0.5s/1s/1.5s after opening.
- **Never `rm -rf .next` without checking for a running dev server** (`ss -ltnp`); the user had one on :3000. Next 16 keeps
  dev output in `.next/dev`, so `next build` can run beside it — deleting `.next` cannot.
- **Test 3D gate animations frame by frame.** A CSS filter near the rotating doors made Chrome drop the whole cover;
  check frames at 0.5s / 1s / 1.5s after opening.
- **Check the page is exactly phone width** (`document.documentElement.scrollWidth`) when props hang off the edges;
  `overflow-x:hidden` on body alone still lets iOS wobble sideways — clip a wrapper with `overflow-x:clip`.
- **An infinite animation on opacity overrides a state's `opacity:0`** — stop the animation in that state too.
- **Design first when asked.** For a visual redesign the user asked for an approvable design (artifact canvas) before
  implementation; it caught a misread (page 3 "timeline") cheaply.
- **Share images: check the byte size, not just the look.** A photo-like background made the OG PNG ~450 KB (over
  WhatsApp's ~300 KB large-preview limit); a soft gradient halved it.

## The thing that carries the guest from one screen to the next must be the same thing
- The card rose out of the welcome envelope, then the first screen showed it sitting in a second, re-drawn envelope
  "pocket" that matched neither in size nor look; the user saw the mismatch and asked for it gone.
- Rule: when an animation hands an object (card, envelope, seal) to the next screen, either reuse the identical artwork
  and size, or drop the container and let the object stand alone. Never draw a look-alike.
- Also: this family wants no verse on the welcome page — keep the cover to monogram, envelope, guest name, button.

## A monogram must not be misreadable
- A fine vertical stem with a diamond between F and R read as "FIR". Anything placed between two initials can read as a
  letter (I, l, V, ✓) — use a real ampersand in a classic face, or nothing, and check it at 32–56 px before shipping.

## A hand-over between screens must never show an empty frame
- Fading the cover out while the next page's card faded in left a moment of half-transparent nothing. Keep the next page
  fully drawn underneath, start its card exactly where the outgoing one is (measure both rects), and move the cover away.
- Follow-up on the hand-over: "no gap" also means the right layering. The card must stay IN FRONT of the envelope as it
  falls (an envelope sliding over the card reads as a cover, not a card coming out), nothing dark may pass over it, and
  a frosted (see-through) card must be opaque until whatever is behind it has gone.

## A shared element must be the same element
- The envelope's card showed a short summary (Bismillah + names) while the first page's card had the full text, so the
  hand-over visibly swapped content. Render the SAME markup in both places (one template), lay the copy out at the
  target's width and scale it; then the hand-over is a pure transform with nothing to crossfade.

## Raising a layer's z-index: re-check every fixed control
- Bringing <main> to z 60 for the hand-over put it over the music button (z 45). After any z-index change, check fixed
  buttons with document.elementFromPoint at their centre, on a scrolled page.
