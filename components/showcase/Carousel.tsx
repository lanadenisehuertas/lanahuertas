"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * One slide per screen, moved by swipe, trackpad, the arrows, the pips or
 * ←/→. Native scroll-snap does the moving, so it scrolls even before JS;
 * JS tracks the current slide and marks it `data-active`, which the slides'
 * CSS uses to fade the backdrop in and drop the pieces into place.
 */
export default function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
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

  const go = useCallback(
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

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(active + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(active - 1);
        }
      }}
    >
      <div
        ref={track}
        tabIndex={0}
        aria-label={`${label}: use the arrow keys to move between slides`}
        className="carousel-track relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain focus-visible:outline-offset-[-4px]"
      >
        {slides.map((s, i) => (
          <div
            key={i}
            data-i={i}
            data-active={i === active ? "" : undefined}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="carousel-slide relative w-full shrink-0 snap-start snap-always"
          >
            {s}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4">
        <div className="glass pointer-events-auto flex max-w-full items-center gap-2 rounded-full px-2 py-1.5 shadow-[0_14px_30px_-20px_rgb(27_7_48/0.6)]">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous slide"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-iris transition-colors hover:bg-white/70"
          >
            <span aria-hidden>←</span>
          </button>
          <ol className="flex items-center gap-1 overflow-x-auto">
            {slides.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                  className="flex h-11 w-4 cursor-pointer items-center justify-center sm:w-5"
                >
                  <span
                    aria-hidden
                    className={`block rounded-full transition-all duration-300 ${
                      i === active ? "h-2.5 w-2.5 bg-iris" : "h-1.5 w-1.5 bg-ink/30"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>
          <span className="type-pixel hidden w-14 shrink-0 text-center text-[10px] text-ink/60 tabular-nums sm:inline">
            {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next slide"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-iris transition-colors hover:bg-white/70"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
