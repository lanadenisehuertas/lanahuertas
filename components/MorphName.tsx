"use client";

import { Fragment, useCallback, useEffect, useRef } from "react";

/*
 * Redaction cuts from clean to most degraded. A letter walks out to the
 * roughest cut and back, then settles into its resting face. There is no
 * italic at 100, so italic letters turn around at 70.
 */
const UPRIGHT = ["r10", "r35", "r70", "r100", "r70", "r35", "r10"];
const ITALIC = ["r10", "r35", "r70", "r35", "r10"];
const STEP_MS = 55;
const RIPPLE_MS = 70;

export type MorphWord = { text: string; italic?: boolean; className?: string };

/**
 * Type that answers the hand. Each letter is two stacked glyphs: the resting
 * one, which owns the width, and an overlay that steps through the Redaction
 * cuts, from clean serif down to coarse pixels and back. Hovering a letter
 * sets it off and ripples to its neighbours, letters near the cursor lift a
 * little, a click scrambles the whole line, and the line runs one wave the
 * first time it comes on screen. Touch devices get the wave on tap.
 *
 * Used for the name in the hero and for every section heading. Everything
 * runs on data attributes, not React state, so a sweep of the mouse costs no
 * re-renders. Reduced motion and the site's "pause motion" switch turn it off.
 */
export default function MorphName({
  words,
  label,
  as: Tag = "h1",
  id,
  className = "",
  stacked = false,
  glint = false,
}: {
  words: MorphWord[];
  /** The real text, for assistive tech and crawlers. */
  label: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  /** Each word on its own line (the hero name); otherwise they run on one line. */
  stacked?: boolean;
  /** An idle sparkle crosses the line every few seconds until it is first touched. */
  glint?: boolean;
}) {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const busy = useRef<Set<number>>(new Set());
  const timers = useRef<number[]>([]);
  const off = useRef(false);

  // every pending timer is tracked, and forgotten once it has fired
  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id);
      fn();
    }, ms);
    timers.current.push(id);
  }, []);
  const still = useCallback(() => off.current || document.documentElement.hasAttribute("data-still"), []);

  const run = useCallback((i: number) => {
    const el = letters.current[i];
    if (!el || still() || busy.current.has(i)) return;
    busy.current.add(i);

    const seq = el.dataset.italic === "1" ? ITALIC : UPRIGHT;
    el.dataset.on = "1";
    el.dataset.lit = "1";
    seq.forEach((cut, s) => later(() => (el.dataset.cut = cut), s * STEP_MS));
    later(() => {
      delete el.dataset.on;
      delete el.dataset.cut;
      busy.current.delete(i);
    }, seq.length * STEP_MS);
    // The glow outlasts the glitch and fades back on its own transition.
    later(() => delete el.dataset.lit, seq.length * STEP_MS + 320);
  }, [later, still]);

  const trigger = useCallback(
    (i: number) => {
      run(i);
      later(() => {
        run(i - 1);
        run(i + 1);
      }, RIPPLE_MS);
    },
    [run, later]
  );

  const wave = useCallback(() => {
    letters.current.forEach((_, i) => later(() => run(i), i * (RIPPLE_MS - 20)));
  }, [run, later]);

  /* Click: random letters hold a random rough cut for a beat, then the line washes clean with a wave. */
  const scramble = useCallback(() => {
    if (still()) return;
    const cuts = ["r35", "r70", "r100"];
    letters.current.forEach((el, i) => {
      if (!el || busy.current.has(i) || Math.random() < 0.35) return;
      busy.current.add(i);
      el.dataset.on = "1";
      el.dataset.cut = el.dataset.italic === "1" ? "r70" : cuts[(Math.random() * cuts.length) | 0];
      later(() => {
        delete el.dataset.on;
        delete el.dataset.cut;
        busy.current.delete(i);
      }, 500 + Math.random() * 500);
    });
    later(wave, 1100);
  }, [wave, later, still]);

  /* Magnetic lift: letters near the cursor rise a little. One rAF per frame, transforms only. */
  const frame = useRef(0);
  const onMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || still()) return;
    const px = e.clientX;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const boxes = letters.current.map((el) => el?.getBoundingClientRect());
      letters.current.forEach((el, i) => {
        const r = boxes[i];
        if (!el || !r) return;
        const d = Math.abs(px - (r.left + r.width / 2));
        el.style.setProperty("--lift", Math.max(0, 1 - d / (r.width * 2.6)).toFixed(3));
      });
    });
  }, [still]);
  const onLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    letters.current.forEach((el) => el?.style.setProperty("--lift", "0"));
  }, []);

  const root = useRef<HTMLElement>(null);
  const played = useRef(false);
  const markPlayed = useCallback(() => {
    played.current = true;
  }, []);

  useEffect(() => {
    off.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raf = frame;
    const el = root.current;
    let visible = false,
      waved = false,
      idle = 0;
    // one wave the first time the line is on screen
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !waved) {
          waved = true;
          later(wave, 420);
        }
      },
      { threshold: 0.5 }
    );
    if (el) io.observe(el);

    const flash = () => {
      if (el && visible && !played.current && !still() && document.visibilityState === "visible") {
        el.dataset.glint = "";
        const count = letters.current.length;
        // the letters under the sparkle shimmer as it passes
        [0.3, 0.62].forEach((f) => later(() => trigger(Math.floor(count * f)), 1600 * f));
        later(() => delete el.dataset.glint, 1700);
      }
      idle = window.setTimeout(flash, 6500 + Math.random() * 3000);
    };
    if (glint) idle = window.setTimeout(flash, 4200);

    return () => {
      cancelAnimationFrame(raf.current);
      window.clearTimeout(idle);
      io.disconnect();
      timers.current.forEach(window.clearTimeout);
    };
  }, [wave, trigger, glint, later, still]);

  let n = 0;
  return (
    <Tag
      ref={root as React.Ref<HTMLHeadingElement>}
      id={id}
      onPointerEnter={markPlayed}
      onPointerDown={markPlayed}
      onClick={scramble}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`morph-name ${className}`}
    >
      {/* The real text. The letters below are drawn twice for the morph, so
          they are hidden; otherwise crawlers read "LLaannaa". */}
      <span className="sr-only">{label}</span>
      {glint && (
        <span aria-hidden className="name-glint">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z" />
          </svg>
        </span>
      )}
      {words.map((w, wi) => (
        <Fragment key={w.text + wi}>
        <span aria-hidden className={`morph-word ${stacked ? "block" : ""} ${w.italic ? "is-italic" : ""} ${w.className ?? ""}`}>
          {Array.from(w.text).map((ch, k) => {
            if (ch === " ") return <span key={`s${k}`}> </span>;
            const i = n++;
            return (
              <span
                key={i}
                ref={(el) => {
                  letters.current[i] = el;
                }}
                data-italic={w.italic ? "1" : undefined}
                onPointerEnter={(e) => e.pointerType === "mouse" && trigger(i)}
                className="morph-letter"
              >
                <span className="morph-base">{ch}</span>
                <span className="morph-overlay" data-ch={ch} />
              </span>
            );
          })}
        </span>
        {/* the space sits between the words, so a narrow screen can break the line there */}
        {!stacked && wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
