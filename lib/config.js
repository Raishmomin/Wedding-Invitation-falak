/* =========================================================
   EDIT THIS FILE — everything on the invitation comes from here
   (the longer wording is in lib/markup.js)
   ========================================================= */
export const CONFIG = {
  bride: "Falaknaaz",
  groom: "Raish Ahemad",
  initials: ["F", "R"],                       // the monogram (run npm run emboss after changing, for the favicon)
  weddingAt: "2026-12-27T10:00:00+05:30",   // Nikah date & time (India time) — drives the dates, calendar and countdown
  musicFile: "",                              // your own song: put music.mp3 in the public folder and write "/music.mp3" here
  defaultGuest: "You & Your Family",
  siteUrl: "",                                // your site's address, e.g. "https://falaknaaz-weds-raish.com" — needed for WhatsApp previews when not hosted on Vercel
  /* THE CELEBRATIONS — one line per event, in order. Copy a line to add another.
     day  = date in the wedding month (puts a heart on the calendar); main = the filled heart; place = where it is held */
  events: [
    { day: 27, name: "Nikah",     time: "10:00 AM", date: "Sunday, 27 December", place: "Juni Eidgah Masjid, Salabatpura, Surat", main: true },
    { day: 27, name: "Reception", time: "12:00 PM", date: "Sunday, 27 December", place: "Surat Vankaneri Momin Jamat Hall, Salabatpura, Surat" }
  ]
};

/* the gold wax seal with F & R (made by scripts/emboss.mjs from `initials`) */
export const SEAL_IMAGE = "/emboss/seal-gold.webp";
