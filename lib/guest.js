import { CONFIG } from "./config";

/* Turns the last part of the link into a name:
   /Rahul-Sharma-and-Family  ->  "Rahul Sharma & Family"            */
export function guestFromSlug(slug) {
  let raw = "";
  try { raw = decodeURIComponent(slug || ""); } catch { raw = slug || ""; }
  raw = raw.replace(/[-_+]+/g, " ").replace(/[^\p{L}\p{M}\p{N} .&']/gu, "").replace(/\s+/g, " ").trim().slice(0, 48);
  if (raw && raw === raw.toLowerCase()) raw = raw.replace(/(^|\s)\p{L}/gu, (c) => c.toUpperCase());
  return raw.replace(/\s(and|And)\s/g, " & ");
}

/* The other way round, for the guest-link page (/admin):
   "rahul sharma & family"  ->  "Rahul-Sharma-and-Family"   (each word capitalised, "&" written as "and", hyphens for spaces) */
export function slugFromName(name) {
  return (name || "")
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{M}\p{N} .']/gu, " ")
    .replace(/\s+/g, " ").trim()
    .split(" ").filter(Boolean)
    .map(titleWord)
    .join("-");
}
// "momin" or "MOMIN" -> "Momin", "a.k." -> "A.K.", "o'brien" -> "O'Brien"; a word typed in mixed case (McDonald) is kept
function titleWord(w) {
  if (/^and$/i.test(w)) return "and";
  const t = w === w.toLowerCase() || w === w.toUpperCase() ? w.toLowerCase() : w;
  return t.replace(/(^|[.'])(\p{L})/gu, (m, before, letter) => before + letter.toUpperCase());
}

export const guestOrDefault = (name) => name || CONFIG.defaultGuest;
