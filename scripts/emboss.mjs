/* Makes the invitation's artwork, lit once here because lighting is too slow for phones:

     public/emboss/sunlit.webp        an ivory surface in morning sun, leaf shadows falling across it (the page behind everything)
     public/emboss/drape.webp         sage chiffon gathered in a corner, its edge melting away
     public/emboss/env-back.webp      a square ivory envelope from the back: side and bottom flaps, the open top showing the inside
     public/emboss/env-flap.webp      its top flap, with the shadow it lays on the rest (it turns up when the envelope opens)
     public/emboss/env-flap-in.webp   the flap's inside, seen once it has turned
     public/emboss/seal-gold.webp     the gold wax seal with F & R standing up from it
     public/emboss/monogram.webp      F & R in gold foil inside a laurel wreath (the logo)
     public/emboss/babysbreath.webp   a stem of fresh baby's breath
     public/emboss/olive.webp         an olive sprig
     assets/seal-gold.png, assets/babysbreath.png, assets/olive.png, app/favicon.ico
                                      copies for the share card and the icons (next/og reads PNG)

   Run it again after changing anything here or the initials in lib/config.js:   npm run emboss
   To redraw only some pieces, name them:   npm run emboss -- seal   (every picture whose name contains "seal")

   Each piece is drawn as a height map (brighter = higher) and lit from the top left, then cut to its own outline
   with the soft shadow it casts, so it can lie on anything. */
import { fileURLToPath } from "node:url";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CONFIG } from "../lib/config.js";

