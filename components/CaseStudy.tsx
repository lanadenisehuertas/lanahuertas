import type { CSSProperties } from "react";
import { engineeringProjects } from "@/lib/content";
import SiteMockup from "./SiteMockup";
import AppShowcase from "./AppShowcase";
import { Lotus, Leaf } from "./Botanicals";

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
 * Software work. Copy on one side, the live product on the other, sides
 * alternating down the list.
 */
export default function CaseStudy() {
  return (
    <div className="space-y-14 sm:space-y-20">
      {engineeringProjects.map((p, i) => {
        const m = MOCKS[p.visual];
        const flip = i % 2 === 1;
        return (
          <article
            key={p.id}
            data-rv
            className={`grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14 ${i > 0 ? "border-t border-ink/12 pt-14 sm:pt-20" : ""}`}
          >
            <div className={flip ? "lg:order-2" : undefined}>
              <p className="type-pixel text-[11px] text-ink/55">
                {p.n} · {p.year}
              </p>
              <h3 className="type-display mt-2 text-5xl text-iris sm:text-6xl">{p.title}</h3>
              <p className="type-display mt-1 text-2xl text-lavender italic sm:text-3xl">{p.tagline}</p>

              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink/80">{p.description}</p>

              <p className="mt-5 text-[13px] text-ink/60">
                <span className="type-pixel text-[10px] text-ink/50">Role </span>
                {p.role.split(" — ")[0]}
              </p>

              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.slice(0, 5).map((s, k) => (
                  <li
                    key={s}
                    data-rv
                    style={{ "--d": `${k * 40}ms` } as CSSProperties}
                    className="rounded-[3px] border border-ink/20 bg-white/50 px-2.5 py-1 text-xs transition-colors duration-150 hover:border-iris hover:bg-iris hover:text-paper"
                  >
                    {s}
                  </li>
                ))}
                {p.stack.length > 5 && (
                  <li className="rounded-[3px] px-1.5 py-1 text-xs text-ink/50">+{p.stack.length - 5}</li>
                )}
              </ul>

              {p.href && (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gel mt-7 inline-flex min-h-[46px] items-center gap-2 px-6"
                >
                  {p.hrefLabel ?? "View project"} <span aria-hidden>↗</span>
                </a>
              )}
            </div>

            {/* The product, laid on a garden sheet like the hero */}
            <div className={`relative ${flip ? "lg:order-1" : ""}`}>
              <div
                aria-hidden
                className="absolute inset-x-2 inset-y-6 overflow-hidden rounded-[6px] border border-ink/12"
                style={{
                  background:
                    "radial-gradient(60% 70% at 50% 50%, #fff6ea 0%, transparent 70%), linear-gradient(160deg, #a9b6f0 0%, #c9b9ec 40%, #f2b8cf 75%, #f6d3c3 100%)",
                }}
              >
                <div className="band-grain absolute inset-0" />
              </div>
              <div aria-hidden className="sl-sprout pointer-events-none absolute -bottom-2 left-0 z-10 w-20 sm:w-24">
                <Lotus className="sway w-full" deep={i % 2 === 0} />
              </div>
              <Leaf className="pointer-events-none absolute top-2 right-0 z-10 w-20 rotate-[200deg]" />
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

            {/* The product itself — real app screens, full width */}
            {m.app && (
              <div className="lg:col-span-2" data-rv>
                <p className="type-pixel mb-4 text-center text-[11px] text-ink/55">✦ Inside the app</p>
                <AppShowcase />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
