"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";
import { toEmbed } from "@/lib/video";
import Pic from "./Pic";
import { useSlide } from "./Spread";
import SpreadCopy from "./SpreadCopy";
import { pad } from "./tone";

/**
 * One video, one screen, on the site's own sky: the video is the big frame —
 * its poster and a play button; the Drive player loads only when asked for,
 * and unloads when the slide leaves the screen.
 */
export default function VideoSlide({ p, n, total }: { p: Project; n: number; total: number }) {
  const { active, near, heading } = useSlide();
  const [on, setOn] = useState(false);
  const src = p.videoUrl ? toEmbed(p.videoUrl) : null;
  const playing = on && active && !!src;
  const meta = [`${pad(n)} / ${pad(total)}`, p.year, p.duration].filter(Boolean).join(" · ");

  return (
    <article className="sp-slide sp-slide--sky" aria-label={p.title}>
      <SpreadCopy
        meta={meta}
        title={p.title}
        heading={heading}
        tagline={p.role}
        body={p.description ?? ""}
        parts={p.tools}
        partsLabel="Cut in"
        actions={
          <>
            {src && (
              <button type="button" className="btn" onClick={() => setOn(true)} aria-pressed={playing}>
                Play here <span aria-hidden>▶</span>
              </button>
            )}
            {p.videoUrl && (
              <a href={p.videoUrl} target="_blank" rel="noopener noreferrer" className="link sp-link">
                Open in Drive <span aria-hidden>↗</span>
              </a>
            )}
          </>
        }
      />

      <div className="sp-stage sp-stage--frame">
        <div className="sp-video">
          {playing ? (
            <iframe src={src} title={p.title} allow="autoplay; fullscreen" allowFullScreen />
          ) : (
            <button type="button" className="sp-video-poster" onClick={() => setOn(true)} disabled={!src} aria-label={`Play ${p.title}`}>
              <Pic img={p.images[0]} eager={near} sizes="(min-width: 768px) 62vw, 92vw" />
              <span aria-hidden className="sp-play" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
