/* Makes the stationery, lit once here because lighting is too slow for phones:

     public/emboss/paper.webp        a sheet of deckle-edged cotton paper, for every card (9-slice, CSS border-image)
     public/emboss/doily.webp        floral lace with a scalloped picot edge, under the first card (9-slice)
     public/emboss/liner.webp        floral embroidery on tulle, lining the envelope (seamless tile)
     public/emboss/flap-sprig.webp   a sprig blind-embossed into the envelope
     public/emboss/seal.webp         the cream wax seal with a pressed sprig
     public/emboss/gypsophila.webp   a stem of dried baby's breath
     public/emboss/dish.webp         a scalloped ceramic dish with two gold rings
     assets/seal.png, assets/dish.png, assets/gypsophila.png, app/favicon.ico   copies for the share card and the icons

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
// let the SVG renderer find the invitation's Cormorant for the favicon
const fontsConf = join(tmpdir(), "shaadi-mubarak-fonts.conf");
writeFileSync(fontsConf, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><include ignore_missing="yes">/etc/fonts/fonts.conf</include><dir>${join(root, "assets/fonts")}</dir></fontconfig>`);
process.env.FONTCONFIG_FILE = fontsConf;
const { default: sharp } = await import("sharp");

function rng(seed){ return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const f = n => n.toFixed(2);
const PAPER = "#faf7f1";
const SOFTEN = `<filter id="soften" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="34"/></filter>`;   // melts the silk's folds together   // the cards: keep equal to --paper in globals.css

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
/* an embroidered flower: n raised petals with a stitched vein, a domed heart */
function flower(cx, cy, R, n = 5, rot = -90){
  let s = "";
  for(let i = 0; i < n; i++){
    const a = rot + i * 360 / n;
    s += `<path d="${tear(cx, cy, a, R * .2, R, R * .38)}" fill="#c9c9c9" stroke="#8a8a8a" stroke-width="${f(R * .05 + .2)}"/>
      <path d="${tear(cx, cy, a, R * .35, R * .8, R * .07)}" fill="#a8a8a8"/>`;
  }
  return s + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * .24)}" fill="url(#dome)"/>`;
}
/* a fine sprig: a curved stem from (x0, y0) to (x1, y1) with leaves in pairs, smaller toward the tip */
function sprig(r, x0, y0, x1, y1, L, n = 6){
  const mx = (x0 + x1) / 2 + (y1 - y0) * .12, my = (y0 + y1) / 2 - (x1 - x0) * .12;
  let s = `<path d="M${f(x0)} ${f(y0)}Q${f(mx)} ${f(my)} ${f(x1)} ${f(y1)}" fill="none" stroke="#9c9c9c" stroke-width="${f(L * .09)}" stroke-linecap="round"/>`;
  for(let i = 0; i < n; i++){
    const t = .12 + i / n * .8, u = 1 - t;
    const x = u * u * x0 + 2 * u * t * mx + t * t * x1, y = u * u * y0 + 2 * u * t * my + t * t * y1;
    const dir = Math.atan2(2 * u * (my - y0) + 2 * t * (y1 - my), 2 * u * (mx - x0) + 2 * t * (x1 - mx)) * 57.296, l = L * (1 - t * .45);
    s += leaf(r, x, y, dir - 38, l, -.06) + leaf(r, x, y, dir + 38, l, .06);
  }
  const [dx, dy] = [x1 - mx, y1 - my];
  return s + leaf(r, x1, y1, Math.atan2(dy, dx) * 57.296, L * .62);
}

/* ---------- cotton paper with a deckled edge (PS×PS, a 9-slice with corners PB deep) ----------
   The torn edge wanders by a sum of waves that all repeat every PM, so the repeated middle of each side joins seamlessly. */
