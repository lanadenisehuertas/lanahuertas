import type { CSSProperties } from "react";
import { Bellflower, Blossom, Leaf, Lotus } from "../Botanicals";

type Plant = {
  kind: "lotus" | "bell" | "blossom" | "leaf";
  /** left edge, % of the bed's width */
  x: number;
  /** width, % of the bed's width */
  w: number;
  /** lift off the ground, % of the bed's height */
  y?: number;
  deep?: boolean;
  rot?: number;
  sway?: string;
};

/*
 * Two beds: a full one that runs the width of the section (the hero), and a
 * corner one that keeps the middle clear for copy and cards (the closing
 * sections). Both are the first portfolio's drawn botanicals, so the garden
 * reads as one hand all the way down the page.
 */
const FULL: Plant[] = [
  { kind: "leaf", x: -3, w: 16, y: 4, rot: -24 },
  { kind: "lotus", x: 2, w: 12, deep: true, sway: "8s" },
  { kind: "bell", x: 12, w: 6, y: 6, sway: "7s" },
  { kind: "lotus", x: 17, w: 8, sway: "9.5s" },
  { kind: "blossom", x: 26, w: 3.4, y: 22 },
  { kind: "bell", x: 31, w: 4.5, y: 2, rot: -8, deep: true, sway: "6.5s" },
  { kind: "leaf", x: 60, w: 12, y: 2, rot: -168 },
  { kind: "bell", x: 66, w: 5, y: 4, rot: 8, sway: "7.5s" },
  { kind: "lotus", x: 72, w: 9, deep: true, sway: "8.5s" },
  { kind: "blossom", x: 82, w: 3, y: 30 },
  { kind: "lotus", x: 85, w: 13, sway: "10s" },
  { kind: "leaf", x: 90, w: 14, y: 6, rot: -150 },
];

const CORNERS: Plant[] = [
  { kind: "leaf", x: -4, w: 15, y: 6, rot: -24 },
  { kind: "lotus", x: 0, w: 11, deep: true, sway: "8s" },
  { kind: "bell", x: 10, w: 5, y: 4, sway: "7s" },
  { kind: "lotus", x: 14, w: 7, sway: "9.5s" },
  { kind: "bell", x: 79, w: 5, y: 4, rot: 8, deep: true, sway: "7.5s" },
  { kind: "lotus", x: 83, w: 8, sway: "8.5s" },
  { kind: "lotus", x: 89, w: 12, deep: true, sway: "10s" },
  { kind: "leaf", x: 90, w: 14, y: 6, rot: -150 },
];

function PlantSvg({ p }: { p: Plant }) {
  const cls = "block w-full";
  if (p.kind === "lotus") return <Lotus className={cls} deep={p.deep} />;
  if (p.kind === "bell") return <Bellflower className={cls} deep={p.deep} />;
  if (p.kind === "blossom") return <Blossom className={`${cls} spin-slow`} deep={p.deep} />;
  return <Leaf className={cls} />;
}

/**
 * The flower bed along the foot of a section: drawn lotus, bellflowers,
 * blossoms and leaves, swaying, over a soft mist ground. Decorative only.
 */
export default function GardenBed({
  variant = "full",
  className = "",
  style,
}: {
  variant?: "full" | "corners";
  className?: string;
  style?: CSSProperties;
}) {
  const plants = variant === "full" ? FULL : CORNERS;
  return (
    <div aria-hidden className={`pa-bed pointer-events-none absolute inset-x-0 bottom-0 ${className}`} style={style}>
      <div className="pa-bed-ground" />
      {plants.map((p, i) => (
        <span
          key={i}
          className="absolute"
          style={{ left: `${p.x}%`, bottom: `${p.y ?? 0}%`, width: `${p.w}%` }}
        >
          <span
            className={p.kind === "leaf" || p.kind === "blossom" ? "block" : "sway block"}
            style={{ "--sway": p.sway ?? "8s", rotate: p.rot ? `${p.rot}deg` : undefined } as CSSProperties}
          >
            <PlantSvg p={p} />
          </span>
        </span>
      ))}
    </div>
  );
}
