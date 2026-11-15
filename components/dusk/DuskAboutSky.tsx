"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ambient, calm } from "@/lib/dusk/fx";
import { streams } from "@/lib/dusk/streams";
import { chime } from "@/lib/dusk/sound";
import { Blob, GStar, Planet, Stars } from "./Decor";
import GardenBed from "../pastel/GardenBed";
import { PeanutWalk } from "./Peanut";

const v = (o: Record<string, string | number>) => o as CSSProperties;

/**
 * The sky behind About: stars, drifting colour, print textures, streams that
 * brighten as the portrait develops (they read --p off the section), and a
 * drawn lotus garden at the foot with Peanut wandering it.
 */
export default function DuskAboutSky() {
  const layer = useRef<HTMLDivElement>(null);
  const streamCv = useRef<HTMLCanvasElement>(null);

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
        // fewer, and only at the edges: About is read, card by card, and
        // drifting bits over the text pulled the eye off it
        petals: 3,
        motes: 6,
        shooting: 7000,
        confetti: [[92, 18], [4, 40], [96, 70]],
        textures: [
          ["meshStar", [70, "#fff"], "left:40%;top:3%;width:140px;--t:7s", "spark"],
          ["halftoneFade", [440, 300, { color: "#9fe3d6", dir: "br", shape: "diamond", step: 12 }], "right:0;bottom:0;width:440px;opacity:.4;z-index:7", ""],
          ["halftoneFade", [420, 280, { color: "#c9b8ff", dir: "tl", shape: "dot", step: 11, angle: 0.4 }], "left:0;top:0;width:420px;opacity:.35", ""],
          ["dotStar", [24, "#fdf3e1"], "right:6%;top:24%;width:48px;opacity:.8", "twk"],
          ["dotDiamond", [36, "#ffcfe0"], "left:var(--dd-x,3%);top:var(--dd-y,62%);width:76px;opacity:.55", "twk"],
        ],
      })
    );
    return () => offs.forEach((f) => f());
  }, []);

  return (
    <div ref={layer} className="pointer-events-none absolute inset-0 overflow-hidden">
      <Stars />
      <Blob color="rgb(255 95 176 / .34)" style={v({ left: "-10%", top: "-8%", width: "60%", height: "60%", "--t": "50s", "--bx": "110px", "--by": "40px" })} />
      <Blob color="rgb(63 208 192 / .3)" style={v({ right: "-14%", top: "12%", width: "60%", height: "60%", "--t": "44s", "--bx": "-80px", "--by": "60px" })} />
      <Blob color="rgb(255 178 122 / .32)" style={v({ left: "28%", bottom: "-12%", width: "56%", height: "46%", "--t": "40s", "--bx": "60px", "--by": "-40px" })} />
      <canvas ref={streamCv} aria-hidden className="dk-canvas dk-astreams" style={{ zIndex: 4 }} />

      <div className="pointer-events-auto">
        {/* Placed by percentage on wide screens; phones move it (and the
            dotted diamond) to fixed spots by the portrait, since there the
            section's height changes with the open tab and a percentage
            would land on the tools or the text (dusk.css, .dk-about). */}
        <Planet hue="pink" size={46} onPress={() => chime(880)} style={v({ left: "2%", top: "var(--pk-y, 44%)", "--t": "14s" })} />
        <Planet hue="peach" size={30} onPress={() => chime(660)} style={v({ right: "8%", top: "3%", "--t": "11s" })} />
      </div>
      <GStar size={26} style={v({ left: "38%", top: "16%", "--tw": "3.4s" })} />
      <GStar size={18} style={v({ right: "10%", top: "40%", "--tw": "4.2s" })} />
      <GStar size={22} style={v({ left: "6%", top: "74%", "--tw": "3.8s" })} />

      {/* the first portfolio's drawn garden along the foot, Peanut wandering it */}
      <GardenBed variant="corners" style={{ bottom: "34px", zIndex: 48 }} />
      <PeanutWalk style={{ left: "max(22%, 150px)", width: "clamp(220px, 24vw, 380px)", bottom: "48px", zIndex: 51 }} size="clamp(76px, 7vw, 112px)" />
    </div>
  );
}