const PS = 440, PB = 40, PM = PS - 2 * PB, PEDGE = 15;
function deckle(){
  const r = rng(11);
  const waves = [2, 3, 4, 5, 7, 9, 11, 13, 17, 21, 27, 33, 41, 53, 67, 83].map(k => [k, 1.1 / Math.pow(k, .85), r() * 6.283]);   // gentle waves, a whisper of fibre
  const j = (t, off) => waves.reduce((s, [k, a, ph]) => s + a * Math.sin(2 * Math.PI * k * t / PM + ph + off), 0);
  const lo = PEDGE, hi = PS - PEDGE;
  let d = "";
  for(let x = lo; x <= hi; x += .5) d += (x === lo ? "M" : "L") + f(x) + " " + f(lo + j(x, 0));
  for(let y = lo; y <= hi; y += .5) d += "L" + f(hi + j(y, 1.7)) + " " + f(y);
  for(let x = hi; x >= lo; x -= .5) d += "L" + f(x) + " " + f(hi + j(x, 3.1));
  for(let y = hi; y >= lo; y -= .5) d += "L" + f(lo + j(y, 4.4)) + " " + f(y);
  return `${d}Z`;
}

/* ---------- the share card's paper: full-bleed ivory with a gold-painted deckle frame inset from its edge (1200×630) ---------- */
function ogFrame(){
  const r = rng(5), W = 1200, H = 630, m = 34;
  const waves = [3, 5, 7, 11, 17, 23, 31, 47, 61].map(k => [k, 1.6 / Math.pow(k, .8), r() * 6.283]);
  const j = (t, L, off) => waves.reduce((s, [k, a, ph]) => s + a * Math.sin(2 * Math.PI * k * t / L + ph + off), 0);
  let d = "";
  for(let x = m; x <= W - m; x += 1) d += (x === m ? "M" : "L") + f(x) + " " + f(m + j(x, W, 0));
  for(let y = m; y <= H - m; y += 1) d += "L" + f(W - m + j(y, H, 1.3)) + " " + f(y);
  for(let x = W - m; x >= m; x -= 1) d += "L" + f(x) + " " + f(H - m + j(x, W, 2.6));
  for(let y = H - m; y >= m; y -= 1) d += "L" + f(m + j(y, H, 3.9)) + " " + f(y);
  return { paper: `<rect width="${W}" height="${H}" fill="${PAPER}"/>`, rim: `<path d="${d}Z" fill="none" stroke="#d0d0d0" stroke-width="2.6"/>` };
}

/* ---------- ivory silk (SW×SH): broad soft folds running corner to corner — wide shadows, narrower bright satin
   highlights along each ridge — painted straight in colour (lighting a height map this smooth bands in 8-bit) ---------- */
const SW = 600, SH = 1100;
function silk(){
  const r = rng(61);
  let shade = "", shine = "";
  const fold = (x0, k) => `M${f(x0)} -80C${f(x0 + 150 + k[0] * 120)} ${f(240 + k[1] * 160)} ${f(x0 + 110 + k[2] * 170)} ${f(620 + k[3] * 180)} ${f(x0 + 430 + k[4] * 120)} ${SH + 80}`;
  for(let i = 0; i < 9; i++){
    const x0 = -380 + i * 105 + r() * 50, k = [r(), r(), r(), r(), r()];
    shade += `<path d="${fold(x0, k)}" fill="none" stroke="#cdbfac" stroke-opacity="${f(.35 + r() * .35)}" stroke-width="${f(60 + r() * 90)}"/>`;
    shine += `<path d="${fold(x0 + 38 + r() * 20, k)}" fill="none" stroke="#fffdf8" stroke-opacity="${f(.55 + r() * .4)}" stroke-width="${f(14 + r() * 26)}"/>`;
  }
  return `<defs><filter id="sb" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="38"/></filter>
      <filter id="hb" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="11"/></filter>
      <radialGradient id="glow" cx=".2" cy=".08" r=".9"><stop offset="0" stop-color="#fffaf1" stop-opacity=".85"/><stop offset="1" stop-color="#fffaf1" stop-opacity="0"/></radialGradient>
      <linearGradient id="dim" x1="0" y1="0" x2="1" y2="1"><stop offset=".55" stop-color="#8a7558" stop-opacity="0"/><stop offset="1" stop-color="#8a7558" stop-opacity=".16"/></linearGradient></defs>
    <rect x="-40" y="-40" width="${SW + 80}" height="${SH + 80}" fill="#ebe3d6"/>
    <g filter="url(#sb)">${shade}</g><g filter="url(#hb)">${shine}</g>
    <rect width="${SW}" height="${SH}" fill="url(#glow)"/><rect width="${SW}" height="${SH}" fill="url(#dim)"/>`;
}

