"use client";

/**
 * Recreation of the Debt Payoff Ledger interface, rebuilt in this site's
 * palette. Same approach as PsyClickVisual: CSS rather than a screenshot, so
 * it stays sharp at any size and the allocation bar can animate.
 *
 * Mirrors the app's own structure — overview tiles, the split allocator, and
 * the debt ledger rows.
 */

const TILES = [
  { k: "Owed total", v: "₱4,850" },
  { k: "Due soonest", v: "Fri" },
  { k: "Allowances left", v: "3" },
];

const DEBTS = [
  { name: "Books", amount: "₱1,200", due: "Fri", hot: true },
  { name: "Org fee", amount: "₱850", due: "Mon" },
  { name: "Lab kit", amount: "₱2,800", due: "Nov 28" },
];

export default function DebtLedgerVisual() {
  return (
    <div className="relative select-none" aria-hidden>
      <div className="overflow-hidden rounded-xl border-2 border-ink bg-maize shadow-hard">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 border-b-2 border-ink/12 bg-lavender/15 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-eminence/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-fawn" />
          <span className="h-2.5 w-2.5 rounded-full bg-iris/60" />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="type-pixel text-[10px] text-eminence">Weekly allocator</p>
              <p className="font-display mt-0.5 text-lg font-black tracking-tight text-ink">
                Student Budget
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-deep px-2.5 py-1 text-[10px] font-bold text-maize">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5ee49a]" />
              ALL CLEAR
            </span>
          </div>

          {/* Overview tiles */}
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {TILES.map((t) => (
              <div key={t.k} className="rounded-lg border border-ink/15 bg-lavender/10 px-2 py-2">
                <p className="text-[10px] font-bold tracking-wide text-ink/45 uppercase">{t.k}</p>
                <p className="font-display mt-0.5 text-sm font-black text-ink tabular-nums">
                  {t.v}
                </p>
              </div>
            ))}
          </div>

          {/* Split allocator — essentials held back first, remainder to debt */}
          <div className="mt-3 rounded-lg border border-ink/12 bg-lavender/8 p-3">
            <div className="flex items-baseline justify-between">
              <p className="type-pixel text-[10px] text-ink/45">Split this allowance</p>
              <p className="font-display text-[11px] font-black text-ink tabular-nums">₱1,500</p>
            </div>

            <div className="mt-2 flex h-6 overflow-hidden rounded-md border border-ink/20">
              <div className="alloc-fill flex items-center justify-center bg-fawn" style={{ width: "40%" }}>
                <span className="type-pixel text-[10px] text-ink">Food</span>
              </div>
              <div
                className="alloc-fill flex items-center justify-center bg-eminence"
                style={{ width: "60%", animationDelay: "160ms" }}
              >
                <span className="type-pixel text-[10px] text-maize">Debt</span>
              </div>
            </div>

            <div className="mt-1.5 flex justify-between">
              <span className="text-[10px] text-ink/50">Keep for food / school</span>
              <span className="text-[10px] text-ink/50">Nearest due first</span>
            </div>
          </div>

          {/* Debt ledger */}
          <div className="mt-3 space-y-1.5">
            {DEBTS.map((d) => (
              <div
                key={d.name}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${
                  d.hot ? "border-eminence/50 bg-eminence/10" : "border-ink/12 bg-lavender/8"
                }`}
              >
                <span className="flex-1 text-[11px] font-semibold text-ink">{d.name}</span>
                <span className="font-display text-[11px] font-black text-ink tabular-nums">
                  {d.amount}
                </span>
                <span
                  className={`type-pixel rounded px-1.5 py-0.5 text-[10px] ${
                    d.hot ? "bg-eminence text-maize" : "bg-ink/10 text-ink/50"
                  }`}
                >
                  {d.due}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating annotations */}
      <div
        className="float-badge absolute -top-3 -left-3 max-w-[180px] rounded-lg border-2 border-ink bg-maize px-3 py-2 shadow-hard-sm sm:-left-8"
        style={{ animationDuration: "8s" }}
      >
        <p className="font-display text-[10px] leading-tight font-black text-ink">Local-first</p>
        <p className="mt-0.5 text-[10px] leading-snug text-ink/60">
          Stays on device unless sync is on
        </p>
      </div>

      <div
        className="float-badge absolute -right-2 -bottom-3 rounded-lg border-2 border-ink bg-fawn px-3 py-2 shadow-hard-sm sm:-right-6"
        style={{ animationDuration: "10s", animationDelay: "-3s" }}
      >
        <p className="font-display text-[10px] font-black text-ink">Editable until confirmed</p>
      </div>
    </div>
  );
}
