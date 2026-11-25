import { iconImage } from "@/lib/og";

// The gold wax seal on ivory for iPhone/iPad home screens (iOS rounds the corners itself).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return iconImage(size, { square: true });
}
