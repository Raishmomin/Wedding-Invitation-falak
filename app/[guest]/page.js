import Invitation from "@/components/Invitation";
import { guestFromSlug } from "@/lib/guest";
import { COUPLE, SITE_TITLE, shareMetadata } from "@/lib/share";

// A personal link: yoursite.com/Rahul-Sharma-and-Family
// Each guest name is rendered when the link is opened, so the page waits for it.
export const instant = false;

export async function generateMetadata({ params }) {
  const { guest } = await params;
  const name = guestFromSlug(guest);
  return shareMetadata(name ? `${name}, you are invited · ${COUPLE}` : SITE_TITLE);
}

export default async function GuestPage({ params }) {
  const { guest } = await params;
  return <Invitation guest={guestFromSlug(guest)} />;
}
