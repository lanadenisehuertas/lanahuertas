import type { caseStudy as CaseStudyData } from "@/lib/content";

/**
 * The engineering section isn't a gallery — it's one project, presented the way
 * the product itself is presented. Structure follows the live site: hero,
 * badges, sample report, pillars, pipeline.
 */
export default function CaseStudy({ data }: { data: typeof CaseStudyData }) {
  return (
    <article>
      {/* ---- Hero ---------------------------------------------------- */}
      <p className="font-display text-[11px] font-bold tracking-[0.2em] text-eminence uppercase">
        {data.eyebrow}
      </p>

      <div className="mt-3 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
        <div>
          <h3 className="font-display text-4xl leading-[0.95] font-black tracking-tighter sm:text-6xl">
            {data.headline}
          </h3>
          <p className="font-display mt-2 text-2xl font-black tracking-tight text-eminence sm:text-3xl">
            {data.product}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/75 sm:text-base">
            {data.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {data.badges.map((b) => (
              <span
                key={b}
                className="rounded-full border-2 border-ink/25 px-3 py-1 text-[11px] font-bold"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Sample session report — the product's own hero artefact */}
        <div className="rounded-xl border-2 border-ink bg-deep p-5 text-maize">
          <div className="flex items-center justify-between">
            <p className="font-display text-[10px] font-bold tracking-[0.18em] text-fawn uppercase">
              {data.report.label}
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-maize/15 px-2.5 py-1 text-[10px] font-bold">
              <span className="h-2 w-2 rounded-full bg-[#4ade80]" aria-hidden />
              {data.report.flag}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-5 gap-2">
            {data.report.metrics.map((m) => (
              <div key={m.k} className="rounded-lg bg-maize/10 px-2 py-2.5 text-center">
                <dt className="text-[9px] font-bold tracking-wide text-fawn uppercase">{m.k}</dt>
                <dd className="font-display mt-0.5 text-base font-black tabular-nums">{m.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ---- Problem ------------------------------------------------- */}
      <div className="mt-10 border-t-2 border-ink/12 pt-7">
        <p className="max-w-3xl text-sm leading-relaxed text-ink/80 sm:text-base">{data.problem}</p>
      </div>

      {/* ---- Pillars ------------------------------------------------- */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.pillars.map((p) => (
          <div key={p.title} className="rounded-xl border-2 border-ink/20 bg-lavender/12 p-4">
            <p className="font-display text-sm font-black tracking-tight">{p.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink/70">{p.body}</p>
          </div>
        ))}
      </div>

      {/* ---- Pipeline ------------------------------------------------ */}
      <div className="mt-11">
        <h4 className="font-display text-[11px] font-bold tracking-[0.2em] text-eminence uppercase">
          Behind the signals
        </h4>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {data.pipeline.map((s) => (
            <li
              key={s.n}
              className="rounded-lg border border-ink/20 bg-maize px-3 py-3 transition-colors duration-200 hover:border-ink hover:bg-fawn/40"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[10px] font-black text-eminence tabular-nums">
                  {s.n}
                </span>
                <span className="font-display text-xs font-bold">{s.k}</span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-ink/65">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ---- Design + architecture ----------------------------------- */}
      <div className="mt-11 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <h4 className="font-display text-[11px] font-bold tracking-[0.2em] text-eminence uppercase">
            The design problem
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">{data.design}</p>
          <p className="mt-4 rounded-lg border-l-2 border-eminence bg-lavender/12 py-2 pl-3 text-sm leading-relaxed text-ink/75">
            {data.privacy}
          </p>
        </div>

        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image.src}
            alt={data.image.caption}
            width={data.image.w}
            height={data.image.h}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full rounded-xl border-2 border-ink bg-white"
          />
          <figcaption className="mt-2 text-center text-[11px] text-ink/50">
            {data.image.caption}
          </figcaption>
        </figure>
      </div>

      {/* ---- Meta ---------------------------------------------------- */}
      <div className="mt-11 grid gap-6 border-t-2 border-ink/12 pt-7 sm:grid-cols-[auto_1fr] sm:gap-10">
        <div>
          <p className="text-[11px] font-bold tracking-wide text-eminence uppercase">Role</p>
          <p className="mt-1 text-sm">{data.role}</p>
          <p className="mt-3 text-[11px] font-bold tracking-wide text-eminence uppercase">Year</p>
          <p className="mt-1 text-sm">{data.year}</p>
        </div>

        <div>
          <p className="text-[11px] font-bold tracking-wide text-eminence uppercase">Built with</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-ink/30 px-3 py-1 text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>

          <a
            href={data.href}
            target="_blank"
            rel="noreferrer"
            className="font-display press mt-6 inline-flex min-h-[44px] cursor-pointer items-center rounded-full border-2 border-ink bg-fawn px-6 text-sm font-bold shadow-hard-sm hover:bg-eminence hover:text-maize"
          >
            {data.hrefLabel}
          </a>
        </div>
      </div>
    </article>
  );
}
