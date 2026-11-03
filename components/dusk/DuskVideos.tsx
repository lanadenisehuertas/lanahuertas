"use client";

import SkyNotes from "./SkyNotes";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { videos } from "@/lib/brands";
import { toEmbed } from "@/lib/video";
import { small } from "@/lib/img";
import { streams } from "@/lib/dusk/streams";
import {
  ambient,
  calm,
  local,
  reducedMotion,
  whileVisible,
} from "@/lib/dusk/fx";
import { chime, scratch, tone } from "@/lib/dusk/sound";
import { PeanutPerch } from "./Peanut";
import { Art, Blob, GStar, ORing, Planet, Stars } from "./Decor";
import { pad } from "../showcase/tone";
import Words from "@/components/Words";

const v = (o: Record<string, string | number>) => o as CSSProperties;
const SEG = 6; // seconds per clip on the timeline

/* The earbuds' gold rings and notes, as their own layers (source pixels of earbuds-bare.webp). */
const EBW = 719,
  EBH = 1330;
const RINGS: [number, number, number, number, number, string][] = [
  [203.4, 803.7, 207, 72.7, 31.9, ""],
  [543.7, 1168.6, 195.1, 69.8, 31.5, " w2"],
];
const ENOTES: [number, number, number][] = [
  [22, 515, 90],
  [0, 876, 81],
  [640, 906, 73],
  [337, 1243, 79],
];
const HOLES: [number, number][] = [
  [128, 812],
  [612, 1188],
];

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

/**
 * One half of the ring layer: the back half sits behind the buds, the front
 * half over them. Each ring is a plain element turned to its tilt and
 * clipped to its half, and everything that moves in it (the wobble, the
 * sparkle riding the ring, the sound pulses) is a transform on an element of
 * its own, so the compositor runs it. Animated SVG shapes inside one SVG kept
 * the main thread repainting the page every frame while the earbuds were on
 * screen. The sparkle's path round each ring is in dusk.css (dk-ebride0/1).
 */
function RingHalf({ half }: { half: "b" | "f" }) {
  return (
    <div aria-hidden className={`r${half}`}>
      {RINGS.map(([cx, cy, rx, ry, rot, w], i) => {
        const bw = 2 * rx + 80,
          bh = 2 * ry + 120;
        return (
          <div
            key={i}
            className={`eb-ring eb-${half}`}
            style={{ left: pct(cx - bw / 2, EBW), top: pct(cy - bh / 2, EBH), width: pct(bw, EBW), height: pct(bh, EBH), transform: `rotate(${rot}deg)` }}
          >
            <div className={`wob${w}`}>
              <svg viewBox={`${-bw / 2} ${-bh / 2} ${bw} ${bh}`}>
                <ellipse rx={rx} ry={ry} fill="none" stroke="#c98f2c" strokeWidth="13" opacity=".55" />
                <ellipse rx={rx} ry={ry} fill="none" stroke="#e8b84b" strokeWidth="9" />
                <ellipse rx={rx} ry={ry} fill="none" stroke="#fff4c8" strokeWidth="2.6" strokeDasharray="3 22" strokeLinecap="round" />
              </svg>
              <span className={`eb-orbit eb-orbit${i}`} style={{ animationDuration: `${4.6 + i}s` }}>
                <svg viewBox="-16 -16 32 32" style={{ width: pct(32, bw) }}>
                  <path d="M0 -16L3.5 -3.5L16 0L3.5 3.5L0 16L-3.5 3.5L-16 0L-3.5 -3.5Z" fill="#fffaf0" />
                </svg>
              </span>
            </div>
          </div>
        );
      })}
      {half === "f" &&
        HOLES.map(([x, y]) =>
          [0, 0.8, 1.6].map((dl) => (
            <svg
              key={`${x}${dl}`}
              className="pulse"
              viewBox="-36 -46 72 92"
              style={{ left: pct(x - 36, EBW), top: pct(y - 46, EBH), width: pct(72, EBW), height: pct(92, EBH), animationDelay: `${dl}s` }}
            >
              <ellipse rx="34" ry="44" fill="none" stroke="#fdf3e1" strokeWidth="3" />
            </svg>
          )),
        )}
    </div>
  );
}

