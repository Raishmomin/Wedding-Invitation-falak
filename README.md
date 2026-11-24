# Shaadi Mubarak — Falaknaaz & Raish Ahemad (Next.js)

The bride's side of `../wedding-invite`: the same wording with the bride first, the Reception at the bride's venue and
the Badi family as hosts — designed as fine wedding stationery on ivory satin. A lace-lined envelope sealed in cream wax
opens and its card slides out; below, deckle-edged cotton cards — the invitation itself on floral lace, tied with cotton
twine — with a ceramic dish of gold rings and dried baby's breath around them.

## Run it

```
npm install
npm run dev
```

Open http://localhost:3000

## Guest links

Add the guest's name to the end of the link, with hyphens for spaces:

| Link | Greets |
|---|---|
| `/` | You & Your Family |
| `/Rahul-Sharma` | Rahul Sharma |
| `/Rahul-Sharma-and-Family` | Rahul Sharma & Family |

## Where things are

| File | What it holds |
|---|---|
| `lib/config.js` | **Edit this.** Names, initials, Nikah date and time, the celebrations (`events`), music file |
| `lib/markup.js` | The invitation's wording: greetings, venues and map links, wishes, contact numbers, family name |
| `app/globals.css` | All styles and animations (colours and fonts are at the top) |
| `lib/invitation.js` | The script: monogram (logo), sprigs, celebrations, calendar, envelope opening, countdown, petals, music |
| `scripts/emboss.mjs` | Draws the deckle-edged paper, the floral lace doily, the envelope's lace liner and embossed sprig, the cream sprig seal, the dish of gold rings, the baby's breath, PNG copies in `assets/` and `app/favicon.ico`. Run `npm run emboss` after changing it or the initials |
| `lib/guest.js` | Turns the link ending into a guest name |
| `components/Invitation.jsx` | The component that shows the invitation |

## Use your own song

Put `music.mp3` in the `public` folder and set `musicFile: "/music.mp3"` in `lib/config.js`.

## Link preview (WhatsApp, Instagram, Facebook …) and icon

Sharing a link shows the invitation card on satin, with the cream seal, the dish of rings and baby's breath; a personal link shows the guest's
name too. The words under the picture come from `lib/share.js`; the picture from `lib/og.jsx`. The icons are the F | R monogram.

On Vercel the preview works by itself. Anywhere else, set `siteUrl` in `lib/config.js` to your site's
address. WhatsApp keeps a preview for a while, so after changing it, test with a fresh link (e.g. add `?v=2`).

## Put it online

Push this folder to GitHub, then import the repository at vercel.com.
