"use client";

import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { Tone } from "@/lib/palettes";
import { pad } from "./tone";

export type SlideInfo = {
  /** Anchor id in stack mode (e.g. /design#neostalgia). */
  key: string;
  /** Full name: edge label, aria-label. */
  name: string;
  /** Shorter name for the project index, when the full one is long. */
  short?: string;
  tone: Tone;
  /** Wash colour "r g b", or none for slides on the site's own sky. */
  wash?: string;
};

type SlideState = {
  /** The slide on screen (always true in stack mode). */
  active: boolean;
  /** On screen or next to it, with the section in reach: load its images now. */
  near: boolean;
  /** Heading level for the project title. */
  heading: "h2" | "h3";
};

const SlideCtx = createContext<SlideState>({ active: true, near: false, heading: "h3" });

/** What a slide needs to know about where it sits. */
export const useSlide = () => useContext(SlideCtx);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The spread: one project per screen. In "carousel" mode (homepage) the
 * slides sit side by side in a native scroll-snap track, so they swipe and
 * scroll before JS; once mounted, the track adds a project index along the
 * top, back/next edge zones with a cursor label, mouse drag and ←/→ while the
 * section is on screen. Off-screen slides are inert. In "stack" mode (the
 * /design, /videos and /ui-ux pages) the same slides run down the page.
 *
 * The section's `data-tone` follows the slide on screen, for the nav.
 */
