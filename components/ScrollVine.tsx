"use client";

import { useEffect, useRef } from "react";
import { Lotus } from "./Botanicals";

const SECTIONS = ["work", "about", "contact"];

/**
 * A stem down the left margin that grows with the reader's progress through
 * the page. Each section has a bud on it; reaching the section opens the bud.
 * Desktop only — on a phone the margin is the content.
 *
 * Progress is written to --scroll on the vine itself, so the stem is pure
 * CSS. Not on <html>: a custom property changed there restyles the whole
 * page on every scroll frame. Below the xl breakpoint the vine is hidden, so
 * nothing listens at all.
 */
export default function ScrollVine() {
  const vine = useRef<HTMLDivElement>(null);
  const buds = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    const wide = window.matchMedia("(min-width: 1280px)");
    let raf = 0;
    let on = false;
    const update = () => {
      raf = 0;
      const max = root.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      vine.current?.style.setProperty("--scroll", p.toFixed(4));
      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id);
        const bud = buds.current[i];
        if (!el || !bud) return;
        bud.classList.toggle("open", el.getBoundingClientRect().top < window.innerHeight * 0.6);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const sync = () => {
      if (wide.matches === on) return;
      on = wide.matches;
      if (on) {
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    sync();
    wide.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={vine} aria-hidden className="scroll-vine pointer-events-none fixed top-20 bottom-6 left-3 z-30 hidden w-10 xl:block 2xl:left-8">
      <svg viewBox="0 0 40 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M20 0 C34 120 6 220 20 340 C34 460 6 560 20 680 C34 800 6 900 20 1000"
          fill="none"
          stroke="color-mix(in srgb, var(--color-leaf) 22%, transparent)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="grow"
          pathLength={1}
          d="M20 0 C34 120 6 220 20 340 C34 460 6 560 20 680 C34 800 6 900 20 1000"
          fill="none"
          stroke="var(--color-leaf)"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {SECTIONS.map((id, i) => (
        <div
          key={id}
          ref={(el) => {
            buds.current[i] = el;
          }}
          className="bud absolute left-1/2 w-10 -translate-x-1/2"
          style={{ top: `${22 + i * 30}%` }}
        >
          <Lotus deep={i === 1} className="w-full" />
        </div>
      ))}
    </div>
  );
}