const root = fileURLToPath(new URL("..", import.meta.url));
// let the SVG renderer find the invitation's Cinzel for the initials
const fontsConf = join(tmpdir(), "shaadi-mubarak-fonts.conf");
writeFileSync(fontsConf, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><include ignore_missing="yes">/etc/fonts/fonts.conf</include><dir>${join(root, "assets/fonts")}</dir></fontconfig>`);
process.env.FONTCONFIG_FILE = fontsConf;
const { default: sharp } = await import("sharp");
function rng(seed){ return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const f = n => n.toFixed(2);

/* ---------- small botanicals (heights) ---------- */
/* A leaf lying along +x from its stalk: a low dome with a pressed midrib and side veins. `sway` bends its tip. */
function leaf(r, x, y, deg, L, sway = 0){
  const w = L * (.25 + r() * .06), c = sway * L;
  let veins = "";
  for(let k = 1; k <= 4; k++){
    const t = k / 5.2, x0 = L * t, y0 = c * t * t, reach = w * .7 * (1 - t * .55);
    veins += `M${f(x0)} ${f(y0)}L${f(x0 + L * .13)} ${f(y0 - reach)}M${f(x0)} ${f(y0)}L${f(x0 + L * .13)} ${f(y0 + reach)}`;
  }
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)})">
    <path d="M0 0C${f(L*.26)} ${f(-w*1.05)} ${f(L*.66)} ${f(-w*.9 + c*.55)} ${f(L)} ${f(c)}C${f(L*.7)} ${f(w*.82 + c*.55)} ${f(L*.3)} ${f(w)} 0 0Z" fill="url(#ridge)" stroke="#6a6a6a" stroke-width="${f(L * .02 + .2)}"/>
    <path d="M${f(L*.03)} 0Q${f(L*.5)} ${f(c*.18)} ${f(L*.95)} ${f(c*.94)}" fill="none" stroke="#555" stroke-width="${f(L * .03 + .3)}" stroke-linecap="round"/>
    <path d="${veins}" fill="none" stroke="#767676" stroke-width="${f(L * .018 + .2)}" stroke-linecap="round"/></g>`;
}
/* a teardrop from radius r0 to r1 along angle a (degrees) around (cx, cy), widest near its outer end */
function tear(cx, cy, a, r0, r1, w){
  const t = a * Math.PI / 180, ux = Math.cos(t), uy = Math.sin(t), px = -uy, py = ux;
  const at = (r, s) => `${f(cx + ux * r + px * s)} ${f(cy + uy * r + py * s)}`;
  const m = r0 + (r1 - r0) * .62;
  return `M${at(r0, 0)}C${at(m - (r1 - r0) * .3, w)} ${at(m, w)} ${at(r1, 0)}C${at(m, -w)} ${at(m - (r1 - r0) * .3, -w)} ${at(r0, 0)}Z`;
}
/* a sprig: a curved stem from (x0, y0) to (x1, y1) with leaves in pairs, smaller toward the tip */
function sprig(r, x0, y0, x1, y1, L, n = 6){
  const mx = (x0 + x1) / 2 + (y1 - y0) * .12, my = (y0 + y1) / 2 - (x1 - x0) * .12;
  let s = `<path d="M${f(x0)} ${f(y0)}Q${f(mx)} ${f(my)} ${f(x1)} ${f(y1)}" fill="none" stroke="#9c9c9c" stroke-width="${f(L * .09)}" stroke-linecap="round"/>`;
  for(let i = 0; i < n; i++){
    const t = .12 + i / n * .8, u = 1 - t;
    const x = u * u * x0 + 2 * u * t * mx + t * t * x1, y = u * u * y0 + 2 * u * t * my + t * t * y1;
    const dir = Math.atan2(2 * u * (my - y0) + 2 * t * (y1 - my), 2 * u * (mx - x0) + 2 * t * (x1 - mx)) * 57.296, l = L * (1 - t * .45);
    s += leaf(r, x, y, dir - 38, l, -.06) + leaf(r, x, y, dir + 38, l, .06);
  }
  return s + leaf(r, x1, y1, Math.atan2(y1 - my, x1 - mx) * 57.296, L * .62);
}
/* baby's breath: a stem branching five times, a cluster of tiny florets at every tip */
function babysBreath(seed, florN, florS, len){
  const r = rng(seed);
  let stems = "", florets = "";
  const floret = (x, y, s) => [...Array(5)].map((_, k) => { const a = k * 1.2566 + r(); return `<circle cx="${f(x + Math.cos(a) * s * .55)}" cy="${f(y + Math.sin(a) * s * .55)}" r="${f(s * .5)}" fill="url(#dome)"/>`; }).join("") + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s * .35)}" fill="#e0e0e0"/>`;
  function branch(x, y, ang, len, depth){
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    stems += `M${f(x)} ${f(y)}Q${f((x + x2) / 2 + (r() - .5) * 5)} ${f((y + y2) / 2)} ${f(x2)} ${f(y2)}`;
    if(!depth){ for(let k = 0, n = florN + Math.floor(r() * 4); k < n; k++){ const a = r() * 6.28, d = r() * 5.5; florets += floret(x2 + Math.cos(a) * d, y2 + Math.sin(a) * d, florS + r() * 1.3); } return; }
    for(let i = 0, n = 2 + Math.floor(r() * 2); i < n; i++) branch(x2, y2, ang + (r() - .5) * 1.2, len * (.66 + r() * .16), depth - 1);
  }
  branch(100, 258, -Math.PI / 2 - .08, len, 5);
  return { stems: `<path d="${stems}" fill="none" stroke="#a6a6a6" stroke-width="1.3" stroke-linecap="round"/>`, florets };
}

/* ---------- our monogram (on a 200-grid): F & R — the initials in Cinzel, a classic ampersand between them ---------- */
const [I1, I2] = CONFIG.initials;
const initials = ({ size, y, x1, x2, amp, ampY, fill, bold }) => `<g fill="${fill}" stroke="${fill}" stroke-width="${bold}" stroke-linejoin="round" text-anchor="middle">
    <text x="${x1}" y="${y}" font-family="Cinzel" font-size="${size}">${I1}</text><text x="${x2}" y="${y}" font-family="Cinzel" font-size="${size}">${I2}</text>
    <text x="${(x1 + x2) / 2}" y="${ampY}" font-family="Cormorant Garamond" font-size="${amp}" stroke-width="${bold / 2}">&amp;</text></g>`;

