"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { experience } from "@/lib/content";
import { Bellflower, Blossom, Lotus, Leaf, Sparkle4 } from "./Botanicals";

const FLOWERS: ((p: { className: string }) => ReactNode)[] = [
  ({ className }) => <Blossom className={className} />,
  ({ className }) => <Bellflower className={className} deep />,
  ({ className }) => <Lotus className={className} />,
  ({ className }) => <Blossom className={className} deep />,
  ({ className }) => <Bellflower className={className} />,
];

/** A ✦ list, kept to the first two points; the rest wait behind "more". */
export function ShortPoints({ items }: { items: readonly string[] }) {
  const shown = items.slice(0, 2);
  const rest = items.slice(2);
  const li = (it: string) => (
    <li key={it} className="flex gap-2.5">
      <Sparkle4 className="mt-[0.45em] h-2.5 w-2.5 shrink-0 text-eminence" />
      <span>{it}</span>
    </li>
  );
  return (
    <div className="mt-3 text-base leading-[1.55] text-ink/85">
      <ul className="space-y-1.5">{shown.map(li)}</ul>
      {rest.length > 0 && (
        <details className="bt-more mt-1.5">
          <summary className="type-pixel inline-flex min-h-[44px] cursor-pointer items-center text-[13px] text-eminence">
            <span className="more-closed">+ {rest.length} more</span>
            <span className="more-open">show less</span>
          </summary>
          <ul className="space-y-1.5">{rest.map(li)}</ul>
        </details>
      )}
    </div>
  );
}

/**
 * Experience as one flowing stem. Each role is a flower on it that blooms as
 * it scrolls into view, with a pearl card beside it; the current role (no end
 * date) is the biggest bloom and breathes gently.
 */
export default function BloomTimeline() {
  const listRef = useRef<HTMLOListElement>(null);

  // Layout effect: arm the reveal before the first paint, so nothing flashes.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const nodes = [...list.querySelectorAll<HTMLElement>(".bt-node")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return; // shown as is
    list.dataset.armed = "";
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          if (el === list) el.dataset.grown = "";
          else el.dataset.bloomed = "";
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.01 },
    );
    io.observe(list);
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  let other = 0;
  return (
    <ol ref={listRef} className="bt relative mt-8">
      {/* The stem: one wavy path, stretched to the list's height. */}
      <svg aria-hidden className="bt-stem" viewBox="0 0 40 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bt-stem-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7cc9a2" />
            <stop offset="0.5" stopColor="#4f9a78" />
            <stop offset="1" stopColor="#7cc9a2" />
          </linearGradient>
        </defs>
        <path
          className="bt-stem-path"
          pathLength={1}
          d="M20 0 C30 80 10 160 20 240 S30 400 20 480 S10 640 20 720 S30 880 20 1000"
          fill="none"
          stroke="url(#bt-stem-g)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {experience.map((e, i) => {
        const now = /present/i.test(e.period);
        const Flower = now ? null : FLOWERS[other++ % FLOWERS.length];
        return (
          <li key={`${e.role}-${e.org}`} className={`bt-node ${now ? "bt-now" : ""}`} style={{ "--i": i } as CSSProperties}>
            <div aria-hidden className="bt-bud">
              {now && <span className="bt-glow" />}
              <span className="bt-leaf">
                <Leaf className="w-full" />
              </span>
              <span className="bt-flower">
                {now ? <Lotus className="bt-flower-art w-full" deep /> : Flower?.({ className: "bt-flower-art w-full" })}
              </span>
            </div>

            <article className="pearl-card bt-card">
              <p className="type-pixel flex flex-wrap items-center gap-x-2 text-[13px] leading-snug text-ink/75">
                <span>{e.period}</span>
                <span aria-hidden>·</span>
                <span>{e.place}</span>
                {now && <span className="bt-badge">✦ now</span>}
              </p>
              <h4 className="type-display mt-2 text-[1.45rem] leading-[1.1] text-iris">{e.role}</h4>
              <p className="type-display mt-1 text-[17px] leading-snug text-eminence italic">{e.org}</p>
              <ShortPoints items={e.points} />
            </article>
          </li>
        );
      })}
    </ol>
  );
}
