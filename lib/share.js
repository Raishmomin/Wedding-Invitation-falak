import { CONFIG } from "./config";

/* Words used when the link is shared (WhatsApp, Instagram, Facebook, X, Telegram, iMessage …) */
const IST = { timeZone: "Asia/Kolkata" };
const wedding = new Date(CONFIG.weddingAt);
const p = Object.fromEntries(
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", ...IST })
    .formatToParts(wedding).map((x) => [x.type, x.value])
);

export const COUPLE = `${CONFIG.bride} & ${CONFIG.groom}`;
export const SITE_TITLE = `${COUPLE} Wedding Invitation`;
export const DOT_DATE = `${p.day}.${p.month}.${p.year}`;               // 27.12.2026
export const DESCRIPTION =
  `You are invited to the wedding of ${COUPLE} — ` +
  `${CONFIG.events.map((e) => `${e.name} on ${e.date}`).join(", ")} ${p.year}.`;

export function shareMetadata(title) {
  return {
    title,
    description: DESCRIPTION,
    openGraph: { title, description: DESCRIPTION, siteName: COUPLE, type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description: DESCRIPTION },
  };
}
