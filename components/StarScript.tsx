"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Section accent words: the italic word in each section title. */
const SELECTOR = "main h1 > em, main h2 > em, main h1 > i, main h2 > i";

type Pt = { x: number; y: number };
type Sample = { pts: Pt[]; left: number; top: number; size: number; color: string };

/**
 * Trace a word's glyph outlines: draw it on a canvas at its computed font and
 * keep edge pixels, thinned to an even spacing and capped by size. Points are
 * relative to the word's box, in writing order (left to right).
 */
function sample(em: HTMLElement): Sample | null {
  const rects = em.getClientRects();
  if (rects.length !== 1) return null; // wrapped across lines: leave it be
  const box = rects[0];
  if (!box.width || !box.height) return null;
  const cs = getComputedStyle(em);
  const size = parseFloat(cs.fontSize);
  const k = 2; // supersample
  const pad = Math.ceil(size * 0.3);
  const w = Math.ceil(box.width + pad * 2);
  const h = Math.ceil(box.height + pad * 2);
  const canvas = document.createElement("canvas");
  canvas.width = w * k;
  canvas.height = h * k;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.scale(k, k);
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  if (cs.letterSpacing !== "normal") (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#000";
  const text = em.textContent ?? "";
  const m = ctx.measureText(text);
  // An inline box's height is the font's ascent + descent, so its baseline sits
  // one ascent below its top.
  ctx.fillText(text, pad, pad + m.fontBoundingBoxAscent);
  const data = ctx.getImageData(0, 0, w * k, h * k).data;
  const W = w * k;
  const H = h * k;
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && data[(y * W + x) * 4 + 3] > 110;

  const step = Math.max(2.2, size / 15) * k;
  const cap = Math.round(Math.min(170, Math.max(36, size * 2.3)));
  const taken = new Map<string, true>();
  const pts: Pt[] = [];
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      if (!on(x, y) || (on(x + 1, y) && on(x - 1, y) && on(x, y + 1) && on(x, y - 1))) continue;
      const key = `${Math.floor(x / step)},${Math.floor(y / step)}`;
      if (taken.has(key)) continue;
      taken.set(key, true);
      pts.push({ x: x / k - pad, y: y / k - pad });
    }
  }
  if (pts.length < 6) return null;
  // Even thinning down to the cap, then writing order.
  let out = pts;
  if (pts.length > cap) {
    const every = pts.length / cap;
    out = Array.from({ length: cap }, (_, i) => pts[Math.floor(i * every)]);
  }
  out.sort((a, b) => a.x + a.y * 0.18 - (b.x + b.y * 0.18));
  return { pts: out, left: box.left + window.scrollX, top: box.top + window.scrollY, size, color: cs.color };
}

function star(x: number, y: number, s: number, color: string, cls: string) {
  const el = document.createElement("span");
  el.className = cls;
  el.style.cssText = `left:${(x - s / 2).toFixed(1)}px;top:${(y - s / 2).toFixed(1)}px;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;--c:${color}`;
  return el;
}

/**
 * Star-script: each section's accent word is written out in tiny stars as it
 * scrolls in, the real word fades up under them, and a few stars stay to
 * twinkle.
 *
 * The heading keeps its text throughout (it is only faded, never replaced), and
 * nothing is hidden unless this script runs: no JS, reduced motion or lite mode
 * means plain text. Stars live in one absolutely positioned layer of our own
 * (not inside anyone's heading), each with a single CSS animation and a
 * staggered delay; after the word settles the trace is removed and eight
 * twinklers remain.
 */