/**
 * Moving pictures, at dusk. The copy for the clip on screen sits on the left;
 * the video is the big framed screen (poster + play; the Drive player loads
 * only when asked). Under it, a little Premiere: V1 clips, an A1 waveform, a
 * playhead and a running timecode that moves through the edits on its own
 * (paused while a video plays, off for reduced motion); click a clip to jump.
 * Around it: the earbuds hang with their gold rings orbiting through the
 * buds, notes bob and drift out, sound pulses ring from the buds, the level
 * meters follow the waveform, and the record spins (click it to scratch).
 */
export default function DuskVideos() {
  const root = useRef<HTMLElement>(null);
  const streamCv = useRef<HTMLCanvasElement>(null);
  const ebuds = useRef<HTMLButtonElement>(null);
  const vinyl = useRef<HTMLImageElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const ph = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const wave = useRef<HTMLCanvasElement>(null);
  const m1 = useRef<HTMLSpanElement>(null);
  const m2 = useRef<HTMLSpanElement>(null);
  const shot = useRef<HTMLImageElement>(null);

  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const T = useRef(0);
  const curRef = useRef(0);
  const playRef = useRef(false);
  useEffect(() => {
    playRef.current = playing;
  }, [playing]);

  /*
   * The meters beside the screen follow the clip's own sound. The player is a
   * Drive embed, so the page cannot hear it: each clip's loudness was measured
   * ahead of time (public/audio/video-levels.json, 10 steps a second) and is
   * read from the moment you click into the player to start it. It cannot see
   * a pause or a seek inside the embed, so it is close, not exact.
   */
  const levels = useRef<Record<string, { fps: number; lv: number[] }> | null>(null);
  const startAt = useRef(0);
  useEffect(() => {
    startAt.current = 0;
    if (!playing) return;
    if (!levels.current)
      fetch("/audio/video-levels.json")
        .then((r) => r.json())
        .then((j) => (levels.current = j))
        .catch(() => {});
    // clicking into the iframe takes focus from the page: that click is "play"
    const onBlur = () =>
      window.setTimeout(() => {
        if (document.activeElement?.tagName === "IFRAME" && !startAt.current) startAt.current = performance.now();
      }, 0);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [playing, cur]);

  const p = videos[cur];
  const src = p.videoUrl ? toEmbed(p.videoUrl) : null;
  const meta = [`${pad(cur + 1)} / ${pad(videos.length)}`, p.year, p.duration]
    .filter(Boolean)
    .join(" · ");

  const show = useCallback((i: number) => {
    curRef.current = i;
    setCur(i);
    setPlaying(false);
    const img = shot.current;
    if (img && !reducedMotion()) {
      delete img.dataset.cut;
      void img.offsetWidth;
      img.dataset.cut = "";
    }
  }, []);

  useEffect(() => {
    const sec = root.current;
    if (!sec) return;
    const still = calm();
    const offs: (() => void)[] = [];
    if (streamCv.current)
      offs.push(
        streams(
          streamCv.current,
          [
            // the streams pour out of the earbuds and run down behind the screen, clear of the words
            {
              from: [0.88, 0.24],
              ctrl: [0.72, 0.6],
              to: [0.42, 1.06],
              amp: 0.015,
              w: 0.03,
              twist: 1.2,
              colors: ["#e9a9c6", "#f7dcc4", "#c3b0f0"],
              p1: 2400 * 4,
              p2: 3800 * 4,
            },
            {
              from: [0.9, 0.3],
              ctrl: [0.98, 0.72],
              to: [0.66, 1.06],
              amp: 0.015,
              w: 0.026,
              twist: 1.1,
              colors: ["#b98cff", "#ff9ec4", "#ffc58f"],
              p1: 2900 * 4,
              p2: 3300 * 4,
              offset: 1200,
            },
            {
              from: [0.86, 0.22],
              ctrl: [0.62, 0.42],
              to: [0.3, 1.06],
              amp: 0.02,
              w: 0.006,
              twist: 0.6,
              colors: ["#fff1d6", "#ff9ec4"],
            },
            {
              from: [0.9, 0.28],
              ctrl: [1.0, 0.1],
              to: [1.06, 0.02],
              amp: 0.02,
              w: 0.007,
              twist: 0.6,
              colors: ["#b9a2ec", "#f7dcc4"],
            },
          ],
          { still },
        ),
      );
    offs.push(
      ambient(sec, {
        // kept light: the film and its timeline are the subject here
        petals: 3,
        motes: 6,
        shooting: 6500,
        confetti: [
          [72, 12],
          [3, 46],
          [30, 92],
        ],
        textures: [
          [
            "meshStar",
            [66, "#fff"],
            "left:56%;top:2%;width:132px;--t:7s",
            "spark",
          ],
          [
            "halftoneFade",
            [
              420,
              300,
              { color: "#c9b8ff", dir: "tl", shape: "square", step: 11 },
            ],
            "left:0;top:0;width:420px;opacity:.45",
            "",
          ],
          [
            "dotStar",
            [22, "#fdf3e1"],
            "left:48%;top:24%;width:44px;opacity:.8",
            "twk",
          ],
          [
            "dotDiamond",
            [30, "#ffcfe0"],
            "right:28%;top:6%;width:64px;opacity:.6",
            "twk",
          ],
        ],
      }),
    );

    // notes drift out of the buds towards the video
    const flyNote = (fast: boolean) => {
      const b = ebuds.current;
      if (!b) return;
      const r = b.getBoundingClientRect(),
        [hx, hy] = HOLES[Math.random() < 0.5 ? 0 : 1],
        [x, y] = local(
          sec,
          r.left + (r.width * hx) / EBW,
          r.top + (r.height * hy) / EBH,
        ),
        n = document.createElement("img");
      n.className = "dk-flynote";
      n.alt = "";
      n.src = `/art/garden/note-${(Math.random() * 4) | 0}.webp`;
      n.style.width = `${22 + Math.random() * 16}px`;
      n.style.left = `${x - 14}px`;
      n.style.top = `${y - 20}px`;
      n.style.setProperty(
        "--fx",
        `${-(40 + Math.random() * (fast ? 220 : 120))}px`,
      );
      n.style.setProperty("--fy", `${-(60 + Math.random() * 110)}px`);
      n.style.setProperty("--fr", `${(Math.random() - 0.5) * 60}deg`);
      sec.appendChild(n);
      setTimeout(() => n.remove(), 3500);
    };
    if (!still) offs.push(whileVisible(sec, 1300, () => flyNote(false)));
    const eb = ebuds.current;
    const onBuds = () => {
      [523, 659, 784, 659].forEach((f, k) =>
        tone(f, { type: "sine", vol: 0.08, dur: 0.55, at: k * 0.18 }),
      );
      if (!reducedMotion())
        for (let k = 0; k < 7; k++) setTimeout(() => flyNote(true), k * 90);
    };
    eb?.addEventListener("click", onBuds);
    offs.push(() => eb?.removeEventListener("click", onBuds));

    // the frame leans with the cursor
    let vis = false,
      raf = 0,
      tx = 0,
      ty = 0,
      x = 0,
      y = 0,
      l1 = 0,
      l2 = 0,
      last = performance.now(),
      moved = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      moved = performance.now();
      // out of the calm rate at once, not at the next calm frame
      if (vis && !raf) raf = requestAnimationFrame(tick);
      const b = sec.getBoundingClientRect();
      tx = ((e.clientX - b.left) / b.width) * 2 - 1;
      ty = ((e.clientY - b.top) / b.height) * 2 - 1;
    };
    sec.addEventListener("pointermove", onMove);
    sec.addEventListener("pointerleave", () => (tx = ty = 0));

    // the timeline: playhead, timecode, waveform, meters, auto-advance
    const amp = (u: number) => {
      const i = Math.min(videos.length - 1, Math.floor(u * videos.length)),
        q = u * 150;
      return Math.min(
        1,
        0.25 +
          0.35 *
            Math.abs(Math.sin(q * 1.7 + i)) *
            (0.6 + 0.4 * Math.sin(q * 0.31 + i * 2)) +
          0.25 * Math.abs(Math.sin(q * 5.3 + i * 7)),
      );
    };
    const total = SEG * videos.length;
    // Sizes come from a ResizeObserver, so a frame never has to ask for
    // layout; the playhead moves by transform, which needs no layout either.
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
      // the first sizes arrive after the first frame: draw again with them
      // (in the calm modes there is no running loop to pick them up)
      if (!raf && (vis || still)) raf = requestAnimationFrame(tick);
    });
    if (ph.current?.parentElement) sizes.observe(ph.current.parentElement);
    if (wave.current) sizes.observe(wave.current);
    // last value written for each style, so unchanged ones are skipped
    const put = new Map<string, string>();
    const set = (el: HTMLElement | null, prop: string, v: string) => {
      if (!el || put.get(prop) === v) return;
      put.set(prop, v);
      if (prop.startsWith("--")) el.style.setProperty(prop.split("@")[0], v);
      else el.style.setProperty(prop, v);
    };
    let drawn = 0,
      wake = 0;
    // About 15 frames a second is plenty for a playhead crawling a few pixels
    // a second and for meters easing; full rate only while the cursor tilts
    // the frame or a video plays. Between calm frames the loop waits on a
    // timer: a frame requested only to be skipped still makes the browser
    // run a whole main-thread frame, restyling every CSS animation with it.
    const CALM = 66;
    const idle = (now: number) => !still && !playRef.current && now - moved > 800;
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
      // a frame's timestamp can predate the moment `last` was taken: never step backwards
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = Math.max(last, now);
      if (!still && !playRef.current) {
        T.current = (T.current + dt) % total;
        const i = Math.min(
          videos.length - 1,
          Math.max(0, Math.floor(T.current / SEG)),
        );
        if (i !== curRef.current) show(i);
      }
      const u = T.current / total;
      set(ph.current, "transform", `translate3d(${(u * trackW).toFixed(1)}px,0,0)`);
      if (tc.current) {
        const s = Math.floor(T.current),
          fr = Math.floor((T.current % 1) * 24);
        const t = `00:00:${pad(s)}:${pad(fr)}`;
        // only when it changes (24 times a second), not every frame
        if (tc.current.textContent !== t) tc.current.textContent = t;
      }
      // the waveform only changes where the playhead crosses a bar: redraw then
      const cv = wave.current,
        W = waveW,
        H = waveH,
        at = Math.floor((u * W) / 3),
        wx = cv && W && at !== bar ? cv.getContext("2d") : null;
      if (wx) {
        bar = at;
        wx.setTransform(2, 0, 0, 2, 0, 0);
        wx.clearRect(0, 0, W, H);
        for (let px = 0; px < W; px += 3) {
          const a = amp(px / W) * (H / 2 - 1);
          wx.fillStyle = px / W < u ? "#ff9ec4" : "rgba(253,243,225,.55)";
          wx.fillRect(px, H / 2 - a, 2, a * 2);
        }
      }
      // meters ease towards their level instead of flickering frame to frame
      let lv = still ? 0.55 : amp(u),
        rate = 6;
      if (playRef.current && !still) {
        const id = videos[curRef.current]?.videoUrl?.match(/\/d\/([^/]+)/)?.[1],
          d = id ? levels.current?.[id] : undefined;
        if (d && startAt.current) {
          const k = Math.floor(((now - startAt.current) / 1000) * d.fps);
          lv = k < d.lv.length ? d.lv[k] / 100 : 0.06;
          rate = 16;
        } else lv = 0.1; // waiting for you to press play in the player
      }
      l1 += (lv * 0.95 - l1) * Math.min(1, dt * rate);
      l2 += (lv * 0.88 - l2) * Math.min(1, dt * (rate - 1));
      set(m1.current, "--lv@1", `${((1 - l1) * 100).toFixed(1)}%`);
      set(m2.current, "--lv@2", `${((1 - l2) * 100).toFixed(1)}%`);
      // while a video plays the frame settles flat and holds still, so the
      // picture never swims under the viewer's eye
      const gx = playRef.current ? 0 : tx,
        gy = playRef.current ? 0 : ty;
      x += (gx - x) * Math.min(1, dt * 4);
      y += (gy - y) * Math.min(1, dt * 4);
      set(frame.current, "--ry", `${(x * 4).toFixed(2)}deg`);
      set(frame.current, "--rx", `${(-y * 3).toFixed(2)}deg`);
      if (!vis || still) return;
      if (idle(now)) later(CALM);
      else raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      vis = e.isIntersecting;
      last = performance.now();
      if (vis && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(sec);
    if (still) raf = requestAnimationFrame(tick);
    offs.push(() => {
      io.disconnect();
      sizes.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(wake);
      sec.removeEventListener("pointermove", onMove);
    });
    return () => offs.forEach((f) => f());
  }, [show]);

  const jump = (i: number) => {
    T.current = i * SEG + 0.01;
    show(i);
    if (calm()) {
      // no running loop in the calm modes: move the playhead by hand
      if (ph.current) {
        const w = ph.current.parentElement?.clientWidth ?? 0;
        ph.current.style.transform = `translate3d(${(((i * SEG) / (SEG * videos.length)) * w).toFixed(1)}px,0,0)`;
      }
    }
  };

  const onScratch = () => {
    const an = vinyl.current?.getAnimations()[0];
    scratch();
    if (!an) return;
    an.playbackRate = -6;
    setTimeout(() => (an.playbackRate = 3), 380);
    setTimeout(() => (an.playbackRate = 1), 1100);
  };

  return (
    <section
      ref={root}
      id="videos"
      data-tone="dark"
      aria-labelledby="videos-heading"
      className="dk dk-sky-videos dk-seam-tb relative min-h-[100svh] pt-[max(17svh,180px)] pb-[max(30svh,220px)] md:pt-[max(17svh,212px)] md:pb-[max(30svh,250px)]"
    >
      <Stars />
      <SkyNotes skip="[class*=reel],[class*=timeline],[class*=player],[class*=clip]" />
      <Blob
        color="rgb(63 208 192 / .3)"
        style={v({
          left: "-14%",
          top: "-10%",
          width: "58%",
          height: "70%",
          "--t": "48s",
          "--bx": "100px",
          "--by": "50px",
        })}
      />
      <Blob
        color="rgb(255 95 176 / .36)"
        style={v({
          right: "-10%",
          top: "20%",
          width: "60%",
          height: "70%",
          "--t": "42s",
          "--bx": "-90px",
          "--by": "-40px",
        })}
      />
      <Blob
        color="rgb(255 178 122 / .4)"
        style={v({
          left: "20%",
          bottom: "-24%",
          width: "60%",
          height: "60%",
          "--t": "36s",
          "--bx": "70px",
          "--by": "-40px",
        })}
      />
      <Planet
        hue="peach"
        size={44}
        onPress={() => chime(880)}
        style={v({ left: "56%", top: "7%", "--t": "15s" })}
      />
      <ORing
        size={84}
        style={v({
          left: "calc(56% - 20px)",
          top: "calc(7% - 20px)",
          "--t": "17s",
        })}
      />
      <GStar size={26} style={v({ left: "60%", top: "12%" })} />
      <GStar size={18} style={v({ left: "3%", top: "20%", "--tw": "4.4s" })} />
      <GStar size={30} style={v({ right: "4%", top: "58%", "--tw": "3.1s" })} />

      {/* the record, behind everything; click it to scratch */}
      <button
        type="button"
        aria-label="Vinyl record (click to scratch)"
        onClick={onScratch}
        className="dk-obj absolute right-[-14%] bottom-[-10%] z-[5] hidden w-[46%] max-w-[700px] rounded-full border-0 bg-transparent p-0 md:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={vinyl}
          className="dk-vinyl"
          src="/art/garden/vinyl.webp"
          alt=""
          width={900}
          height={900}
          loading="lazy"
          decoding="async"
        />
      </button>
      <canvas
        ref={streamCv}
        aria-hidden
        className="dk-canvas dk-streams-fade"
        style={{ zIndex: 8 }}
      />

      {/* the earbuds hang from the top, rings orbiting through the buds */}
      <button
        ref={ebuds}
        type="button"
        aria-label="Earbuds (click for a chime)"
        className="dk-ebuds hidden border-0 bg-transparent p-0 md:block"
        style={{ right: "3%", top: "-2%", width: "clamp(150px, 12.5%, 210px)" }}
      >
        <RingHalf half="b" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="bud"
          src="/art/garden/earbuds-bare.webp"
          alt=""
          width={EBW}
          height={EBH}
          loading="lazy"
          decoding="async"
        />
        <RingHalf half="f" />
        {ENOTES.map(([x, y, w], k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={k}
            className="enote"
            src={`/art/garden/note-${k}.webp`}
            alt=""
            style={v({
              left: `${(x / EBW) * 100}%`,
              top: `${(y / EBH) * 100}%`,
              width: `${(w / EBW) * 100}%`,
              "--t": `${2.6 + k * 0.45}s`,
              "--dl": `${-k * 0.7}s`,
              "--nx": `${k % 2 ? -5 : 5}px`,
            })}
          />
        ))}
      </button>

      <div className="relative z-30 mx-auto max-w-[1400px] px-4 sm:px-[3.4%] lg:max-w-none lg:pr-[15%]">
        {/* one header across both columns: the title, and what's playing on the right */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 lg:mb-12">
          <h2
            id="videos-heading"
            data-perch
            data-rv="mist"
            className="type-display text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.95]"
          >
            Moving <em className="text-[#ffcfe0] italic">pictures</em>
          </h2>
          <p className="dk-k pb-2" aria-live="polite">
            Now playing · {meta}
          </p>
        </header>

        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:items-stretch">
          <div className="dk-copy flex flex-col" aria-live="polite">
            <h3 className="type-display text-[2rem] leading-[1.1]">
              {p.title}
            </h3>
            {p.role && (
              <p className="type-display mt-1 text-xl text-[#ffcfe0] italic">
                {p.role}
              </p>
            )}
            {p.description && (
              <Words key={p.description} mode="play" className="mt-5 text-base leading-[1.65]" text={p.description} />
            )}
            {p.tools && p.tools.length > 0 && (
              <p className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[15px]">
                <span className="dk-k text-[11px]">Cut in</span>
                {p.tools.map((t) => (
                  <span key={t}>✦ {t}</span>
                ))}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-5 lg:mt-auto lg:pt-8">
              {src && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => setPlaying(true)}
                  aria-pressed={playing}
                >
                  Play here <span aria-hidden>▶</span>
                </button>
              )}
              {p.videoUrl && (
                <a
                  href={p.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-[#fdf3e1] underline decoration-[#ffcfe0]/70 underline-offset-4 hover:decoration-[#ffcfe0]"
                >
                  Open in Drive <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </div>

          <div className="relative min-w-0">
            <div ref={frame} className="dk-vframe">
              <span className="o2" />
              <span className="o1" />
              <div className="screen">
                {playing && src ? (
                  <iframe
                    src={src}
                    title={p.title}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={shot}
                      src={
                        p.images[0].w > 720
                          ? small(p.images[0].src)
                          : p.images[0].src
                      }
                      srcSet={
                        p.images[0].w > 720
                          ? `${small(p.images[0].src)} 720w, ${p.images[0].src} ${p.images[0].w}w`
                          : undefined
                      }
                      sizes="(min-width: 1024px) 56vw, 92vw"
                      alt=""
                      width={p.images[0].w}
                      height={p.images[0].h}
                      decoding="async"
                    />
                    {src && (
                      <button
                        type="button"
                        className="dk-play"
                        onClick={() => setPlaying(true)}
                        aria-label={`Play ${p.title}`}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Peanut watches from the top of the frame */}
          <PeanutPerch playing={playing} style={{ left: "16%", top: 0, width: "clamp(78px, 7.6vw, 124px)" }} />

          {/* level meters, beside the screen */}
            <div
              aria-hidden
              className="dk-meter absolute top-[16%] -right-[46px] hidden h-[62%] w-[22px] lg:flex"
            >
              <span ref={m1} />
              <span ref={m2} />
            </div>

            <div
              className="dk-tl mt-11"
              role="group"
              aria-label="Timeline: pick a video"
            >
              <p className="tc" aria-hidden>
                <b>●</b> <span ref={tc}>00:00:00:00</span>
              </p>
              <div className="tracks">
                <div className="row overflow-x-auto sm:overflow-visible">
                  <span className="lab" aria-hidden>
                    V1
                  </span>
                  {videos.map((vd, i) => (
                    <button
                      key={vd.id}
                      type="button"
                      className="clip min-w-[56px]"
                      aria-current={i === cur}
                      aria-label={vd.title}
                      title={vd.title}
                      onClick={() => jump(i)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          vd.images[0].w > 720
                            ? small(vd.images[0].src)
                            : vd.images[0].src
                        }
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
                <div className="row">
                  <span className="lab" aria-hidden>
                    A1
                  </span>
                  <canvas ref={wave} aria-hidden />
                </div>
                <div ref={ph} aria-hidden className="ph" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Art
        name="cloud-bank"
        w={1400}
        h={196}
        className="dk-cloud"
        style={v({
          left: "-10%",
          bottom: "3%",
          width: "84%",
          zIndex: 12,
          "--t": "20s",
          "--cx": "-30px",
        })}
      />
      <div aria-hidden className="dk-grain" />
    </section>
  );
}
