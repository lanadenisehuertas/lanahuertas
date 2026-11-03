"use client";

import { useEffect } from "react";

/**
 * Three savings for what is out of view:
 *
 * - data-off pauses every CSS animation in a section well out of view (more
 *   than 300px off screen): twinkles, sways, floating art and the like keep
 *   costing frames otherwise, which an older phone feels. The canvases already
 *   stop themselves offscreen. dusk.css does the rest.
 * - data-unseen does the same for each looping decoration on its own, so the
 *   parts of an on-screen section you can't see (the far end of a tall one,
 *   a blob drifting below the fold) hold still too. Only endless, time-driven
 *   CSS animations are watched; scroll-driven ones and one-off reveals are
 *   left alone. Sideways there is a whole screen of margin, so things that
 *   drift across never freeze just out of sight.
 * - data-cv lets the browser skip a far section's layout and paint entirely
 *   (content-visibility: auto). Each keeps its measured height as its
 *   placeholder size, so the scrollbar and anchor jumps do not shift. Only
 *   sections that already clip their overflow get it, so nothing that spills
 *   past a section edge is cut. Nothing fixed-position lives inside a section.
 */
export default function PauseOffscreen() {
  useEffect(() => {
    // Safari has no requestIdleCallback
    const ric = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;
    const soon = (fn: () => void, timeout: number) => (ric ? ric(fn, { timeout }) : window.setTimeout(fn, 300));
    const cancel = (id: number) => (ric ? cancelIdleCallback(id) : clearTimeout(id));

    /* each looping decoration, paused while it is itself out of view */
    const watched = new WeakSet<Element>();
    const deco = new IntersectionObserver(
      (es) => es.forEach((e) => e.target.toggleAttribute("data-unseen", !e.isIntersecting)),
      { rootMargin: "200px 100%" }
    );
    let scanId = 0;
    const scan = () => {
      scanId = 0;
      for (const a of document.getAnimations()) {
        if (!(a instanceof CSSAnimation) || !(a.timeline instanceof DocumentTimeline)) continue;
        const fx = a.effect as KeyframeEffect | null;
        const el = fx?.target;
        if (!fx || !el || watched.has(el)) continue;
        if (fx.getComputedTiming().iterations !== Infinity) continue;
        watched.add(el);
        deco.observe(el);
      }
    };
    // sections that skip their rendering start their animations only when they
    // come near, so look again whenever one does
    const rescan = () => {
      if (!scanId) scanId = soon(scan, 1000);
    };

    const secs = Array.from(document.querySelectorAll<HTMLElement>("#top section")).filter(
      (s) => !s.parentElement?.closest("section")
    );
    const io = new IntersectionObserver(
      (es) => {
        let woke = false;
        es.forEach((e) => {
          (e.target as HTMLElement).toggleAttribute("data-off", !e.isIntersecting);
          if (e.isIntersecting) woke = true;
        });
        if (woke) rescan();
      },
      { rootMargin: "300px 0px" }
    );
    secs.forEach((s) => io.observe(s));

    // after the page has settled (fonts, first images), so the sizes are real
    let idle = 0;
    const skip = () => {
      secs.forEach((s) => {
        const ov = getComputedStyle(s).overflowY;
        if (ov !== "clip" && ov !== "hidden") return;
        s.style.containIntrinsicSize = `auto ${Math.round(s.getBoundingClientRect().height)}px`;
        s.setAttribute("data-cv", "");
      });
      scan();
    };
    const later = () => {
      idle = soon(skip, 2000);
    };
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });

    return () => {
      io.disconnect();
      deco.disconnect();
      window.removeEventListener("load", later);
      cancel(idle);
      if (scanId) cancel(scanId);
    };
  }, []);
  return null;
}
