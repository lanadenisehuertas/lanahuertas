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
import { pad } from "./tone";
import { Heading } from "../current/Ornaments";

export type SlideInfo = {
  /** Anchor id in stack mode (e.g. /design#neostalgia). */
  key: string;
  /** Full name: edge label, aria-label. */
  name: string;
  /** Shorter name for the project index, when the full one is long. */
  short?: string;
};

export type SpreadTitle = { lead: string; accent: string; n?: string; script?: string; spec?: string; world?: string };

/** What stands above the projects: the chapter's facts, a line about it, and the way to (or back from) the archive. */
export type SpreadHead = {
  meta?: string;
  lede?: ReactNode;
  link?: { href: string; label: string };
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
 * The spread: one project at a time, words beside the art. In "carousel" mode
 * (homepage) the slides sit side by side in a native scroll-snap track, so
 * they swipe and scroll before JS; once mounted, the track adds a project
 * index, back and next buttons, mouse drag and arrow keys while the section
 * is on screen. Off-screen slides are inert. In "stack" mode (the /design,
 * /videos and /ui-ux pages) the same slides run down the page under a page
 * heading.
 */
/**
 * A slow, eased glide between slides (the browser's own smooth scroll is short
 * and abrupt). Snapping is held off while it runs so it can't tug the motion,
 * and a new glide, a drag or a wheel cancels the old one.
 */
const glides = new WeakMap<HTMLElement, number>();
function glide(el: HTMLElement, to: number) {
  cancelAnimationFrame(glides.get(el) ?? 0);
  const from = el.scrollLeft,
    dist = to - from;
  if (Math.abs(dist) < 1) return;
  const dur = Math.min(1150, 700 + (Math.abs(dist) / el.clientWidth) * 150),
    t0 = performance.now(),
    ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  el.style.scrollSnapType = "none";
  const stop = () => {
    cancelAnimationFrame(glides.get(el) ?? 0);
    glides.delete(el);
    el.style.scrollSnapType = "";
    el.removeEventListener("pointerdown", stop);
    el.removeEventListener("wheel", stop);
  };
  el.addEventListener("pointerdown", stop, { once: true });
  el.addEventListener("wheel", stop, { once: true, passive: true });
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / dur);
    el.scrollLeft = from + dist * ease(k);
    if (k < 1) glides.set(el, requestAnimationFrame(step));
    else stop();
  };
  glides.set(el, requestAnimationFrame(step));
}

