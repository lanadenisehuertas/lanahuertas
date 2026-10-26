import { engineeringProjects } from "@/lib/content";
import SectionTitle from "../SectionTitle";
import CodeSlide from "./CodeSlide";

export default function CodeShowcase() {
  const total = engineeringProjects.length;
  return (
    <section id="code" className="relative pt-16 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionTitle id="code-heading" index="03" lead="UI/UX &" accent="code" note="designed, then built" ornament="flourish" />
      </div>
      {engineeringProjects.map((p, i) => (
        <CodeSlide key={p.id} p={p} n={i + 1} total={total} />
      ))}
      <div className="mt-10 text-center">
        <a href="/ui-ux" className="btn inline-flex min-h-[48px] items-center gap-2 px-6">
          All case studies <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
