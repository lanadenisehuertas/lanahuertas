import type { CSSProperties } from "react";
import { engineeringProjects } from "@/lib/content";
import SiteMockup from "./SiteMockup";
import AppShowcase from "./AppShowcase";
import { PixelFlower } from "./Ethereal";

/*
 * Each project shows its real, live site as a device mockup. Add a project by
 * appending to `engineeringProjects` and giving it an entry here.
 */
const MOCKS = {
  psyclick: {
    kind: "browser" as const,
    // The live site opens on an animated intro, then lands on the hero. The
    // hero is the top frame, so it is what shows when motion is reduced.
    src: "/work/psyclick/landing-hero-sm.webp",
    src2: "/work/psyclick/landing-intro-sm.webp",
    url: "psyclick-app.vercel.app",
    app: true,
  },
  debtledger: {
    kind: "phone" as const,
    src: "/work/shot-debtledger.webp",
    src2: undefined,
    url: "debt-ledger-puce.vercel.app",
    app: false,
  },
  algebrawl: {
    kind: "browser" as const,
    src: "/work/algebrawl-title.webp",
    src2: undefined,
    url: "algebrawl.vercel.app",
    app: false,
  },
};

/**
 * Software work, as one calm reading line: copy on the left, the live product
 * on the right, the same for every project so the eye never has to re-find
 * its place. Each product sits on a quiet pearl field that dissolves at the
 * bottom in the site's pixel dither. PsyClick's app screens wait behind a
 * disclosure rather than all arriving at once.
 */
export default function CaseStudy() {
  return (
    <div className="divide-y divide-ink/10">
      {engineeringProjects.map((p) => {
        const m = MOCKS[p.visual];
        return (
          <article key={p.id} className="grid gap-8 py-12 first:pt-2 last:pb-2 lg:grid-cols-12 lg:items-center lg:gap-12 sm:py-16">
            <div data-rv className="focus-rv lg:col-span-5">
              <p className="type-pixel flex items-center gap-2 text-[11px] text-ink/55">
                <PixelFlower className="h-2.5 w-2.5" fill="var(--color-lavender)" />
                {p.n} · {p.year}
              </p>
              <h3 className="type-display mt-3 text-4xl leading-none text-iris sm:text-5xl">{p.title}</h3>
              <p className="type-display mt-2 text-xl text-lavender italic sm:text-2xl">{p.tagline}</p>

              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/80">{p.description}</p>

              <p className="mt-5 text-[13px] text-ink/65">
                <span className="type-pixel text-[10px] text-ink/50">Role </span>
                {p.role.split(" — ")[0]}
              </p>

              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.slice(0, 4).map((s) => (
                  <li key={s} className="rounded-full border border-ink/15 bg-white/50 px-2.5 py-0.5 text-xs text-ink/75">
                    {s}
                  </li>
                ))}
                {p.stack.length > 4 && <li className="px-1.5 py-0.5 text-xs text-ink/50">+{p.stack.length - 4}</li>}
              </ul>

              {p.href && (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hire mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-[18px] italic"
                >
                  {p.hrefLabel ?? "View project"} <span aria-hidden className="text-[13px] not-italic">↗</span>
                </a>
              )}
            </div>

            {/* The product on a quiet field */}
            <div data-rv style={{ "--d": "140ms" } as CSSProperties} className="focus-rv relative lg:col-span-7">
              <div
                aria-hidden
                className="absolute inset-x-0 inset-y-4 overflow-hidden rounded-[10px]"
                style={{
                  background:
                    "radial-gradient(60% 70% at 50% 40%, #ffffff 0%, transparent 70%), linear-gradient(170deg, #dfe5fa 0%, #e6dcf6 55%, #f4dbe7 100%)",
                }}
              >
                <div className="dither absolute inset-x-0 bottom-0 h-1/2 opacity-80" />
              </div>
              <div className="relative px-6 py-10 sm:px-10">
                <SiteMockup
                  kind={m.kind}
                  src={m.src}
                  src2={m.src2}
                  alt2={`${p.title} — website intro`}
                  url={m.url}
                  href={p.href}
                  alt={`${p.title} — live site`}
                />
              </div>
            </div>

            {/* The app itself, on request */}
            {m.app && (
              <details className="app-peek group lg:col-span-12">
                <summary className="type-pixel mx-auto flex min-h-[44px] w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-ink/15 bg-white/50 px-4 text-[11px] text-ink/70 transition-colors hover:border-lavender hover:text-iris">
                  <span aria-hidden className="transition-transform duration-300 group-open:rotate-45">+</span>
                  <span className="group-open:hidden">See inside the app</span>
                  <span className="hidden group-open:inline">Hide the app screens</span>
                </summary>
                <div className="mt-8">
                  <AppShowcase />
                </div>
              </details>
            )}
          </article>
        );
      })}
    </div>
  );
}
