import type { CSSProperties } from "react";
import { profile, toolkit, workTabs, engineeringProjects } from "@/lib/content";
import ToolBadge from "./ToolBadge";
import { Lotus, Leaf, Sparkle4, Orb, Spiral, Bellflower } from "./Botanicals";
import { Butterfly, PixelFlower, Star5, PixelArt } from "./Ethereal";

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
            <span className="bokeh absolute top-[6%] right-[8%] h-24 w-24 opacity-60" style={{ "--bk": "#ffffff" } as CSSProperties} />
            <div className="dither absolute inset-x-0 bottom-0 h-[46%] opacity-70" />
            <div className="band-grain absolute inset-0" />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/lana-portrait.webp"
            alt="Lana Denise Huertas"
            width={1136}
            height={1200}
            className="relative block aspect-[1136/1200] w-full rounded-[4px] border border-ink/40 object-cover object-top"
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
                    className="float-badge"
                    style={{ animationDuration: `${7 + k * 0.9}s`, animationDelay: `${-k * 1.1}s` }}
                  />
                </span>
              </span>
            ))}
          </div>

          <div aria-hidden className="pointer-events-none">
            <div className="sl-sprout absolute -bottom-10 -left-12 z-10 w-28 sm:w-36" style={{ "--i": 1 } as CSSProperties} data-react="lotus">
              <span className="react block"><Lotus className="sway w-full" deep /></span>
            </div>
            <div className="sl-sprout absolute -right-10 -bottom-8 z-10 w-24 sm:w-32" style={{ "--i": 2 } as CSSProperties} data-react="leaf">
              <span className="react block"><Leaf className="sway w-full -rotate-[35deg]" /></span>
            </div>
            <Spiral className="spin-slow absolute -top-10 left-[18%] z-10 w-10" stroke="#b9379d" />
            <Sparkle4 className="spin-slow absolute -top-6 right-[10%] z-10 h-8 w-8 text-white" />
            <Orb className="float-badge absolute top-[56%] -right-3 z-10 h-5 w-5" />
            <div className="sl-sprout absolute -bottom-6 left-[22%] z-10 w-12 sm:w-16" style={{ "--i": 2 } as CSSProperties} data-react="bell">
              <span className="react block"><Bellflower className="sway w-full" /></span>
            </div>
            <PixelFlower className="absolute -top-4 left-[44%] z-10 h-6 w-6" />
            <PixelArt name="swirl" className="absolute -bottom-8 right-[18%] z-10 w-24 opacity-90" />
            <PixelArt name="heart" className="absolute top-[10%] left-[10%] z-10 w-5" />
            <PixelArt name="daisy" className="absolute -top-5 right-[30%] z-10 w-7" />
            <Star5 className="twinkle absolute top-[34%] -left-4 z-10 h-3 w-3 text-white" />
            <span className="absolute -top-12 -right-6 z-30 w-16 sm:-right-10 sm:w-20" data-react="butterfly">
              <span className="react block">
                <span className="flutter block" style={{ "--dur": "9s" } as CSSProperties}>
                  <Butterfly className="w-full -rotate-[12deg]" style={{ "--flap": "1.25s" } as CSSProperties} />
                </span>
              </span>
            </span>
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

        <p className="mt-6 max-w-xl text-base leading-[1.75] text-ink/80 sm:text-[15px]">
          Publicity art, scalable templates and paced video edits for student organizations and clients, and,
          as a Computer Science student, the interfaces I design I can also build. Detail-obsessed and always on
          time.
        </p>

        {/* Stats — printed tiles, the number in italic on the sheet */}
        <ul className="mt-7 grid grid-cols-3 gap-3">
          {STATS.map((s, k) => (
            <li
              key={s.label}
              className="sl-pop sheet-card group relative"
              style={{ "--i": k * 0.6 } as CSSProperties}
            >
              <div className="sheet-band relative h-14 overflow-hidden sm:h-16">
                <p className="type-display absolute bottom-0 left-3 text-4xl text-iris italic transition-transform duration-500 group-hover:-translate-y-1 sm:text-5xl">
                  {s.n}
                </p>
                <Sparkle4 className="absolute top-2 right-2 h-3 w-3 text-white transition-transform duration-500 group-hover:rotate-180" />
              </div>
              <p className="px-3 py-2 text-[12px] leading-snug text-ink/75">{s.label}</p>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
