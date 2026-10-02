import { engineeringProjects } from "@/lib/content";
import PsyClickVisual from "./PsyClickVisual";
import DebtLedgerVisual from "./DebtLedgerVisual";

const VISUALS = {
  psyclick: PsyClickVisual,
  debtledger: DebtLedgerVisual,
} as const;

/**
 * Software engineering work, as a numbered list. Each entry gets its own
 * product visual — adding a project means appending to `engineeringProjects`
 * and registering its visual above.
 */
export default function CaseStudy() {
  return (
    <div className="space-y-16">
      {engineeringProjects.map((p, i) => {
        const Visual = VISUALS[p.visual];
        return (
          <article key={p.id} data-rv className={i > 0 ? "border-t border-ink/12 pt-16" : undefined}>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
              {/* Copy */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="type-pixel text-lg text-eminence/85 tabular-nums">
                    {p.n}
                  </span>
                  <h3 className="type-display text-5xl sm:text-6xl">
                    {p.title}
                  </h3>
                </div>

                <p className="type-display mt-2 pl-[2.6rem] text-2xl text-eminence sm:text-3xl">
                  {p.tagline}
                </p>

                <div className="mt-5 max-w-xl space-y-3 text-sm leading-relaxed text-ink/80 sm:text-base">
                  {p.description.split("\n\n").map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
                </div>

                <dl className="mt-7 space-y-3">
                  <div>
                    <dt className="type-pixel text-[10px] text-eminence">
                      Role
                    </dt>
                    <dd className="text-sm">{p.role}</dd>
                  </div>
                  <div>
                    <dt className="type-pixel text-[10px] text-eminence">
                      Year
                    </dt>
                    <dd className="text-sm tabular-nums">{p.year}</dd>
                  </div>
                  <div>
                    <dt className="type-pixel text-[10px] text-eminence">
                      Built with
                    </dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-[4px] bg-white/40 px-3 py-1 text-xs font-medium ring-1 ring-ink/10 transition-colors duration-200 hover:bg-fawn/45"
                        >
                          {s}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>

                {p.href && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gel type-pixel mt-7 inline-flex min-h-[48px] items-center px-7 text-[11px]"
                  >
                    {p.hrefLabel ?? "View project"}
                  </a>
                )}
              </div>

              {/* Product visual */}
              <div className="px-4 sm:px-8 lg:px-0">{Visual && <Visual />}</div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
