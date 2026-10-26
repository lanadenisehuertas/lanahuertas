"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { InkArrow } from "../Ink";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One slide per screen, moved by swipe, trackpad, the arrows, the pips or
 * ←/→. Native scroll-snap does the moving, so it scrolls even before JS.
 * Once mounted the track is marked `data-ready` and the current slide
 * `data-active` — the CSS only hides pieces for their entrance after that,
 * so nothing is blank before hydration. Slides off screen are inert, so Tab
 * stays on the slide you are looking at.
 */
export default function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    setReady(true);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }),
      { root: el, threshold: 0.6 }
    );
    Array.from(el.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [count]);

  /** Jump to slide `i` (wrapping). */
  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = ((i % count) + count) % count;
      const target = el.children[next] as HTMLElement | undefined;
      if (!target) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: target.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    },
    [count]
  );

  /** Step from where the track actually is, so quick presses are not lost mid-scroll. */
  const step = useCallback(
    (by: number) => {
      const el = track.current;
      if (!el) return;
      goTo(Math.round(el.scrollLeft / el.clientWidth) + by);
    },
    [goTo]
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
      onKeyDown={(e) => {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        }
      }}
    >
      <div
        ref={track}
        role="group"
        tabIndex={0}
        aria-label={`${label}: use the arrow keys to move between slides`}
        data-ready={ready ? "" : undefined}
        className="carousel-track relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain focus-visible:outline-offset-[-4px]"
      >
        {slides.map((s, i) => (
          <div
            key={i}
            data-i={i}
            data-active={i === active ? "" : undefined}
            inert={ready && i !== active}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="carousel-slide relative w-full shrink-0 snap-start snap-always"
          >
            {s}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-3 px-4">
        <button type="button" onClick={() => step(-1)} aria-label="Previous slide" className="btn-ghost btn-icon pointer-events-auto">
          <InkArrow dir="left" className="h-5 w-8" />
        </button>
        <div className="pointer-events-auto flex max-w-[calc(100%-120px)] items-center gap-3">
          <ol className="flex items-center overflow-x-auto [scrollbar-width:none]">
            {slides.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                  className="flex h-9 w-3.5 cursor-pointer items-center justify-center sm:w-4"
                >
                  <span
                    aria-hidden
                    className={`block rounded-full transition-all duration-300 ${
                      i === active ? "h-2.5 w-2.5 bg-lavender shadow-[0_0_10px_rgb(185_55_157/0.6)]" : "h-1.5 w-1.5 bg-ink/30"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>
          <span className="idx hidden shrink-0 sm:inline">
            {pad(active + 1)} / {pad(count)}
          </span>
        </div>
        <button type="button" onClick={() => step(1)} aria-label="Next slide" className="btn-ghost btn-icon pointer-events-auto">
          <InkArrow className="h-5 w-8" />
        </button>
      </div>
    </div>
  );
}
