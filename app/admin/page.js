import LinkMaker from "@/components/LinkMaker";
import { COUPLE } from "@/lib/share";

// The family's page for making guest links: /admin. Kept out of search results.
export const metadata = {
  title: `Guest links · ${COUPLE}`,
  robots: { index: false, follow: false },
};

export default function Admin() {
  return <LinkMaker />;
}
