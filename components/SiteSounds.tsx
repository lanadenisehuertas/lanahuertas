"use client";

import { useEffect } from "react";
import { close, page, paper, playFx, pop, tape, tick, typeTick, whoosh } from "@/lib/dusk/sound";

/*
 * Things that already make their own sound (Peanut, the bass, the mic, the
 * yarn, the record, the tool stars, the sky): left alone here.
 */
const OWN = ".dk-obj, .dk-perch, .dk-peek, .dk-walk, .ts-btn, .dk-yarn, [data-nosfx]";

/** selector → sound, first match wins */
const MAP: [string, () => void][] = [
  [".lb-next", () => page(1)],
  [".lb-prev", () => page(-1)],
  [".lb-close", close],
  [".dk-play, [aria-label^='Play']", playFx],
  [".dk-tl .clip", tape],
  ["[role=tab], .sp-index-btn, .dev-tab, .about-tab, .sp-thumb", tick],
  [".pr-btn, .pr-fig, .pr-item button", paper],
  ["[aria-label='Back to top']", () => whoosh(true)],
  ["a[href^='#'], .nav-link", () => whoosh()],
  ["button, a, .btn, .btn-ghost", pop],
];

/**
 * One delegated listener that gives the page's controls a voice: a music-box
 * tick for tabs, a page sliding past for next and previous, paper for opening
 * a poster, a tape-deck click for the timeline, air for jumping through the
 * page, a soft pop for any other button, and a faint pencil tick while you
 * type in the form. Clicks only, never hover or scroll; the garden's mute
 * switch silences all of it.
 */
export default function SiteSounds() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest || t.closest(OWN)) return;
      for (const [sel, fx] of MAP) {
        if (t.closest(sel)) {
          fx();
          return;
        }
      }
    };
    let lastKey = 0;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as Element | null;
      if (!t?.matches?.(".field") || e.key.length !== 1) return;
      const now = performance.now();
      if (now - lastKey < 45) return;
      lastKey = now;
      typeTick();
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, []);
  return null;
}
