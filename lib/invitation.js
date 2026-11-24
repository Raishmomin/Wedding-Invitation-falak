import { CONFIG } from "./config";

/* Brings the invitation to life: fills in names and dates, builds the programme and calendar, runs the gatefold,
   scroll reveals, countdown, drifting petals and music.
   Called from components/Invitation.jsx after the page is shown; sets everything up once. */
export function initInvitation(root, guest){
  // while the gatefold is closed the page behind it must not scroll (re-applied on every call: React may run
  // the effect, undo it and run it again, and the undo takes the lock off)
  if(document.querySelector("#gate:not(.open)")) document.body.classList.add("locked");
  if(root.dataset.ready) return;
  root.dataset.ready = "1";

  const $ = s => document.querySelector(s);
  const put = (sel, text) => document.querySelectorAll(sel).forEach(el => el.textContent = text);
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ---------- guest name from the link ----------
     Works as  yoursite.com/#Rahul-Sharma   (also ?to=Rahul+Sharma on your own hosting) */
  const RESERVED = /^(settings|sidebar|customize|upgrade|downloads|comment-.*)$/i;
  const query = (() => { try{ return new URLSearchParams(location.search); }catch(e){ return new URLSearchParams(); } })();
  function guestFromUrl(){
    let raw = "";
    try{ raw = query.get("to") || query.get("guest") || query.get("name") || decodeURIComponent(location.hash.slice(1)); }
    catch(e){ raw = location.hash.slice(1); }
    if(!raw || RESERVED.test(raw)) return "";
    raw = raw.replace(/[-_+]+/g," ").replace(/[^\p{L}\p{M}\p{N} .&']/gu,"").replace(/\s+/g," ").trim().slice(0,48);
    if(raw && raw === raw.toLowerCase()) raw = raw.replace(/(^|\s)\p{L}/gu, c => c.toUpperCase());
    return raw.replace(/\s(and|And)\s/g," & ");
  }
  function setGuest(name){
    const g = name || CONFIG.defaultGuest;
    const inGujarati = /[\u0A80-\u0AFF]/.test(g);   // the script font has no Gujarati letters: such names get a plain serif
    // the script font's "&" reads like a 4, so it is set apart in Cormorant italic
    const html = esc(g).replace(/&amp;/g, `<span class="amp">&amp;</span>`);
    document.querySelectorAll("[data-guest]").forEach(el => { el.innerHTML = html; el.classList.toggle("gu", inGujarati); });
  }

  /* ---------- fill from CONFIG ---------- */
  put("[data-groom]", CONFIG.groom); put("[data-bride]", CONFIG.bride);

  const wedding = new Date(CONFIG.weddingAt);
  const IST = { timeZone: "Asia/Kolkata" };
  const P = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { day:"numeric", month:"numeric", year:"numeric", ...IST }).formatToParts(wedding).map(p => [p.type, +p.value]));
  const fmt = opts => wedding.toLocaleDateString("en-GB", { ...opts, ...IST });
  const monthName = fmt({ month:"long" });
  const dd = String(P.day).padStart(2,"0"), mm = String(P.month).padStart(2,"0");
  put("[data-dd]", dd); put("[data-mon]", fmt({ month:"short" })); put("[data-yr]", P.year); put("[data-weekday]", fmt({ weekday:"long" }));
  put("[data-dm]", `${dd}.${mm}`); put("[data-month]", `${monthName} ${P.year}`);
  const main = CONFIG.events.find(e => e.main) || CONFIG.events[0];
  put("[data-main-at]", `${main.name} at ${main.time}`);

  /* the celebrations: the name in gold capitals, the day and time, the place — built from CONFIG.events */
  (function(){
    $("#program").innerHTML = CONFIG.events.map((e, i) => `<div class="ev reveal" style="--k:${i}">
        <p class="cap gold">${esc(e.name)}</p><p class="cap">${esc(e.date)} · ${esc(e.time)}</p>${e.place ? `<p class="place">${esc(e.place)}</p>` : ""}
      </div>`).join("");
  })();

  /* the calendar's key: each marked day — a fine gold ring, filled for the Nikah — and what happens on it */
  (function(){
    const lg = $("#legend"), days = [...new Set(CONFIG.events.map(e => e.day))];
    days.forEach(day => {
      const evs = CONFIG.events.filter(e => e.day === day);
      const sp = document.createElement("span");
      sp.innerHTML = `<i class="${evs.some(e => e.main) ? "main" : ""}"></i><span></span>`;
      sp.lastElementChild.textContent = `${day} · ${evs.map(e => e.name).join(" & ")}`;
      lg.appendChild(sp);
    });
  })();

  /* the monogram (logo), as on the stationery: our initials either side of a hairline, a little laurel beneath */
  function monogram(){
    const [a, b] = CONFIG.initials;
    let laurel = "";
    for(const s of [-1, 1]){
      laurel += `<path class="stem" pathLength="1" d="M100 106Q${100 + s * 22} 106 ${100 + s * 34} 88"/>`;
      [[.25, 0], [.5, 1], [.72, 0], [.9, 1]].forEach(([t, side], i) => {
        const u = 1 - t, x = u * u * 100 + 2 * u * t * (100 + s * 22) + t * t * (100 + s * 34), y = u * u * 106 + 2 * u * t * 106 + t * t * 88;
        const dir = s > 0 ? -40 - t * 30 : 220 + t * 30, a1 = dir + (side ? -1 : 1) * 40 * (s > 0 ? 1 : -1), L = 9 - i * .8;
        laurel += `<path class="lf" style="--k:${i}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a1.toFixed(0)})" d="M0 0Q${L / 2} ${-L * .38} ${L} 0Q${L / 2} ${L * .38} 0 0Z"/>`;
      });
    }
    return `<svg class="mono reveal" viewBox="0 0 200 114" role="img" aria-label="${a} and ${b}">
      <text class="mA" x="86" y="70" text-anchor="end">${a}</text>
      <path class="bar" pathLength="1" d="M100.5 26V78"/>
      <text class="mB" x="114" y="70">${b}</text>
      <g class="laurel">${laurel}<circle class="bud" cx="100" cy="106" r="1.8"/></g>
    </svg>`;
  }
  document.querySelectorAll("[data-mono]").forEach(el => el.innerHTML = monogram());

  /* month calendar, Monday first; a gold ring round each day of the celebrations */
  (function(){
    const cal = $("#cal"); let k = 0;
    ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach(d => { const e = document.createElement("div"); e.className = "dow"; e.textContent = d; cal.appendChild(e); });
    const first = (new Date(Date.UTC(P.year, P.month - 1, 1)).getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(P.year, P.month, 0)).getUTCDate();
    for(let i = 0; i < first; i++) cal.appendChild(document.createElement("div"));
    for(let d = 1; d <= days; d++){
      const e = document.createElement("div"); e.className = "d"; e.style.setProperty("--k", k++);
      const evs = CONFIG.events.filter(x => x.day === d);
      if(evs.length) e.classList.add(evs.some(x => x.main) ? "main" : "also");
      const s = document.createElement("span"); s.textContent = d; e.appendChild(s);
      cal.appendChild(e);
    }
  })();

  const initialGuest = guest || guestFromUrl();
  setGuest(initialGuest);

  /* ---------- music: soft piano over strings in a hall, made in the browser; starts when the seal is opened ----------
     To use your own song instead, add an audio file to the page and set MUSIC_FILE to its name. */
  const MUSIC_FILE = CONFIG.musicFile || "";
  let ac, master, verb, tune, musicOn = false, step = 0, nextAt = 0, loop;
  const EIGHTH = .47;                                   // tempo: about 64 beats a minute
  /* eight bars: [string-pad notes], [eight piano notes, low to high and back] */
  const BARS = [
    [[185, 220, 277.18, 329.63],    [146.83, 220, 329.63, 369.99, 440, 369.99, 329.63, 220]],       // D maj9
    [[146.83, 185, 220, 293.66],    [123.47, 185, 293.66, 369.99, 440, 369.99, 293.66, 185]],       // B m7
    [[196, 246.94, 293.66, 369.99], [98, 146.83, 246.94, 293.66, 369.99, 293.66, 246.94, 146.83]],  // G maj7
    [[220, 293.66, 329.63],         [110, 164.81, 220, 293.66, 329.63, 277.18, 220, 164.81]],       // A sus4 - A
    [[220, 277.18, 329.63],         [92.5, 138.59, 220, 277.18, 329.63, 277.18, 220, 138.59]],      // F# m7
    [[146.83, 185, 220, 293.66],    [123.47, 185, 293.66, 369.99, 440, 369.99, 293.66, 185]],       // B m7
    [[196, 246.94, 293.66, 369.99], [82.41, 123.47, 196, 246.94, 293.66, 369.99, 293.66, 246.94]],  // E m9
    [[196, 220, 277.18, 329.63],    [110, 164.81, 196, 277.18, 329.63, 392, 329.63, 277.18]]        // A 7
  ];
  /* the tune: step in the 64-step cycle -> [note, length in steps] */
  const MELODY = { 0:[739.99,3], 3:[659.25,1], 4:[880,4], 8:[587.33,4], 12:[739.99,4], 16:[493.88,2], 18:[587.33,2], 20:[739.99,2], 22:[659.25,2],
    24:[659.25,6], 30:[554.37,2], 32:[880,3], 35:[739.99,1], 36:[659.25,4], 40:[587.33,2], 42:[739.99,2], 44:[987.77,4],
    48:[783.99,3], 51:[739.99,1], 52:[659.25,2], 54:[587.33,2], 56:[554.37,4], 60:[659.25,4] };
  function buildSound(){
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0;
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    master.connect(comp); comp.connect(ac.destination);
    /* a concert-hall echo, made from fading noise */
    const len = Math.floor(ac.sampleRate * 3.4), ir = ac.createBuffer(2, len, ac.sampleRate);
    for(let c = 0; c < 2; c++){ const d = ir.getChannelData(c); for(let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8); }
    verb = ac.createConvolver(); verb.buffer = ir;
    const wet = ac.createGain(); wet.gain.value = .5; verb.connect(wet); wet.connect(master);
  }
  function piano(f, t, vel, len){
    const out = ac.createGain(), lp = ac.createBiquadFilter(), pan = ac.createStereoPanner ? ac.createStereoPanner() : null;
    lp.type = "lowpass"; lp.frequency.value = 1500 + vel * 9000; lp.Q.value = .3;
    out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(vel, t + .008);
    out.gain.exponentialRampToValueAtTime(vel * .3, t + .4); out.gain.exponentialRampToValueAtTime(.0006, t + len);
    [1, .42, .2, .09, .04].forEach((amp, i) => {
      const n = i + 1, o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine"; o.frequency.value = f * n * (1 + .0005 * n * n); g.gain.value = amp;
      o.connect(g); g.connect(lp); o.start(t); o.stop(t + len + .1);
    });
    lp.connect(out);
    if(pan){ pan.pan.value = Math.max(-.5, Math.min(.5, Math.log2(f / 330) * .28)); out.connect(pan); pan.connect(master); pan.connect(verb); }
    else { out.connect(master); out.connect(verb); }
  }
  function strings(notes, t, dur){
    const g = ac.createGain(), lp = ac.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 850; lp.Q.value = .5;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + dur * .45); g.gain.linearRampToValueAtTime(.04, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + 1.8);
    notes.forEach(f => [-7, 7].forEach(cents => {
      const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = cents;
      o.connect(lp); o.start(t); o.stop(t + dur + 2);
    }));
    lp.connect(g); g.connect(master); g.connect(verb);
  }
  function schedule(){
    if(!root.isConnected){ clearInterval(loop); if(ac) ac.close(); return; }
    while(nextAt < ac.currentTime + .5){
      const cycle = Math.floor(step / 64), s64 = step % 64, bar = Math.floor(s64 / 8), i = s64 % 8, [pad, arp] = BARS[bar];
      const t = nextAt + (Math.random() - .5) * .018;
      if(i === 0) strings(pad, nextAt, EIGHTH * 8);
      piano(arp[i], t, (i === 0 ? .17 : i === 4 ? .1 : .075) * (.9 + Math.random() * .2), i === 0 ? 4.5 : 2.6);
      const m = MELODY[s64];
      if(m && cycle > 0) piano(m[0], t + .012, .15 * (.88 + Math.random() * .24), Math.max(2.4, m[1] * EIGHTH + 1.6));   // first time round is an introduction
      nextAt += EIGHTH; step++;
    }
  }
  function setMusic(on){
    const btn = $("#music");
    try{
      if(MUSIC_FILE){
        if(!tune){ tune = new Audio(MUSIC_FILE); tune.loop = true; tune.volume = .6; }
        on ? tune.play().catch(() => {}) : tune.pause();
      }else{
        if(!ac) buildSound();
        if(on){
          ac.resume(); nextAt = ac.currentTime + .1;
          master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(.95, ac.currentTime + 3);
          clearInterval(loop); loop = setInterval(schedule, 120); schedule();
        }else{
          clearInterval(loop);
          master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(0, ac.currentTime + 1.2);
        }
      }
      musicOn = on;
    }catch(e){ musicOn = false; }
    btn.setAttribute("aria-pressed", String(musicOn)); btn.setAttribute("aria-label", musicOn ? "Turn music off" : "Turn music on");
  }
  $("#music").addEventListener("click", () => setMusic(!musicOn));
  let wasOn = false;
  document.addEventListener("visibilitychange", () => { if(document.hidden){ wasOn = musicOn; if(musicOn) setMusic(false); } else if(wasOn) setMusic(true); });

  /* ---------- entrance ----------
     The seal presses and lifts, the flap opens on its lace lining, the card rises out of the envelope; then the card is
     lifted out of it and flown — same proportions, every size in container units — onto the invitation below, and the
     cover fades away with the invitation already in exactly that place. */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gate = $("#gate"), box = $(".env-cardbox"), hero = $("#hero");
  // the card in the envelope takes the invitation's proportions, so it can land on it exactly
  const fit = () => { if(box.isConnected && !gate.classList.contains("open")) box.style.setProperty("--ratio", hero.offsetHeight / hero.offsetWidth); };
  fit(); (document.fonts?.ready || Promise.resolve()).then(fit); addEventListener("resize", fit);
  function open(){
    if(gate.classList.contains("open")) return;
    gate.classList.add("open");
    $("#music").hidden = false; setMusic(true);
    const at = (ms, fn) => setTimeout(fn, reduce ? 0 : ms);
    at(1250, () => box.querySelector(".mono")?.classList.remove("pre"));
    at(2300, () => {
      if(reduce) return;
      $(".hero .mono")?.classList.remove("pre");
      const r0 = box.getBoundingClientRect(), r1 = hero.getBoundingClientRect();
      gate.appendChild(box);   // out of the envelope, no longer clipped by it
      Object.assign(box.style, { position: "fixed", left: r0.left + "px", top: r0.top + "px", width: r0.width + "px", height: r0.height + "px", margin: 0 });
      void box.offsetWidth;
      gate.classList.add("fly");
      box.style.transform = `translate(${r1.left - r0.left}px, ${r1.top - r0.top}px) scale(${r1.width / r0.width})`;
    });
    at(3150, () => {
      gate.classList.add("gone");
      document.body.classList.remove("locked");
      document.body.classList.add("opened");
    });
    at(3900, () => gate.remove());
  }
  $("#tapBtn").addEventListener("click", open);
  $("#openBtn").addEventListener("click", e => { e.stopPropagation(); open(); });
  $("#env").addEventListener("click", open);   // tapping anywhere on the envelope opens it too

  /* ---------- reveal on scroll: every piece arrives on its own beat ---------- */
  const reveals = [...document.querySelectorAll(".reveal")];
  if("IntersectionObserver" in window && !reduce){
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.remove("pre"); io.unobserve(e.target); }
    }), { threshold:.2 });
    const cardIo = new IntersectionObserver(entries => entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.remove("pre"); cardIo.unobserve(e.target); }
    }), { threshold:.06 });
    reveals.forEach(el => {
      el.classList.add("pre");
      if(el.closest(".hero, #gate")) return;           // the invitation and the cover are released by the entrance
      if(el.classList.contains("card")){ cardIo.observe(el); return; }
      const sibs = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
      if(!el.matches(".cal,.mono,.ev")) el.style.transitionDelay = Math.min(sibs.indexOf(el) % 6, 5) * .1 + "s";
      io.observe(el);
    });
  }
  /* ---------- countdown ---------- */
  const cdEls = { d:$("#cd"), h:$("#ch"), m:$("#cm"), s:$("#cs") };
  function setNum(el, v){
    const t = String(v).padStart(2,"0");
    if(el.textContent !== t){ el.textContent = t; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); }
  }
  function tickCountdown(){
    if(!root.isConnected) return;
    let diff = Math.floor((wedding - Date.now()) / 1000);
    if(diff <= 0){ $("#countTitle").textContent = "The celebrations have begun"; $("#count").hidden = true; $("#countSub").hidden = true; return; }
    setNum(cdEls.d, Math.floor(diff / 86400)); diff %= 86400;
    setNum(cdEls.h, Math.floor(diff / 3600));  diff %= 3600;
    setNum(cdEls.m, Math.floor(diff / 60));
    setNum(cdEls.s, diff % 60);
    setTimeout(tickCountdown, 1000);
  }
  tickCountdown();

}
