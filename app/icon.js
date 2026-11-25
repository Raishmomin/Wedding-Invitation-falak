import { iconImage } from "@/lib/og";

// The gold wax seal for browser tabs, bookmarks and Android home screens.
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return iconImage(size);
}
