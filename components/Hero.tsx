import type { CSSProperties } from "react";
import { profile } from "@/lib/content";
import MorphName from "./MorphName";
import { Lotus, Leaf, Spiral, Sparkle4, Orb, Vine } from "./Botanicals";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const depth = (n: number, sway?: string) =>
  ({ "--depth": n, ...(sway ? { "--sway": sway } : {}) }) as CSSProperties;

/**
 * Poster-style opener, after the botanical portfolio covers: a date line, the
 * name on one line in a thin serif, then a gradient band with flowers spilling
 * over its edges. Corner labels pin the composition like a printed sheet.
 *
 * Interactive layers: the name (hover decays letters, the cursor lifts them,
 * click scrambles) and the garden (drifts with the pointer, lotus blooms on
 * hover, and the band widens as the page scrolls).
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        {/* Name — one line, one size */}
        <div data-rv style={d(80)} className="relative mt-6 text-center sm:mt-10">
          <MorphName
            label={profile.name}
            words={[
              {
                text: "Lana Denise",
                italic: false,
                className: "type-name text-[17vw] whitespace-nowrap text-iris xl:text-[13.5rem]",
              },
            ]}
          />
          <Sparkle4 className="spin-slow pointer-events-none absolute top-[6%] right-[4%] h-8 w-8 text-sky sm:h-12 sm:w-12" />
          <Sparkle4 className="pointer-events-none absolute bottom-[8%] left-[3%] h-5 w-5 text-lavender sm:h-7 sm:w-7" />
        </div>
      </div>

      {/* Garden band — the same printed sheet as the end card, so the page
          opens and closes on one design. */}
      <div data-rv style={d(260)} className="relative mx-auto mt-2 max-w-6xl px-4 sm:px-8">
        <div className="bloom bloom-zone relative h-[50vw] max-h-[460px] min-h-[260px]">
          {/* The sheet */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-[14%] bottom-[8%] overflow-hidden rounded-[6px] border border-ink/20"
            style={{
              background:
                "radial-gradient(55% 75% at 50% 60%, #fff6ea 0%, transparent 70%), linear-gradient(180deg, #a9b6f0 0%, #c9b9ec 34%, #f2b8cf 68%, #f6d3c3 100%)",
            }}
          >
            <div className="band-grain absolute inset-0" />
            <Sparkle4 className="px sl-par absolute top-[16%] left-[24%] h-4 w-4 text-white" />
            <Sparkle4 className="px sl-par spin-slow absolute top-[48%] right-[20%] h-7 w-7 text-white/90" />
            <Sparkle4 className="px sl-par absolute top-[26%] right-[38%] h-3 w-3 text-white" />
            <Sparkle4 className="px sl-par absolute bottom-[20%] left-[38%] h-5 w-5 text-white/80" />
          </div>

          {/* Back layer: vines sweeping in over the top corners */}
          <div className="px sl-par absolute -top-[2%] left-[1%] w-[32%] sm:w-[27%]" style={depth(-8)}>
            <Vine className="w-full" />
          </div>
          <div className="px sl-par absolute top-0 right-0 w-[32%] sm:w-[27%]" style={depth(-8)}>
            <Vine className="w-full" flip />
          </div>

          {/* Mid layer: leaves, spirals, beads */}
          <div className="px sl-par absolute bottom-[0%] -left-[2%] w-[24%] sm:w-[18%]" style={depth(14)}>
            <Leaf className="sway w-full -rotate-[28deg]" />
          </div>
          <div className="px sl-par absolute top-[8%] right-[6%] w-[20%] sm:w-[15%]" style={depth(16)}>
            <Leaf className="sway w-full rotate-[152deg]" />
          </div>
          <div className="px sl-par absolute right-[2%] bottom-[2%] w-[18%] sm:w-[13%]" style={depth(12, "8s")}>
            <Leaf className="sway w-full -rotate-[150deg]" />
          </div>
          <div className="px sl-par absolute top-[8%] left-[28%] w-[7%]" style={depth(22)}>
            <Spiral className="spin-slow w-full" />
          </div>
          <div className="px sl-par absolute top-[30%] right-[30%] w-[5%]" style={depth(20)}>
            <Spiral className="spin-slow w-full" stroke="#b9379d" />
          </div>
          <div className="px sl-par absolute right-[27%] bottom-[6%] w-[5%]" style={depth(26)}>
            <Orb className="float-badge w-full" />
          </div>
          <div className="px sl-par absolute top-[22%] left-[13%] w-[3.5%]" style={depth(30)}>
            <Orb className="float-badge w-full" />
          </div>
          <div className="px sl-par absolute top-[40%] left-[42%] w-[2.5%]" style={depth(34)}>
            <Orb className="float-badge w-full" />
          </div>

          {/* Front: the lotus bed */}
          <div className="px sl-par absolute bottom-0 left-[31%] w-[38%] sm:left-[35%] sm:w-[30%]" style={depth(24)}>
            <Lotus className="sway w-full" />
          </div>
          <div className="px sl-par absolute right-[13%] bottom-[5%] w-[17%] sm:w-[13%]" style={depth(34, "9s")}>
            <Lotus className="sway w-full" deep />
          </div>
          <div className="px sl-par absolute bottom-[8%] left-[16%] w-[13%] sm:w-[10%]" style={depth(30, "8s")}>
            <Lotus className="sway w-full" deep />
          </div>
          <div className="px sl-par absolute bottom-[4%] left-[30%] w-[9%] sm:w-[7%]" style={depth(38, "10s")}>
            <Lotus className="sway w-full" />
          </div>
          <div className="px sl-par absolute right-[28%] bottom-[2%] w-[8%] sm:w-[6%]" style={depth(40, "6.5s")}>
            <Lotus className="sway w-full" />
          </div>
        </div>
      </div>

      {/* Subline, after ref 1's "GRAPHIC DESIGN / Graphic / Visual / …" */}
      <div className="mx-auto mt-12 max-w-6xl px-4 text-center sm:px-8">

        <p
          data-rv
          style={d(420)}
          className="type-display mx-auto mt-8 max-w-2xl text-3xl leading-tight text-ink italic sm:text-[2.6rem]"
        >
          {profile.heroShort}
        </p>

        <div data-rv style={d(480)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#work" className="gel flex min-h-[46px] items-center gap-2 px-5">
            See the work <span aria-hidden>↓</span>
          </a>
          <a href="#contact" className="gel-ghost flex min-h-[46px] items-center gap-2 px-5">
            Contact <span aria-hidden>↗</span>
          </a>
        </div>

      </div>

    </section>
  );
}
