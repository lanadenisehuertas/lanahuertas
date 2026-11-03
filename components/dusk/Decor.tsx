"use client";

import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";
import { isMuted, onMute, setMuted } from "@/lib/dusk/sound";

/* Small static pieces of the dusk sky. Motion is CSS (app/styles/dusk.css). */

type Pos = CSSProperties;

/** A soft colour blob, drifting and leaning away from the cursor. */
export function Blob({ color, style }: { color: string; style: Pos }) {
  return <div aria-hidden className="dk-blob" style={{ background: `radial-gradient(closest-side, ${color}, transparent)`, ...style }} />;
}

/* matte: lit side to shade with no white specular spot; "teal" is now a lavender moon */
const PLANETS = {
  pink: ["#f9b9d2", "#ec9cc0", "#b9709e", "236 156 192"],
  teal: ["#d2c4f6", "#ad9ae8", "#7d6cc8", "173 154 232"],
  peach: ["#f9d2b2", "#f0b59c", "#c98394", "240 181 156"],
} as const;

/** A flat gradient planet. Click to make it boing (the parent wires the chime). */
export function Planet({ hue, size, style, onPress }: { hue: keyof typeof PLANETS; size: number; style: Pos; onPress?: (el: HTMLElement) => void }) {
  const [a, b, c, glow] = PLANETS[hue];
  return (
    <button
      type="button"
      aria-label="A planet (plays a chime)"
      className="dk-planet"
      onClick={(e) => {
        const el = e.currentTarget;
        delete el.dataset.boing;
        void el.offsetWidth;
        el.dataset.boing = "";
        onPress?.(el);
      }}
      style={{
        width: size,
        height: size,
        border: 0,
        padding: 0,
        background: `radial-gradient(circle at 34% 30%, ${a} 0 28%, ${b} 58%, ${c})`,
        boxShadow: `0 0 ${size * 0.4}px rgb(${glow} / 0.25)`,
        ...style,
      }}
    />
  );
}

export function ORing({ size, style }: { size: number; style: Pos }) {
  return <div aria-hidden className="dk-oring" style={{ width: size, height: size, ...style }} />;
}

/** A crisp four-point star with a soft glow. */
export function GStar({ size, style }: { size: number; style: Pos }) {
  return <div aria-hidden className="dk-gstar" style={{ "--s": `${size}px`, ...style } as CSSProperties} />;
}

/** A hand-drawn curl that draws itself in. */
export function Curl({ style, color = "#fdf3e1", flip, delay = 0.4 }: { style: Pos; color?: string; flip?: boolean; delay?: number }) {
  return (
    <svg aria-hidden className="dk-curl" width="200" height="120" viewBox="0 0 200 120" style={{ ...(flip ? { scale: "-1 1" } : {}), ...style }}>
      <path
        style={{ "--len": 330, "--dd": `${delay}s` } as Pos}
        d="M10 100 C 40 20 120 10 140 60 C 160 110 90 120 100 70 C 110 30 170 30 190 50"
        fill="none"
        stroke={color}
        strokeOpacity=".7"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A thin tilted ring with a gold star riding it. */
export function SkyRing({ style }: { style: Pos }) {
  return (
    <svg aria-hidden viewBox="0 0 600 220" className="pointer-events-none absolute" style={{ translate: "calc(var(--mx,0)*6px) calc(var(--my,0)*6px)", ...style }}>
      <g transform="rotate(-8 300 110)">
        <ellipse cx="300" cy="110" rx="290" ry="82" fill="none" stroke="#fdf3e1" strokeOpacity=".45" strokeWidth="1.4" />
        <path d="M590 101L592 108L599 110L592 112L590 119L588 112L581 110L588 108Z" fill="#ffd98a" />
      </g>
    </svg>
  );
}

/** A fixed field of stars, thicker towards the top, painted once. */
export function Stars({ count = 170 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const paint = () => {
      const b = c.getBoundingClientRect(),
        dpr = Math.min(1.5, window.devicePixelRatio || 1),
        x = c.getContext("2d");
      if (!x || !b.width) return;
      c.width = Math.round(b.width * dpr);
      c.height = Math.round(b.height * dpr);
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let k = 0; k < count; k++) {
        const y = rnd() ** 1.8 * b.height * 0.7;
        x.fillStyle = `rgba(253,243,225,${0.25 + rnd() * 0.65})`;
        x.beginPath();
        x.arc(rnd() * b.width, y, rnd() * 1.3 + 0.3, 0, 7);
        x.fill();
      }
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(c);
    return () => ro.disconnect();
  }, [count]);
  return <canvas ref={ref} aria-hidden className="dk-canvas" style={{ zIndex: 0 }} />;
}

/** The one sound switch for the whole garden. */
export function MuteToggle({ className = "dk-mute" }: { className?: string }) {
  const m = useSyncExternalStore(onMute, isMuted, () => false);
  return (
    <button type="button" className={className} aria-pressed={!m} onClick={() => setMuted(!m)}>
      {m ? "♪ sound off" : "♪ sound on"}
    </button>
  );
}

/** Painted art from public/art/garden (matte, grainy, transparent). */
export function Art({ name, alt = "", className = "", style, w, h }: { name: string; alt?: string; className?: string; style?: Pos; w: number; h: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/art/garden/${name}.webp`} alt={alt} aria-hidden={alt ? undefined : true} width={w} height={h} loading="lazy" decoding="async" draggable={false} className={`dk-art ${className}`} style={style} />
  );
}