/* half a laurel: a fine stem along the circle (radius R round the centre) from angle a0 to a1, teardrop leaves in pairs,
   smaller toward the tip, one leaf at the end */
function laurel(R, a0, a1, n, L, W){
  const pt = a => [100 + R * Math.cos(a * Math.PI / 180), 100 + R * Math.sin(a * Math.PI / 180)], turn = a1 > a0 ? 90 : -90;
  const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
  let s = `<path d="M${f(x0)} ${f(y0)}A${R} ${R} 0 0 ${a1 > a0 ? 1 : 0} ${f(x1)} ${f(y1)}" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>`;
  for(let i = 0; i < n; i++){
    const t = i / n, a = a0 + (a1 - a0) * (t + .04), [x, y] = pt(a), l = L * (1 - t * .45), w = W * (1 - t * .35);
    s += `<path d="${tear(x, y, a + turn - 34, 0, l, w)}" fill="#fff"/><path d="${tear(x, y, a + turn + 34, 0, l, w)}" fill="#fff"/>`;
  }
  return s + `<path d="${tear(x1, y1, a1 + turn, 0, L * .55, W * .6)}" fill="#fff"/>`;
}

/* the logo: F & R inside a laurel wreath, open at the top, a diamond at its crown and at its foot */
function monogram(){
  const gem = y => `<path d="M100 ${y - 5}l4 5-4 5-4-5Z" fill="#fff"/>`;
  return laurel(85, 104, 252, 10, 15, 3.8) + laurel(85, 76, -72, 10, 15, 3.8) + gem(14) + gem(192)
    + initials({ size: 72, y: 127, x1: 57, x2: 145, amp: 44, ampY: 117, fill: "#fff", bold: .7 });
}

/* ---------- the gold seal (on a 200-grid): wax with an uneven edge and a rounded lip, a pressed plate, the initials standing up ---------- */
function seal(){
  let edge = "";
  for(let i = 0; i <= 160; i++){
    const t = i / 160 * 6.2832, rr = 90 + 3.2 * Math.sin(5 * t + .6) + 2.2 * Math.sin(8 * t + 2.1) + 1.2 * Math.sin(13 * t + .9);
    edge += (i ? "L" : "M") + f(100 + rr * Math.cos(t)) + " " + f(100 + rr * Math.sin(t));
  }
  return `<path d="${edge}Z" fill="url(#lip)"/><circle cx="100" cy="100" r="68" fill="#7e7e7e"/><circle cx="100" cy="100" r="61" fill="none" stroke="#b4b4b4" stroke-width="2.4"/>
    ${initials({ size: 52, y: 119, x1: 69, x2: 133, amp: 32, ampY: 111, fill: "#c8c8c8", bold: 1.2 })}`;
}