/* ---------- floral lace along an edge (band coordinates: u along it, a scallop every DP; v inward from the tips) ---------- */
const DP = 36, DS = 5 * DP, DB = 54;
function laceBand(id, u0, u1){
  let outline = `M${u0} 46L${u0} 17`, cord = "", threads = "", net = "";
  for(let uc = Math.floor((u0 - DP / 2) / DP) * DP + DP / 2; uc <= u1 + DP; uc += DP){
    outline += `L${f(uc - 15)} 17A15 15 0 0 1 ${f(uc + 15)} 17Q${f(uc + 18)} 22 ${f(uc + 21)} 17`;
    cord += `M${f(uc - 15)} 17A15 15 0 0 1 ${f(uc + 15)} 17Q${f(uc + 18)} 22 ${f(uc + 21)} 17`;
    for(let a = 195; a <= 345; a += 15){ const t = a * Math.PI / 180; threads += `<circle cx="${f(uc + 16.8 * Math.cos(t))}" cy="${f(17 + 16.8 * Math.sin(t))}" r="1.25" fill="none" stroke="#bdbdbd" stroke-width=".7"/>`; }
    threads += flower(uc, 19, 7.6) + `<path d="${tear(uc + 18, 24, -62, 1, 6.2, 1.8)}${tear(uc + 18, 24, -118, 1, 6.2, 1.8)}" fill="#bfbfbf" stroke="#8a8a8a" stroke-width=".3"/>`;
    threads += `<path d="${tear(uc + 9, 31 + 2.6 * Math.sin(2 * Math.PI * 9 / DP), -70, 0, 5.6, 1.9)}${tear(uc + 27, 31 + 2.6 * Math.sin(2 * Math.PI * 27 / DP), 70, 0, 5.6, 1.9)}" fill="#c4c4c4" stroke="#8a8a8a" stroke-width=".3"/>
      <circle cx="${f(uc)}" cy="31" r="1.3" fill="url(#dome)"/>`;
  }
  let vine = "";
  for(let u = u0; u <= u1; u += 1) vine += (u === u0 ? "M" : "L") + f(u) + " " + f(31 + 2.6 * Math.sin(2 * Math.PI * (u - DP / 2) / DP));
  for(let n = Math.floor(u0 / 6) - 10; n <= u1 / 6 + 10; n++) net += `M${6 * n} 0L${6 * n + 50} 50M${6 * n} 0L${6 * n - 50} 50`;
  return `<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><path d="${outline}L${u1} 17L${u1} 46Z"/></clipPath>
    <path d="${net}" clip-path="url(#${id})" stroke="#8a8a8a" stroke-width=".38" fill="none" opacity=".6"/>
    <path d="${cord}" fill="none" stroke="#c8c8c8" stroke-width="1.6"/><path d="${vine}" fill="none" stroke="#bdbdbd" stroke-width="1.1"/>
    <path d="M${u0} 41H${u1}" stroke="#cfcfcf" stroke-width="1.8"/><path d="M${u0} 44.5H${u1}" stroke="#bcbcbc" stroke-width=".9"/>${threads}`;
}
function doily(){
  // each edge mitred at 45° where it meets the next, so the bands join at the corners instead of crossing
  const miter = `<clipPath id="miter" clipPathUnits="userSpaceOnUse"><path d="M-30 -30H${DS + 30}L${DS - 52} 52H52Z"/></clipPath>`;
  const bands = ["1 0 0 1 0 0", "0 1 1 0 0 0", `1 0 0 -1 0 ${DS}`, `0 1 -1 0 ${DS} 0`]
    .map((m, i) => `<g transform="matrix(${m})"><g clip-path="url(#miter)">${laceBand(`lb${i}`, -DP, DS + DP)}</g></g>`).join("");
  // a rosette over each corner, where two edges cross
  const rosettes = [[24, 24], [DS - 24, 24], [24, DS - 24], [DS - 24, DS - 24]].map(([x, y]) => flower(x, y, 12, 8, -67.5) + flower(x, y, 6.5, 5)).join("");
  return miter + bands + rosettes;
}

