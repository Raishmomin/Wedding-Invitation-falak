// The invitation's HTML. __GUEST__ is replaced with the guest's name, __SEAL__ with the seal picture.
// Names, dates, the day's timeline and the calendar are filled in from lib/config.js by lib/invitation.js.
const PIN = `<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 21.5c-4.6-5.4-7-9-7-12a7 7 0 0 1 14 0c0 3-2.4 6.6-7 12z"/><circle cx="12" cy="9.5" r="2.5"/></g></svg>`;
const PHONE = `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" d="M6.6 3.5h3l1.5 4-2 1.3a10 10 0 0 0 5.1 5.1l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/></svg>`;
const RULE = `<i class="rule" aria-hidden="true"></i>`;
const MONO = (cls) => `<img class="mono ${cls}" src="/emboss/monogram.webp" alt="" aria-hidden="true">`;   // the F R logo
/* The invitation card. The envelope holds a small copy of the very card the first page shows, so the card that comes
   out of the envelope is the first page's card (the copy's names are not a heading: \`h\` = "p"). */
const CARD = (h) => `
      <p class="bismillah" lang="ar" dir="rtl">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
      <p class="cap small">In the name of Allah, the Most Gracious, the Most Merciful</p>
      ${RULE}
      <p class="cap strong">The Badi Family</p>
      <p class="cap">With the grace of the Almighty<br>and the blessings of our elders</p>
      <p class="cap soft label-wi">Wedding Invitation</p>
      <${h} class="names"><span class="n" data-bride>Falaknaaz</span><span class="and"><i></i><span class="script">and</span><i></i></span><span class="n" data-groom>Raish Ahemad</span></${h}>
      ${RULE}
      <div class="daterow"><span data-weekday>Sunday</span><i></i><span class="dd"><b data-dd>27</b><small data-yr>2026</small></span><i></i><span data-mon>December</span></div>
      <p class="cap" data-main-at>Nikah at 10:00 AM</p>
      <p class="cap soft">Salabatpura · Surat</p>
      ${MONO("h-mono")}`;
const flower = (cls, src) => `<img class="deco ${cls}" src="/emboss/${src}.webp" alt="" aria-hidden="true">`;

