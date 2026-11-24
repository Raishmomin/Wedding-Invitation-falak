import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { CONFIG } from "./config";

/* Share-preview card and icons, drawn with the invitation's own fonts and colours (see globals.css):
   a paper card on ivory satin, the monogram, the names in script, the cream sprig seal on cotton twine,
   a ceramic dish of gold rings and dried baby's breath beside it. */
const C = { paper: "#faf7f1", ink: "#564b43", ink2: "#7a6e64", line: "#cfc3b3", sprig: "#a69a8b", twine: "#efe7da" };

const assets = join(process.cwd(), "assets");
const [light, medium, italic, script, sealPng, dishPng, gypPng] = await Promise.all([
  readFile(join(assets, "fonts/CormorantGaramond-300.ttf")),
  readFile(join(assets, "fonts/CormorantGaramond-500.ttf")),
  readFile(join(assets, "fonts/CormorantGaramond-Italic.ttf")),
  readFile(join(assets, "fonts/PinyonScript-Regular.ttf")),
  readFile(join(assets, "seal.png")),          // written by npm run emboss
  readFile(join(assets, "dish.png")),
  readFile(join(assets, "gypsophila.png")),
]);
const FONTS = [
  { name: "Cormorant", data: light, weight: 300, style: "normal" },
  { name: "Cormorant", data: medium, weight: 500, style: "normal" },
  { name: "Cormorant", data: italic, weight: 400, style: "italic" },
  { name: "Script", data: script, weight: 400, style: "normal" },
];
const png = (b) => `data:image/png;base64,${b.toString("base64")}`;
const SEAL = png(sealPng), DISH = png(dishPng), GYP = png(gypPng);
const [A, B] = CONFIG.initials;

/* ---------- the monogram: F | R ---------- */
function Monogram({ size, color = C.ink }) {
  return (
    <div style={{ display: "flex", alignItems: "center", fontFamily: "Cormorant", fontWeight: 300, fontSize: size, color, lineHeight: 1 }}>
      <span>{A}</span>
      <div style={{ width: Math.max(1, size / 50), height: size * 0.95, backgroundColor: C.line, margin: `0 ${size * 0.2}px` }} />
      <span>{B}</span>
    </div>
  );
}

/* ---------- icons ---------- */
export function iconImage({ width, height }, { square = false } = {}) {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: C.paper, borderRadius: square ? 0 : width * 0.18, border: square ? "none" : `${Math.max(1, width / 64)}px solid ${C.line}` }}>
      <Monogram size={width * 0.46} />
    </div>,
    { width, height, fonts: FONTS },
  );
}

/* ---------- the share card (1200×630) ---------- */
const sc = (fontSize, color = C.ink2) => ({ fontFamily: "Cormorant", fontWeight: 500, fontSize, letterSpacing: fontSize * 0.22, color, textTransform: "uppercase" });
// script words set apart by hand: the script font's own space is too narrow; "and" in Cormorant italic
const Script = ({ text, size, color = C.ink, style }) => (
  <div style={{ display: "flex", alignItems: "center", fontFamily: "Script", fontSize: size, color, lineHeight: 1.3, ...style }}>
    {text.split(" ").map((w, i) => w === "&"
      ? <span key={i} style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: size * 0.4, color: C.ink2, margin: `0 ${size * 0.16}px` }}>and</span>
      : <span key={i} style={{ margin: `0 ${size * 0.09}px` }}>{w}</span>)}
  </div>
);
// Names outside the script font's alphabet (e.g. written in Gujarati) would print as empty boxes — show the general card then.
const printable = (name) => /^[\p{Script=Latin}\p{M}\p{N} .&'’]+$/u.test(name);
const W = new Date(CONFIG.weddingAt);
const part = (o) => new Intl.DateTimeFormat("en-GB", { ...o, timeZone: "Asia/Kolkata" }).format(W);
const bar = <div style={{ width: 1, height: 26, backgroundColor: C.line, margin: "0 20px" }} />;

function Card({ guest }) {
  const forGuest = guest && printable(guest);
  const guestSize = Math.min(54, Math.floor(640 / (guest.length * 0.42)));   // shrink long names to one line
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e9e2d6",
      backgroundImage: "linear-gradient(118deg, #e6ded1 0%, #f3eee6 22%, #e7dfd2 44%, #f1ebe2 66%, #e2d9cb 100%)" }}>
      <img src={GYP} width={190} height={247} alt="" style={{ position: "absolute", left: -20, bottom: -40, transform: "rotate(18deg)" }} />
      <img src={DISH} width={250} height={250} alt="" style={{ position: "absolute", right: -60, top: -60 }} />
      <div style={{ position: "relative", width: 760, height: 560, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        backgroundColor: C.paper, boxShadow: "0 14px 34px rgba(80,62,45,.25), 0 2px 5px rgba(80,62,45,.15)", transform: "rotate(-1deg)" }}>
        <Monogram size={46} />
        {forGuest ? [
          <div key="l" style={{ ...sc(16), marginTop: 18 }}>An invitation for</div>,
          <Script key="g" text={guest} size={guestSize} />,
          <Script key="n" text={`${CONFIG.bride} & ${CONFIG.groom}`} size={50} style={{ marginTop: -2 }} />,
        ] : [
          <div key="l" style={{ ...sc(16), marginTop: 18 }}>Wedding Invitation</div>,
          <Script key="n" text={`${CONFIG.bride} & ${CONFIG.groom}`} size={60} style={{ marginTop: 4 }} />,
        ]}
        <div style={{ ...sc(14), marginTop: 10 }}>{part({ weekday: "long" })}</div>
        <div style={{ display: "flex", alignItems: "center", fontFamily: "Cormorant", fontWeight: 500, fontSize: 30, letterSpacing: 4, color: C.ink, marginTop: 2 }}>
          <span>{part({ day: "numeric" })}</span>{bar}<span>{part({ month: "short" }).toUpperCase()}</span>{bar}<span>{part({ year: "numeric" })}</span>
        </div>
        <div style={{ ...sc(13), marginTop: 10 }}>Salabatpura · Surat</div>
        {/* cotton twine across the card, a cream seal on it */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, height: 2, backgroundColor: C.twine, boxShadow: "0 1px 1px rgba(90,70,50,.3)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, height: 2, backgroundColor: C.twine, boxShadow: "0 1px 1px rgba(90,70,50,.3)" }} />
        <img src={SEAL} width={78} height={78} alt="" style={{ position: "absolute", bottom: 10 }} />
      </div>
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };
export const ogImage = (guest = "") => new ImageResponse(<Card guest={guest} />, { ...OG_SIZE, fonts: FONTS });
