/* eslint-disable @next/next/no-img-element -- next/og draws with plain <img>; next/image does not apply here */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { CONFIG } from "./config";

/* Share-preview card and icons, in the invitation's own look (see globals.css): a frosted card on sage, baby's breath
   and olive at its corners, the names in Roman capitals, the gold seal. next/og cannot set Arabic,
   so the card keeps to the English lines. */
const C = { ink: "#4a4037", ink3: "#6f6358", gold: "#b38f52", goldDark: "#7a5a22", line: "#a8916a" };

const assets = join(process.cwd(), "assets");
const [cinzel, cormorant, script, seal, bb, olive] = await Promise.all([
  readFile(join(assets, "fonts/Cinzel-400.ttf")),
  readFile(join(assets, "fonts/CormorantGaramond-500.ttf")),
  readFile(join(assets, "fonts/PinyonScript-Regular.ttf")),
  readFile(join(assets, "seal-gold.png")),     // these three are written by npm run emboss
  readFile(join(assets, "babysbreath.png")),
  readFile(join(assets, "olive.png")),
]);
const FONTS = [
  { name: "Cinzel", data: cinzel, weight: 400, style: "normal" },
  { name: "Cormorant", data: cormorant, weight: 500, style: "normal" },
  { name: "Script", data: script, weight: 400, style: "normal" },
];
const png = (b) => `data:image/png;base64,${b.toString("base64")}`;
const SEAL = png(seal), BB = png(bb), OLIVE = png(olive);

/* ---------- icons: the gold seal ---------- */
export function iconImage({ width, height }, { square = false } = {}) {
  const size = square ? width * 0.84 : width;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: square ? "#f3eee5" : "transparent" }}>
      <img src={SEAL} width={size} height={size} alt="" />
    </div>,
    { width, height },
  );
}

/* ---------- the share card (1200×630) ---------- */
const cap = (fontSize, color = C.ink3) => ({ fontFamily: "Cormorant", fontSize, letterSpacing: fontSize * 0.2, color, textTransform: "uppercase" });
const rule = (w) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <div style={{ width: w, height: 1, backgroundColor: C.line }} />
    <div style={{ width: 8, height: 8, backgroundColor: C.gold, transform: "rotate(45deg)", margin: "0 10px" }} />
    <div style={{ width: w, height: 1, backgroundColor: C.line }} />
  </div>
);
// Names outside the script font's alphabet (e.g. written in Gujarati) would print as empty boxes — show the general card then.
const printable = (name) => /^[\p{Script=Latin}\p{M}\p{N} .&'’]+$/u.test(name);
const W = new Date(CONFIG.weddingAt);
const part = (o) => new Intl.DateTimeFormat("en-GB", { ...o, timeZone: "Asia/Kolkata" }).format(W).toUpperCase();
const vbar = <div style={{ width: 1, height: 54, backgroundColor: C.line, margin: "0 22px" }} />;

function Card({ guest }) {
  const forGuest = guest && printable(guest);
  const guestSize = Math.min(48, Math.floor(620 / (guest.length * 0.42)));   // shrink long names to one line
  return (
    // a soft sage ground (the sunlit photo-like one would make the PNG too heavy for WhatsApp's preview)
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#c3c7b0",
      backgroundImage: "radial-gradient(ellipse at 15% 0%, #e4e3d2 0%, #c9ccb6 45%, #b4b99f 100%)" }}>
      <img src={BB} width={300} height={390} alt="" style={{ position: "absolute", left: -40, top: -60, transform: "rotate(150deg)" }} />
      <img src={BB} width={280} height={364} alt="" style={{ position: "absolute", right: -30, bottom: -90, transform: "rotate(-20deg)" }} />
      <img src={OLIVE} width={150} height={275} alt="" style={{ position: "absolute", right: 120, top: -40, transform: "rotate(-150deg)" }} />
      <img src={OLIVE} width={130} height={238} alt="" style={{ position: "absolute", left: 150, bottom: -70, transform: "rotate(24deg)" }} />

      <div style={{ position: "relative", width: 780, height: 560, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        borderRadius: 28, backgroundColor: "rgba(255,255,255,.72)", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 24px 50px rgba(60,58,40,.22)" }}>
        <div style={{ position: "absolute", top: 12, left: 12, right: 12, bottom: 12, borderRadius: 20, border: `1px solid rgba(179,143,82,.5)` }} />
        {forGuest ? [
          <div key="l" style={cap(17)}>An invitation for</div>,
          <div key="g" style={{ fontFamily: "Script", fontSize: guestSize, color: C.ink, lineHeight: 1.3 }}>{guest}</div>,
        ] : (
          <div style={cap(18)}>Wedding Invitation</div>
        )}
        <div style={{ fontFamily: "Cinzel", fontSize: forGuest ? 46 : 54, letterSpacing: 3, color: C.ink, marginTop: forGuest ? 6 : 10 }}>{CONFIG.bride.toUpperCase()}</div>
        <div style={{ display: "flex", alignItems: "center", margin: "0 0 2px" }}>
          <div style={{ width: 70, height: 1, backgroundColor: C.line }} />
          <div style={{ fontFamily: "Script", fontSize: 36, color: "#6a5e52", margin: "0 18px" }}>and</div>
          <div style={{ width: 70, height: 1, backgroundColor: C.line }} />
        </div>
        <div style={{ fontFamily: "Cinzel", fontSize: forGuest ? 46 : 54, letterSpacing: 3, color: C.ink }}>{CONFIG.groom.toUpperCase()}</div>
        <div style={{ display: "flex", margin: "16px 0 14px" }}>{rule(80)}</div>
        <div style={{ display: "flex", alignItems: "center", fontFamily: "Cinzel", fontSize: 20, letterSpacing: 4, color: C.ink }}>
          <span>{part({ weekday: "long" })}</span>{vbar}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><span style={{ fontSize: 46, letterSpacing: 0, lineHeight: 1 }}>{part({ day: "numeric" })}</span><span style={{ fontSize: 18 }}>{part({ year: "numeric" })}</span></div>
          {vbar}<span>{part({ month: "long" })}</span>
        </div>
        <div style={{ ...cap(15), marginTop: 12 }}>Salabatpura · Surat</div>
      </div>
      <img src={SEAL} width={104} height={104} alt="" style={{ position: "absolute", left: 548, bottom: 6 }} />
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };
export const ogImage = (guest = "") => new ImageResponse(<Card guest={guest} />, { ...OG_SIZE, fonts: FONTS });