export default function Spread({
  id,
  title,
  label,
  slides,
  mode = "carousel",
  head = {},
  children,
}: {
  id: string;
  /** The chapter heading: its two halves, its catalogue number and the script word behind it. */
  title: SpreadTitle;
  /** Accessible name for the carousel ("Brands"). */
  label: string;
  slides: SlideInfo[];
  mode?: "carousel" | "stack";
  head?: SpreadHead;
  children: ReactNode;
}) {
  const kids = Children.toArray(children);
  const count = kids.length;

  if (mode === "stack") {
    return (
      <>
        <header className="page-head">
          {head.link && (
            <a href={head.link.href} className="link page-back">
              <span aria-hidden>←</span> {head.link.label}
            </a>
          )}
          {head.meta && <p className="t-meta">{head.meta}</p>}
          <Heading as="h1" lead={title.lead} accent={title.accent} n={title.n} script={title.script} />
          {head.lede && <p className="t-lede">{head.lede}</p>}
        </header>
        <div id={id} className="sp sp--stack">
          {kids.map((kid, i) => (
            <div key={slides[i].key} id={slides[i].key} className="sp-cell">
              <SlideCtx.Provider value={{ active: true, near: i < 2, heading: "h2" }}>{kid}</SlideCtx.Provider>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <Carousel id={id} title={title} label={label} slides={slides} count={count} head={head}>
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
  head,
  children,
}: {
  id: string;
  title: SpreadTitle;
  label: string;
  slides: SlideInfo[];
  count: number;
  head: SpreadHead;
  children: ReactNode[];
}) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const index = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: number; id: number } | null>(null);
  const swallowClick = useRef(false);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [inReach, setInReach] = useState(false);

  const wrap = useCallback((i: number) => ((i % count) + count) % count, [count]);

  /** Move to slide `i` (wrapping). Wrapping jumps rather than flying past every slide. */
  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = wrap(i);
      const from = Math.round(el.scrollLeft / el.clientWidth);
      const far = Math.abs(next - from) > 1 && (i < 0 || i >= count);
      if (reduced() || far) el.scrollTo({ left: next * el.clientWidth, behavior: "auto" });
      else glide(el, next * el.clientWidth);
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
      // read once, before any writes: reading scrollLeft between the writes
      // below would make the browser restyle the page once per slide
      const pos = el.scrollLeft / (el.clientWidth || 1);
      setActive(Math.min(count - 1, Math.max(0, Math.round(pos))));
      // Each slide's offset from the middle (0 = in place, ±1 = a slide away)
      // drives the move between slides in work.css: the words and the art
      // part and fade.
      for (const c of el.children) {
        const cell = c as HTMLElement;
        const o = Math.max(-1.5, Math.min(1.5, Number(cell.dataset.i) - pos)),
          v = o.toFixed(3);
        // slides parked off screen keep their value: no style work for them
        if (cell.dataset.o === v) continue;
        cell.dataset.o = v;
        cell.style.setProperty("--o", v);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    read();
    // Keep the slide in place when the window resizes.
    let last = Math.round(el.scrollLeft / (el.clientWidth || 1));
    // only a change of width: the track's height follows the slide on phones,
    // and reacting to that would pull a swipe back to the slide it left
    let width = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === width) return;
      width = el.clientWidth;
      el.scrollTo({ left: last * width, behavior: "auto" });
    });
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
      el.style.height = window.innerWidth < 900 && cell ? `${cell.offsetHeight}px` : "";
    };
    fit();
    window.addEventListener("resize", fit);
    // a slide can grow after it is shown (an image loads, a device tab changes)
    const cell = el.children[active];
    const ro = new ResizeObserver(fit);
    if (cell) ro.observe(cell);
    return () => {
      window.removeEventListener("resize", fit);
      ro.disconnect();
    };
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
    if ((e.target as HTMLElement).closest("a, iframe, input, .sp-strip, .dev-screen, .dev-tabs, .dev-phone-tabs, [data-nodrag]")) return;
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
    // a drag that ends with no click (released off the track) must not eat the next real one
    window.setTimeout(() => (swallowClick.current = false), 0);
    const base = Math.round(d.left / el.clientWidth);
    const dx = e.clientX - d.x;
    goTo(Math.abs(dx) > 60 ? base + (dx < 0 ? 1 : -1) : base);
  };

  const cur = slides[active] ?? slides[0];
  const short = (s: SlideInfo) => s.short ?? s.name;

  return (
    <section ref={section} id={id} data-scene={id} aria-labelledby={`${id}-name`} className="sp sp--carousel">
      <header className="sec-head sp-head">
        <div data-rv>
          {head.meta && <p className="t-meta">{head.meta}</p>}
          <Heading id={`${id}-name`} lead={title.lead} accent={title.accent} n={title.n} script={title.script} />
        </div>
        <div className="sec-note" data-rv style={{ "--d": "90ms" } as CSSProperties}>
          {head.lede && <p className="t-lede">{head.lede}</p>}
          {head.link && (
            <a href={head.link.href} className="link">
              {head.link.label}
            </a>
          )}
        </div>
      </header>

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
        {count > 1 && (
          <div className="sp-arrows">
            <button type="button" className="sp-arrow" aria-label={`Previous: ${slides[wrap(active - 1)].name}`} onClick={() => step(-1)}>
              <span aria-hidden>←</span>
            </button>
            <button type="button" className="sp-arrow" aria-label={`Next: ${slides[wrap(active + 1)].name}`} onClick={() => step(1)}>
              <span aria-hidden>→</span>
            </button>
          </div>
        )}
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
            // the starting offsets (the track opens on the first slide), so the
            // first read on mount finds nothing to write
            data-o={Math.min(1.5, i).toFixed(3)}
            style={{ "--o": Math.min(1.5, i).toFixed(3) } as CSSProperties}
            data-active={i === active ? "" : undefined}
            inert={ready && i !== active}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${slides[i].name}`}
            className="sp-cell"
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
    </section>
  );
}