/* ---------- the envelope's liner: flowers, leaves and dots embroidered on tulle (LT×LT, seamless) ---------- */
const LT = 96;
function liner(withNet = true){
  const r = rng(23);
  let net = "", s = "";
  for(let n = -40; n <= 70; n++) net += `M${4 * n} -40L${4 * n + 180} 140M${4 * n} -40L${4 * n - 180} 140`;
  const motifs = [[22, 24, 8], [68, 60, 9], [40, 82, 5], [86, 16, 5.5], [10, 66, 4.5]];
  let one = "";
  motifs.forEach(([x, y, R], i) => {
    one += flower(x, y, R, i % 2 ? 6 : 5, r() * 60);
    for(let k = 0; k < 3; k++){ const a = r() * 360; one += `<path d="${tear(x, y, a, R * 1.1, R * 1.9, R * .3)}" fill="#c2c2c2" stroke="#8a8a8a" stroke-width=".3"/>`; }
    for(let k = 0; k < 4; k++){ const a = r() * 6.28, d = R * (2.1 + r() * .6); one += `<circle cx="${f(x + Math.cos(a) * d)}" cy="${f(y + Math.sin(a) * d)}" r=".9" fill="url(#dome)"/>`; }
  });
  for(let i = -1; i <= 1; i++) for(let j = -1; j <= 1; j++) s += `<g transform="translate(${i * LT} ${j * LT})">${one}</g>`;
  return (withNet ? `<path d="${net}" stroke="#8a8a8a" stroke-width=".32" fill="none" opacity=".55"/>` : "") + s;
}

/* ---------- a straight-cut card with gilded edges (PS×PS 9-slice, like paper.webp): the sheet, and a gold rim round it ---------- */
const giltRect = `M${PEDGE + 4} ${PEDGE}H${PS - PEDGE - 4}Q${PS - PEDGE} ${PEDGE} ${PS - PEDGE} ${PEDGE + 4}V${PS - PEDGE - 4}Q${PS - PEDGE} ${PS - PEDGE} ${PS - PEDGE - 4} ${PS - PEDGE}H${PEDGE + 4}Q${PEDGE} ${PS - PEDGE} ${PEDGE} ${PS - PEDGE - 4}V${PEDGE + 4}Q${PEDGE} ${PEDGE} ${PEDGE + 4} ${PEDGE}Z`;

/* ---------- the seal (on a 200-grid): cream wax with an uneven edge and a rounded lip, a pressed plate, a sprig standing up ---------- */
function seal(){
  const r = rng(19);
  let edge = "";
  for(let i = 0; i <= 160; i++){
    const t = i / 160 * 6.2832, rr = 90 + 3.2 * Math.sin(5 * t + .6) + 2.2 * Math.sin(8 * t + 2.1) + 1.2 * Math.sin(13 * t + .9);
    edge += (i ? "L" : "M") + f(100 + rr * Math.cos(t)) + " " + f(100 + rr * Math.sin(t));
  }
  let s = `<path d="${edge}Z" fill="url(#lip)"/><circle cx="100" cy="100" r="68" fill="#7e7e7e"/><circle cx="100" cy="100" r="61" fill="none" stroke="#b4b4b4" stroke-width="2.4"/>
    <path d="M100 152C97 128 98 92 102 50" fill="none" stroke="#c8c8c8" stroke-width="3.2" stroke-linecap="round"/>`;
  [[146, 26], [128, 24], [110, 21], [92, 18], [75, 15], [60, 12]].forEach(([y, L], i) => {
    const x = 99 + (y < 90 ? 1.5 : 0);
    s += leaf(r, x, y, -150 + i * 4, L, .06) + leaf(r, x, y, -30 - i * 4, L, -.06);
  });
  return s + leaf(r, 102, 52, -88, 13);
}

