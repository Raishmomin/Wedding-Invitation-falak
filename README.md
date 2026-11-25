# Shaadi Mubarak — Falaknaaz & Raish Ahemad (Next.js)

The bride's side of `../wedding-invite`: the same wording with the bride first, the Reception at the bride's venue and
the Badi family as hosts. The design follows the approved canvas (after an ivory Muslim-wedding invitation video): an
ivory envelope under the F & R monogram, tied with sheer chiffon and sealed in gold, opens — the seal cracks, the ribbon slips away, the flap
turns up, the card rises out — and as the envelope drops away the card grows into the first page. Below, frosted-glass cards on sage with baby's breath and olive: the letter
and a timeline of the day, the locations, the calendar and countdown, wishes and contact.

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

### Make links the easy way: `/admin`

Open `/admin` (e.g. http://localhost:3000/admin, or yoursite.com/admin), type the guest's name — `raish momin` becomes
`/Raish-Momin`, `& Family` becomes `-and-Family` — and press **Copy link** to paste it into WhatsApp, or **Open** to see
their invitation. It also shows exactly how the invitation will greet them.

## Where things are

| File | What it holds |
|---|---|
| `lib/config.js` | **Edit this.** Names, Nikah date and time, the celebrations (`events`: they make the timeline and the calendar), music file |
| `lib/markup.js` | The wording: the Bismillah, the invitation, the letter, venues and map links, wishes, contact numbers |
| `app/globals.css` | All styles and animations (colours and fonts are at the top) |
| `lib/invitation.js` | The script: names and dates, the day's timeline, the calendar, the envelope opening, scroll reveals, countdown dials, music |
| `scripts/emboss.mjs` | Draws the sunlit ground, sage chiffon, the envelope (back and flap), the F & R monogram, the gold seal with F & R, baby's breath and olive, PNG copies in `assets/` and `app/favicon.ico`. Run `npm run emboss` after changing it or the initials (then restart `npm run dev` to see the new share card and icons) |
| `lib/guest.js` | Turns the link ending into a guest name, and a name into a link ending (for `/admin`) |
| `components/LinkMaker.jsx` | The `/admin` page that makes guest links |
| `components/Invitation.jsx` | The component that shows the invitation |

## Use your own song

Put `music.mp3` in the `public` folder and set `musicFile: "/music.mp3"` in `lib/config.js`.

## Link preview (WhatsApp, Instagram, Facebook …) and icon

Sharing a link shows the frosted invitation card on sage with baby's breath, olive and the gold seal; a personal link
shows the guest's name too. The words under the picture come from `lib/share.js`; the picture from `lib/og.jsx`
(kept under ~250 KB so WhatsApp shows it large). The icons are the gold seal with F & R (from `initials` in `lib/config.js`).

On Vercel the preview works by itself. Anywhere else, set `siteUrl` in `lib/config.js` to your site's
address. WhatsApp keeps a preview for a while, so after changing it, test with a fresh link (e.g. add `?v=2`).

## Put it online

Push this folder to GitHub, then import the repository at vercel.com.