/* ---------- an ivory surface in morning sun: warm light from the upper left, the soft shadows of leaves across it ---------- */
const SW = 600, SH = 1100;
function sunlit(w = SW, h = SH){
  const r = rng(73);
  let leaves = "";
  for(let b = 0; b < 5; b++){
    let x = w + 20 - r() * 120, y = -40 + b * h / 7 + r() * 80;
    const ang = 2.35 + (r() - .5) * .5;
    for(let i = 0; i < 18; i++){
      x += Math.cos(ang) * 14; y += Math.sin(ang) * 14;
      for(const side of [-1, 1]){ const a = ang * 57.3 + side * (45 + r() * 20), L = 22 + r() * 18; leaves += `<path d="${tear(x, y, a, 2, L, L * .24)}"/>`; }
    }
  }
  return `<defs><filter id="lb" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4.2"/></filter>
      <filter id="tooth"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .4  0 0 0 0 .33  0 0 0 .05 0"/></filter>
      <radialGradient id="sun" cx=".18" cy=".1" r="1"><stop offset="0" stop-color="#fffdf8"/><stop offset=".55" stop-color="#f4efe6"/><stop offset="1" stop-color="#e9e1d4"/></radialGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#sun)"/><rect width="${w}" height="${h}" filter="url(#tooth)"/>
    <g fill="#5f6348" opacity=".17" filter="url(#lb)">${leaves}</g>`;
}
/* sage chiffon gathered in the lower left corner: soft folds, its edge melting away */
function drape(){
  const r = rng(29);
  let folds = "";
  for(let i = 0; i < 9; i++){
    const x0 = -60 + i * 34 + r() * 14, k = [r(), r(), r()];
    folds += `<path d="M${f(x0)} ${360 + r() * 40}C${f(x0 + 40 + k[0] * 50)} ${f(250 + k[1] * 40)} ${f(x0 + 120 + k[2] * 60)} ${f(170 + k[0] * 40)} ${f(x0 + 260 + k[1] * 60)} -20" fill="none" stroke="${i % 2 ? "#f0f1e6" : "#8c9378"}" stroke-opacity="${f(.45 + r() * .4)}" stroke-width="${f(10 + r() * 26)}"/>`;
  }
  return `<defs><filter id="db" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
      <radialGradient id="fade" cx="0" cy="1" r="1"><stop offset=".3" stop-color="#fff"/><stop offset=".62" stop-color="#fff" stop-opacity=".6"/><stop offset=".92" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <mask id="dm" maskUnits="userSpaceOnUse" x="0" y="0" width="360" height="360"><rect width="360" height="360" fill="url(#fade)"/></mask></defs>
    <g mask="url(#dm)"><rect width="360" height="360" fill="#b4ba9f"/><g filter="url(#db)">${folds}</g></g>`;
}

/* ---------- a square ivory envelope from the back (EW×EH) ----------
   The back: side flaps meeting a bottom flap, and above the side flaps' edges the inside of the envelope, seen once the
   top flap is up. The top flap is its own picture, so it can turn. */
const EW = 320, EH = 304, TIP = EH * .6;
const flapPath = `M0 0H${EW}L${EW / 2 + 12} ${EH * .56}Q${EW / 2} ${TIP} ${EW / 2 - 12} ${EH * .56}Z`;
const envBackShade = `<defs>
    <linearGradient id="inside" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f3f2e" stop-opacity=".24"/><stop offset="1" stop-color="#4f3f2e" stop-opacity=".1"/></linearGradient>
    <linearGradient id="sl" x1="0" x2="1"><stop offset="0" stop-color="#7a6248" stop-opacity="0"/><stop offset="1" stop-color="#7a6248" stop-opacity=".08"/></linearGradient>
    <linearGradient id="sr" x1="1" x2="0"><stop offset="0" stop-color="#7a6248" stop-opacity="0"/><stop offset="1" stop-color="#7a6248" stop-opacity=".1"/></linearGradient></defs>
  <path d="M0 0H${EW}L${EW / 2} ${EH * .55}Z" fill="#efe7da"/><path d="M0 0H${EW}L${EW / 2} ${EH * .55}Z" fill="url(#inside)"/>
  <path d="M0 0L${EW / 2} ${EH * .55}L0 ${EH}Z" fill="url(#sl)"/><path d="M${EW} 0L${EW / 2} ${EH * .55}L${EW} ${EH}Z" fill="url(#sr)"/>
  <path d="M0 ${EH}L${EW / 2} ${EH * .47}L${EW} ${EH}Z" fill="#7a6248" fill-opacity=".04"/>`;
const envBackRelief = `<rect width="${EW}" height="${EH}" fill="#6e6e6e"/><path d="M0 0H${EW}L${EW / 2} ${EH * .55}Z" fill="#5a5a5a"/>
  <path d="M0 ${EH}L${EW / 2} ${EH * .47}L${EW} ${EH}Z" fill="#848484"/>
  <path d="M0 0L${EW / 2} ${EH * .55}L0 ${EH}Z" fill="#7a7a7a"/><path d="M${EW} 0L${EW / 2} ${EH * .55}L${EW} ${EH}Z" fill="#7a7a7a"/>`;