/* ---------- dried baby's breath: a stem branching four times, a cluster of tiny florets at every tip ---------- */
function gypsophila(){
  const r = rng(41);
  let stems = "", florets = "";
  const floret = (x, y, s) => [...Array(5)].map((_, k) => { const a = k * 1.2566 + r(); return `<circle cx="${f(x + Math.cos(a) * s * .55)}" cy="${f(y + Math.sin(a) * s * .55)}" r="${f(s * .5)}" fill="url(#dome)"/>`; }).join("") + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s * .35)}" fill="#e0e0e0"/>`;
  function branch(x, y, ang, len, depth){
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    stems += `M${f(x)} ${f(y)}Q${f((x + x2) / 2 + (r() - .5) * 5)} ${f((y + y2) / 2)} ${f(x2)} ${f(y2)}`;
    if(!depth){ for(let k = 0, n = 4 + Math.floor(r() * 4); k < n; k++){ const a = r() * 6.28, d = r() * 5; florets += floret(x2 + Math.cos(a) * d, y2 + Math.sin(a) * d, 2.3 + r() * 1.3); } return; }
    for(let i = 0, n = 2 + Math.floor(r() * 2); i < n; i++) branch(x2, y2, ang + (r() - .5) * 1.2, len * (.66 + r() * .16), depth - 1);
  }
  branch(100, 258, -Math.PI / 2 - .08, 56, 5);
  return { stems: `<path d="${stems}" fill="none" stroke="#a6a6a6" stroke-width="1.3" stroke-linecap="round"/>`, florets };
}

/* ---------- a scalloped ceramic dish (a raised rim, a shallow well) and two gold rings resting in it ---------- */
function dish(){
  let edge = "";
  for(let i = 0; i <= 280; i++){ const t = i / 280 * 6.2832, rr = 100 + 4.2 * Math.cos(14 * t); edge += (i ? "L" : "M") + f(115 + rr * Math.cos(t)) + " " + f(115 + rr * Math.sin(t)); }
  const ring = (cx, cy, R) => `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#a2a2a2" stroke-width="5.2"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#e6e6e6" stroke-width="1.8"/>`;
  return {
    clay: `<path d="${edge}Z" fill="url(#well)"/>`,
    gold: ring(98, 108, 21) + ring(126, 124, 18.5),
  };
}

/* ---------- lighting ---------- */
const sun = `<feDistantLight azimuth="225" elevation="50"/>`;   // from the top left
const DEFS = `
  <radialGradient id="dome" cx=".42" cy=".4" r=".62"><stop offset="0" stop-color="#d8d8d8"/><stop offset=".72" stop-color="#ababab"/><stop offset="1" stop-color="#8a8a8a"/></radialGradient>
  <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a7a7a"/><stop offset=".5" stop-color="#c4c4c4"/><stop offset="1" stop-color="#7a7a7a"/></linearGradient>
  <radialGradient id="lip"><stop offset="0" stop-color="#b0b0b0"/><stop offset=".76" stop-color="#b4b4b4"/><stop offset=".88" stop-color="#d6d6d6"/><stop offset="1" stop-color="#909090"/></radialGradient>
  ${SOFTEN}
  <radialGradient id="well"><stop offset="0" stop-color="#8e8e8e"/><stop offset=".7" stop-color="#999"/><stop offset=".82" stop-color="#d4d4d4"/><stop offset=".9" stop-color="#c8c8c8"/><stop offset="1" stop-color="#9c9c9c"/></radialGradient>`;
