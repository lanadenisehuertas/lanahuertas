"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { toolkit } from "@/lib/content";
import { burst } from "@/lib/dusk/fx";
import { chime } from "@/lib/dusk/sound";
import { SHORT_NAME, ToolTile } from "../ToolBubbles";

type ToolId = (typeof toolkit)[number]["id"];

/* What a star says once you touch it. Years only where they are known. */
const SAYS: Record<ToolId, string> = {
  ps: "Photoshop · 7+ yrs",
  ai: "Illustrator",
  pr: "Premiere Pro · 6 yrs",
  ae: "After Effects",
  ca: "Canva",
  fg: "Figma",
  py: "Python",
  js: "JavaScript",
};

/** A tool star (`id` is a tool) or a plain little star (`id` starts with "m"). `k` scales it. */
type Spot = { id: ToolId | `m${number}`; x: string; y: string; k?: number };

/*
 * Round the portrait: a loose constellation, not a frame. Stars of different
 * sizes sit off the ring at uneven heights, joined in two chains with a gap,
 * so it reads as stars someone connected rather than a border.
 */
const ORBIT: Spot[] = [
  { id: "ps", x: "9%", y: "15%", k: 1 },
  { id: "m1", x: "21%", y: "6%" },
  { id: "ae", x: "42%", y: "3%", k: 0.74 },
  { id: "m2", x: "66%", y: "7%" },
  { id: "fg", x: "90%", y: "19%", k: 1.12 },
  { id: "ca", x: "93%", y: "50%", k: 0.86 },
  { id: "ai", x: "8%", y: "51%", k: 0.82 },
  { id: "m3", x: "11%", y: "72%" },
  { id: "pr", x: "25%", y: "89%", k: 0.7 },
  { id: "m4", x: "62%", y: "95%" },
  { id: "m5", x: "88%", y: "77%" },
];
const ORBIT_CHAINS = [
  ["ps", "m1", "ae", "m2", "fg", "ca"],
  ["ai", "m3", "pr", "m4", "m5"],
];

/* Under the about text: the two code tools as a little constellation of their own. */
const MEADOW: Spot[] = [
  { id: "m6", x: "6%", y: "70%" },
  { id: "py", x: "24%", y: "46%", k: 1 },
  { id: "m7", x: "40%", y: "70%" },
  { id: "js", x: "58%", y: "34%", k: 0.9 },
  { id: "m8", x: "80%", y: "52%" },
];
const MEADOW_CHAINS = [["m6", "py", "m7", "js", "m8"]];

/* Phones and tablets: every tool in one zigzag chain under the portrait. */
const ROW_IDS: ToolId[] = ["ps", "ai", "pr", "ae", "fg", "ca", "py", "js"];
const ROW: Spot[] = ROW_IDS.map((id) => ({ id, x: "0", y: "0", k: 1 }));
const ROW_CHAINS = [ROW_IDS as string[]];

const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
const STARS = ["#fff6dc", "#ffcfe0", "#c9b8ff", "#ffd98a"];

/**
 * The app logos as a constellation: each tool is a star (its tile on a
 * four-point glint and a soft halo) and the stars are joined by fine glowing
 * lines. They light up in order as the portrait develops on scroll (the
 * section's --p); touching one makes it chime, spark and say its name.
 */
export default function ToolStars({ variant, className = "" }: { variant: "orbit" | "meadow" | "row"; className?: string }) {
  const field = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [said, setSaid] = useState("");
  const [lit, setLit] = useState<string | null>(null);
  const spots = variant === "orbit" ? ORBIT : variant === "meadow" ? MEADOW : ROW;
  const chains = variant === "orbit" ? ORBIT_CHAINS : variant === "meadow" ? MEADOW_CHAINS : ROW_CHAINS;
  const order = useMemo(() => spots.map((s) => s.id as string), [spots]);

  // draw the lines between the stars' centres, and redraw when the field resizes
  useEffect(() => {
    const f = field.current,
      s = svg.current;
    if (!f || !s) return;
    const draw = () => {
      const c = (id: string) => {
        const el = f.querySelector<HTMLElement>(`[data-node="${id}"]`);
        if (!el) return null;
        // absolutely placed stars are centred on their offset (translate -50%); in-flow ones are not
        const inFlow = variant === "row";
        return [el.offsetLeft + (inFlow ? el.offsetWidth / 2 : 0), el.offsetTop + (inFlow ? el.offsetHeight / 2 : 0)] as const;
      };
      let html = "";
      chains.forEach((ch) =>
        ch.slice(1).forEach((id, k) => {
          const a = c(ch[k]),
            b = c(id);
          if (!a || !b) return;
          const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
          // each segment draws in just after the star it leaves from lights up
          const t = (order.indexOf(ch[k]) / order.length) * 0.75;
          html += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" style="--len:${len.toFixed(1)};--t:${t.toFixed(3)}"/>`;
        })
      );
      s.innerHTML = html;
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(f);
    return () => ro.disconnect();
  }, [variant, chains, order]);

  const touch = (id: ToolId, i: number, el: HTMLElement) => {
    chime(NOTES[i % NOTES.length]);
    setLit(id);
    setSaid(SAYS[id]);
    window.setTimeout(() => setLit((v) => (v === id ? null : v)), 1800);
    const f = field.current;
    if (!f) return;
    const star = el.closest<HTMLElement>(".ts");
    if (!star) return;
    const inFlow = variant === "row";
    burst(f, star.offsetLeft + (inFlow ? star.offsetWidth / 2 : 0), star.offsetTop + (inFlow ? star.offsetHeight / 2 : 0), 12, STARS, "star");
  };

  return (
    <div ref={field} className={`ts-field ts-${variant} ${className}`}>
      <svg ref={svg} aria-hidden className="ts-lines" />
      {spots.map((s, i) => {
        const t = ((i / spots.length) * 0.75).toFixed(3);
        if (s.id.startsWith("m"))
          return (
            <span
              key={s.id}
              aria-hidden
              data-node={s.id}
              className="ts-minor"
              style={{ "--x": s.x, "--y": s.y, "--t": t, animationDelay: `${-i * 0.9}s` } as CSSProperties}
            />
          );
        const id = s.id as ToolId;
        return (
          <div
            key={id}
            data-node={id}
            data-lit={lit === id ? "" : undefined}
            className="ts"
            style={{ "--x": s.x, "--y": s.y, "--k": s.k ?? 1, "--t": t, "--dy": variant === "row" && i % 2 ? "22px" : "0px" } as CSSProperties}
          >
            <span aria-hidden className="ts-halo" style={{ animationDelay: `${-i * 1.3}s` }} />
            <span aria-hidden className="ts-glint" style={{ animationDelay: `${-i * 0.8}s` }} />
            <button type="button" className="ts-btn" aria-label={SHORT_NAME[id]} onClick={(e) => touch(id, i, e.currentTarget)}>
              <ToolTile id={id} label={false} className="ts-tile" />
            </button>
            <span aria-hidden className="ts-label">
              {lit === id ? SAYS[id] : SHORT_NAME[id]}
            </span>
          </div>
        );
      })}
      <span className="sr-only" aria-live="polite">
        {said}
      </span>
    </div>
  );
}
