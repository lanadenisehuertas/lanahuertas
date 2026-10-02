import type { CSSProperties } from "react";
import { profile, toolkit, workTabs, engineeringProjects } from "@/lib/content";
import ToolBadge from "./ToolBadge";
import { Lotus, Leaf, Sparkle4, Orb, Spiral } from "./Botanicals";

/*
 * App icons orbiting the portrait. Nothing to drag — they move on their own:
 *   - drift with the pointer (--depth),
 *   - glide up/down as the section scrolls past (--dy),
 *   - spring outward and tilt when you hover the portrait (--hx/--hy).
 * Each one also spins in on its own slice of the scroll (--i).
 */
const ORBIT = [
  { i: 0, size: 64, pos: { top: "4%", left: -40 }, depth: 18, dy: 40, hx: -26, hy: -14 }, // Ps
  { i: 2, size: 56, pos: { top: "38%", left: -38 }, depth: 26, dy: -30, hx: -30, hy: 0 }, // Pr
  { i: 1, size: 52, pos: { top: "72%", left: -30 }, depth: 14, dy: 50, hx: -24, hy: 16 }, // Ai
  { i: 3, size: 64, pos: { top: "10%", right: -40 }, depth: 22, dy: -40, hx: 26, hy: -14 }, // Ae
  { i: 4, size: 56, pos: { top: "44%", right: -38 }, depth: 30, dy: 34, hx: 30, hy: 0 }, // Ca
  { i: 5, size: 52, pos: { top: "76%", right: -30 }, depth: 16, dy: -46, hx: 24, hy: 16 }, // Fg
] as const;

const PIECES =
  workTabs.reduce((n, t) => n + t.projects.length, 0) + engineeringProjects.length;

const STATS = [
  { n: "7+", label: "years in Photoshop" },
  { n: "6", label: "years in Premiere Pro" },
  { n: String(PIECES), label: "pieces in this folio" },
];

const SHEET =
  "radial-gradient(70% 90% at 30% 20%, #fff6ea 0%, transparent 70%), linear-gradient(120deg, #a9b6f0 0%, #c9b9ec 38%, #f2b8cf 72%, #f6d3c3 100%)";

export default function AboutMe() {
  return (
    <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
      {/* Portrait — hover it and the icons spring out */}
      <div className="portrait-zone mx-auto w-full max-w-[300px] sm:max-w-[420px]">
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-4 -rotate-[3deg] overflow-hidden rounded-[6px] border border-ink/15 transition-transform duration-700 ease-out sm:-inset-6 [.portrait-zone:hover_&]:-rotate-[5deg]"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, #fff6ea 0%, transparent 70%), linear-gradient(180deg, #a9b6f0 0%, #c9b9ec 36%, #f2b8cf 70%, #f6d3c3 100%)",
            }}
          >
            <div className="band-grain absolute inset-0" />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/lana-portrait.webp"
            alt="Lana Denise Huertas"
            width={1136}
            height={1200}
            className="relative block aspect-[1136/1200] w-full rounded-[4px] border border-ink/40 object-cover object-top shadow-[6px_6px_0_var(--color-blush)]"
          />

          <span className="type-pixel absolute -bottom-3 left-4 rounded-[3px] border border-ink/30 bg-paper px-2 py-0.5 text-[10px] text-ink/70">
            lana_huertas.jpg
          </span>

          <div aria-hidden className="hidden sm:block">
            {ORBIT.map((o, k) => (
              <span
                key={toolkit[o.i].id}
                className="orbit absolute z-20"
                style={
                  {
                    ...o.pos,
                    "--depth": o.depth,
                    "--hx": `${o.hx}px`,
                    "--hy": `${o.hy}px`,
                  } as unknown as CSSProperties
                }
              >
                <span className="sl-badge sl-drift block" style={{ "--i": k, "--dy": `${o.dy}px` } as CSSProperties}>
                  <ToolBadge
                    tool={toolkit[o.i]}
                    size={o.size}
                    className="float-badge shadow-[3px_4px_0_rgb(27_7_48/0.25)]"
                    style={{ animationDuration: `${7 + k * 0.9}s`, animationDelay: `${-k * 1.1}s` }}
                  />
                </span>
              </span>
            ))}
          </div>

          <div aria-hidden className="pointer-events-none">
            <div className="sl-sprout absolute -bottom-10 -left-12 z-10 w-28 sm:w-36" style={{ "--i": 1 } as CSSProperties}>
              <Lotus className="sway w-full" deep />
            </div>
            <div className="sl-sprout absolute -right-10 -bottom-8 z-10 w-24 sm:w-32" style={{ "--i": 2 } as CSSProperties}>
              <Leaf className="sway w-full -rotate-[35deg]" />
            </div>
            <Spiral className="spin-slow absolute -top-10 left-[18%] z-10 w-10" stroke="#b9379d" />
            <Sparkle4 className="spin-slow absolute -top-6 right-[10%] z-10 h-8 w-8 text-white" />
            <Orb className="float-badge absolute top-[56%] -right-3 z-10 h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Copy */}
      <div>
        <p className="type-pixel text-[11px] text-ink/55">✦ Hello, I&apos;m Lana</p>
        <h3 className="type-display mt-3 text-[2rem] leading-[1.06] text-iris sm:text-[2.7rem]">
          {profile.aboutHeadline}
        </h3>
        <p className="type-display mt-2 text-3xl text-lavender italic sm:text-4xl">{profile.aboutKicker}</p>

        <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-ink/80">
          An adaptable creative with a meticulous eye and a sharp command of Illustrator. From publicity
          materials and scalable templates to paced video edits, I handle the creative heavy lifting so you
          don&apos;t have to.
        </p>

        {/* Stats — printed tiles, the number in italic on the sheet */}
        <ul className="mt-7 grid grid-cols-3 gap-3">
          {STATS.map((s, k) => (
            <li
              key={s.label}
              className="sl-pop group relative overflow-hidden rounded-[6px] border border-ink/15 transition-shadow duration-200 hover:shadow-[4px_4px_0_var(--color-sky)]"
              style={{ "--i": k * 0.6 } as CSSProperties}
            >
              <div className="relative h-14 overflow-hidden sm:h-16" style={{ background: SHEET }}>
                <div className="band-grain absolute inset-0" />
                <p className="type-display absolute bottom-0 left-3 text-4xl text-iris italic transition-transform duration-500 group-hover:-translate-y-1 sm:text-5xl">
                  {s.n}
                </p>
                <Sparkle4 className="absolute top-2 right-2 h-3 w-3 text-white transition-transform duration-500 group-hover:rotate-180" />
              </div>
              <p className="bg-white/60 px-3 py-2 text-[12px] leading-snug text-ink/75">{s.label}</p>
            </li>
          ))}
        </ul>

        {/* Toolbox — icon tiles, like a dock */}
        <div className="mt-7">
          <p className="type-pixel text-[10px] text-ink/55">Tools I work in</p>
          <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-4 xl:grid-cols-8">
            {toolkit.map((t, k) => (
              <li
                key={t.id}
                className="sl-pop group flex flex-col items-center gap-1.5 rounded-[6px] py-2 transition-colors duration-150 hover:bg-white/70"
                style={{ "--i": k * 0.35 } as CSSProperties}
              >
                <ToolBadge
                  tool={t}
                  size={38}
                  className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1.5 group-hover:scale-110"
                />
                <span className="text-center text-[11px] leading-tight text-ink/70">{t.name.replace("Adobe ", "")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
