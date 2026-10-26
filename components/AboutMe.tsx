import type { CSSProperties } from "react";
import { profile, toolkit, workTabs, engineeringProjects } from "@/lib/content";
import ToolBadge from "./ToolBadge";
import { Lotus, Leaf } from "./Botanicals";

/** An organisation the work was made for, shown by its first brand's key visual. */
export type Org = { name: string; src: string };

/*
 * App icons orbiting the snapshot. They drift with the pointer (--depth),
 * glide as the section scrolls (--dy) and spring outward when you hover the
 * photo (--hx/--hy); each spins in on its own slice of the scroll (--i).
 */
const ORBIT = [
  { i: 0, size: 60, pos: { top: "6%", left: -44 }, depth: 18, dy: 40, hx: -26, hy: -14 }, // Ps
  { i: 2, size: 52, pos: { top: "40%", left: -42 }, depth: 26, dy: -30, hx: -30, hy: 0 }, // Pr
  { i: 1, size: 48, pos: { top: "72%", left: -34 }, depth: 14, dy: 50, hx: -24, hy: 16 }, // Ai
  { i: 3, size: 60, pos: { top: "12%", right: -44 }, depth: 22, dy: -40, hx: 26, hy: -14 }, // Ae
  { i: 4, size: 52, pos: { top: "46%", right: -42 }, depth: 30, dy: 34, hx: 30, hy: 0 }, // Ca
  { i: 5, size: 48, pos: { top: "78%", right: -34 }, depth: 16, dy: -46, hx: 24, hy: 16 }, // Fg
] as const;

/* Pen doodles (scripts/gen-stickers.py) drawn around the snapshot. */
const DOODLES = [
  { name: "moon", className: "-top-12 -left-10 w-20 text-iris sm:w-24" },
  { name: "stars", className: "-top-10 right-0 w-16 text-lavender sm:w-20" },
  { name: "butterfly", className: "-right-12 bottom-24 w-16 -rotate-12 text-iris sm:w-20" },
  { name: "swirl", className: "-bottom-4 left-[38%] w-16 text-lavender" },
];

const PIECES = workTabs.reduce((n, t) => n + t.projects.length, 0) + engineeringProjects.length;

const STATS = [
  { n: "7+", label: "years in Photoshop" },
  { n: "6", label: "years in Premiere Pro" },
  { n: String(PIECES), label: "pieces in this folio" },
];

/** The photo, taped into the sketchbook with a pen caption, the apps and doodles around it. */
function Snapshot() {
  return (
    <div className="portrait-zone relative mx-auto w-full max-w-[290px] pt-6 sm:max-w-[350px]">
      <span aria-hidden className="halftone pointer-events-none absolute -inset-16 -z-10 opacity-30" />

      <figure className="relative -rotate-[3deg] bg-[#fffdf8] p-3 pb-16 shadow-[0_30px_50px_-30px_rgb(27_7_48/0.6),0_2px_6px_rgb(27_7_48/0.15)] transition-transform duration-700 ease-out [.portrait-zone:hover_&]:-rotate-[5deg]">
        <span aria-hidden className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/lana-portrait.webp"
          alt="Lana Denise Huertas"
          width={1136}
          height={1200}
          loading="lazy"
          decoding="async"
          className="block aspect-[1136/1200] w-full object-cover object-top"
        />
        <figcaption className="hand absolute right-4 bottom-4 left-4 text-[1.55rem] text-ink/75">me, probably redesigning something</figcaption>
      </figure>

      {/* App icons */}
      <div aria-hidden className="hidden sm:block">
        {ORBIT.map((o, k) => (
          <span
            key={toolkit[o.i].id}
            className="orbit absolute z-20"
            style={{ ...o.pos, "--depth": o.depth, "--hx": `${o.hx}px`, "--hy": `${o.hy}px` } as unknown as CSSProperties}
          >
            <span className="sl-badge sl-drift block" style={{ "--i": k, "--dy": `${o.dy}px` } as CSSProperties}>
              <ToolBadge tool={toolkit[o.i]} size={o.size} />
            </span>
          </span>
        ))}
      </div>

      {/* Doodles and two pieces of the garden */}
      <div aria-hidden className="pointer-events-none">
        {DOODLES.map((d) => (
          <span key={d.name} className={`doodle absolute z-30 ${d.className}`} style={{ "--doodle": `url(/art/ink/${d.name}.webp)` } as CSSProperties} />
        ))}
        <Lotus className="absolute -bottom-10 -left-14 z-10 w-28 sm:w-32" deep />
        <Leaf className="absolute -right-10 -bottom-6 z-10 w-24 -rotate-[35deg] sm:w-28" />
      </div>
    </div>
  );
}

/**
 * About me, as a sketchbook page on the sky: the snapshot taped in with the
 * apps and doodles around it, then the words, the numbers on ruled lines
 * and the organisations the work was made for.
 */
export default function AboutMe({ orgs }: { orgs: Org[] }) {
  return (
    <div className="grid items-center gap-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
      <Snapshot />

      <div>
        <p className="hand">hello, I&apos;m Lana —</p>
        <h3 className="type-display mt-4 text-[2rem] leading-[1.06] text-iris sm:text-[2.7rem]">{profile.aboutHeadline}</h3>
        <p className="type-display mt-2 text-3xl text-lavender italic sm:text-4xl">{profile.aboutKicker}</p>
        <p className="mt-6 max-w-xl text-base leading-[1.75] text-ink/80 sm:text-[15px]">
          Publicity art, scalable templates and paced video edits for student organizations and clients, and, as a Computer Science
          student, the interfaces I design I can also build. Detail-obsessed and always on time.
        </p>

        <dl className="mt-9 grid grid-cols-3 divide-x divide-ink/15 border-y border-ink/15">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col px-4 py-4 first:pl-0">
              <dt className="type-pixel order-2 mt-1 text-[10px] text-ink/60">{s.label}</dt>
              <dd className="type-display -order-1 text-5xl text-iris italic">{s.n}</dd>
            </div>
          ))}
        </dl>

        <p className="hand mt-9">made for —</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-5">
          {orgs.map((o) => (
            <li key={o.name} className="flex w-[76px] flex-col items-center gap-2 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={o.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-16 w-16 rounded-full border border-ink object-cover shadow-[2px_2px_0_var(--color-ink)]"
              />
              <span className="type-pixel text-[9px] leading-tight text-ink/70">{o.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
