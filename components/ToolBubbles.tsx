"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { toolkit } from "@/lib/content";

type Tool = (typeof toolkit)[number];
type ToolId = Tool["id"];

const byId = (id: ToolId) => toolkit.find((t) => t.id === id)!;

/* Canva and Figma are not lettermarks, so they use the real tile artwork. */
const MARKS: Partial<Record<ToolId, string>> = {
  ca: "/logos/canva.webp",
  fg: "/logos/figma.webp",
};

/* What the label says once a bubble pops. Years only where they are known. */
const POP_LABEL: Record<ToolId, string> = {
  ps: "Photoshop · 7+ yrs",
  ai: "Illustrator",
  pr: "Premiere Pro · 6 yrs",
  ae: "After Effects",
  ca: "Canva",
  fg: "Figma",
  py: "Python",
  js: "JavaScript",
};

/** Short names for captions under the tiles. */
export const SHORT_NAME: Record<ToolId, string> = {
  ps: "Photoshop",
  ai: "Illustrator",
  pr: "Premiere Pro",
  ae: "After Effects",
  ca: "Canva",
  fg: "Figma",
  py: "Python",
  js: "JavaScript",
};

/**
 * The app's own tile: a rounded square on the product's dark ground. Adobe's
 * apps brand themselves with a two-letter glyph in a heavy grotesk and a rim
 * in the glyph colour, so for those the glyph is the logo; Canva and Figma
 * fill the tile edge to edge with their real artwork.
 */
export function ToolTile({ id, className = "", label = true }: { id: ToolId; className?: string; label?: boolean }) {
  const tool = byId(id);
  const mark = MARKS[id];
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label ? tool.name : undefined}
      aria-hidden={label ? undefined : true}
      className={`tool-tile ${className}`}
      data-tool={id}
      style={{ "--tile-bg": tool.bg, "--tile-fg": tool.fg } as CSSProperties}
    >
      {mark ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mark} alt="" aria-hidden width={192} height={192} loading="lazy" decoding="async" />
      ) : (
        <span className="tool-tile-glyph">{tool.label}</span>
      )}
    </span>
  );
}

/* Twelve sparkles per burst (white, pink, lilac), evenly round with a little jitter. */
const SPARKS = Array.from({ length: 12 }, (_, i) => ({
  a: i * 30 + ((i * 17) % 11) - 5,
  d: 46 + ((i * 29) % 26),
  s: 0.55 + ((i * 7) % 5) * 0.12,
  tone: ["", "is-pink", "is-lilac"][i % 3],
}));

type Spot = { id: ToolId; x: string; y: string; dur?: number; delay?: number };

const POP_MS = 2000; // gone this long, then it grows back
const REGROW_MS = 760;

/**
 * One logo bubble: the app tile inside a glossy soap-bubble with an
 * iridescent rim. Tap (or Enter/Space) pops it into a ring and a spray of
 * four-point sparkles with the app's name; two seconds later it grows back
 * from a dot with a soft wobble.
 */
function Bubble({ spot, i, onPop }: { spot: Spot; i: number; onPop: (text: string) => void }) {
  const [state, setState] = useState<"idle" | "popped" | "regrow">("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const pop = () => {
    if (state === "popped") return;
    timers.current.forEach((t) => window.clearTimeout(t));
    setState("popped");
    onPop(`${POP_LABEL[spot.id]}. It grows back in two seconds.`);
    timers.current = [
      window.setTimeout(() => setState("regrow"), POP_MS),
      window.setTimeout(() => setState("idle"), POP_MS + REGROW_MS),
    ];
  };

  const tool = byId(spot.id);
  return (
    <div
      className="tb"
      data-state={state}
      style={
        {
          "--x": spot.x,
          "--y": spot.y,
          "--bob": `${spot.dur ?? 8 + (i % 4) * 1.3}s`,
          "--bob-delay": `${-(spot.delay ?? i * 1.7)}s`,
        } as CSSProperties
      }
    >
      <div className="tb-float">
        <button type="button" className="tb-bubble" aria-label={`Pop ${tool.name}`} onClick={pop}>
          <ToolTile id={spot.id} label={false} className="tb-tile" />
        </button>
        <span aria-hidden className="tb-ring" />
        <span aria-hidden className="tb-sparks">
          {SPARKS.map((s, k) => (
            <i
              key={k}
              className={s.tone || undefined}
              style={{ "--a": `${s.a}deg`, "--d": `${s.d}px`, "--s": s.s } as CSSProperties}
            />
          ))}
        </span>
        <span aria-hidden className="tb-label">
          {state === "idle" ? SHORT_NAME[spot.id] : POP_LABEL[spot.id]}
        </span>
      </div>
    </div>
  );
}

/* Around the arched portrait: three in each margin, clear of the photo. */
const ORBIT: Spot[] = [
  { id: "ps", x: "7%", y: "13%" },
  { id: "ai", x: "9.5%", y: "41%" },
  { id: "pr", x: "6%", y: "67%" },
  { id: "ae", x: "93%", y: "19%" },
  { id: "fg", x: "90.5%", y: "46%" },
  { id: "ca", x: "93.5%", y: "72%" },
];

/* In the empty space under the about text (desktop). */
const MEADOW: Spot[] = [
  { id: "py", x: "22%", y: "52%" },
  { id: "js", x: "52%", y: "34%" },
];

/* Phones and tablets: one loose cluster under the portrait. */
const ROW: Spot[] = (["ps", "ai", "pr", "ae", "fg", "ca", "py", "js"] as const).map((id) => ({ id, x: "0", y: "0" }));

/**
 * The app logos as bubbles you can pop.
 *   orbit   absolutely placed in the portrait column's margins (desktop)
 *   meadow  a reserved strip under the about text (desktop)
 *   row     an in-flow cluster under the portrait (phones, tablets)
 */
export default function ToolBubbles({ variant, className = "" }: { variant: "orbit" | "meadow" | "row"; className?: string }) {
  const [said, setSaid] = useState("");
  const spots = variant === "orbit" ? ORBIT : variant === "meadow" ? MEADOW : ROW;

  return (
    <div className={`tb-field tb-${variant} ${className}`}>
      {variant === "meadow" && (
        <>
          <span aria-hidden className="tb-plain" style={{ "--x": "78%", "--y": "58%", "--r": "34px" } as CSSProperties} />
          <span aria-hidden className="tb-plain" style={{ "--x": "36%", "--y": "16%", "--r": "18px" } as CSSProperties} />
          <span aria-hidden className="tb-plain" style={{ "--x": "66%", "--y": "84%", "--r": "14px" } as CSSProperties} />
        </>
      )}
      {spots.map((s, i) => (
        <Bubble key={s.id} spot={s} i={i} onPop={setSaid} />
      ))}
      <span className="sr-only" aria-live="polite">
        {said}
      </span>
    </div>
  );
}