/* the flap's inside, seen once it has turned up: drawn upside down, since the flap shows it turned over */
const flapInside = `<defs><linearGradient id="fi" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f1eadf"/><stop offset="1" stop-color="#e3d9c9"/></linearGradient></defs>
  <path d="M0 200H${EW}L${EW / 2 + 12} ${f(200 - EH * .56)}Q${EW / 2} ${f(200 - TIP)} ${EW / 2 - 12} ${f(200 - EH * .56)}Z" fill="url(#fi)"/>`;
const flapArt = `<defs><linearGradient id="tf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf8"/><stop offset="1" stop-color="#f3ede2"/></linearGradient>
    <filter id="fs" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="3.4"/></filter></defs>
  <path d="${flapPath}" fill="#4a3a2a" fill-opacity=".24" filter="url(#fs)" transform="translate(0 5)"/>
  <path d="${flapPath}" fill="url(#tf)"/><path d="${flapPath}" fill="none" stroke="#c8bba8" stroke-width=".8"/>`;

/* ---------- lighting ---------- */
const sun = `<feDistantLight azimuth="225" elevation="50"/>`;   // from the top left
const DEFS = `
  <radialGradient id="dome" cx=".42" cy=".4" r=".62"><stop offset="0" stop-color="#d8d8d8"/><stop offset=".72" stop-color="#ababab"/><stop offset="1" stop-color="#8a8a8a"/></radialGradient>
  <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a7a7a"/><stop offset=".5" stop-color="#c4c4c4"/><stop offset="1" stop-color="#7a7a7a"/></linearGradient>
  <radialGradient id="lip"><stop offset="0" stop-color="#b0b0b0"/><stop offset=".76" stop-color="#b4b4b4"/><stop offset=".88" stop-color="#d6d6d6"/><stop offset="1" stop-color="#909090"/></radialGradient>`;
let BOX = "";     // set per picture by render(): the filter covers the whole (padded) picture
let GRAIN = "";   // set per picture by render(): the noise has to be as fine as the pixels being drawn
const grainAt = density => `<feTurbulence type="fractalNoise" baseFrequency="${(.55 * density).toFixed(2)}" numOctaves="1" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .01 0 0 0 0" result="grain"/>`;
const KD = .5 / Math.sin(50 * Math.PI / 180);   // flat paper lights to exactly mid-grey…

/* a material of one colour, lit, cut to its own outline, casting a soft shadow on whatever lies beneath */
const material = (color, { kd = 1.2, spec = .2, exp = 30, relief = 4.5, blur = 1, shadow = .25, sx = 1.4, sy = 2.4, sb = 2 } = {}) => id => `<filter id="${id}" ${BOX}>
    <feColorMatrix in="SourceGraphic" type="luminanceToAlpha"/>
    <feGaussianBlur stdDeviation="${blur}" result="height"/>
    <feDiffuseLighting in="height" surfaceScale="${relief}" diffuseConstant="${kd}" lighting-color="${color}" result="matte">${sun}</feDiffuseLighting>
    <feSpecularLighting in="height" surfaceScale="${relief}" specularConstant="${spec}" specularExponent="${exp}" lighting-color="#fff" result="shine">${sun}</feSpecularLighting>
    <feComposite in="matte" in2="shine" operator="arithmetic" k2="1" k3="1" result="lit"/>
    <feComposite in="lit" in2="SourceAlpha" operator="in" result="cut"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="${sb}"/><feOffset dx="${sx}" dy="${sy}" result="cast"/>
    <feFlood flood-color="#4a3c30" flood-opacity="${shadow}"/><feComposite in2="cast" operator="in" result="shade"/>
    <feMerge><feMergeNode in="shade"/><feMergeNode in="cut"/></feMerge>
  </filter>`;
