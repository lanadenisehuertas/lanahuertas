import type { CSSProperties } from "react";
import { profile, software } from "@/lib/content";
import EdgeRail from "./EdgeRail";
import MorphName from "./MorphName";

const TICKER = [
  "UI/UX design",
  "Graphic design",
  "Brand systems",
  "Video editing",
  "Motion graphics",
  "Software engineering",
  "Figma prototypes",
  "Design systems",
];

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Flim-style opener: a readout strip, the name on one line at full measure,
 * then a two-column footer — the pitch on the left, actions on the right —
 * and a slow ticker closing the fold.
 */
export default function Hero() {
  return (
    <section className="relative pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div data-rv style={d(0)}>
          <EdgeRail
            className="border-b pb-3"
            items={[
              { label: "Portfolio — Vol. 01" },
              { label: `Now: ${profile.now}` },
              { label: "Manila, PH" },
              { label: "Est. 2019" },
            ]}
          />
        </div>

        {/*
         * One line, one size, in Redaction Regular — the clean cut of the
         * family the letters decay into on hover, so the glitch lands exactly
         * on the letterforms.
         */}
        <div data-rv style={d(120)} className="relative mt-10 sm:mt-14">
          <MorphName
            label={profile.name}
            words={[
              {
                text: "LANA DENISE",
                italic: false,
                className: "type-name text-[14.6vw] whitespace-nowrap text-maize xl:text-[11.4rem]",
              },
            ]}
          />

          {/* Hover hint — a flat Mac tooltip, desktop only */}
          <span
            aria-hidden
            className="type-pixel pointer-events-none absolute -top-7 right-2 hidden items-center gap-1.5 rounded-[2px] border border-ink bg-maize px-1.5 py-0.5 text-[10px] text-ink md:flex"
          >
            <svg viewBox="0 0 16 24" className="h-3.5 w-2.5" shapeRendering="crispEdges">
              <path d="M1 1v17l4-4 3 7 3-1-3-7h6z" fill="#1b0730" />
            </svg>
            hover the name
          </span>
        </div>

        <div className="mt-10 grid gap-8 pt-6 sm:mt-12 md:grid-cols-12">
          <span data-rv="rule" style={d(260)} className="col-span-full -mt-6 block h-px bg-maize/20" />

          <p
            data-rv
            style={d(320)}
            className="text-xl leading-snug font-medium tracking-[-0.015em] text-maize md:col-span-6 sm:text-[1.65rem]"
          >
            {profile.heroShort}
            <span aria-hidden className="caret ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.12em] bg-fawn" />
          </p>

          <div data-rv style={d(420)} className="flex flex-col gap-5 md:col-span-5 md:col-start-8">
            <div className="flex flex-wrap gap-3">
              <a href="#work" className="gel type-pixel flex min-h-[46px] items-center gap-2 px-5 text-[12px]">
                See the work <span aria-hidden>↓</span>
              </a>
              <a
                href="#contact"
                className="gel-ghost type-pixel flex min-h-[46px] items-center gap-2 px-5 text-[12px]"
              >
                Contact <span aria-hidden>↗</span>
              </a>
            </div>

            <div className="type-pixel flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[11px] text-maize/60">
              <span className="mr-1">Tools</span>
              {software.map((s) => (
                <span
                  key={s}
                  className="flex h-7 min-w-7 items-center justify-center rounded-[2px] border border-maize/25 px-1.5 text-maize transition-colors duration-100 hover:bg-maize hover:text-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div
        data-rv
        style={d(520)}
        className="ticker-wrap mt-16 overflow-hidden border-y border-maize/15 py-2.5"
        aria-hidden
      >
        <div className="ticker type-pixel text-[12px] text-maize/70">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0">
              {TICKER.map((t) => (
                <span key={t} className="flex items-center gap-6 pr-6">
                  {t}
                  <span className="text-fawn">↗</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
