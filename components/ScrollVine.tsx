"use client";

import { useEffect, useRef } from "react";
import { Lotus } from "./Botanicals";

const SECTIONS = ["work", "about", "contact"];

/**
 * A stem down the left margin that grows with the reader's progress through
 * the page. Each section has a bud on it; reaching the section opens the bud.
 * Desktop only — on a phone the margin is the content.
 *
 * Progress goes straight onto the stem's own path, and the buds open from an
 * IntersectionObserver. Nothing is written to <html> on scroll: a custom
 * property there restyles every element on the page, every frame, and the
 * layout read that used to follow it forced a full layout on top. Off
 * entirely below 1280px, where the stem is not shown.
 */
export default function ScrollVine() {
  const buds = useRef<(HTMLDivElement | null)[]>([]);
  const grow = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1280px)").matches) return;
    const root = document.documentElement;
    let raf = 0;
    let max = 1;
    const measure = () => {
      max = Math.max(1, root.scrollHeight - window.innerHeight);
    };
    const update = () => {
      raf = 0;
      const p = Math.min(1, window.scrollY / max);
      grow.current?.style.setProperty("stroke-dashoffset", (1 - p).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    // a bud opens once its section's top is above 60% of the screen
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const i = SECTIONS.indexOf(e.target.id);
          buds.current[i]?.classList.toggle("open", e.boundingClientRect.top < window.innerHeight * 0.6);
        }),
      { rootMargin: "0px 0px -40% 0px", threshold: [0, 1] }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    measure();
    update();
    // the page grows as sections below the fold lay out
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="scroll-vine pointer-events-none fixed top-20 bottom-6 left-3 z-30 hidden w-10 xl:block 2xl:left-8">
      <svg viewBox="0 0 40 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M20 0 C34 120 6 220 20 340 C34 460 6 560 20 680 C34 800 6 900 20 1000"
          fill="none"
          stroke="color-mix(in srgb, var(--color-leaf) 22%, transparent)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={grow}
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
