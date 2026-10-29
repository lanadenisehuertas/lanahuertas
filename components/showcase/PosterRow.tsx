"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { posters } from "@/lib/brands";
import Lightbox from "./Lightbox";
import Pic from "./Pic";

const still = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.hasAttribute("data-lite");

/**
 * One-off posters: one row on the site's sky. Mouse drag flings it (with
 * momentum); wheel, trackpad and touch scroll it natively; Tab walks the
 * posters. The poster under the pointer lifts and tilts toward it; a click
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

  const tilt = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse" || drag.current?.moved || still()) return;
    const fig = e.currentTarget.firstElementChild as HTMLElement | null;
    if (!fig) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    fig.style.transform = `perspective(900px) translateY(-10px) rotateY(${px * 14}deg) rotateX(${-py * 10}deg) scale(1.03)`;
  };
  const untilt = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const fig = e.currentTarget.firstElementChild as HTMLElement | null;
    if (fig) fig.style.transform = "";
  };

  return (
    <section id={id} data-tone="light" aria-labelledby={`${id}-h`} className="pr">
      <div className="pr-head">
        <h2 id={`${id}-h`} data-perch className="pr-title">
          One-off <em>posters</em>
        </h2>
        <p className="pr-hint">
          {posters.length} posters · drag the row · click to open
        </p>
      </div>
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
              aria-label={`Open ${p.title}`}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              onClick={() => setOpen(i)}
            >
              <figure className="pr-fig">
                <Pic img={p.img} sizes="(min-width: 768px) 420px, 70vw" />
                <figcaption>
                  <span className="pr-cap">{p.title}</span>
                  <span className="pr-meta">{p.meta}</span>
                </figcaption>
              </figure>
            </button>
          </li>
        ))}
      </ul>
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
