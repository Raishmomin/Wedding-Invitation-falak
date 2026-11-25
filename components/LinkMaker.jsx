"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { guestFromSlug, slugFromName } from "@/lib/guest";
import { CONFIG } from "@/lib/config";

/* Type a guest's name, get their invitation link:  "Raish momin"  ->  yoursite/Raish-Momin  — then open, copy or share it. */
const noop = () => () => {};
const siteAddress = () => (CONFIG.siteUrl || window.location.origin).replace(/\/$/, "");
// the phone's own share sheet (needs https); without it, sharing goes straight to WhatsApp
const canShare = () => typeof navigator.share === "function";

const OPEN = <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></g></svg>;
const COPY = <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></g></svg>;
const SHARE = <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3"/><path d="M7.5 7.5L12 3l4.5 4.5"/><path d="M8 11H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-2"/></g></svg>;
const DONE = <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// copying needs a secure page (https or localhost); on a plain-http address (a phone on the home Wi-Fi) fall back
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const t = document.createElement("textarea");
  t.value = text; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;top:0;opacity:0";
  document.body.appendChild(t); t.select(); t.setSelectionRange(0, text.length);
  const ok = document.execCommand("copy"); t.remove();
  return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
}

export default function LinkMaker() {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState("");   // "", "done" or "failed"
  const timer = useRef(0);
  const site = useSyncExternalStore(noop, siteAddress, () => CONFIG.siteUrl.replace(/\/$/, ""));
  const nativeShare = useSyncExternalStore(noop, canShare, () => false);

  const slug = slugFromName(name);
  const href = `${site}/${encodeURIComponent(slug)}`;
  const greets = guestFromSlug(slug);
  const empty = !slug;

  function copy(e) {
    e?.preventDefault();
    if (empty) return;
    copyText(href).then(() => setCopied("done"), () => setCopied("failed"));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(""), 2000);
  }

  function share() {
    if (empty) return;
    if (nativeShare) navigator.share({ url: href }).catch(() => {});   // closing the share sheet is not an error
    else window.open(`https://wa.me/?text=${encodeURIComponent(href)}`, "_blank", "noopener");
  }

  return (
    <main className="adm">
      <div id="ground" aria-hidden="true" />
      <section className="glass adm-card">
        {/* eslint-disable-next-line @next/next/no-img-element -- a small fixed logo, already sized */}
        <img className="mono" src="/emboss/monogram.webp" alt="" />
        <h1 className="title">Guest links</h1>
        <i className="rule" aria-hidden="true" />
        <p className="cap">Type a guest&rsquo;s name to make<br />their own invitation link</p>

        <form className="adm-form" onSubmit={copy}>
          <label className="cap soft" htmlFor="adm-name">Guest name</label>
          <input id="adm-name" className="adm-input" value={name} autoFocus autoComplete="off" autoCapitalize="words" spellCheck={false} enterKeyHint="done"
            placeholder="e.g. Rahul Sharma & Family" maxLength={60} onChange={(e) => { setName(e.target.value); setCopied(""); }} />
        </form>

        <div className="adm-out" aria-live="polite">
          <p className="cap soft">Their link</p>
          <p className="adm-link">{empty ? <span className="adm-hint">The link appears here</span> : <><span>{site}/</span><b>{slug}</b></>}</p>
          {!empty && <>
            <p className="cap soft adm-gap">The invitation will greet</p>
            <p className="script adm-greet">{greets}</p>
          </>}
        </div>

        <div className="adm-btns">
          <a className="adm-btn" href={empty ? undefined : href} target="_blank" rel="noopener noreferrer" aria-disabled={empty}>{OPEN}Open</a>
          <button className="adm-btn" type="button" onClick={copy} disabled={empty}>
            {copied === "done" ? <>{DONE}Copied</> : copied === "failed" ? "Copy failed" : <>{COPY}Copy link</>}
          </button>
          <button className="adm-btn gold wide" type="button" onClick={share} disabled={empty}>
            {SHARE}{nativeShare ? "Share" : "Share on WhatsApp"}
          </button>
        </div>
      </section>
    </main>
  );
}
