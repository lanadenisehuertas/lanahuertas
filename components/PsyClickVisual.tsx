"use client";

/**
 * Recreation of the PsyClick hero illustration, rebuilt in this site's palette.
 *
 * Pure CSS/DOM rather than an exported image, so it stays crisp at any size and
 * the heatmap can animate. The layout mirrors the product's own hero: window
 * chrome, session report with its metric tiles, a hesitation heatmap, and two
 * floating annotation chips.
 */

const METRICS = [
  { k: "PHQ-9", v: "7" },
  { k: "GAD-7", v: "5" },
  { k: "PSI", v: "0.82", hot: true },
  { k: "PAI", v: "0.44" },
  { k: "T²", v: "3.2" },
  { k: "FLAG", v: "Normal", flag: true },
];

// Hesitation heatmap. 0 = calm, 1 = warm, 2 = hot. Right column trends warm,
// mirroring the "one topic ran hot" story the product tells.
const HEAT = [
  [0, 0, 0, 0, 2, 0, 1],
  [0, 0, 2, 2, 0, 0, 1],
  [2, 0, 0, 0, 0, 2, 1],
  [2, 0, 0, 2, 0, 0, 1],
  [0, 2, 0, 0, 2, 0, 1],
  [0, 0, 0, 0, 2, 0, 1],
];

const CELL = ["bg-lavender/25", "bg-fawn/70", "bg-eminence/45"];

export default function PsyClickVisual() {
  return (
    <div className="relative select-none" aria-hidden>
      {/* Window */}
      <div className="overflow-hidden rounded-xl border-2 border-ink bg-maize shadow-hard">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 border-b-2 border-ink/12 bg-lavender/15 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-eminence/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-fawn" />
          <span className="h-2.5 w-2.5 rounded-full bg-iris/60" />
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-12 shrink-0 flex-col items-center gap-2 bg-deep py-4 sm:flex">
            <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-eminence text-[10px] font-black text-maize">
              Ps
            </span>
            <span className="h-1.5 w-6 rounded-full bg-fawn" />
            <span className="h-1.5 w-6 rounded-full bg-maize/25" />
            <span className="h-1.5 w-6 rounded-full bg-maize/25" />
            <span className="h-1.5 w-6 rounded-full bg-maize/25" />
          </div>

          {/* Body */}
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold tracking-[0.18em] text-eminence uppercase">
                  Clinical overview
                </p>
                <p className="font-display mt-0.5 text-lg font-black tracking-tight text-ink">
                  Session Report
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-deep px-2.5 py-1 text-[9px] font-bold text-maize">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ee49a]" />
                GREEN
              </span>
            </div>

            {/* Metric tiles */}
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {METRICS.map((m) => (
                <div
                  key={m.k}
                  className={`rounded-lg border px-2 py-2 ${
                    m.flag
                      ? "border-transparent bg-deep text-maize"
                      : m.hot
                        ? "border-transparent bg-eminence text-maize"
                        : "border-ink/15 bg-lavender/10 text-ink"
                  }`}
                >
                  <p
                    className={`text-[8px] font-bold tracking-wide uppercase ${
                      m.flag || m.hot ? "text-maize/70" : "text-ink/45"
                    }`}
                  >
                    {m.k}
                  </p>
                  <p className="font-display mt-0.5 text-sm font-black tabular-nums">{m.v}</p>
                </div>
              ))}
            </div>

            {/* Hesitation heatmap */}
            <div className="mt-3 rounded-lg border border-ink/12 bg-lavender/8 p-2">
              <div className="grid grid-cols-7 gap-1">
                {HEAT.flatMap((row, r) =>
                  row.map((v, c) => (
                    <span
                      key={`${r}-${c}`}
                      className={`heat-cell aspect-square rounded-[3px] ${CELL[v]}`}
                      style={{ animationDelay: `${(r * 7 + c) * 28}ms` }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating annotations */}
      <div
        className="float-badge absolute -top-3 -left-3 max-w-[190px] rounded-lg border-2 border-ink bg-maize px-3 py-2 shadow-hard-sm sm:-left-8"
        style={{ animationDuration: "8s" }}
      >
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-eminence">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-maize stroke-[3]">
              <path d="M3 12h4l3-8 4 16 3-8h4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="font-display text-[10px] leading-tight font-black text-ink">
              Hotelling T²
            </p>
            <p className="mt-0.5 text-[9px] leading-snug text-ink/60">
              Baseline-aware anomaly review
            </p>
          </div>
        </div>
      </div>

      <div
        className="float-badge absolute -right-2 -bottom-3 rounded-lg border-2 border-ink bg-fawn px-3 py-2 shadow-hard-sm sm:-right-6"
        style={{ animationDuration: "10s", animationDelay: "-3s" }}
      >
        <p className="font-display text-[10px] font-black text-ink">Report ready</p>
      </div>
    </div>
  );
}
