"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { videos } from "@/lib/brands";
import { toEmbed } from "@/lib/video";
import { small } from "@/lib/img";
import { pad } from "../showcase/tone";
import { Butterfly } from "../Ethereal";

const SEG = 6; // seconds each clip holds on the timeline

// motion is off for reduced motion, for lite machines, and when the visitor
// has paused the site's motion (the switch in the corner sets data-still)
const still = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  document.documentElement.hasAttribute("data-lite") ||
  document.documentElement.hasAttribute("data-still");

/**
 * Moving pictures, in the ethereal garden. The same reel as the dusk version
 * (copy on the left, the film in a big window, a little timeline under it
 * that walks through the edits on its own), redrawn in this site's language:
 * the glossy periwinkle title bars and pink bead of the work tiles, pearl
 * paper, plum ink, and one butterfly resting on the window. Motion answers the reel: the window leans a little
 * toward the pointer, each cut mists in, the playhead crawls.
 *
 * The reel moves on its own only where that is safe: "Pause reel" stops it at
 * any time; it waits while the pointer or keyboard focus is on the section,
 * so nobody is cut off mid-sentence; picking a clip yourself stops it; it
 * does not start on touch screens; and it is off while a video plays, for
 * reduced motion and when the site's motion is paused.
 */
export default function MovingPictures() {
  const root = useRef<HTMLElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const shot = useRef<HTMLImageElement>(null);
  const ph = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const wave = useRef<HTMLCanvasElement>(null);

  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  // whether the reel moves on by itself; the visitor's "Pause reel" switch
  const [auto, setAuto] = useState(true);
  const autoRef = useRef(true);
  const hold = useRef(false); // pointer or focus is on the section
  const T = useRef(0);
  const curRef = useRef(0);
  const playRef = useRef(false);
  useEffect(() => {
    playRef.current = playing;
  }, [playing]);
  useEffect(() => {
    autoRef.current = auto;
  }, [auto]);
  // touch screens have no hover to wait on, so the reel starts paused there
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- read once from the device */
    if (window.matchMedia("(hover: none)").matches) setAuto(false);
  }, []);

  const p = videos[cur];
  const src = p.videoUrl ? toEmbed(p.videoUrl) : null;
  const meta = [`${pad(cur + 1)} / ${pad(videos.length)}`, p.year, p.duration].filter(Boolean).join(" · ");

  // show clip i: the copy and the still change, and the still mists in
  const show = useCallback((i: number) => {
    curRef.current = i;
    setCur(i);
    setPlaying(false);
    const img = shot.current;
    if (img && !still()) {
      delete img.dataset.cut;
      void img.offsetWidth;
      img.dataset.cut = "";
    }
  }, []);

  useEffect(() => {
    const sec = root.current;
    if (!sec) return;
    const calm = () => still();
    const going = () => autoRef.current && !hold.current && !playRef.current && !calm();

    // the window leans a few degrees toward the pointer (mouse only)
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0,
      moved = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      moved = performance.now();
      if (vis && !raf) raf = requestAnimationFrame(tick);
      const b = sec.getBoundingClientRect();
      tx = ((e.clientX - b.left) / b.width) * 2 - 1;
      ty = ((e.clientY - b.top) / b.height) * 2 - 1;
    };
    const onLeave = () => {
      tx = ty = 0;
      hold.current = false;
    };
    sec.addEventListener("pointermove", onMove);
    sec.addEventListener("pointerleave", onLeave);

    // the timeline: a made-up waveform, the playhead and the timecode
    const amp = (u: number) => {
      const i = Math.min(videos.length - 1, Math.floor(u * videos.length)),
        q = u * 150;
      return Math.min(
        1,
        0.25 + 0.35 * Math.abs(Math.sin(q * 1.7 + i)) * (0.6 + 0.4 * Math.sin(q * 0.31 + i * 2)) + 0.25 * Math.abs(Math.sin(q * 5.3 + i * 7)),
      );
    };
    const total = SEG * videos.length;
    let trackW = 0,
      waveW = 0,
      waveH = 0,
      bar = -1;
    const sizes = new ResizeObserver(() => {
      trackW = ph.current?.parentElement?.clientWidth ?? 0;
      const cv = wave.current;
      if (cv) {
        waveW = cv.clientWidth;
        waveH = cv.clientHeight;
        cv.width = waveW * 2;
        cv.height = waveH * 2;
        bar = -1;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    });
    if (ph.current?.parentElement) sizes.observe(ph.current.parentElement);
    if (wave.current) sizes.observe(wave.current);

    let vis = false,
      raf = 0,
      wake = 0,
      drawn = 0,
      last = performance.now();
    // about 15 frames a second is plenty for a crawling playhead; full rate
    // only while the pointer is leaning the window
    const CALM = 66;
    const idle = (now: number) => now - moved > 800;
    const later = (ms: number) => {
      if (!vis || wake) return;
      wake = window.setTimeout(() => {
        wake = 0;
        if (vis && !raf) raf = requestAnimationFrame(tick);
      }, ms);
    };
    const tick = (now: number) => {
      raf = 0;
      if (idle(now) && now - drawn < CALM) {
        later(Math.max(8, CALM - (now - drawn)));
        return;
      }
      drawn = now;
      // capped so a background tab coming back does not skip clips, but wide
      // enough that the calm frame rate still keeps real time
      const dt = Math.max(0, Math.min(0.25, (now - last) / 1000));
      last = Math.max(last, now);
      if (going()) {
        T.current = (T.current + dt) % total;
        const i = Math.min(videos.length - 1, Math.max(0, Math.floor(T.current / SEG)));
        if (i !== curRef.current) show(i);
      }
      const u = T.current / total;
      if (ph.current) ph.current.style.transform = `translate3d(${(u * trackW).toFixed(1)}px,0,0)`;
      if (tc.current) {
        const s = Math.floor(T.current),
          fr = Math.floor((T.current % 1) * 24),
          t = `00:00:${pad(s)}:${pad(fr)}`;
        if (tc.current.textContent !== t) tc.current.textContent = t;
      }
      const cv = wave.current,
        at = Math.floor((u * waveW) / 3),
        wx = cv && waveW && at !== bar ? cv.getContext("2d") : null;
      if (wx) {
        bar = at;
        wx.setTransform(2, 0, 0, 2, 0, 0);
        wx.clearRect(0, 0, waveW, waveH);
        for (let px = 0; px < waveW; px += 3) {
          const a = amp(px / waveW) * (waveH / 2 - 1);
          wx.fillStyle = px / waveW < u ? "#b9379d" : "rgba(81,1,124,.22)";
          wx.fillRect(px, waveH / 2 - a, 2, a * 2);
        }
      }
      // while a video plays the window settles flat and holds still
      const flat = playRef.current || calm(),
        gx = flat ? 0 : tx,
        gy = flat ? 0 : ty;
      x += (gx - x) * Math.min(1, dt * 4);
      y += (gy - y) * Math.min(1, dt * 4);
      win.current?.style.setProperty("--ry", `${(x * 3).toFixed(2)}deg`);
      win.current?.style.setProperty("--rx", `${(-y * 2).toFixed(2)}deg`);
      if (!vis) return;
      // nothing moves: one more look in a while, in case motion is switched back on
      if (!going() && idle(now)) later(400);
      else if (idle(now)) later(CALM);
      else raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      vis = e.isIntersecting;
      last = performance.now();
      if (vis && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(sec);
    // wait for the reader: no advance while the pointer or focus is on the section
    const holdOn = () => (hold.current = true);
    const holdOff = () => (hold.current = false);
    sec.addEventListener("pointerenter", holdOn);
    sec.addEventListener("focusin", holdOn);
    sec.addEventListener("focusout", holdOff);
    return () => {
      io.disconnect();
      sizes.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(wake);
      sec.removeEventListener("pointermove", onMove);
      sec.removeEventListener("pointerleave", onLeave);
      sec.removeEventListener("pointerenter", holdOn);
      sec.removeEventListener("focusin", holdOn);
      sec.removeEventListener("focusout", holdOff);
    };
  }, [show]);

  const jump = (i: number) => {
    T.current = i * SEG + 0.01;
    show(i);
    setAuto(false);
  };

  const cover = p.images[0];

  return (
    <section ref={root} id="videos" aria-labelledby="videos-heading" className="mp page-x page-y relative">
      {/* a soft bloom of sky behind the window, and a few stars on the page */}
      <div aria-hidden className="mp-bloom" />

      <div className="relative z-[1]">
        <header className="sec-head">
          <h2 id="videos-heading" className="mp-title type-display">
            Moving <em>pictures</em>
          </h2>
          <div className="sec-tools">
            {/* announced only when the visitor changed the clip, not on every automatic cut */}
            <p className="mp-k" aria-live={auto ? "off" : "polite"}>
              Showing {meta}
            </p>
            <button type="button" className="mp-toggle" aria-pressed={!auto} onClick={() => setAuto((a) => !a)}>
              <span aria-hidden>{auto ? "❚❚" : "▶"}</span> {auto ? "Pause reel" : "Play reel"}
            </button>
          </div>
        </header>

        <div className="mp-grid">
          {/* the words for the clip on screen; they mist in on each cut */}
          <div key={p.id} className="mp-copy flex flex-col" aria-live={auto ? "off" : "polite"}>
            <h3 className="type-display text-[2.1rem] leading-[1.1] text-iris">{p.title}</h3>
            {p.role && <p className="type-display mt-1 text-xl text-[#962480] italic">{p.role}</p>}
            {p.description && <p className="mt-5 text-base leading-[1.65] text-ink">{p.description}</p>}
            {p.tools && p.tools.length > 0 && (
              <p className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[15px] text-ink">
                <span className="mp-k">Cut in</span>
                {p.tools.map((t) => (
                  <span key={t}>
                    <span aria-hidden className="text-[#b9379d]">✦</span> {t}
                  </span>
                ))}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-5 lg:mt-auto lg:pt-8">
              {src && (
                <button type="button" className="btn" onClick={() => setPlaying(true)} aria-pressed={playing}>
                  Play here <span aria-hidden>▶</span>
                </button>
              )}
              {p.videoUrl && (
                <a href={p.videoUrl} target="_blank" rel="noopener noreferrer" className="link">
                  Open in Drive <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </div>

          <div className="relative min-w-0">
            {/* the film, in a window like the work tiles */}
            <div ref={win} className="mp-win">
              <div className="titlebar type-pixel mp-bar">
                <span aria-hidden className="closebox" />
                <span className="tb-label mx-auto truncate normal-case">{p.id}.mov</span>
                <span className="tb-label shrink-0 tabular-nums normal-case">
                  {pad(cur + 1)} / {pad(videos.length)}
                </span>
              </div>
              <div className="mp-screen">
                {playing && src ? (
                  <iframe src={src} title={p.title} allow="autoplay; fullscreen" allowFullScreen />
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={shot}
                      src={cover.w > 720 ? small(cover.src) : cover.src}
                      srcSet={cover.w > 720 ? `${small(cover.src)} 720w, ${cover.src} ${cover.w}w` : undefined}
                      sizes="(min-width: 1024px) 56vw, 92vw"
                      alt=""
                      width={cover.w}
                      height={cover.h}
                      decoding="async"
                    />
                    {src && (
                      <button type="button" className="mp-play" onClick={() => setPlaying(true)} aria-label={`Play ${p.title}`}>
                        <svg viewBox="0 0 24 24" aria-hidden>
                          <path d="M8 5.5v13l10.5-6.5z" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* the garden round the window: decoration only */}
            <span aria-hidden className="mp-perch">
              <span className="flutter block">
                <Butterfly className="w-full rotate-[14deg]" />
              </span>
            </span>

            {/* the timeline, its own little window */}
            <div className="mp-tl" role="group" aria-label="Timeline: pick a video">
              <div className="titlebar type-pixel mp-bar">
                <span aria-hidden className="closebox" />
                <span className="tb-label mx-auto truncate normal-case">sequence 01</span>
                <span className="tb-label shrink-0 tabular-nums normal-case" aria-hidden>
                  <span ref={tc}>00:00:00:00</span>
                </span>
              </div>
              <div className="mp-tracks">
                <div className="mp-row">
                  <span className="mp-lab" aria-hidden>
                    V1
                  </span>
                  {videos.map((vd, i) => (
                    <button
                      key={vd.id}
                      type="button"
                      className="mp-clip"
                      aria-current={i === cur}
                      aria-label={vd.title}
                      title={vd.title}
                      onClick={() => jump(i)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={vd.images[0].w > 720 ? small(vd.images[0].src) : vd.images[0].src} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
                <div className="mp-row">
                  <span className="mp-lab" aria-hidden>
                    A1
                  </span>
                  <canvas ref={wave} aria-hidden className="mp-wave" />
                </div>
                <div aria-hidden className="mp-phlane">
                  <div ref={ph} className="mp-ph" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