const LIGHT = {
  // only what rises or falls shows, on a transparent ground: light above mid-grey, shade below it (the envelope's folds)
  pressed: id => `<filter id="${id}" ${BOX}>
    <feColorMatrix in="SourceGraphic" type="luminanceToAlpha"/>
    <feGaussianBlur stdDeviation=".9" result="height"/>
    <feDiffuseLighting in="height" surfaceScale="3.4" diffuseConstant="${KD.toFixed(4)}" lighting-color="#fff" result="lit">${sun}</feDiffuseLighting>
    <feColorMatrix in="lit" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 .98  4 0 0 0 -2.04" result="hi"/>
    <feColorMatrix in="lit" type="matrix" values="0 0 0 0 .32  0 0 0 0 .26  0 0 0 0 .2  -1.5 0 0 0 .73" result="sh"/>
    <feMerge><feMergeNode in="sh"/><feMergeNode in="hi"/></feMerge>
  </filter>`,
  // the envelope's paper: one colour, with the soft shadow it lays down
  envsheet: id => `<filter id="${id}" ${BOX}>
    <feFlood flood-color="#f4efe6" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in" result="sheet"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="5"/><feOffset dx="2" dy="7" result="far"/>
    <feFlood flood-color="#5d4c3b" flood-opacity=".22"/><feComposite in2="far" operator="in" result="farS"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="1"/><feOffset dy="1" result="near"/>
    <feFlood flood-color="#5d4c3b" flood-opacity=".18"/><feComposite in2="near" operator="in" result="nearS"/>
    <feMerge><feMergeNode in="farS"/><feMergeNode in="nearS"/><feMergeNode in="sheet"/></feMerge>
  </filter>`,
  // gold sealing wax, satin-bright where it rises
  goldwax: id => `<filter id="${id}" ${BOX}>
    <feColorMatrix in="SourceGraphic" type="luminanceToAlpha"/>
    <feGaussianBlur stdDeviation="1" result="shape"/>
    ${GRAIN}
    <feComposite in="shape" in2="grain" operator="arithmetic" k2="1" k3="1" result="height"/>
    <feDiffuseLighting in="height" surfaceScale="7" diffuseConstant="1.12" lighting-color="#c39a55" result="matte">${sun}</feDiffuseLighting>
    <feSpecularLighting in="height" surfaceScale="7" specularConstant=".75" specularExponent="28" lighting-color="#fff1cc" result="shine">${sun}</feSpecularLighting>
    <feComposite in="matte" in2="shine" operator="arithmetic" k2="1" k3="1" result="lit"/>
    <feColorMatrix in="shape" type="matrix" values="0 0 0 0 .93  0 0 0 0 .8  0 0 0 0 .56  0 0 0 1.2 -.72" result="pale"/>
    <feMerge result="toned"><feMergeNode in="lit"/><feMergeNode in="pale"/></feMerge>
    <feComposite in="toned" in2="SourceAlpha" operator="in"/>
  </filter>`,
  olive: material("#8e9a6c", { kd: 1.15, spec: .18, relief: 4, shadow: .22 }),
  greenstem: material("#9ca783", { kd: 1.15, spec: .08, relief: 3, shadow: .15 }),
  white: material("#fffdf9", { kd: 1.3, spec: .12, relief: 3, shadow: .2 }),
  // gold foil pressed into the paper: a low, bright relief with almost no shadow
  goldfoil: material("#86622a", { kd: 1.1, spec: .6, exp: 16, relief: 1.6, blur: .5, shadow: .14, sx: .4, sy: .8, sb: .8 }),
};
const NEEDS_GROUND = new Set(["pressed"]);   // lights the whole sheet, so it starts as flat black (height 0)

/* layers: [light, art] pairs, bottom first ("plain" = drawn as it is, unlit); art is drawn on a W×H grid and the picture
   comes out `scale` times that. It is lit at twice that size and reduced, which smooths every edge.
   pad: room drawn round the picture and cut off afterwards.  png: also keep a PNG copy in assets/, `pngW` wide. */
