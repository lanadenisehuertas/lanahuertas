"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { burst, floatText, local } from "@/lib/dusk/fx";
import { meow, purr } from "@/lib/dusk/sound";

/*
 * Peanut, Lana's orange cat, turning up around the page as round, fluffy
 * pixel art (public/art/peanut, drawn on a grid with the site's dither and a
 * soft plum outline): asleep on a cloud in the hero (DuskHero), perched on the
 * video frame here, and peeking over the contact form. Stroke her for hearts
 * and a purr; click her for a meow.
 */

const heart = (c: string) =>
  `<svg viewBox="0 0 16 14" width="16" height="14" aria-hidden="true"><path d="M8 13 C 2 9 0 6 0 4 C 0 1.5 2 0 4 0 C 6 0 7 1.2 8 2.6 C 9 1.2 10 0 12 0 C 14 0 16 1.5 16 4 C 16 6 14 9 8 13Z" fill="${c}"/></svg>`;

/** hearts while stroked, a meow and a little hop on click */
function usePet(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = (el.closest("section") as HTMLElement | null) ?? document.body;
    let last: [number, number] | null = null,
      dist = 0,
      purrT = 0;
    const onMove = (e: PointerEvent) => {
      if (last) dist += Math.hypot(e.clientX - last[0], e.clientY - last[1]);
      last = [e.clientX, e.clientY];
      if (dist < 70) return;
      dist = 0;
      const [x, y] = local(host, e.clientX, e.clientY),
        h = document.createElement("div");
      h.className = "dk-heart";
      h.setAttribute("aria-hidden", "true");
      h.innerHTML = heart(["#ffcfe0", "#ff9ec4", "#fdf3e1"][(Math.random() * 3) | 0]);
      h.style.left = `${x - 8}px`;
      h.style.top = `${y - 18}px`;
      h.style.setProperty("--hx", `${(Math.random() - 0.5) * 40}px`);
      host.appendChild(h);
      setTimeout(() => h.remove(), 1500);
      if (performance.now() - purrT > 1000) {
        purrT = performance.now();
        purr();
      }
    };
    const onLeave = () => {
      last = null;
      dist = 0;
    };
    const onClick = () => {
      meow();
      delete el.dataset.hop;
      void el.offsetWidth;
      el.dataset.hop = "";
      const b = el.getBoundingClientRect(),
        [x, y] = local(host, b.left + b.width / 2, b.top);
      floatText(host, x - 16, y - 6, "meow", "#ffcfe0");
      burst(host, x, y + b.height * 0.3, 8, ["#ffcfe0", "#fdf3e1", "#ffd98a"], "star");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("click", onClick);
    };
  }, [ref]);
}

/**
 * Sitting on the top edge of whatever she is placed in (its parent must be
 * positioned): her tail hangs over the edge and swings; while a video plays
 * she bobs her head to it and the tail keeps time.
 */
export function PeanutPerch({ playing, style }: { playing?: boolean; style?: CSSProperties }) {
  const ref = useRef<HTMLButtonElement>(null);
  usePet(ref);
  return (
    <button ref={ref} type="button" aria-label="Peanut, my cat, watching (click for a meow)" className="dk-perch" data-playing={playing ? "" : undefined} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tail" src="/art/peanut/perch-tail.svg" alt="" width={13} height={31} loading="lazy" decoding="async" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="body" src="/art/peanut/perch-body.svg" alt="" width={42} height={50} loading="lazy" decoding="async" draggable={false} />
    </button>
  );
}

/**
 * Peeking up over the top edge of her parent: she rises into view when it
 * scrolls on screen, ducks when the pointer comes close, and pops back up.
 */
export function PeanutPeek({ style }: { style?: CSSProperties }) {
  const ref = useRef<HTMLButtonElement>(null);
  usePet(ref);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setTimeout(() => (el.dataset.up = ""), 500);
        else delete el.dataset.up;
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <button ref={ref} type="button" aria-label="Peanut, my cat, peeking (click for a meow)" className="dk-peek" style={style}>
      <span className="win">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/peanut/peek.svg" alt="" width={48} height={31} loading="lazy" decoding="async" draggable={false} />
      </span>
    </button>
  );
}

/**
 * Walking about on a strip of her parent (its parent must be positioned):
 * she trots to a spot, stops a while (tail flick, a slow blink), turns and
 * trots somewhere else. The walk is a six-frame pixel strip (frames 0-3
 * walk, 4-5 stand); only her translateX moves, and only while she is on
 * screen. Reduced motion: she just stands. Stroke or click her like the others.
 */
export function PeanutWalk({ style, size = "clamp(84px, 8vw, 124px)" }: { style?: CSSProperties; size?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const cat = useRef<HTMLButtonElement>(null);
  usePet(cat);
  useEffect(() => {
    const tr = track.current,
      el = cat.current;
    if (!tr || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0,
      to = 0,
      raf = 0,
      wait = 0,
      seen = false,
      last = 0;
    const room = () => Math.max(0, tr.clientWidth - el.offsetWidth);
    const place = () => (el.style.transform = `translateX(${x.toFixed(1)}px)`);
    const pick = () => {
      const r = room();
      // somewhere at least a third of the strip away, so every walk is a real one
      let t = Math.random() * r;
      if (Math.abs(t - x) < r / 3) t = x < r / 2 ? x + r / 3 + Math.random() * (r - x - r / 3) : Math.random() * (x - r / 3);
      to = Math.max(0, Math.min(r, t));
      el.dataset.dir = to < x ? "l" : "r";
      el.dataset.walk = "";
    };
    const step = (now: number) => {
      raf = 0;
      if (!seen) return;
      const dt = Math.min(64, now - (last || now));
      last = now;
      if (el.dataset.walk !== undefined) {
        const v = el.offsetWidth * 0.42 * (dt / 1000);
        const d = to - x;
        if (Math.abs(d) <= v) {
          x = to;
          delete el.dataset.walk;
          wait = window.setTimeout(() => {
            pick();
            go();
          }, 1800 + Math.random() * 3200);
          place();
          return;
        }
        x += Math.sign(d) * v;
        place();
      }
      go();
    };
    const go = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      last = 0;
      if (seen && el.dataset.walk === undefined && !wait) wait = window.setTimeout(() => {
        wait = 0;
        pick();
        go();
      }, 900);
      if (seen) go();
    });
    // a click stops her for a moment to look at you
    const stop = () => {
      delete el.dataset.walk;
      window.clearTimeout(wait);
      wait = window.setTimeout(() => {
        wait = 0;
        pick();
        go();
      }, 2600);
    };
    x = room() * (0.15 + Math.random() * 0.5);
    place();
    io.observe(tr);
    el.addEventListener("click", stop);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(wait);
      el.removeEventListener("click", stop);
    };
  }, []);
  return (
    <div ref={track} className="dk-walk-track" style={style}>
      <button ref={cat} type="button" aria-label="Peanut, my cat, out for a walk (click for a meow)" className="dk-walk" style={{ width: size }}>
        <span className="spr" />
      </button>
    </div>
  );
}
