"use client";

import type { CSSProperties } from "react";
import type { Project } from "@/lib/content";

/** Desktop-window file name for the title bar — the tool decides the extension. */
function fileName(p: Project) {
  const tool = p.tools?.[0] ?? "";
  const ext = p.isVideo
    ? "mov"
    : tool.includes("Illustrator")
      ? "ai"
      : tool.includes("Photoshop")
        ? "psd"
        : "png";
  return `${p.id.replace(/-/g, "_")}.${ext}`;
}

/**
 * Justified gallery. Each tile is sized by its cover's aspect ratio, so every
 * piece shows whole — no cropping — and each full row shares one height and
 * runs edge to edge (see `.justified` in globals.css). Order is the order in
 * content.ts, strongest work first.
 *
 * A folder-info tile leads the grid, set to a near-square ratio so it sits in
 * the first row like any other window.
 */
export default function ProjectBento({
  projects,
  heading,
  blurb,
  onOpen,
}: {
  projects: Project[];
  heading: string;
  blurb: string;
  onOpen: (p: Project) => void;
}) {
  const years = projects.map((p) => p.year).filter(Boolean).sort() as string[];
  const range =
    years.length > 0 ? `${years[0].slice(0, 4)}–${years[years.length - 1].slice(-4)}` : "";

  return (
    <div className="justified">
      {/* Folder info */}
      <div
        data-rv
        style={{ "--ar": 0.82 } as CSSProperties}
        className="flex min-h-[150px] flex-col overflow-hidden rounded-[3px] border border-ink bg-ink text-maize"
      >
        <span className="titlebar type-pixel flex h-[22px] shrink-0 items-center gap-2 px-2 text-[9px]">
          <span aria-hidden className="closebox" />
          <span className="tb-label mx-auto truncate normal-case">
            {heading.toLowerCase().replace(/\s+/g, "_")}
          </span>
        </span>
        <div className="flex flex-1 flex-col justify-between p-3.5">
          <p className="type-pixel text-[10px] leading-relaxed text-maize/60">
            {projects.length} items
            {range && <><br />{range}</>}
          </p>
          <div>
            <p className="type-display text-6xl tabular-nums text-fawn">
              {String(projects.length).padStart(2, "0")}
            </p>
            <p className="mt-2 line-clamp-4 hidden text-[12px] leading-snug text-maize/70 sm:block">
              {blurb}
            </p>
          </div>
        </div>
      </div>

      {projects.map((p, i) => {
        const cover = p.images[0];
        const ar = cover.w / cover.h;
        const extra = p.images.length - 1;
        return (
          <button
            key={p.id}
            type="button"
            data-rv
            onClick={() => onOpen(p)}
            aria-label={`Open ${p.title}${p.year ? `, ${p.year}` : ""}`}
            style={{ "--ar": ar, "--d": `${(i % 6) * 60}ms` } as CSSProperties}
            className="group relative flex flex-col overflow-hidden rounded-[3px] border border-ink bg-ink text-left outline-offset-2 transition-[outline-color] duration-150 hover:outline-2 hover:outline-lavender"
          >
            {/* Window chrome */}
            <span className="titlebar type-pixel flex h-[22px] shrink-0 items-center gap-2 px-2 text-[9px]">
              <span aria-hidden className="closebox" />
              <span className="tb-label mx-auto truncate normal-case">{fileName(p)}</span>
              <span className="tb-label hidden shrink-0 tabular-nums sm:inline">
                {p.isVideo ? p.duration : extra > 0 ? `+${extra}` : p.year}
              </span>
            </span>

            {/* Exact-ratio box: the cover always shows whole */}
            <span className="relative block w-full" style={{ paddingBottom: `${100 / ar}%` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover.src}
                alt=""
                width={cover.w}
                height={cover.h}
                loading={i < 8 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {p.isVideo && (
                <span
                  aria-hidden
                  className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3px] border border-ink bg-maize pl-0.5 transition-colors duration-150 group-hover:bg-fawn"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-ink">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              )}

              {/* Caption bar — slides up on hover/focus */}
              <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-3 border-t border-ink bg-maize px-2.5 py-2 text-ink transition-transform duration-200 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
                <span className="truncate text-[13px] leading-tight font-semibold tracking-[-0.01em]">
                  {p.title}
                </span>
                <span className="type-pixel shrink-0 text-[10px]">Open ↗</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
