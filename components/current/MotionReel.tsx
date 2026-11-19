"use client";

import { useRef, useState, type CSSProperties } from "react";
import { videos } from "@/lib/brands";
import { toEmbed } from "@/lib/video";
import { small } from "@/lib/img";
import SkyNotes from "../dusk/SkyNotes";
import { Heading } from "./Ornaments";

/**
 * Moving pictures, as a viewing room: one wide screen on the dark ground, the
 * film's title and what Lana did on it beside the screen, and a rail of every
 * edit underneath. Nothing plays on its own. "Load the player" swaps the still
 * for the Google Drive player, which starts (and makes sound) only when you
 * press play inside it; choosing another film or "Close the player" unloads it.
 */
export default function MotionReel() {
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const shot = useRef<HTMLImageElement>(null);
  const rail = useRef<HTMLOListElement>(null);

  const p = videos[cur];
  const src = p.videoUrl ? toEmbed(p.videoUrl) : null;
  const meta = [`${cur + 1} of ${videos.length}`, p.year, p.duration].filter(Boolean).join(", ");
  const img = p.images[0];

  const show = (i: number) => {
    const next = (i + videos.length) % videos.length;
    setCur(next);
    setPlaying(false);
    // the still cuts in, like a new shot
    const el = shot.current;
    if (el) {
      delete el.dataset.cut;
      void el.offsetWidth;
      el.dataset.cut = "";
    }
    const btn = rail.current?.children[next] as HTMLElement | undefined;
    const box = rail.current;
    if (btn && box) {
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      box.scrollTo({ left: btn.offsetLeft - box.clientWidth / 2 + btn.offsetWidth / 2, behavior: still ? "auto" : "smooth" });
    }
  };

  return (
    <section id="videos" data-scene="videos" aria-labelledby="videos-heading" className="sec reel">
      <SkyNotes skip="[class*=reel-]" />
      <header className="sec-head">
        <div data-rv>
          <p className="t-meta">{videos.length} edits, cut in Premiere Pro and After Effects</p>
          <Heading id="videos-heading" lead="Moving" accent="pictures" n="03" script="motion" />
        </div>
        <div className="sec-note" data-rv style={{ "--d": "90ms" } as CSSProperties}>
          <p className="t-lede">Documentary essays, instructional series, trailers and music videos, cut and finished by me.</p>
          <a href="/videos" className="link">
            Every edit, one by one
          </a>
        </div>
      </header>

      <div className="reel-main">
        <div className="reel-screen">
          {playing && src ? (
            <iframe src={src} title={p.title} allow="fullscreen" allowFullScreen />
          ) : (
            <button type="button" className="reel-poster" onClick={() => setPlaying(true)} disabled={!src} aria-label={`Load the player for ${p.title}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={shot}
                src={img.w > 720 ? small(img.src) : img.src}
                srcSet={img.w > 720 ? `${small(img.src)} 720w, ${img.src} ${img.w}w` : undefined}
                sizes="(min-width: 1000px) 60vw, 92vw"
                width={img.w}
                height={img.h}
                alt=""
                loading="lazy"
                decoding="async"
              />
              {src && <span aria-hidden className="reel-play" />}
            </button>
          )}
        </div>

        <div className="reel-info backing" aria-live="polite">
          <p className="t-meta">{meta}</p>
          <h3 className="reel-title">{p.title}</h3>
          {p.role && <p className="reel-role">{p.role}</p>}
          {p.description && <p className="reel-desc">{p.description}</p>}
          {p.tools && p.tools.length > 0 && (
            <p className="reel-tools">
              <span>Cut in</span>
              {p.tools.join(", ")}
            </p>
          )}
          <div className="reel-acts">
            {src &&
              (playing ? (
                <button type="button" className="btn-ghost" onClick={() => setPlaying(false)}>
                  Close the player
                </button>
              ) : (
                <button type="button" className="btn" onClick={() => setPlaying(true)}>
                  Load the player <span aria-hidden>▶</span>
                </button>
              ))}
            {p.videoUrl && (
              <a href={p.videoUrl} target="_blank" rel="noopener noreferrer" className="link">
                Open in Drive <span aria-hidden>↗</span>
              </a>
            )}
          </div>
          <p className="reel-note">
            {playing ? "Press play inside the player. Sound starts only when you do." : "The video plays in the Google Drive player and never starts on its own."}
          </p>
        </div>
      </div>

      <div className="reel-pick">
        <ol ref={rail} className="reel-rail" aria-label="Pick a video">
          {videos.map((vd, i) => (
            <li key={vd.id}>
              <button type="button" className="reel-clip" aria-current={i === cur ? "true" : undefined} onClick={() => show(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vd.images[0].w > 720 ? small(vd.images[0].src) : vd.images[0].src}
                  width={vd.images[0].w}
                  height={vd.images[0].h}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <span>{vd.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="reel-steps">
          <button type="button" className="reel-step" aria-label="Previous video" onClick={() => show(cur - 1)}>
            <span aria-hidden>←</span>
          </button>
          <button type="button" className="reel-step" aria-label="Next video" onClick={() => show(cur + 1)}>
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
