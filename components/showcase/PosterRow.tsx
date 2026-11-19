"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { posters } from "@/lib/brands";
import Lightbox from "./Lightbox";
import SkyNotes from "../dusk/SkyNotes";
import Pic from "./Pic";
import { Heading } from "../current/Ornaments";

const still = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  document.documentElement.hasAttribute("data-lite") ||
  document.documentElement.hasAttribute("data-still");

/**
 * One-off posters, hung as a rail: mouse drag flings it (with momentum);
 * wheel, trackpad and touch scroll it natively; Tab walks the posters. The
 * poster under the pointer steps forward a little and stays whole; a click
 * (not a drag) opens the lightbox.
 */
export default function PosterRow({ id = "posters" }: { id?: string }) {
  const row = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; last: number; t: number; v: number; moved: number; id: number } | null>(null);
  const coast = useRef(0);
  const swallow = useRef(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => () => cancelAnimationFrame(coast.current), []);

  const onDown = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    cancelAnimationFrame(coast.current);
    drag.current = { x: e.clientX, last: e.clientX, t: performance.now(), v: 0, moved: 0, id: e.pointerId };
  };
  const onMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d) return;
    const el = e.currentTarget;
    const dx = e.clientX - d.last;
    const now = performance.now();
    d.moved += Math.abs(dx);
    if (d.moved < 6) return;
    if (!el.classList.contains("is-drag")) {
      el.classList.add("is-drag");
      el.setPointerCapture(d.id);
    }
    el.scrollLeft -= dx;
    // Velocity in px per frame (16ms), smoothed.
    d.v = d.v * 0.6 + (dx / Math.max(1, now - d.t)) * 16 * 0.4;
    d.last = e.clientX;
    d.t = now;
  };
  const onUp = (e: ReactPointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved < 6) return;
    const el = e.currentTarget;
    el.classList.remove("is-drag");
    if (el.hasPointerCapture(d.id)) el.releasePointerCapture(d.id);
    swallow.current = true;
    if (still()) return;
    let v = d.v;
    const glide = () => {
      if (Math.abs(v) < 0.4) return;
      el.scrollLeft -= v;
      v *= 0.94;
      coast.current = requestAnimationFrame(glide);
    };
    coast.current = requestAnimationFrame(glide);
  };

  return (
    <section id={id} data-scene="posters" aria-labelledby={`${id}-h`} className="pr">
      <SkyNotes skip="[class*=pr-row],[class*=pr-item]" />
      <header className="sec-head pr-head">
        <div data-rv>
          <p className="t-meta">{posters.length} posters, made in Photoshop</p>
          <Heading id={`${id}-h`} lead="One-off" accent="posters" n="02" script="print" />
        </div>
        <div className="sec-note" data-rv style={{ "--d": "90ms" } as CSSProperties}>
          <p className="t-lede">Single pieces for events, greetings and announcements, each designed to stand on its own.</p>
        </div>
      </header>
      <ul
        ref={row}
        className="pr-row"
        aria-label="Posters"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={(e) => {
          if (swallow.current) {
            swallow.current = false;
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {posters.map((p, i) => (
          <li key={p.id} className="pr-item">
            <button
              type="button"
              className="pr-btn"
              onClick={() => setOpen(i)}
            >
              {/* named by its own caption plus a hidden "Open", so the name
                  holds the words on screen and voice control users can say
                  what they see */}
              <span className="sr-only">Open </span>
              <figure className="pr-fig">
                <span className="pr-shot">
                  <Pic img={p.img} sizes="(min-width: 768px) 420px, 70vw" />
                </span>
                <figcaption>
                  <span className="pr-cap">{p.title}</span>
                  <span className="pr-meta">{p.meta}</span>
                </figcaption>
              </figure>
            </button>
          </li>
        ))}
      </ul>
      <p className="pr-hint">Select a poster to see it whole.</p>
      {open !== null && (
        <Lightbox
          label="One-off posters"
          items={posters.map((p) => ({ img: p.img, caption: `${p.title} · ${p.meta}` }))}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
