"use client";

import { useCallback, useEffect, useRef } from "react";

/*
 * Redaction cuts from clean to most degraded. A letter walks out to the
 * roughest cut and back, then settles into its resting face. There is no
 * italic at 100, so italic letters turn around at 70.
 */
const UPRIGHT = ["r10", "r35", "r70", "r100", "r70", "r35", "r10"];
const ITALIC = ["r10", "r35", "r70", "r35", "r10"];
const STEP_MS = 55;
const RIPPLE_MS = 70;

type Word = { text: string; italic: boolean; className: string };

/**
 * The hero name. Each letter is two stacked glyphs: the resting one, which
 * owns the width, and an overlay that steps through the Redaction cuts.
 * Hovering a letter sets it off and ripples to its neighbours; the whole name
 * runs one wave on load. Touch devices get the wave on tap.
 *
 * Everything runs on data attributes, not React state, so a sweep of the
 * mouse costs no re-renders.
 */
export default function MorphName({
  words,
  label,
  as: Tag = "h1",
}: {
  words: Word[];
  label: string;
  /** The hero name is the page's h1; anywhere else, pass "p". */
  as?: "h1" | "p";
}) {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const busy = useRef<Set<number>>(new Set());
  const timers = useRef<number[]>([]);
  const reduced = useRef(false);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const run = useCallback((i: number) => {
    const el = letters.current[i];
    if (!el || reduced.current || busy.current.has(i)) return;
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
    // The peach tint outlasts the glitch and fades back on its own transition.
    later(() => delete el.dataset.lit, seq.length * STEP_MS + 260);
  }, []);

  const trigger = useCallback(
    (i: number) => {
      run(i);
      later(() => {
        run(i - 1);
        run(i + 1);
      }, RIPPLE_MS);
    },
    [run]
  );

  const wave = useCallback(() => {
    letters.current.forEach((_, i) => later(() => run(i), i * RIPPLE_MS));
  }, [run]);

  /*
   * Click: scramble. Random letters hold a random rough cut for a beat, then
   * the whole name washes clean with a wave.
   */
  const scramble = useCallback(() => {
    if (reduced.current) return;
    const cuts = ["r35", "r70", "r100"];
    letters.current.forEach((el, i) => {
      if (!el || busy.current.has(i) || Math.random() < 0.35) return;
      busy.current.add(i);
      el.dataset.on = "1";
      el.dataset.cut = cuts[(Math.random() * cuts.length) | 0];
      later(() => {
        delete el.dataset.on;
        delete el.dataset.cut;
        busy.current.delete(i);
      }, 500 + Math.random() * 500);
    });
    later(wave, 1100);
  }, [wave]);

  /*
   * Magnetic lift: letters near the cursor rise and swell a little, falling
   * off with horizontal distance. One rAF per frame, transforms only.
   */
  const frame = useRef(0);
  const onMove = useCallback((e: React.PointerEvent) => {
    if (reduced.current || e.pointerType !== "mouse") return;
    const px = e.clientX;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      letters.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(px - (r.left + r.width / 2));
        const k = Math.max(0, 1 - d / (r.width * 2.6));
        el.style.setProperty("--lift", k.toFixed(3));
      });
    });
  }, []);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    letters.current.forEach((el) => el?.style.setProperty("--lift", "0"));
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = timers.current;
    const start = window.setTimeout(wave, 450);
    const raf = frame;
    return () => {
      cancelAnimationFrame(raf.current);
      window.clearTimeout(start);
      t.forEach(window.clearTimeout);
    };
  }, [wave]);

  let n = 0;
  return (
    <Tag
      onClick={scramble}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="morph-name select-none"
    >
      {/* The real heading text. The letters below are drawn twice for the
          morph, so they are hidden; otherwise crawlers read "LLaannaa". */}
      <span className="sr-only">{label}</span>
      {words.map((w) => (
        <span key={w.text} aria-hidden className={`block ${w.className}`}>
          {Array.from(w.text).map((ch, k) => {
            if (ch === " ") return <span key={`s${k}`}>{" "}</span>;
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
      ))}
    </Tag>
  );
}
