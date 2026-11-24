import { ogImage, OG_SIZE } from "@/lib/og";
import { SITE_TITLE } from "@/lib/share";
import { guestFromSlug } from "@/lib/guest";

// The picture shown when a personal link is shared: the same card, with the guest's name on it.
export const alt = SITE_TITLE;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }) {
  const { guest } = await params;
  return ogImage(guestFromSlug(guest));
}
