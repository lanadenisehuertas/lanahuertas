import type { CSSProperties } from "react";
import { Sparkle4, Orb } from "./Botanicals";

type Chip = { label: string; value: string; style: CSSProperties };

/**
 * A live-site screenshot dressed as a device, with motion so it reads as a
 * working product rather than a picture:
 *
 *  browser — Aero title bar and URL pill; the screenshot pans slowly, a
 *            cursor glides in and clicks, and UI chips bob beside it.
 *  phone   — the screen scrolls the full app on a loop; hover pauses it.
 *
 * The whole device is a link to the live site and tilts with the pointer
 * (the same .tile behaviour as the work grid).
 */
export default function SiteMockup({
  kind,
  src,
  url,
  href,
  alt,
  chips = [],
}: {
  kind: "browser" | "phone";
  src: string;
  url: string;
  href?: string;
  alt: string;
  chips?: Chip[];
}) {
  const body =
    kind === "browser" ? (
      <span className="tile relative block overflow-hidden rounded-[6px] border border-ink bg-paper shadow-[6px_6px_0_var(--color-sky)]">
        <span className="titlebar type-pixel flex h-7 items-center gap-1.5 px-2.5 text-[10px]">
          <span className="closebox" />
          <span className="closebox" style={{ filter: "hue-rotate(60deg)" }} />
          <span className="closebox" style={{ filter: "hue-rotate(140deg)" }} />
          <span className="mx-auto truncate rounded-full border border-ink/25 bg-white/80 px-3 py-0.5 normal-case">
            {url}
          </span>
        </span>
        <span className="relative block aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" className="mock-pan absolute inset-0 h-full w-full object-cover" />
          {/* Fake cursor */}
          <svg aria-hidden viewBox="0 0 16 24" className="mock-cursor absolute h-6 w-4" shapeRendering="crispEdges">
            <path d="M1 1v17l4-4 3 7 3-1-3-7h6z" fill="#fff" stroke="#1b0730" strokeWidth="1.2" />
          </svg>
          <span aria-hidden className="mock-click absolute h-8 w-8 rounded-full border-2 border-lavender" />
        </span>
      </span>
    ) : (
      <span className="tile relative mx-auto block w-[62%] max-w-[260px] rounded-[26px] border border-ink bg-ink p-2 shadow-[6px_6px_0_var(--color-blush)]">
        <span className="absolute top-3.5 left-1/2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ink" />
        <span className="mock-screen relative block aspect-[9/17] overflow-hidden rounded-[19px] bg-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" className="mock-scroll absolute top-0 left-0 w-full" />
        </span>
      </span>
    );

  return (
    <div className="relative px-4 py-6 sm:px-8">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${url}`} className="group block">
          {body}
        </a>
      ) : (
        body
      )}

      {chips.map((c, i) => (
        <span
          key={c.label}
          aria-hidden
          className="float-badge glass type-pixel pointer-events-none absolute flex flex-col rounded-[4px] px-3 py-2 text-[10px] text-ink"
          style={{ ...c.style, animationDuration: `${6 + i * 1.7}s`, animationDelay: `${-i * 1.3}s` }}
        >
          <span className="text-ink/55">{c.label}</span>
          <span className="type-display text-2xl text-iris normal-case">{c.value}</span>
        </span>
      ))}

      <Sparkle4 className="spin-slow pointer-events-none absolute -top-1 right-2 h-7 w-7 text-sky" />
      <Orb className="float-badge pointer-events-none absolute bottom-2 left-1 h-6 w-6" />
    </div>
  );
}
