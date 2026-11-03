"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { profile } from "@/lib/content";
import MorphName from "../MorphName";
import { streams, type Ribbon } from "@/lib/dusk/streams";
import { staff } from "@/lib/dusk/staff";
import { ambient, burst, calm, floatText, local, PALETTE, reducedMotion, whileVisible } from "@/lib/dusk/fx";
import { meow, purr, tone } from "@/lib/dusk/sound";
import { playNextNote } from "@/lib/dusk/skyTune";
import { bloomLetters } from "@/lib/dusk/pixelFlowers";
import SkyNotes from "./SkyNotes";
import { cleanTitle, decode, type Star } from "@/lib/dusk/skySong";

// the composer is its own chunk, loaded when someone opens it or follows a song link
const SkyComposer = dynamic(() => import("./SkyComposer"), { ssr: false });
import { Art, Blob, GStar, SkyRing, Stars } from "./Decor";

const v = (o: Record<string, string | number>) => o as CSSProperties;

/* Streams pour out of the foot of the door: four broad, six thin. */
const DOOR: [number, number] = [0.5, 0.74];
/* two-colour, matte: peach and lavender with the pink between, no mint or teal */
const BROAD = [
  { to: [-0.06, 0.6], ctrl: [0.2, 0.5], colors: ["#f7dcc4", "#e9a9c6", "#b9a2ec"] },
  { to: [-0.06, 0.86], ctrl: [0.22, 0.62], colors: ["#f7dcc4", "#f0b59c"] },
  { to: [1.06, 0.6], ctrl: [0.8, 0.5], colors: ["#f7dcc4", "#c3b0f0", "#9d8fe0"] },
  { to: [1.06, 0.86], ctrl: [0.78, 0.62], colors: ["#f7dcc4", "#e9a9c6"] },
];
const THIN = [
  { to: [-0.05, 0.16], ctrl: [0.2, 0.6], colors: ["#f7dcc4", "#b9a2ec"] },
  { to: [1.05, 0.16], ctrl: [0.8, 0.6], colors: ["#f7dcc4", "#e9a9c6"] },
  { to: [-0.06, 0.3], ctrl: [0.3, 0.5], colors: ["#f0b59c", "#b9a2ec"] },
  { to: [1.06, 0.32], ctrl: [0.7, 0.5], colors: ["#f0b59c", "#c3b0f0"] },
  { to: [0.25, 1.05], ctrl: [0.38, 0.82], colors: ["#e9a9c6", "#f7dcc4"] },
  { to: [0.76, 1.05], ctrl: [0.62, 0.82], colors: ["#9d8fe0", "#f7dcc4"] },
];
const RIBBONS: Ribbon[] = [
  ...THIN.map((s, i) => ({ from: DOOR, ctrl: s.ctrl as [number, number], to: s.to as [number, number], amp: 0.02, w: 0.009 + (i % 3) * 0.003, twist: 0.8, colors: s.colors, p1: 6500 + i * 700, p2: 9000, alpha: 0.9, delay: 500 + i * 140, span: 1.2 })),
  ...BROAD.map((s, i) => ({ from: DOOR, ctrl: s.ctrl as [number, number], to: s.to as [number, number], amp: 0.02, w: 0.046, twist: 1.1, colors: s.colors, p1: 7000 + i * 600, p2: 9500 + i * 400, alpha: 1, delay: i * 120, span: 0.9 })),
];

const heartSvg = (c: string) =>
  `<svg viewBox="0 0 16 14" width="16" height="14" aria-hidden="true"><path d="M8 13 C 2 9 0 6 0 4 C 0 1.5 2 0 4 0 C 6 0 7 1.2 8 2.6 C 9 1.2 10 0 12 0 C 14 0 16 1.5 16 4 C 16 6 14 9 8 13Z" fill="${c}"/></svg>`;

