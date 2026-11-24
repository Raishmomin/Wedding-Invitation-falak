// The invitation's HTML. __GUEST__ is replaced with the guest's name, __SEAL__ with the seal picture.
// Names, dates and the celebrations are filled in from lib/config.js by lib/invitation.js.
export const MARKUP = `<div id="ground" aria-hidden="true"></div>
<button id="music" type="button" aria-pressed="false" aria-label="Turn music on" hidden><i></i><i></i><i></i><i></i></button>

<!-- ============ WELCOME · an envelope on silk, addressed to the guest; its seal lifts, the flap opens on a lace
     lining, the card rises and flies into place as the invitation below ============ -->
<div id="gate" role="dialog" aria-label="Invitation cover">
  <div class="addr">
    <span class="cap">An invitation for</span>
    <span class="script" data-guest>__GUEST__</span>
  </div>
  <div class="env" id="env">
    <img class="tuck" src="/emboss/gypsophila.webp" alt="" width="200" height="260">
    <div class="env-inner"></div>
    <div class="env-slot"><div class="env-cardbox"><div class="card inv">
      <div data-mono="big"></div>
      <p class="cap">Wedding Invitation</p>
      <div class="names"><span class="n script" data-bride>Falaknaaz</span><span class="and">and</span><span class="n b script" data-groom>Raish Ahemad</span></div>
    </div></div></div>
    <div class="env-pocket"><svg viewBox="0 0 100 70" preserveAspectRatio="none"><path class="bottom" d="M0 70L50 35.5L100 70Z"/><path class="fold" d="M0 70L50 35.5L100 70M0 0L50 36M100 0L50 36"/></svg></div>
    <div class="env-flap">
      <svg class="rim" viewBox="0 0 100 64" preserveAspectRatio="none"><path d="M0 0L46.5 60.2Q50 64 53.5 60.2L100 0"/></svg>
      <div class="face front"></div>
      <div class="face back"></div>
    </div>
    <div class="seal-wrap">
      <span class="halo"></span>
      <button class="seal" id="openBtn" type="button" aria-label="Open invitation" style="--seal:url(__SEAL__)">
        <img src="__SEAL__" alt="" width="200" height="200" draggable="false">
      </button>
    </div>
  </div>
  <button class="cta" id="tapBtn" type="button">Tap the seal to open</button>
</div>

<main>
  <!-- ============ THE INVITATION · on lace, tied with cotton twine and the seal ============ -->
  <section class="suite" id="home">
    <div class="doily" aria-hidden="true"></div>
    <img class="tuck" src="/emboss/gypsophila.webp" alt="" aria-hidden="true">
    <article class="card inv hero" id="hero">
      <div data-mono="big"></div>
      <p class="cap">Wedding Invitation</p>
      <div class="names"><span class="n script" data-bride>Falaknaaz</span><span class="and">and</span><span class="n b script" data-groom>Raish Ahemad</span></div>
      <p class="cap blessing stage" style="--i:0">With the grace of the Almighty<br>and the blessings of our elders</p>
      <div class="when stage" style="--i:1">
        <span class="cap" data-weekday>Sunday</span>
        <div class="dmy"><b data-dd>27</b><i></i><b data-mon>Dec</b><i></i><b data-yr>2026</b></div>
        <span class="cap" data-main-at>Nikah at 10:00 AM</span>
      </div>
      <p class="script family stage" style="--i:2">The Badi Family</p>
      <p class="cap stage" style="--i:3">Salabatpura · Surat</p>
      <div class="ribbon" aria-hidden="true">
        <svg viewBox="0 0 400 40" preserveAspectRatio="none"><path pathLength="1" d="M0 13Q200 19 400 14"/><path pathLength="1" d="M0 18Q200 21 400 19"/><path pathLength="1" d="M0 23Q200 22 400 25"/><path pathLength="1" d="M0 28Q200 24 400 30"/></svg>
        <img src="__SEAL__" alt="">
      </div>
    </article>
  </section>

  <!-- ============ THE LETTER ============ -->
  <article class="card reveal">
    <h2 class="script title reveal">We are delighted</h2>
    <i class="orn reveal" aria-hidden="true"></i>
    <p class="cap lead reveal">to share with you the joy of a day that means everything to us</p>
    <div class="bigdate reveal"><b data-dm>27.12</b><span class="script">day</span><b data-yr>2026</b></div>
    <p class="cap reveal">Dear</p>
    <p class="script guest reveal" data-guest>__GUEST__</p>
    <p class="text reveal">It would mean the world to us to have you with us as we begin our life together. Please come, bring your smiles and your blessings, and be part of our happiest day.</p>
    <p class="text reveal">With love,</p>
    <p class="script from reveal"><span data-bride>Falaknaaz</span> <span class="amp">&amp;</span> <span data-groom>Raish Ahemad</span></p>
    <p class="cap reveal">and the Badi family</p>
  </article>

  <!-- ============ THE DATE: calendar and countdown ============ -->
  <article class="card reveal" id="details">
    <h2 class="head reveal" data-month>December 2026</h2>
    <i class="orn reveal" aria-hidden="true"></i>
    <div class="cal reveal" id="cal"></div>
    <div class="legend reveal" id="legend"></div>
    <h2 class="script title reveal sect" id="countTitle">Until the wedding</h2>
    <i class="orn reveal" aria-hidden="true"></i>
    <p class="cap reveal" id="countSub">Only a little time left</p>
    <div class="count reveal" id="count">
      <div><b id="cd">00</b><span>Days</span></div><i></i>
      <div><b id="ch">00</b><span>Hours</span></div><i></i>
      <div><b id="cm">00</b><span>Minutes</span></div><i></i>
      <div><b id="cs">00</b><span>Seconds</span></div>
    </div>
  </article>

  <!-- ============ THE CELEBRATIONS (lib/config.js: events) and where ============ -->
  <article class="card reveal" id="venues">
    <h2 class="head reveal">The celebrations</h2>
    <i class="orn reveal" aria-hidden="true"></i>
    <div class="program" id="program"></div>
    <h2 class="head reveal sect">Locations</h2>
    <i class="orn reveal" aria-hidden="true"></i>
    <div class="venue reveal">
      <p class="cap gold">Nikah</p>
      <p class="cap">Sunday, 27 December · 10:00 AM</p>
      <p class="vname">Juni Eidgah Masjid</p>
      <p class="cap">Salabatpura, Surat</p>
      <a class="btn" href="https://www.google.com/maps/search/?api=1&amp;query=Juni%20Eidgah%20Masjid%2C%20Salabatpura%2C%20Surat" target="_blank" rel="noopener">Open map</a>
    </div>
    <div class="venue reveal">
      <p class="cap gold">Reception</p>
      <p class="cap">Sunday, 27 December · 12:00 PM</p>
      <p class="vname">Surat Vankaneri Momin Jamat Hall</p>
      <p class="cap">Salabatpura, Surat</p>
      <a class="btn" href="https://www.google.com/maps/search/?api=1&amp;query=Surat%20Vankaneri%20Momin%20Jamat%20Hall%2C%20Salabatpura%2C%20Surat" target="_blank" rel="noopener">Open map</a>
    </div>
  </article>

  <!-- ============ WISHES, CONTACT, and a last word ============ -->
  <article class="card reveal" id="contact">
    <h2 class="head reveal">Wishes</h2>
    <i class="orn reveal" aria-hidden="true"></i>
    <div class="wish reveal"><p class="cap gold">Gifts</p><p class="text">Having you there is all we ask for. Please come as you are and celebrate with us.</p></div>
    <div class="wish reveal"><p class="cap gold">A request</p><p class="text">Keep us in your prayers and good wishes as we start this new chapter.</p></div>
    <h2 class="head reveal sect">Contact</h2>
    <i class="orn reveal" aria-hidden="true"></i>
    <p class="cap reveal">For any help on the day, please call</p>
    <a class="contact reveal" href="tel:+919408782333"><span class="cap">Raish Ahemad</span><span class="dots"></span><b>94087 82333</b></a>
    <a class="contact reveal" href="tel:+919825594333"><span class="cap">Zishan Momin</span><span class="dots"></span><b>98255 94333</b></a>
    <p class="cap reveal sect">We are waiting for you</p>
    <p class="script guest reveal" data-guest>__GUEST__</p>
    <p class="script family reveal">The Badi Family</p>
    <div class="reveal" data-mono="small"></div>
  </article>
</main>

<div class="foot"></div>`;
