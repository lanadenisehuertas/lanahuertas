"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";
import { toEmbed } from "../ProjectModal";
import Pic from "./Pic";

/** Poster first; the Drive player loads only when asked for. */
export default function VideoEmbed({ p }: { p: Project }) {
  const [on, setOn] = useState(false);
  const src = p.videoUrl ? toEmbed(p.videoUrl) : null;
  return (
    <div className="relative overflow-hidden rounded-[14px] border border-ink/25 bg-ink" style={{ aspectRatio: "16 / 9" }}>
      {on && src ? (
        <iframe src={src} title={p.title} allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full" />
      ) : (
        <button type="button" onClick={() => setOn(true)} disabled={!src} aria-label={`Play ${p.title}`} className="group absolute inset-0 cursor-pointer">
          <Pic img={p.images[0]} sizes="(min-width: 1024px) 60vw, 92vw" className="h-full w-full object-cover" />
          <span aria-hidden className="gel !absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center !p-0 after:hidden">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
