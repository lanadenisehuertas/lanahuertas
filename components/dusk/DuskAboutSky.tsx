"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ambient, calm, floatText, local } from "@/lib/dusk/fx";
import { streams } from "@/lib/dusk/streams";
import { chime, la, tone } from "@/lib/dusk/sound";
import { Art, Blob, GStar, Planet, Stars } from "./Decor";
import { PeanutWalk } from "./Peanut";

const v = (o: Record<string, string | number>) => o as CSSProperties;

/**
 * The sky behind About: stars, drifting colour, print textures, streams that
 * brighten as the portrait develops (they read --p off the section), lotus and
 * clouds at the foot, and two of my interests to play with — the yarn rolls
 * off and back, the mic sings a little phrase.
 */
export default function DuskAboutSky() {
  const layer = useRef<HTMLDivElement>(null);
  const streamCv = useRef<HTMLCanvasElement>(null);
  const yarn = useRef<HTMLButtonElement>(null);
  const mic = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const host = layer.current,
      sec = host?.closest("section");
    if (!host || !sec) return;
    const still = calm();
    const offs: (() => void)[] = [];
    if (streamCv.current)
      offs.push(
        streams(
          streamCv.current,
          [
            { from: [0.2, 0.22], ctrl: [0.4, 0.12], to: [1.05, 0.3], amp: 0.02, w: 0.0045, twist: 0.6, colors: ["#fff1d6", "#ff9ec4"], span: 1.2 },
          ],
          { still }
        )
      );
    offs.push(
      ambient(host, {
        leanEl: sec,
        petals: 5,
        motes: 12,
        shooting: 7000,
        confetti: [[46, 4], [92, 18], [4, 40], [60, 34], [96, 70], [36, 88]],
        textures: [
          ["meshStar", [70, "#fff"], "left:40%;top:3%;width:140px;--t:7s", "spark"],
          ["halftoneFade", [440, 300, { color: "#9fe3d6", dir: "br", shape: "diamond", step: 12 }], "right:0;bottom:0;width:440px;opacity:.4;z-index:7", ""],
          ["halftoneFade", [420, 280, { color: "#c9b8ff", dir: "tl", shape: "dot", step: 11, angle: 0.4 }], "left:0;top:0;width:420px;opacity:.35", ""],
          ["dotStar", [24, "#fdf3e1"], "right:6%;top:24%;width:48px;opacity:.8", "twk"],
          ["dotDiamond", [36, "#ffcfe0"], "left:3%;top:62%;width:76px;opacity:.55", "twk"],
        ],
      })
    );
    return () => offs.forEach((f) => f());
  }, []);

  // the yarn rolls over to Peanut, she pounces on it, it rolls home
  const rollYarn = () => {
    const r = yarn.current?.querySelector<HTMLElement>(".roll"),
      host = layer.current,
      cat = host?.querySelector<HTMLElement>(".dk-walk");
    if (!r) return;
    r.style.transform = "translateX(min(84px, 16vw)) rotate(260deg)";
    tone(392, { type: "sine", vol: 0.05, dur: 0.5 });
    if (cat && host)
      setTimeout(() => {
        delete cat.dataset.hop;
        void cat.offsetWidth;
        cat.dataset.hop = "";
        tone(660, { type: "triangle", vol: 0.04, dur: 0.18 });
        const b = cat.getBoundingClientRect(),
          [x, y] = local(host, b.left + b.width / 2, b.top);
        floatText(host, x - 14, y - 4, "mrrp!", "#ffcfe0");
      }, 750);
    setTimeout(() => (r.style.transform = ""), 1500);
  };

  // the mic sings four notes while little notes float up
  const sing = () => {
    const m = mic.current,
      host = layer.current;
    if (!m || !host) return;
    delete m.dataset.sing;
    void m.offsetWidth;
    m.dataset.sing = "";
    (
      [
        [523, 0, 0.32],
        [587, 0.34, 0.32],
        [659, 0.68, 0.5],
        [784, 1.2, 0.7],
      ] as const
    ).forEach(([f, at, d]) => la(f, at, d));
    const b = m.getBoundingClientRect();
    for (let k = 0; k < 6; k++)
      setTimeout(() => {
        const [x, y] = local(host, b.left + b.width * 0.45 + (Math.random() - 0.5) * 40, b.top + 10);
        floatText(host, x, y, ["♪", "♫", "♬"][k % 3], ["#fdf3e1", "#ffcfe0", "#a8e6dc"][k % 3]);
      }, k * 220);
  };

  return (
    <div ref={layer} className="pointer-events-none absolute inset-0 overflow-hidden">
      <Stars />
      <Blob color="rgb(255 95 176 / .34)" style={v({ left: "-10%", top: "-8%", width: "60%", height: "60%", "--t": "50s", "--bx": "110px", "--by": "40px" })} />
      <Blob color="rgb(63 208 192 / .3)" style={v({ right: "-14%", top: "12%", width: "60%", height: "60%", "--t": "44s", "--bx": "-80px", "--by": "60px" })} />
      <Blob color="rgb(255 178 122 / .32)" style={v({ left: "28%", bottom: "-12%", width: "56%", height: "46%", "--t": "40s", "--bx": "60px", "--by": "-40px" })} />
      <canvas ref={streamCv} aria-hidden className="dk-canvas dk-astreams" style={{ zIndex: 4 }} />

      <div className="pointer-events-auto">
        <Planet hue="pink" size={46} onPress={() => chime(880)} style={v({ left: "2%", top: "44%", "--t": "14s" })} />
        <Planet hue="peach" size={30} onPress={() => chime(660)} style={v({ right: "8%", top: "3%", "--t": "11s" })} />
      </div>
      <GStar size={26} style={v({ left: "38%", top: "16%", "--tw": "3.4s" })} />
      <GStar size={18} style={v({ right: "10%", top: "40%", "--tw": "4.2s" })} />
      <GStar size={22} style={v({ left: "6%", top: "74%", "--tw": "3.8s" })} />

      <Art name="cloud-bank" w={1400} h={196} className="dk-cloud" style={v({ left: "-8%", bottom: "34px", width: "116%", zIndex: 48, "--t": "22s", "--cx": "26px" })} />
      <Art name="lotus-cluster" w={1000} h={471} className="dk-sway" style={v({ left: "-3%", bottom: "44px", width: "max(30%, 220px)", zIndex: 50, "--t": "8s" })} />

      <button
        ref={yarn}
        type="button"
        aria-label="A ball of yarn and a crochet hook (click to roll it)"
        onClick={rollYarn}
        className="dk-obj dk-yarn pointer-events-auto border-0 bg-transparent p-0"
        style={{ left: "max(24%, 170px)", bottom: "74px", width: "clamp(96px, 10vw, 150px)", zIndex: 52 }}
      >
        <span className="roll block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/art/garden/yarn.webp" alt="" width={460} height={260} loading="lazy" decoding="async" />
        </span>
      </button>
      {/* Peanut wanders the cloud past the yarn and pounces when it rolls to her */}
      <PeanutWalk style={{ left: "calc(max(24%, 170px) + clamp(110px, 11vw, 170px))", width: "clamp(220px, 24vw, 380px)", bottom: "74px", zIndex: 51 }} size="clamp(76px, 7vw, 112px)" />

      <button
        ref={mic}
        type="button"
        aria-label="A microphone (click to hear it sing)"
        onClick={sing}
        className="dk-obj dk-mic pointer-events-auto border-0 bg-transparent p-0"
        style={{ right: "4%", bottom: "84px", width: "clamp(70px, 7.5vw, 120px)", zIndex: 52 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/garden/mic.webp" alt="" width={360} height={528} loading="lazy" decoding="async" />
      </button>
    </div>
  );
}
