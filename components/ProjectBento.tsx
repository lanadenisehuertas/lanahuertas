"use client";

import type { CSSProperties } from "react";
import { Lotus, Sparkle4, Blossom, Bellflower } from "./Botanicals";
import { Cloud, Star5, PixelFlower, PixelArt } from "./Ethereal";
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

/** 720px-wide copy of a poster, made for the grid tiles (public/work/sm). */
export const small = (src: string) => src.replace("/work/", "/work/sm/");

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
        className="bento-info sheet-band relative flex min-h-[150px] flex-col overflow-hidden rounded-[4px] border border-ink text-ink"
      >
        <span className="titlebar type-pixel flex h-[22px] shrink-0 items-center gap-2 px-2 text-[9px]">
          <span aria-hidden className="closebox" />
          <span className="tb-label mx-auto truncate normal-case">
            {heading.toLowerCase().replace(/\s+/g, "_")}
          </span>
        </span>
        <div className="flex flex-1 flex-col justify-between p-3.5">
          <p className="type-pixel text-[10px] leading-relaxed text-ink/60">
            {range}
          </p>
          <div>
            <p className="type-display text-7xl tracking-[-0.04em] text-iris italic">
              {String(projects.length).padStart(2, "0")}
            </p>
            <p className="mt-2 line-clamp-4 hidden text-[12px] leading-snug text-ink/75 sm:block">
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
            aria-label={`Open ${p.title}${p.year ? `, ${p.year}` : ""}`}
            style={{ "--ar": ar, "--d": `${(i % 6) * 60}ms` } as CSSProperties}
            data-rv
            className="tile group relative flex flex-col overflow-hidden rounded-[4px] border border-ink bg-ink text-left"
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
                src={small(cover.src)}
                srcSet={`${small(cover.src)} 720w, ${cover.src} ${cover.w}w`}
                sizes="(min-width: 1024px) 34vw, (min-width: 640px) 45vw, 60vw"
                alt=""
                width={cover.w}
                height={cover.h}
                loading={i < 8 ? "eager" : "lazy"}
                decoding="async"
                className="tile-img absolute inset-0 h-full w-full object-cover"
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

              {/* Caption — fades in on hover/focus */}
              <span className="tile-cap absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-ink bg-paper/95 px-2.5 py-2 text-ink">
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
        <Cloud className="drift-x absolute -bottom-[18%] -left-[16%] w-[100%] opacity-90" />
        <div className="dither absolute inset-x-0 bottom-0 h-1/2 opacity-45" />
        <div className="band-grain absolute inset-0" />
        <Star5 className="twinkle absolute top-[30%] left-[18%] h-3 w-3 text-white" />
        <Star5 className="twinkle absolute top-[14%] left-[46%] h-2 w-2 text-white/90 [animation-delay:-1.4s]" />
        <Blossom className="spin-slow absolute top-[14%] right-[42%] h-7 w-7" />
        <PixelFlower className="absolute top-[12%] left-[30%] h-5 w-5" />
        <PixelArt name="sparkle" className="twinkle absolute top-[10%] left-[52%] w-8" />
        <PixelArt name="heart" className="absolute top-[34%] left-[18%] w-3" />
        <Bellflower className="sway absolute right-[30%] bottom-0 h-[58%] w-auto" deep />
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