let BOX = "";     // set per picture by render(): the filter covers the whole (padded) picture
let GRAIN = "";   // set per picture by render(): the noise has to be as fine as the pixels being drawn
const grainAt = density => `<feTurbulence type="fractalNoise" baseFrequency="${(.55 * density).toFixed(2)}" numOctaves="1" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .01 0 0 0 0" result="grain"/>`;
const KD = .5 / Math.sin(50 * Math.PI / 180);   // flat paper lights to exactly mid-grey…

/* a material of one colour, lit, cut to its own outline, casting a soft shadow on whatever lies beneath */
const material = (color, { kd = 1.2, spec = .2, exp = 30, relief = 4.5, blur = 1, shadow = .25, sx = 1.4, sy = 2.4, sb = 2, ink = "#4a3c30" } = {}) => id => `<filter id="${id}" ${BOX}>
    <feColorMatrix in="SourceGraphic" type="luminanceToAlpha"/>
    <feGaussianBlur stdDeviation="${blur}" result="height"/>
    <feDiffuseLighting in="height" surfaceScale="${relief}" diffuseConstant="${kd}" lighting-color="${color}" result="matte">${sun}</feDiffuseLighting>
    <feSpecularLighting in="height" surfaceScale="${relief}" specularConstant="${spec}" specularExponent="${exp}" lighting-color="#fff" result="shine">${sun}</feSpecularLighting>
    <feComposite in="matte" in2="shine" operator="arithmetic" k2="1" k3="1" result="lit"/>
    <feComposite in="lit" in2="SourceAlpha" operator="in" result="cut"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="${sb}"/><feOffset dx="${sx}" dy="${sy}" result="cast"/>
    <feFlood flood-color="${ink}" flood-opacity="${shadow}"/><feComposite in2="cast" operator="in" result="shade"/>
    <feMerge><feMergeNode in="shade"/><feMergeNode in="cut"/></feMerge>
  </filter>`;