export const MARKUP = `<div id="ground" aria-hidden="true"></div>
<button id="music" type="button" aria-pressed="false" aria-label="Turn music on" hidden><i></i><i></i><i></i><i></i></button>

<!-- ============ WELCOME · our monogram, and an ivory envelope tied with chiffon and sealed in gold; the seal cracks, the ribbon slips
     away, the flap turns up, and the card rises out into the invitation below ============ -->
<div id="gate" role="dialog" aria-modal="true" aria-label="Invitation cover">
  ${flower("g-drape1", "drape")}${flower("g-drape2", "drape")}${flower("g-bb1", "babysbreath")}${flower("g-bb2", "babysbreath")}
  ${MONO("g-mono")}
  <div class="env" id="env">
    <img class="env-back" src="/emboss/env-back.webp" alt="" draggable="false">
    <div class="env-slot" aria-hidden="true"><div class="env-card"><div class="glass card-inv mini">${CARD("p")}</div></div></div>
    <div class="env-flap"><img class="face front" src="/emboss/env-flap.webp" alt="" draggable="false"><img class="face back" src="/emboss/env-flap-in.webp" alt="" draggable="false"></div>
    <div class="ribbon" aria-hidden="true"><i class="band"></i><i class="tail t1"></i><i class="tail t2"></i></div>
    <img class="env-olive" src="/emboss/olive.webp" alt="" aria-hidden="true">
    <img class="env-bb" src="/emboss/babysbreath.webp" alt="" aria-hidden="true">
    <button class="seal" id="openBtn" type="button" aria-label="Open the invitation" style="--seal:url(__SEAL__)">
      <span class="halo"></span>
      <i class="piece p1"></i><i class="piece p2"></i><i class="piece p3"></i><i class="piece p4"></i>
      <i class="gloss"></i>
    </button>
  </div>
  <div class="addr">
    <span class="cap">An invitation for</span>
    <span class="script" data-guest>__GUEST__</span>
  </div>
  <button class="cta" id="tapBtn" type="button"><i></i>Tap the seal to open<i></i></button>
</div>

<main inert>
  <!-- ============ THE INVITATION · the frosted acrylic card that rose out of the envelope ============ -->
  <section class="sec hero" id="home">
    ${flower("h-bb1", "babysbreath")}${flower("h-olive", "olive")}${flower("h-bb2", "babysbreath")}${flower("h-bb3", "babysbreath")}
    <article class="glass card-inv" id="hero">${CARD("h1")}
    </article>
  </section>

  <!-- ============ WE ARE DELIGHTED, and the day's timeline (lib/config.js: events) ============ -->
  <section class="sec">
    ${flower("l-bb1", "babysbreath")}${flower("l-olive", "olive")}${flower("l-bb2", "babysbreath")}${flower("l-drape", "drape")}
    <article class="glass reveal">
      ${MONO("l-mono")}
      <h2 class="title">We are delighted</h2>
      ${RULE}
      <p class="cap">to share with you the joy of a day<br>that means everything to us</p>
      <p class="cap soft gap-s">Dear</p>
      <p class="script guest" data-guest>__GUEST__</p>
      <p class="text">It would mean the world to us to have you with us as we begin our life together. Please come, bring your smiles and your blessings, and be part of our happiest day.</p>
      <p class="side">The celebrations</p>
      <div class="timeline reveal" id="timeline"></div>
      <p class="text with">With love,</p>
      <p class="sign"><span data-bride>Falaknaaz</span> <span class="script">&amp;</span> <span data-groom>Raish Ahemad</span></p>
      <p class="cap soft">and the Badi family</p>
    </article>
  </section>

  <!-- ============ LOCATIONS ============ -->
  <section class="sec" id="venues">
    ${flower("v-bb1", "babysbreath")}${flower("v-olive", "olive")}${flower("v-bb2", "babysbreath")}${flower("v-drape", "drape")}
    <header class="sec-head reveal">
      <svg width="22" height="26" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M12 21.5c-4.6-5.4-7-9-7-12a7 7 0 0 1 14 0c0 3-2.4 6.6-7 12z"/><circle cx="12" cy="9.5" r="2.5"/></g></svg>
      <h2 class="title">Locations</h2>
      ${RULE}
    </header>
    <article class="glass arch venue reveal">
      <svg class="art" width="124" height="72" viewBox="0 0 120 70" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 64H112"/><path d="M36 64V46H84V64"/><path d="M38 46C38 31 47 22 60 19C73 22 82 31 82 46"/><path d="M60 19V11"/><path d="M62.5 8.5A3 3 0 1 1 57.8 11.7A2.4 2.4 0 1 0 62.5 8.5Z"/>
        <path d="M54 64V55Q60 48 66 55V64"/><path d="M21 64V30H29V64"/><path d="M21 30L25 22L29 30"/><path d="M91 64V30H99V64"/><path d="M91 30L95 22L99 30"/><path d="M44 52Q47 49 50 52V56H44Z"/><path d="M70 52Q73 49 76 52V56H70Z"/></g></svg>
      <p class="cap gold">Nikah</p>
      <p class="cap">Sunday, 27 December · 10:00 AM</p>
      <p class="vname">Juni Eidgah Masjid</p>
      <p class="cap soft">Salabatpura, Surat</p>
      <a class="pill" href="https://www.google.com/maps/search/?api=1&amp;query=Juni%20Eidgah%20Masjid%2C%20Salabatpura%2C%20Surat" target="_blank" rel="noopener">${PIN}Open map</a>
    </article>
    <article class="glass arch venue reveal">
      <svg class="art" width="124" height="72" viewBox="0 0 120 70" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 64H112"/><path d="M14 34L60 12L106 34Z"/><path d="M20 34V64M100 34V64"/><path d="M28 64V48Q34 41 40 48V64"/><path d="M54 64V46Q60 38 66 46V64"/><path d="M80 64V48Q86 41 92 48V64"/>
        <path d="M24 34Q42 44 60 34Q78 44 96 34"/><circle cx="33" cy="38.5" r="1"/><circle cx="46" cy="40" r="1"/><circle cx="74" cy="40" r="1"/><circle cx="87" cy="38.5" r="1"/><path d="M60 19V24"/><circle cx="60" cy="26.5" r="2.5"/></g></svg>
      <p class="cap gold">Reception</p>
      <p class="cap">Sunday, 27 December · 12:00 PM</p>
      <p class="vname">Surat Vankaneri<br>Momin Jamat Hall</p>
      <p class="cap soft">Salabatpura, Surat</p>
      <a class="pill" href="https://www.google.com/maps/search/?api=1&amp;query=Surat%20Vankaneri%20Momin%20Jamat%20Hall%2C%20Salabatpura%2C%20Surat" target="_blank" rel="noopener">${PIN}Open map</a>
    </article>
  </section>

  <!-- ============ THE DATE AND THE COUNTDOWN ============ -->
  <section class="sec" id="details">
    ${flower("d-drape", "drape")}${flower("d-bb1", "babysbreath")}${flower("d-olive", "olive")}${flower("d-bb2", "babysbreath")}
    <article class="glass reveal">
      <h2 class="title" data-month>December 2026</h2>
      ${RULE}
      <div class="cal reveal" id="cal"></div>
      <p class="legend reveal" id="legend"></p>
      <svg class="orn" width="110" height="16" viewBox="0 0 110 16" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><path d="M2 8H40M70 8H108"/><path d="M55 3C51 3 48 5.5 47 8C48 10.5 51 13 55 13C59 13 62 10.5 63 8C62 5.5 59 3 55 3Z"/><path d="M47 8H63"/></g></svg>
      <h2 class="title sub" id="countTitle">Until the wedding</h2>
      <p class="cap soft" id="countSub">Only a little time left</p>
      <div class="dials reveal" id="count">
        <div class="dial"><svg viewBox="0 0 62 62" aria-hidden="true"><circle class="track" cx="31" cy="31" r="28"/><circle class="arc" id="ad" cx="31" cy="31" r="28" pathLength="100"/></svg><b id="cd">00</b><span>Days</span></div>
        <div class="dial"><svg viewBox="0 0 62 62" aria-hidden="true"><circle class="track" cx="31" cy="31" r="28"/><circle class="arc" id="ah" cx="31" cy="31" r="28" pathLength="100"/></svg><b id="ch">00</b><span>Hours</span></div>
        <div class="dial"><svg viewBox="0 0 62 62" aria-hidden="true"><circle class="track" cx="31" cy="31" r="28"/><circle class="arc" id="am" cx="31" cy="31" r="28" pathLength="100"/></svg><b id="cm">00</b><span>Minutes</span></div>
        <div class="dial"><svg viewBox="0 0 62 62" aria-hidden="true"><circle class="track" cx="31" cy="31" r="28"/><circle class="arc" id="as" cx="31" cy="31" r="28" pathLength="100"/></svg><b id="cs">00</b><span>Seconds</span></div>
      </div>
    </article>
  </section>

  <!-- ============ WISHES, CONTACT, AND A LAST WORD ============ -->
  <section class="sec last" id="contact">
    ${flower("c-bb1", "babysbreath")}${flower("c-olive", "olive")}${flower("c-drape", "drape")}${flower("c-bb2", "babysbreath")}
    <article class="glass reveal">
      <svg class="ico" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9.5" width="16" height="11"/><path d="M3 9.5h18M12 9.5v11M12 9.5C10.6 5.5 6.5 5 6.5 7.2S10 9.5 12 9.5c2 0 5.5.5 5.5-2.3S13.4 5.5 12 9.5"/></g></svg>
      <h2 class="title">Wishes</h2>
      ${RULE}
      <p class="cap gold">Gifts</p>
      <p class="text">Having you there is all we ask for. Please come as you are and celebrate with us.</p>
      <p class="cap gold gap-s">A request</p>
      <p class="text">Keep us in your prayers and good wishes as we start this new chapter.</p>
      <svg class="ico gap-l" width="26" height="20" viewBox="0 0 28 22" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><rect x="1.5" y="1.5" width="25" height="19" rx="1.5"/><path d="M1.5 3l12.5 9.5L26.5 3"/></g></svg>
      <h2 class="title sub">Contact</h2>
      ${RULE}
      <p class="cap">For any help on the day, please call</p>
      <a class="call" href="tel:+919624648486"><span class="ring">${PHONE}</span><span class="who">Sarik Badi</span><span class="num">96246 48486</span></a>
      <a class="call" href="tel:+916353486964"><span class="ring">${PHONE}</span><span class="who">Shebaz Badi</span><span class="num">63534 86964</span></a>
      ${RULE}
      <p class="cap soft">We are waiting for you</p>
      <p class="script guest" data-guest>__GUEST__</p>
      <p class="sign">The Badi Family</p>
    </article>
    <img class="close-seal reveal" src="__SEAL__" alt="" aria-hidden="true">
  </section>
</main>`;