export default function Spread({
  id,
  title,
  label,
  slides,
  mode = "carousel",
  children,
}: {
  id: string;
  /** The small section name in the copy column ("Branding & pubmats"). */
  title: ReactNode;
  /** Accessible name for the carousel ("Brands"). */
  label: string;
  slides: SlideInfo[];
  mode?: "carousel" | "stack";
  children: ReactNode;
}) {
  const kids = Children.toArray(children);
  const count = kids.length;

  if (mode === "stack") {
    return (
      <div id={id} className="sp sp--stack">
        {kids.map((kid, i) => {
          const s = slides[i];
          return (
            <div
              key={s.key}
              id={s.key}
              data-tone={s.tone}
              className="sp-cell"
              style={s.wash ? ({ "--head": `rgb(${s.wash})` } as CSSProperties) : undefined}
            >
              {i === 0 ? (
                <h1 className="sp-name">{title}</h1>
              ) : (
                <p className="sp-name" aria-hidden>
                  {title}
                </p>
              )}
              <SlideCtx.Provider value={{ active: true, near: i < 2, heading: "h2" }}>{kid}</SlideCtx.Provider>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Carousel id={id} title={title} label={label} slides={slides} count={count}>
      {kids}
    </Carousel>
  );
}

function Carousel({
  id,
  title,
  label,
  slides,
  count,
  children,
}: {
  id: string;
  title: ReactNode;
  label: string;
  slides: SlideInfo[];
  count: number;
  children: ReactNode[];
}) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const index = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: number; id: number } | null>(null);
  const swallowClick = useRef(false);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [inReach, setInReach] = useState(false);
  const [edge, setEdge] = useState<-1 | 1 | null>(null);

  const wrap = useCallback((i: number) => ((i % count) + count) % count, [count]);

  /** Move to slide `i` (wrapping). Wrapping jumps rather than flying past every slide. */
  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = wrap(i);
      const from = Math.round(el.scrollLeft / el.clientWidth);
      const far = Math.abs(next - from) > 1 && (i < 0 || i >= count);
      el.scrollTo({ left: next * el.clientWidth, behavior: reduced() || far ? "auto" : "smooth" });
    },
    [count, wrap]
  );

  /** Step from where the track is now, so quick presses are not lost mid-scroll. */
  const step = useCallback(
    (by: number) => {
      const el = track.current;
      if (el) goTo(Math.round(el.scrollLeft / el.clientWidth) + by);
    },
    [goTo]
  );

  // Track position -> active slide.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    setReady(true);
    let frame = 0;
    const read = () => {
      frame = 0;
      setActive(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    // Keep the slide in place when the window resizes.
    let last = Math.round(el.scrollLeft / (el.clientWidth || 1));
    const ro = new ResizeObserver(() => el.scrollTo({ left: last * el.clientWidth, behavior: "auto" }));
    const keep = () => (last = Math.round(el.scrollLeft / (el.clientWidth || 1)));
    el.addEventListener("scrollend", keep);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", keep);
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [count]);

  // Load neighbours' images only once the section is within a screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInReach(true), { rootMargin: "100% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ←/→ while this section holds the middle of the screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable], dialog")) return;
      if (document.querySelector("dialog[open]")) return;
      const r = section.current?.getBoundingClientRect();
      if (!r || r.top > innerHeight / 2 || r.bottom < innerHeight / 2) return;
      e.preventDefault();
      step(e.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  // Phones: slides stack their words above the art and differ in height; the
  // track takes the height of the slide on screen.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const fit = () => {
      const cell = el.children[active] as HTMLElement | undefined;
      el.style.height = window.innerWidth < 768 && cell ? `${cell.offsetHeight}px` : "";
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [active]);

  // Keep the current name in view in the index.
  useEffect(() => {
    const box = index.current;
    const btn = box?.querySelectorAll<HTMLElement>("[data-i]")[active];
    if (!box || !btn) return;
    const left = btn.offsetLeft - box.clientWidth / 2 + btn.offsetWidth / 2;
    box.scrollTo({ left, behavior: reduced() ? "auto" : "smooth" });
  }, [active]);

  /* Mouse drag on the art. Touch and trackpads scroll the track natively. */
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("a, iframe, input, .sp-strip, .dev-screen, .dev-tabs, [data-nodrag]")) return;
    drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: 0, id: e.pointerId };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved < 6) return;
    const el = e.currentTarget;
    if (!el.classList.contains("is-drag")) {
      el.classList.add("is-drag");
      el.setPointerCapture(d.id);
    }
    el.scrollLeft = d.left - dx;
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved < 6) return;
    const el = e.currentTarget;
    el.classList.remove("is-drag");
    if (el.hasPointerCapture(d.id)) el.releasePointerCapture(d.id);
    swallowClick.current = true;
    const base = Math.round(d.left / el.clientWidth);
    const dx = e.clientX - d.x;
    goTo(Math.abs(dx) > 60 ? base + (dx < 0 ? 1 : -1) : base);
  };

  /* The edge label follows the pointer; no React render per move. */
  const follow = (dir: -1 | 1) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const box = section.current?.getBoundingClientRect();
    const lab = cursor.current;
    if (!box || !lab) return;
    if (edge !== dir) setEdge(dir);
    const x = e.clientX - box.left;
    const y = e.clientY - box.top - 20;
    lab.style.transform = `translate3d(${dir > 0 ? x - lab.offsetWidth - 14 : x + 14}px, ${y}px, 0)`;
  };

  const cur = slides[active] ?? slides[0];
  const short = (s: SlideInfo) => s.short ?? s.name;
  const target = edge ? slides[wrap(active + edge)] : null;

  return (
    <section
      ref={section}
      id={id}
      data-tone={cur.tone}
      aria-labelledby={`${id}-name`}
      className="sp sp--carousel"
      style={{ "--head": cur.wash ? `rgb(${cur.wash})` : "transparent" } as CSSProperties}
    >
      <h2 id={`${id}-name`} className="sp-name">
        {title}
      </h2>

      <div className="sp-index">
        <div ref={index} className="sp-index-list" role="group" aria-label={`${label}: jump to`}>
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              data-i={i}
              aria-current={i === active ? "true" : undefined}
              aria-label={s.short ? s.name : undefined}
              onClick={() => goTo(i)}
              className="sp-index-btn"
            >
              {short(s)}
            </button>
          ))}
        </div>
        <span className="sp-count" aria-live="polite">
          <span className="sr-only">Showing </span>
          {pad(active + 1)} / {pad(count)}
          <span className="sr-only">: {cur.name}</span>
        </span>
      </div>

      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className="sp-track"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={(e) => {
          if (swallowClick.current) {
            swallowClick.current = false;
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {children.map((kid, i) => (
          <div
            key={slides[i].key}
            data-i={i}
            data-active={i === active ? "" : undefined}
            inert={ready && i !== active}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${slides[i].name}`}
            className={`sp-cell sp-${slides[i].tone}`}
          >
            <SlideCtx.Provider
              value={{
                active: i === active,
                near: inReach && (Math.abs(i - active) <= 1 || Math.abs(i - active) === count - 1),
                heading: "h3",
              }}
            >
              {kid}
            </SlideCtx.Provider>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          {([-1, 1] as const).map((dir) => (
            <div
              key={dir}
              aria-hidden
              className={`sp-edge ${dir < 0 ? "sp-edge--l" : "sp-edge--r"}`}
              onPointerMove={follow(dir)}
              onPointerLeave={() => setEdge(null)}
              onClick={() => step(dir)}
            />
          ))}
          <div ref={cursor} aria-hidden className="sp-cursor" data-on={edge ? "" : undefined}>
            {target && edge === 1 && (
              <>
                <small>next</small>
                {short(target)} →
              </>
            )}
            {target && edge === -1 && (
              <>
                <small>back</small>← {short(target)}
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
