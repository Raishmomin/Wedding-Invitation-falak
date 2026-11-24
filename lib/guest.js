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

export const guestOrDefault = (name) => name || CONFIG.defaultGuest;
