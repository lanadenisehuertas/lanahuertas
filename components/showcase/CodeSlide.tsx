import type { EngineeringProject } from "@/lib/content";
import { palettes } from "@/lib/palettes";
import { MOCKS } from "../CaseStudy";
import SiteMockup from "../SiteMockup";
import ProjectText from "./ProjectText";
import SlideShell from "./SlideShell";

/** One software project, one screen: a backdrop from its own interface colours, the live mockup, the words beside. */
export default function CodeSlide({ p, n, total }: { p: EngineeringProject; n: number; total: number }) {
  const m = MOCKS[p.visual];
  return (
    <SlideShell
      slug={`code-${p.id}`}
      id={`code-${p.id}`}
      n={n}
      label={p.title}
      art={<SiteMockup kind={m.kind} src={m.src} src2={m.src2} alt2={`${p.title} — website intro`} url={m.url} href={p.href} alt={`${p.title} — live site`} />}
      text={() => (
        <ProjectText
          n={n}
          total={total}
          meta={[p.year]}
          title={p.title}
          tagline={p.tagline}
          body={p.description}
          roles={p.role.split(" — ")[0].split(" · ")}
          tools={p.stack.slice(0, 5)}
          toolsLabel="Stack"
          palette={palettes[`code-${p.id}`]}
          actions={
            <>
              <a href={`/ui-ux#${p.id}`} className="btn inline-flex min-h-[44px] items-center gap-2 px-5">
                Read the case study <span aria-hidden>→</span>
              </a>
              {p.href && (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="link text-[15px] text-[var(--t-title)]">
                  {p.hrefLabel ?? "Visit"} ↗
                </a>
              )}
            </>
          }
        />
      )}
    />
  );
}