/**
 * The hero at dusk: the name in the upper sky (MorphName: hover morph,
 * click scramble — unchanged), a glowing door with streams pouring out of
 * it, the bass's strings running on into a music staff across the floor
 * (from tablet width up), pixel clouds and lotus, and things to play with —
 * Peanut asleep on her cloud (stroke her, click her), the bass (click to play
 * a note), the door (confetti), and the sky itself (click to place stars that
 * join into a constellation). Kept deliberately spare: no planets, badge or
 * checker diamonds, so the name has the sky to itself. Touching a letter of the name
 * also blooms a small cluster of pixel flowers round it.
 */
export default function DuskHero() {
  const root = useRef<HTMLElement>(null);
  const streamCv = useRef<HTMLCanvasElement>(null);
  const staffCv = useRef<HTMLCanvasElement>(null);
  const nameBox = useRef<HTMLDivElement>(null);
  const peanut = useRef<HTMLButtonElement>(null);
  const bass = useRef<HTMLButtonElement>(null);
  const [song, setSong] = useState<{ mode: "write" | "listen"; stars: Star[]; title: string } | null>(null);
  const [hint, setHint] = useState(false);

  // a shared song link (?song=...) opens with the sender's constellation in the sky
  useEffect(() => {
    const q = new URLSearchParams(location.search),
      stars = decode(q.get("song"));
    /* eslint-disable react-hooks/set-state-in-effect -- read once from the URL on arrival */
    if (stars.length) setSong({ mode: "listen", stars, title: cleanTitle(q.get("title")) });
    // "Write a song" from the gallery (/?compose=1) opens an empty sky
    else if (q.has("compose")) {
      setSong({ mode: "write", stars: [], title: "" });
      history.replaceState(null, "", location.pathname + location.hash);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // after a few stars clicked into the sky, the composer button glows once: "you can write your own"
  useEffect(() => {
    const hero = root.current;
    if (!hero) return;
    let n = 0;
    const on = () => ++n === 4 && setHint(true);
    hero.addEventListener("skynote", on);
    return () => hero.removeEventListener("skynote", on);
  }, []);

  // the camera move out of the hero: --hp runs 0 to 1 as the hero scrolls
  // away, and the CSS lifts the name, fades the tagline and rolls mist up
  useEffect(() => {
    const sec = root.current;
    if (!sec || reducedMotion()) return;
    // written on the four layers that read it, not the whole section, so a
    // scroll frame restyles four elements instead of every star and petal
    const layers = sec.querySelectorAll<HTMLElement>(".dk-hname, .dk-hsub, .dk-hmist");
    let raf = 0,
      last = "";
    const read = () => {
      raf = 0;
      const h = sec.offsetHeight || 1,
        p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / h)).toFixed(3);
      if (p === last) return;
      last = p;
      layers.forEach((l) => l.style.setProperty("--hp", p));
    };
    const onScroll = () => {
      if (!raf && window.scrollY < (sec.offsetHeight || 0) * 1.2) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const hero = root.current;
    if (!hero) return;
    const still = calm();
    const offs: (() => void)[] = [];

    if (streamCv.current) offs.push(streams(streamCv.current, RIBBONS, { still }));
    // the staff (and its notes) stays off on phones: the hero is busy enough there
    if (staffCv.current && matchMedia("(min-width: 640px)").matches)
      offs.push(
        staff(staffCv.current, {
          from: [-0.05, 0.74],
          c1: [0.28, 0.44],
          c2: [0.66, 0.9],
          to: [1.05, 0.5],
          gap: 0.02,
          strings: 4,
          still,
          hitEl: hero,
          onPluck: (i, e) => {
            if (hero.hasAttribute("data-compose")) return;
            playNextNote();
            const [x, y] = local(hero, e.clientX, e.clientY);
            floatText(hero, x, y - 12, i % 2 ? "♫" : "♪");
          },
        })
      );

    offs.push(
      ambient(hero, {
        petals: 5,
        motes: 8,
        shooting: 5200,
        confetti: [[8, 17], [92, 15], [5, 58], [95, 60]],
        textures: [
          ["halftoneFade", [460, 300, { color: "#c9b8ff", dir: "bl", shape: "diamond", step: 12 }], "left:0;bottom:0;width:460px;opacity:.5;z-index:22", ""],
          ["halftoneFade", [440, 280, { color: "#9fe3d6", dir: "tr", shape: "dot", step: 11, angle: 0.4 }], "right:0;top:0;width:440px;opacity:.45", ""],
          ["bayerFade", [1400, 90, { color: "#fdf3e1", cell: 4, dir: "b" }], "left:0;bottom:21%;width:100%;height:90px;opacity:.35;z-index:21", ""],
          ["dotStar", [26, "#fdf3e1"], "left:12%;top:58%;width:52px;opacity:.85;--tw:5s", "twk"],
          ["dotStar", [18, "#ffcfe0"], "right:30%;top:14%;width:36px;opacity:.85;--tw:4s", "twk"],
        ],
      })
    );

    // Peanut: zz while asleep; stroke for hearts + purr; click to wake her
    const pn = peanut.current;
    let awake = false;
    if (pn) {
      if (!reducedMotion())
        offs.push(
          // while Peanut herself is on screen, not just a sliver of the hero:
          // a z drifting in a hero the browser has stopped rendering
          // (content-visibility) is animated on the main thread, every frame
          whileVisible(pn, 1500, () => {
            if (awake) return;
            const [x, y] = local(hero, pn.getBoundingClientRect().left + pn.offsetWidth * 0.55, pn.getBoundingClientRect().top + pn.offsetHeight * 0.1);
            const z = document.createElement("div");
            z.className = "dk-zz";
            z.textContent = "z";
            z.setAttribute("aria-hidden", "true");
            z.style.left = `${x}px`;
            z.style.top = `${y}px`;
            z.style.fontSize = `${16 + Math.random() * 10}px`;
            hero.appendChild(z);
            setTimeout(() => z.remove(), 3700);
          })
        );
      let dist = 0,
        lastPt: [number, number] | null = null,
        purrT = 0,
        t = 0;
      const onMove = (e: PointerEvent) => {
        if (lastPt) dist += Math.hypot(e.clientX - lastPt[0], e.clientY - lastPt[1]);
        lastPt = [e.clientX, e.clientY];
        if (dist < 70) return;
        dist = 0;
        const [x, y] = local(hero, e.clientX, e.clientY),
          h = document.createElement("div");
        h.className = "dk-heart";
        h.setAttribute("aria-hidden", "true");
        h.innerHTML = heartSvg(["#ffcfe0", "#ff9ec4", "#fdf3e1"][(Math.random() * 3) | 0]);
        h.style.left = `${x - 8}px`;
        h.style.top = `${y - 18}px`;
        h.style.setProperty("--hx", `${(Math.random() - 0.5) * 40}px`);
        hero.appendChild(h);
        setTimeout(() => h.remove(), 1500);
        if (performance.now() - purrT > 1000) {
          purrT = performance.now();
          purr();
        }
      };
      const onLeave = () => {
        lastPt = null;
        dist = 0;
      };
      const onClick = () => {
        awake = true;
        pn.dataset.up = "";
        meow();
        clearTimeout(t);
        const b = pn.getBoundingClientRect(),
          [x, y] = local(hero, b.left + b.width / 2, b.top);
        floatText(hero, x - 16, y - 6, "meow", "#ffcfe0");
        burst(hero, x, y + b.height * 0.3, 9, ["#ffcfe0", "#fdf3e1", "#ffd98a"], "star");
        t = window.setTimeout(() => {
          delete pn.dataset.up;
          awake = false;
        }, 2800);
      };
      pn.addEventListener("pointermove", onMove);
      pn.addEventListener("pointerleave", onLeave);
      pn.addEventListener("click", onClick);
      offs.push(() => {
        pn.removeEventListener("pointermove", onMove);
        pn.removeEventListener("pointerleave", onLeave);
        pn.removeEventListener("click", onClick);
        clearTimeout(t);
      });
    }

    // the name: pixel flowers bloom round a touched letter (the morph is MorphName's own)
    if (nameBox.current) offs.push(bloomLetters(nameBox.current));


    return () => offs.forEach((f) => f());
  }, []);

  const doorBurst = (e: React.MouseEvent<HTMLButtonElement>) => {
    const hero = root.current;
    if (!hero) return;
    const b = e.currentTarget.getBoundingClientRect(),
      [x, y] = local(hero, b.left + b.width / 2, b.top + b.height * 0.55);
    burst(hero, x, y, 26, PALETTE);
    [523, 659, 784, 988].forEach((f, k) => tone(f, { type: "sine", vol: 0.06, dur: 1.2, at: k * 0.07 }));
  };
  const strum = (e: React.MouseEvent<HTMLButtonElement>) => {
    const hero = root.current,
      el = e.currentTarget;
    delete el.dataset.strum;
    void el.offsetWidth;
    el.dataset.strum = "";
    playNextNote();
    if (!hero) return;
    const [x, y] = local(hero, e.clientX, e.clientY);
    for (let k = 0; k < 4; k++) setTimeout(() => floatText(hero, x + k * 26, y - 20 - k * 6, k % 2 ? "♫" : "♪"), k * 70);
  };

  return (
    // overflow-clip, not -hidden: a hidden box is a scroll container (see the old Hero).
    <section ref={root} data-tone="dark" aria-label="Intro" className="dk dk-hero dk-sky-hero dk-seam-b relative h-[max(100svh,640px)] min-h-[640px]">
      <Stars />
      <Blob color="rgb(255 95 176 / .6)" style={v({ left: "-14%", top: "-18%", width: "60%", height: "70%", "--t": "52s", "--bx": "120px", "--by": "60px" })} />
      <Blob color="rgb(63 208 192 / .5)" style={v({ right: "-18%", top: "2%", width: "62%", height: "76%", "--t": "44s", "--bx": "-110px", "--by": "40px" })} />
      <Blob color="rgb(255 178 122 / .5)" style={v({ left: "22%", top: "40%", width: "56%", height: "60%", "--t": "38s", "--bx": "60px", "--by": "-50px", "--bs": 1.25 })} />
      <Blob color="rgb(155 92 255 / .55)" style={v({ left: "-10%", bottom: "-20%", width: "50%", height: "60%", "--t": "56s", "--bx": "90px", "--by": "-30px" })} />

      <SkyRing style={v({ left: "50%", top: "52%", width: "min(620px, 86vw)", marginLeft: "calc(min(620px, 86vw) / -2)", zIndex: 4 })} />
      <GStar size={30} style={v({ left: "30%", top: "13%", "--tw": "3.2s" })} />
      <GStar size={20} style={v({ right: "30%", top: "58%", "--tw": "3.6s" })} />
      <GStar size={34} style={v({ right: "6%", top: "34%", "--tw": "4.6s" })} />


      <SkyNotes skip=".dk-hero-floor" maxY={0.62} />

      <button type="button" aria-label="The glowing door (bursts confetti)" onClick={doorBurst} className="dk-portal border-0 bg-transparent p-0">
        <span className="halo" />
        <span className="light" />
        <span className="l1" />
        <span className="l2" />
      </button>

      <canvas ref={streamCv} aria-hidden className="dk-canvas dk-hstreams" style={{ zIndex: 20 }} />

      {/* The name, in the sky */}
      <div className="dk-hname absolute inset-x-0 top-[22svh] z-30 mx-auto w-full max-w-6xl px-4 text-center sm:top-[25svh] sm:px-8">
        {/* the poster's small print, set just above the name (out of the flow, so the name keeps its place) */}
        <p className="dk-hkick">
          Portfolio 2026 <span aria-hidden>·</span> UI/UX <span aria-hidden>·</span> Branding <span aria-hidden>·</span> Video
        </p>
        <div ref={nameBox} data-perch className="relative inline-block">
          <MorphName
            label={profile.name}
            words={[
              { text: "Lana", italic: false, className: "type-name hero-name text-[23vw] whitespace-nowrap sm:mr-[0.2em] sm:inline-block sm:text-[12vw] xl:text-[11.75rem]" },
              { text: "Denise", italic: false, className: "type-name hero-name dk-name-accent text-[23vw] whitespace-nowrap sm:inline-block sm:text-[12vw] xl:text-[11.75rem]" },
            ]}
          />
        </div>
        <p className="dk-hline type-display mx-auto mt-3 max-w-[30ch] text-lg leading-snug italic sm:mt-4 sm:max-w-[38ch] sm:text-[1.55rem]">{profile.heroShort}</p>
      </div>

      <Art name="cloud-bank" w={1400} h={196} className="dk-cloud" style={v({ left: "-8%", bottom: "3%", width: "116%", zIndex: 50, "--t": "18s", "--cx": "30px" })} />
      <canvas ref={staffCv} aria-hidden className="dk-canvas hidden sm:block" style={{ zIndex: 52 }} />
      <Art name="lotus-cluster" w={1000} h={471} className="dk-sway" style={v({ left: "-4%", bottom: "4%", width: "max(32%, 240px)", zIndex: 56, "--t": "7s" })} />
      <Art name="lotus-cluster" w={1000} h={471} className="dk-sway" style={v({ right: "-6%", bottom: "3%", width: "max(26%, 200px)", zIndex: 56, scale: "-1 1", "--t": "8s" })} />

      <button ref={bass} type="button" aria-label="Bass guitar (click to play a note)" onClick={strum} className="dk-obj dk-bass hidden border-0 bg-transparent p-0 md:block" style={{ left: "-3%", bottom: "15%", width: "clamp(220px, 25%, 380px)", zIndex: 53 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/garden/bass.webp" alt="" width={640} height={425} decoding="async" />
      </button>

      <button ref={peanut} type="button" aria-label="Peanut, my cat, asleep (stroke her, or click to wake her)" className="dk-obj dk-peanut border-0 bg-transparent p-0" style={{ left: "15%", bottom: "8%", width: "clamp(120px, 12.5vw, 196px)", zIndex: 58 }}>
        <span className="pz block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sleep" src="/art/peanut/sleep.svg" alt="" width={52} height={35} decoding="async" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="awake" src="/art/peanut/awake.svg" alt="" width={52} height={35} decoding="async" />
        </span>
      </button>

      {/* Low on the horizon, in the door's light: the one call to action */}
      <div className="dk-hsub absolute inset-x-0 bottom-[calc(9%+70px)] z-[60] mx-auto w-full max-w-2xl px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="#branding" className="btn">
            See the work <span aria-hidden>↓</span>
          </a>
          <button type="button" className="btn-ghost dk-compose" data-hint={hint ? "" : undefined} aria-expanded={!!song} onClick={() => setSong({ mode: "write", stars: [], title: "" })}>
            <span aria-hidden>✦</span> Write a song in the stars
          </button>
        </div>
      </div>

      {song && (
        <SkyComposer
          key={song.mode + song.stars.length}
          mode={song.mode}
          initial={song.stars}
          initialTitle={song.title}
          onClose={() => {
            setSong(null);
            if (location.search) history.replaceState(null, "", location.pathname + location.hash);
          }}
        />
      )}

      <div aria-hidden className="dk-hmist" />
      <div aria-hidden className="dk-grain" />
    </section>
  );
}
