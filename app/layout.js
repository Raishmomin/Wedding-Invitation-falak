import "./globals.css";
import { CONFIG, SEAL_IMAGE } from "@/lib/config";
import { SITE_TITLE, shareMetadata } from "@/lib/share";

export const metadata = {
  // Share previews need full image links. On Vercel this is found automatically; elsewhere set siteUrl in lib/config.js.
  metadataBase: CONFIG.siteUrl ? new URL(CONFIG.siteUrl) : null,
  ...shareMetadata(SITE_TITLE),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href={SEAL_IMAGE} as="image" type="image/webp" />
        {["silk", "paper-gilt", "liner", "doily", "gypsophila"].map((n) => (
          <link key={n} rel="preload" href={`/emboss/${n}.webp`} as="image" type="image/webp" />
        ))}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;0,600;0,700;1,500&family=EB+Garamond:wght@500;600&family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
