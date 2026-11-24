import { ogImage, OG_SIZE } from "@/lib/og";
import { SITE_TITLE } from "@/lib/share";

// The picture shown when the general link is shared (WhatsApp, Instagram, Facebook …).
export const alt = SITE_TITLE;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage();
}