const LIGHT = {
  // cotton paper: the sheet in one colour, a faint shade along its torn edge, and the shadow it lays on the satin
  sheet: id => `<filter id="${id}" ${BOX}>
    <feFlood flood-color="${PAPER}" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in" result="sheet"/>
    <feMorphology in="SourceAlpha" operator="erode" radius="1.3" result="er"/>
    <feComposite in="SourceAlpha" in2="er" operator="out" result="rim0"/><feGaussianBlur in="rim0" stdDeviation=".7" result="rim1"/>
    <feFlood flood-color="#c9bba8" flood-opacity=".32"/><feComposite in2="rim1" operator="in" result="rim"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="4"/><feOffset dy="4" result="far"/>
    <feFlood flood-color="#5d4c3b" flood-opacity=".2"/><feComposite in2="far" operator="in" result="farS"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="1"/><feOffset dy="1" result="near"/>
    <feFlood flood-color="#5d4c3b" flood-opacity=".16"/><feComposite in2="near" operator="in" result="nearS"/>
    <feMerge><feMergeNode in="farS"/><feMergeNode in="nearS"/><feMergeNode in="sheet"/><feMergeNode in="rim"/></feMerge>
  </filter>`,
  // only what rises or falls shows, on a transparent ground: light above mid-grey, shade below it (blind embossing)
  pressed: id => `<filter id="${id}" ${BOX}>
    <feColorMatrix in="SourceGraphic" type="luminanceToAlpha"/>
    <feGaussianBlur stdDeviation=".9" result="height"/>
    <feDiffuseLighting in="height" surfaceScale="3.4" diffuseConstant="${KD.toFixed(4)}" lighting-color="#fff" result="lit">${sun}</feDiffuseLighting>
    <feColorMatrix in="lit" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 .98  4 0 0 0 -2.04" result="hi"/>
    <feColorMatrix in="lit" type="matrix" values="0 0 0 0 .32  0 0 0 0 .26  0 0 0 0 .2  -1.5 0 0 0 .73" result="sh"/>
    <feMerge><feMergeNode in="sh"/><feMergeNode in="hi"/></feMerge>
  </filter>`,
  thread: material("#f7f2e9", { kd: 1.27, spec: .12, relief: 2.6, blur: .55, shadow: .32, sx: .7, sy: 1.2, sb: .9 }),   // ivory lace
  dry: material("#d9c9ab", { kd: 1.18, spec: .08, relief: 3, shadow: .18 }),                                           // dried stems
  bloom: material("#f4ecdf", { kd: 1.25, spec: .15, relief: 3, shadow: .16 }),                                         // dried florets
  clay: material("#e7ddcf", { kd: 1.14, spec: .32, exp: 22, relief: 6, shadow: .3, sx: 3, sy: 6, sb: 5 }),           // ceramic
  gold: material("#cf9f52", { kd: 1.15, spec: 1, exp: 34, relief: 5, blur: .8, shadow: .35, sx: 1.2, sy: 2, sb: 1.4 }),
  // silk: a soft ivory sheen that rises to bright satin highlights along each fold
  silk: id => `<filter id="${id}" ${BOX}>
    <feColorMatrix in="SourceGraphic" type="luminanceToAlpha"/>
    <feGaussianBlur stdDeviation="2" result="height"/>
    <feDiffuseLighting in="height" surfaceScale="38" diffuseConstant="1.02" lighting-color="#efe7da" result="matte"><feDistantLight azimuth="235" elevation="58"/></feDiffuseLighting>
    <feSpecularLighting in="height" surfaceScale="38" specularConstant=".55" specularExponent="9" lighting-color="#fffaf2" result="shine"><feDistantLight azimuth="235" elevation="58"/></feSpecularLighting>
    <feComposite in="matte" in2="shine" operator="arithmetic" k2="1" k3="1"/>
  </filter>`,
  foil: material("#c9a25a", { kd: 1.12, spec: .9, exp: 24, relief: 1.4, blur: .45, shadow: .12, sx: .4, sy: .6, sb: .5 }),   // flat hot-foil print
  // cream sealing wax, cut to its outline; what stands higher is a touch paler, so the lip and the sprig read
  wax: id => `<filter id="${id}" ${BOX}>
    <feColorMatrix in="SourceGraphic" type="luminanceToAlpha"/>
    <feGaussianBlur stdDeviation="1" result="shape"/>
    ${GRAIN}
    <feComposite in="shape" in2="grain" operator="arithmetic" k2="1" k3="1" result="height"/>
    <feDiffuseLighting in="height" surfaceScale="7" diffuseConstant="1.12" lighting-color="#ecdfc8" result="matte">${sun}</feDiffuseLighting>
    <feSpecularLighting in="height" surfaceScale="7" specularConstant=".4" specularExponent="20" lighting-color="#fffaf0" result="shine">${sun}</feSpecularLighting>
    <feComposite in="matte" in2="shine" operator="arithmetic" k2="1" k3="1" result="lit"/>
    <feColorMatrix in="shape" type="matrix" values="0 0 0 0 1  0 0 0 0 .98  0 0 0 0 .93  0 0 0 1.5 -.74" result="pale"/>
    <feMerge result="toned"><feMergeNode in="lit"/><feMergeNode in="pale"/></feMerge>
    <feComposite in="toned" in2="SourceAlpha" operator="in"/>
  </filter>`,
};
const NEEDS_GROUND = new Set(["pressed"]);   // lights the whole sheet, so it starts as flat black (height 0)

/* layers: [light, art] pairs, bottom first; art is drawn on a W×H grid and the picture comes out `scale` times that.
   It is lit at twice that size and reduced, which smooths every edge.
   pad: room drawn round the picture and cut off afterwards, so tiles have no lit seams at their edges.
   png: also keep a PNG copy in assets/ (next/og, which draws the share card, reads PNG). */
