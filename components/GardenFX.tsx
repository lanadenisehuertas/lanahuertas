"use client";

import { useEffect, useRef } from "react";

/*
 * Garden reactions. Every plant, bead and butterfly that can respond carries
 * data-react="<kind>". When the pointer comes near one (or a finger taps it),
 * it gets data-hit for the length of its reaction and the CSS plays the kind's
 * move — lotus fans, bell rings, blossom turns, pixel flower flips, leaf
 * rustles, butterfly flits, bead bounces — and a small sparkle (a note, for
 * the bells) lifts off it. Same trigger, same burst, a different gesture per
 * element: that is what ties them together.
 *
 * Cheap by design: one listener, one rAF per frame, element boxes cached and
 * only re-read after scroll or resize, and a cooldown so nothing re-fires
 * while it is still moving. Off entirely for reduced motion.
 */
const REACT_MS: Record<string, number> = {
  lotus: 1100,
  bell: 1200,
  blossom: 900,
  pixel: 700,
  leaf: 900,
  butterfly: 1600,
  orb: 800,
};
const COOLDOWN = 1400;
const POOL = 8;

type Item = { el: HTMLElement; kind: string; x: number; y: number; r: number };

export default function GardenFX() {
  const burstRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let items: Item[] = [];
    let stale = true;
    const last = new WeakMap<HTMLElement, number>();
    let next = 0;
    let raf = 0;
    let px = -1e4;
    let py = -1e4;

    const measure = () => {
      items = [...document.querySelectorAll<HTMLElement>("[data-react]")].flatMap((el) => {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.bottom < -200 || b.top > innerHeight + 200) return [];
        return [{ el, kind: el.dataset.react || "", x: b.left + b.width / 2, y: b.top + b.height / 2, r: Math.max(34, Math.min(b.width, b.height) * 0.55) }];
      });
      stale = false;
    };

    const burst = (it: Item) => {
      const node = burstRefs.current[next++ % POOL];
      if (!node) return;
      node.dataset.kind = it.kind === "bell" ? "note" : "spark";
      node.style.left = `${it.x}px`;
      node.style.top = `${it.y - it.r * 0.6}px`;
      node.classList.remove("go");
      void node.offsetWidth; // restart the animation
      node.classList.add("go");
    };

    const hit = (it: Item) => {
      const now = performance.now();
      if (now - (last.get(it.el) ?? -1e9) < COOLDOWN) return;
      last.set(it.el, now);
      it.el.dataset.hit = "";
      burst(it);
      window.setTimeout(() => delete it.el.dataset.hit, REACT_MS[it.kind] ?? 900);
    };

    const check = () => {
      raf = 0;
      if (stale) measure();
      for (const it of items) {
        const dx = px - it.x;
        const dy = py - it.y;
        if (dx * dx + dy * dy < it.r * it.r) hit(it);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(check);
    };

    // Touch: a tap wakes the nearest thing within reach.
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if (stale) measure();
      let best: Item | null = null;
      let bd = Infinity;
      for (const it of items) {
        const d = Math.hypot(e.clientX - it.x, e.clientY - it.y);
        if (d < it.r * 1.6 && d < bd) {
          best = it;
          bd = d;
        }
      }
      if (best) hit(best);
    };

    const invalidate = () => (stale = true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none">
      {Array.from({ length: POOL }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            burstRefs.current[i] = el;
          }}
          className="fx-burst"
        >
          <svg viewBox="0 0 24 24" className="fx-spark">
            <path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z" fill="currentColor" />
          </svg>
          <svg viewBox="0 0 24 24" className="fx-note">
            <ellipse cx="8.2" cy="18.2" rx="4.4" ry="3.3" transform="rotate(-22 8.2 18.2)" fill="currentColor" />
            <path d="M11.4 17.4V2.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M11.4 2.6c1.6 2.6 5.6 3.6 5.4 8.2-.6-2.4-2.8-3.8-5.4-4.2z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}
