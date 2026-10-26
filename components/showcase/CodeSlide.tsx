import type { EngineeringProject } from "@/lib/content";
import { backdropSrc } from "@/lib/brands";
import { MOCKS } from "../CaseStudy";
import SiteMockup from "../SiteMockup";
import { Backdrop } from "./BrandSlide";

const pad = (n: number) => String(n).padStart(2, "0");

/** One software project as a deck screen, after ref 1's brand intro. */
export default function CodeSlide({ p, n, total }: { p: EngineeringProject; n: number; total: number }) {
  const m = MOCKS[p.visual];
  const flip = n % 2 === 0;
  return (
    <article id={`code-${p.id}`} aria-label={p.title} className="relative isolate flex min-h-[100svh] items-center overflow-hidden lg:min-h-[760px]">
      <Backdrop src={backdropSrc(`code-${p.id}`)} />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div data-rv className={`focus-rv lg:col-span-7 ${flip ? "lg:col-start-1" : "lg:col-start-6"} lg:row-start-1`}>
          <SiteMockup kind={m.kind} src={m.src} src2={m.src2} alt2={`${p.title} — website intro`} url={m.url} href={p.href} alt={`${p.title} — live site`} />
        </div>
        <div className={`bs-card relative rounded-[20px] p-6 sm:p-8 lg:col-span-5 ${flip ? "lg:col-start-8" : "lg:col-start-1"} lg:row-start-1`}>
          <p className="type-pixel flex flex-wrap gap-x-2 text-[10px] text-ink/60">
            <span>
              {pad(n)} / {pad(total)}
            </span>
            <span aria-hidden>·</span>
            <span>{p.year}</span>
          </p>
          <h3 className="type-display mt-3 text-5xl text-iris sm:text-6xl xl:text-7xl">{p.title}</h3>
          <p className="type-display mt-2 text-xl text-eminence italic sm:text-2xl">{p.tagline}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{p.description}</p>
          <ul aria-label="Role" className="mt-5 flex flex-wrap gap-1.5">
            {p.role
              .split(" — ")[0]
              .split(" · ")
              .map((r) => (
                <li key={r} className="rounded-full border border-ink/15 bg-white/60 px-2.5 py-0.5 text-xs text-ink/80">
                  {r}
                </li>
              ))}
          </ul>
          <p className="type-pixel mt-3 text-[10px] text-ink/55">Stack · {p.stack.slice(0, 5).join(" · ")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={`/ui-ux#${p.id}`} className="gel inline-flex min-h-[44px] items-center gap-2 px-5">
              Read the case study <span aria-hidden>→</span>
            </a>
            {p.href && (
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="type-pixel inline-flex min-h-[44px] items-center text-[11px] text-iris underline decoration-lavender/60 underline-offset-4">
                {p.hrefLabel ?? "Visit"} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