const SUPER = 2, ONLY = process.argv[2];
async function render(file, W, H, layers, { scale = 3, quality = 88, alphaQuality = 92, pad = 0, png = "", pngW = W * 1.5 } = {}){
  if(ONLY && !file.includes(ONLY)) return;
  const [px, py] = Array.isArray(pad) ? pad : [pad, pad], VW = W + 2 * px, VH = H + 2 * py;
  GRAIN = grainAt(scale * SUPER);
  BOX = `filterUnits="userSpaceOnUse" x="${-px}" y="${-py}" width="${VW}" height="${VH}" color-interpolation-filters="sRGB"`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${VW}" height="${VH}" viewBox="${-px} ${-py} ${VW} ${VH}">
    <defs>${DEFS}${layers.map(([light], i) => LIGHT[light]?.(`l${i}`) ?? "").join("")}</defs>
    ${layers.map(([light, art], i) => `<g ${LIGHT[light] ? `filter="url(#l${i})"` : ""}>${NEEDS_GROUND.has(light) ? `<rect x="${-px}" y="${-py}" width="${VW}" height="${VH}" fill="#000"/>` : ""}${art}</g>`).join("")}</svg>`;
  let img = sharp(Buffer.from(svg), { density: 72 * scale * SUPER, limitInputPixels: false })
    .resize(Math.round(VW * scale), Math.round(VH * scale), { kernel: "lanczos3" });
  if(px || py) img = sharp(await img.png().toBuffer()).extract({ left: Math.round(px * scale), top: Math.round(py * scale), width: Math.round(W * scale), height: Math.round(H * scale) });
  const buf = await img.png().toBuffer();
  const info = await sharp(buf).webp({ quality, alphaQuality, effort: 6, smartSubsample: true }).toFile(join(root, "public", file));
  console.log(`public/${file}`.padEnd(38), `${info.width}×${info.height}`.padEnd(11), `${Math.round(info.size / 1024)} KB`);
  if(png) await sharp(buf).resize(Math.round(pngW)).png().toFile(join(root, "assets", png));
  return buf;
}

/* ---------- the pieces (sizes are CSS px on a phone) ---------- */
mkdirSync(join(root, "public/emboss"), { recursive: true });

await render("emboss/sunlit.webp", SW, SH, [["plain", sunlit()]], { scale: 1.2, quality: 84 });
await render("emboss/drape.webp", 360, 360, [["plain", drape()]], { scale: 1.6, quality: 86 });
await render("emboss/env-back.webp", EW, EH, [["envsheet", `<rect width="${EW}" height="${EH}" rx="2" fill="#fff"/>`], ["plain", envBackShade], ["pressed", envBackRelief]], { scale: 2.4, quality: 90, pad: 18 });
await render("emboss/env-flap.webp", EW, 200, [["plain", flapArt]], { scale: 2.4, quality: 90, alphaQuality: 95 });
await render("emboss/env-flap-in.webp", EW, 200, [["plain", flapInside]], { scale: 2.4, quality: 88, alphaQuality: 95 });
{
  const g = babysBreath(57, 6, 2.6, 52);
  await render("emboss/babysbreath.webp", 200, 260, [["greenstem", g.stems], ["white", g.florets]], { scale: 2.5, quality: 90, pad: 6, png: "babysbreath.png", pngW: 300 });
  await render("emboss/olive.webp", 120, 220, [["olive", sprig(rng(33), 22, 214, 92, 14, 30, 7)]], { scale: 2.5, quality: 90, pad: 10, png: "olive.png", pngW: 180 });
}
await render("emboss/monogram.webp", 200, 200, [["goldfoil", monogram()]], { scale: 1.6, quality: 92, alphaQuality: 100, pad: 4 });
// the seal, and from it favicon.ico (16, 32, 48)
const sealPng = await render("emboss/seal-gold.webp", 200, 200, [["goldwax", seal()]], { scale: 3, quality: 95, alphaQuality: 100, png: "seal-gold.png", pngW: 300 });
if(sealPng){
  const sizes = [16, 32, 48], pngs = await Promise.all(sizes.map(s => sharp(sealPng).resize(s, s).png().toBuffer()));
  const head = Buffer.alloc(6 + 16 * sizes.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let offset = head.length;
  sizes.forEach((s, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(pngs[i].length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += pngs[i].length;
  });
  writeFileSync(join(root, "app/favicon.ico"), Buffer.concat([head, ...pngs]));
  console.log("app/favicon.ico");
}
