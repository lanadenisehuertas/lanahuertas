"use client";

import type { CSSProperties, PointerEvent } from "react";
import { Lotus, Sparkle4 } from "./Botanicals";
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

/** Tilt toward the pointer and steer the gloss band. Mouse only. */
function tilt(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--ry", `${((x - 0.5) * 9).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${((0.5 - y) * 9).toFixed(2)}deg`);
  el.style.setProperty("--mx", (x * 140 - 20).toFixed(1));
}

function untilt(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
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
        className="relative flex min-h-[150px] flex-col overflow-hidden rounded-[4px] border border-ink bg-iris text-paper"
      >
        <span className="titlebar type-pixel flex h-[22px] shrink-0 items-center gap-2 px-2 text-[9px]">
          <span aria-hidden className="closebox" />
          <span className="tb-label mx-auto truncate normal-case">
            {heading.toLowerCase().replace(/\s+/g, "_")}
          </span>
        </span>
        <div className="flex flex-1 flex-col justify-between p-3.5">
          <p className="type-pixel text-[10px] leading-relaxed text-paper/70">
            {range}
          </p>
          <div>
            <p className="type-display text-7xl tracking-[-0.04em] text-blush italic">
              {String(projects.length).padStart(2, "0")}
            </p>
            <p className="mt-2 line-clamp-4 hidden text-[12px] leading-snug text-paper/80 sm:block">
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
            onClick={() => onOpen(p)}
            onPointerMove={tilt}
            onPointerLeave={untilt}
            aria-label={`Open ${p.title}${p.year ? `, ${p.year}` : ""}`}
            style={{ "--ar": ar, "--d": `${(i % 6) * 60}ms` } as CSSProperties}
            className="tile sl-rise group relative flex flex-col overflow-hidden rounded-[4px] border border-ink bg-ink text-left"
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
              <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-3 border-t border-ink bg-paper px-2.5 py-2 text-ink transition-transform duration-200 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
                <span className="truncate text-[13px] leading-tight font-semibold tracking-[-0.01em]">
                  {p.title}
                </span>
                <span className="type-pixel shrink-0 text-[10px]">Open ↗</span>
              </span>
            </span>
          </button>
        );
      })}

      {/*
       * End tile. It grows to soak up whatever the last row leaves, so the
       * gallery always closes square — no gap at the bottom right. Hover it
       * and the lotus opens.
       */}
      <div
        aria-hidden
        className="bento-end relative flex min-h-[120px] items-end justify-between overflow-hidden rounded-[4px] border border-ink/25 p-3"
        style={{
          background: "linear-gradient(160deg, #a9b6f0 0%, #f2b8cf 60%, #f6d3c3 100%)",
        }}
      >
        <div className="band-grain absolute inset-0" />
        <p className="type-pixel relative text-[10px] leading-relaxed text-ink/70">
          end of folder
          <br />
          more on request ✿
        </p>
        <Sparkle4 className="spin-slow absolute top-3 right-3 h-5 w-5 text-white" />
        <Lotus className="sway relative -mb-2 h-[85%] max-h-40 w-auto" deep />
      </div>
    </div>
  );
}