const SUPER = 2, ONLY = process.argv[2];
async function render(file, W, H, layers, { scale = 3, quality = 88, alphaQuality = 92, pad = 0, png = "" } = {}){
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
  if(png) await sharp(buf).resize(Math.round(W * 1.5)).png().toFile(join(root, "assets", png));
  return buf;
}

/* ---------- the pieces (sizes are CSS px on a phone) ---------- */
mkdirSync(join(root, "public/emboss"), { recursive: true });

{
  const edge = deckle();
  await render("emboss/paper.webp", PS, PS, [["sheet", `<path d="${edge}" fill="#fff"/>`]], { scale: 2, quality: 92, alphaQuality: 95 });
  // the same sheet with its torn edge painted gold, as fine stationers do
  await render("emboss/paper-gilt.webp", PS, PS, [["sheet", `<path d="${edge}" fill="#fff"/>`], ["foil", `<path d="${edge}" fill="none" stroke="#d0d0d0" stroke-width="2.2"/>`]], { scale: 2, quality: 92, alphaQuality: 95 });
}
await render("emboss/silk.webp", SW, SH, [["plain", silk()]], { scale: 1.2, quality: 84 });
{
  const o = ogFrame();
  await render("emboss/og-frame.webp", 1200, 630, [["plain", o.paper], ["foil", o.rim]], { scale: 1, quality: 90, png: "og-frame.png" });
}
await render("emboss/card-gilt.webp", PS, PS, [["sheet", `<path d="${giltRect}" fill="#fff"/>`], ["gold", `<path d="${giltRect}" fill="none" stroke="#c4c4c4" stroke-width="2.4"/><path d="${giltRect}" fill="none" stroke="#e8e8e8" stroke-width=".8"/>`]], { scale: 2, quality: 92, alphaQuality: 95 });
await render("emboss/doily.webp", DS, DS, [["thread", doily()]], { scale: 3, quality: 90, alphaQuality: 95, pad: 6 });
await render("emboss/liner.webp", LT, LT, [["thread", liner()]], { scale: 3, quality: 88, alphaQuality: 92, pad: 12 });
await render("emboss/liner-gold.webp", LT, LT, [["gold", liner(false)]], { scale: 3, quality: 88, alphaQuality: 92, pad: 12 });
await render("emboss/flap-sprig.webp", 110, 150, [["pressed", sprig(rng(7), 18, 144, 88, 12, 15, 7)]], { scale: 3, quality: 88, pad: 8 });
await render("emboss/seal.webp", 200, 200, [["wax", seal()]], { scale: 3, quality: 95, alphaQuality: 100, png: "seal.png" });
{
  const g = gypsophila();
  await render("emboss/gypsophila.webp", 200, 260, [["dry", g.stems], ["bloom", g.florets]], { scale: 2.5, quality: 90, pad: 6, png: "gypsophila.png" });
}
{
  const d = dish();
  await render("emboss/dish.webp", 230, 230, [["clay", d.clay], ["gold", d.gold]], { scale: 2.5, quality: 90, pad: 8, png: "dish.png" });
}

// favicon.ico (16, 32, 48): the monogram, F | R, on paper
if(!ONLY || "favicon".includes(ONLY)){
  const [a, b] = CONFIG.initials;
  const svg = s => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="${PAPER}"/>
    <g font-family="Cormorant Garamond" font-weight="500" font-size="34" fill="#4f453e" text-anchor="middle"><text x="19" y="44">${a}</text><text x="46" y="44">${b}</text></g>
    <path d="M32.5 14V50" stroke="#a39684" stroke-width="1.6"/></svg>`);
  const sizes = [16, 32, 48], pngs = await Promise.all(sizes.map(s => sharp(svg(s), { density: 72 * 4 }).resize(s, s).png().toBuffer()));
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