export default function StarScript() {
  const pathname = usePathname();
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = layer.current;
    const html = document.documentElement;
    if (
      !root ||
      html.hasAttribute("data-lite") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;

    const words = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (!words.length) return;
    const timers: number[] = [];
    const done = new Set<HTMLElement>();
    const twinkles = new Map<HTMLElement, HTMLElement>();
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const restore = (em: HTMLElement) => {
      if (em.dataset.ss === "hide") em.dataset.ss = "ink";
    };

    const twinkle = (em: HTMLElement, s: Sample) => {
      twinkles.get(em)?.remove();
      const g = document.createElement("div");
      g.className = "ss-word";
      g.style.transform = `translate(${s.left.toFixed(1)}px, ${s.top.toFixed(1)}px)`;
      const size = Math.max(6, s.size / 7);
      const glints = ["#fff6dc", "#f7a8dc", "#ffffff", "#ffe39a"];
      for (let i = 0; i < 8; i++) {
        const p = s.pts[Math.floor(((i + 0.5) / 8) * s.pts.length)];
        // Nudge each twinkler off the glyph edge, alternately up and down.
        const t = star(p.x + (i % 2 ? 2 : -2), p.y + (i % 2 ? -size * 0.4 : size * 0.4), size * (0.7 + (i % 3) * 0.25), glints[i % 4], "ss-tw");
        t.style.animationDelay = `${(-i * 0.83).toFixed(2)}s`;
        t.style.animationDuration = `${(2.6 + (i % 4) * 0.7).toFixed(1)}s`;
        g.appendChild(t);
      }
      root.appendChild(g);
      twinkles.set(em, g);
    };

    const write = (em: HTMLElement) => {
      let s: Sample | null = null;
      try {
        s = sample(em);
      } catch {
        s = null;
      }
      if (!s) {
        restore(em);
        return;
      }
      const sample0 = s;
      const n = s.pts.length;
      const dur = Math.min(1.7, Math.max(0.9, 0.7 + n * 0.006));
      const size = Math.max(2.4, s.size / 16);
      const g = document.createElement("div");
      g.className = "ss-word";
      g.style.transform = `translate(${s.left.toFixed(1)}px, ${s.top.toFixed(1)}px)`;
      s.pts.forEach((p, i) => {
        const st = star(p.x, p.y, size * (i % 5 === 0 ? 1.6 : 1), i % 4 === 0 ? "#fff6dc" : s.color, "ss-star");
        st.style.animationDelay = `${((i / n) * dur).toFixed(3)}s`;
        g.appendChild(st);
      });
      root.appendChild(g);
      // The word inks in under the last stars, then the trace fades away.
      later(() => restore(em), dur * 1000 + 150);
      later(() => g.classList.add("ss-out"), dur * 1000 + 900);
      later(() => {
        g.remove();
        twinkle(em, sample0);
      }, dur * 1000 + 1600);
    };

    // Two observers: hide the word just before it can be seen, write it once it is.
    const pre = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const em = e.target as HTMLElement;
          if (e.isIntersecting && !done.has(em) && !em.dataset.ss) em.dataset.ss = "hide";
        }),
      { rootMargin: "0px 0px 30% 0px" }
    );
    const play = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const em = e.target as HTMLElement;
          if (!e.isIntersecting || done.has(em)) return;
          done.add(em);
          pre.unobserve(em);
          play.unobserve(em);
          em.dataset.ss = "hide";
          write(em);
        }),
      { rootMargin: "0px 0px -16% 0px", threshold: 1 }
    );

    let ready = false;
    document.fonts.ready.then(() => {
      if (ready) return;
      ready = true;
      words.forEach((em) => {
        pre.observe(em);
        play.observe(em);
      });
    });

    // Twinklers follow their words through a resize.
    let rs = 0;
    const onResize = () => {
      window.clearTimeout(rs);
      rs = window.setTimeout(() => {
        twinkles.forEach((g, em) => {
          const s = sample(em);
          if (s) twinkle(em, s);
          else g.remove();
        });
      }, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      ready = true;
      pre.disconnect();
      play.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(rs);
      window.removeEventListener("resize", onResize);
      words.forEach((em) => delete em.dataset.ss);
      root.replaceChildren();
    };
  }, [pathname]);

  return <div ref={layer} aria-hidden className="ss-layer" />;
}
