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
