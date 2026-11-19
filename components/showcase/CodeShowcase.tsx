import { engineeringProjects } from "@/lib/content";
import CodeSlide from "./CodeSlide";
import Spread from "./Spread";

/** UI/UX & code: one product at a time, its real screens in a hairline frame. */
export default function CodeShowcase({ mode = "carousel" }: { mode?: "carousel" | "stack" }) {
  const total = engineeringProjects.length;
  const meta = `${total} products, designed in Figma and built in Next.js and Python`;
  return (
    <Spread
      id="code"
      mode={mode}
      label="UI/UX projects"
      title={{ lead: "UI/UX &", accent: "code", n: "04", script: "interfaces", spec: "lotus", world: "lilac" }}
      head={
        mode === "carousel"
          ? {
              meta,
              lede: "Products I designed and then built. Each one names my part, shows the real screens and links to the live build.",
              link: { href: "/ui-ux", label: "Read the case studies" },
            }
          : {
              meta,
              lede: "Case studies: what each product is for, my part in it, the real screens and the live build.",
              link: { href: "/#code", label: "Back to the portfolio" },
            }
      }
      slides={engineeringProjects.map((p) => ({ key: p.id, name: p.title }))}
    >
      {engineeringProjects.map((p, i) => (
        <CodeSlide key={p.id} p={p} n={i + 1} total={total} caseLink={mode === "carousel"} />
      ))}
    </Spread>
  );
}
