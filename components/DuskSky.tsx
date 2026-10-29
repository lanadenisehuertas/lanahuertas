"use client";

import { useEffect, useRef } from "react";

/**
 * The sky turns from dawn to dusk down the page, so scrolling reads as time
 * passing. Over the fixed ground (`.graph-ground`), under the content.
 *
 * Static art only: ordered-dither bands (public/art/dusk/band-*.png, made by
 * scripts/gen-dusk.py) step from clear sky into lavender, then — only below the
 * contact copy — into violet and night, with pixel stars. Nothing animates.
 *
 * It sits in the document (absolute), so it scrolls with the page at no cost.
 * The only script is placement: one measure on load and on resize, written
 * as custom properties on this element.
 *
 * Contrast: about and contact text is dark plum on the sky, so the lavender
 * behind them is translucent and light (≥ 8:1 for body text); the deep dusk
 * starts only below the lowest line of contact copy.
 */
export default function DuskSky() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const place = () => {
      raf = 0;
      const sy = window.scrollY;
      const top = (n: Element | null) => (n ? n.getBoundingClientRect().top + sy : NaN);
      const h = document.body.offsetHeight;
      const about = top(document.getElementById("about"));
      const contact = top(document.getElementById("contact"));

      // Where the copy ends: the dusk may only darken below this line.
      let copyEnd = NaN;
      document.querySelectorAll("#contact p, #contact a, #contact form, #contact h2").forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.height) copyEnd = Math.max(Number.isNaN(copyEnd) ? 0 : copyEnd, r.bottom + sy);
      });

      // Pages without about/contact: a gentle lavender over the last stretch only.
      const start = Number.isNaN(about) ? Math.max(h * 0.6, h - 2400) : Math.min(about - 760, h * 0.62);
      const mid = Number.isNaN(contact) ? h - 900 : contact - 200;
      const deep = Number.isNaN(copyEnd) ? h - 180 : Math.max(copyEnd + 28, h - 420);

      el.style.top = `${Math.round(start)}px`;
      el.style.height = `${Math.max(0, Math.round(h - start))}px`;
      el.style.setProperty("--dk-mid", `${Math.max(360, Math.round(mid - start))}px`);
      el.style.setProperty("--dk-deep", `${Math.max(0, Math.round(h - deep))}px`);
      el.dataset.on = "";
    };
    const ask = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    place();
    const ro = new ResizeObserver(ask);
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="dk-sky">
      <div className="dk-band dk-a" />
      <div className="dk-flat dk-l1" />
      <div className="dk-mid">
        <div className="dk-band dk-b" />
        <div className="dk-flat dk-l2" />
        <div className="dk-stars dk-stars-soft" />
      </div>
      <div className="dk-deep">
        <div className="dk-band dk-c" />
        <div className="dk-band dk-d" />
        <div className="dk-band dk-e" />
        <div className="dk-flat dk-night" />
        <div className="dk-stars" />
      </div>
    </div>
  );
}
