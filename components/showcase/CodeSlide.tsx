"use client";

import type { EngineeringProject } from "@/lib/content";
import { palettes } from "@/lib/palettes";
import Backdrop from "./Backdrop";
import Device, { type Screen } from "./Device";
import { useSlide } from "./Spread";
import SpreadCopy from "./SpreadCopy";
import { pad, washVar } from "./tone";

const PSY = (id: string, label: string, h = 1000): Screen => ({
  label,
  src: `/work/psyclick/${id}.webp`,
  sm: `/work/psyclick/${id}-sm.webp`,
  w: 1600,
  h,
});

/** Each product's real screens and the outline they belong in. */
const DEVICES: Record<EngineeringProject["visual"], { kind: "browser" | "phone"; url?: string; screens: Screen[] }> = {
  psyclick: {
    kind: "browser",
    url: "psyclick-app.vercel.app",
    screens: [
      PSY("landing-hero", "Landing", 1111),
      PSY("app-dashboard", "Dashboard"),
      PSY("app-intake", "Intake"),
      PSY("app-report", "Report"),
      PSY("app-typing", "Typing"),
    ],
  },
  // A phone-width capture of the app: the one genuinely mobile screenshot.
  debtledger: {
    kind: "phone",
    screens: [{ label: "This week", src: "/work/shot-debtledger.webp", w: 500, h: 1140 }],
  },
  algebrawl: {
    kind: "browser",
    url: "algebrawl.vercel.app",
    screens: [{ label: "Title screen", src: "/work/algebrawl-title.webp", w: 1040, h: 780 }],
  },
};

/** One product, one screen: its artboard, the words on the wash, the real screens in a thin outline. */
export default function CodeSlide({ p, n, total, caseLink = true }: { p: EngineeringProject; n: number; total: number; caseLink?: boolean }) {
  const { near, heading } = useSlide();
  const slug = `code-${p.id}`;
  const d = DEVICES[p.visual];
  return (
    <article className="sp-slide sp-slide--code" style={washVar(slug)} aria-label={p.title}>
      <Backdrop slug={slug} eager={near} />
      <SpreadCopy
        meta={`${pad(n)} / ${pad(total)} · ${p.year}`}
        title={p.title}
        heading={heading}
        tagline={p.tagline}
        body={p.description}
        palette={palettes[slug]}
        parts={p.role.split(" — ")[0].split(" · ")}
        extra={<p className="sp-stack-line">Built with {p.stack.filter((s) => s !== "Pixel art").slice(0, 5).join(" · ")}</p>}
        actions={
          <>
            {p.href && (
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="btn">
                {p.hrefLabel ?? "Visit"} <span aria-hidden>↗</span>
              </a>
            )}
            {caseLink && (
              <a href={`/ui-ux#${p.id}`} className="link sp-link">
                Case study <span aria-hidden>→</span>
              </a>
            )}
          </>
        }
      />
      <div className="sp-stage sp-stage--frame">
        <Device kind={d.kind} screens={d.screens} title={p.title} url={d.url} eager={near} />
      </div>
    </article>
  );
}
