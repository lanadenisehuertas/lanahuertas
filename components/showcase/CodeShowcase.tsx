import { engineeringProjects } from "@/lib/content";
import CodeSlide from "./CodeSlide";
import Spread from "./Spread";
import { toneOf, WASH } from "./tone";

/** UI/UX & code: one product per screen, its real screens in a thin outline. */
export default function CodeShowcase({ mode = "carousel" }: { mode?: "carousel" | "stack" }) {
  const total = engineeringProjects.length;
  return (
    <Spread
      id="code"
      mode={mode}
      label="UI/UX projects"
      title={
        <>
          UI/UX &amp; <em>code</em>
        </>
      }
      slides={engineeringProjects.map((p) => ({ key: p.id, name: p.title, tone: toneOf(`code-${p.id}`), wash: WASH[`code-${p.id}`] }))}
    >
      {engineeringProjects.map((p, i) => (
        <CodeSlide key={p.id} p={p} n={i + 1} total={total} caseLink={mode === "carousel"} />
      ))}
    </Spread>
  );
}
