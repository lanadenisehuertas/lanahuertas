import type { Project } from "@/lib/content";
import { palettes } from "@/lib/palettes";
import { InkPlay } from "../Ink";
import Pic from "./Pic";
import ProjectText from "./ProjectText";
import SlideShell from "./SlideShell";

/** One video, one screen: on the site's own sky, the poster as large as the screen allows, the words beside. */
export default function VideoSlide({ p, n, total, eager = false }: { p: Project; n: number; total: number; eager?: boolean }) {
  return (
    <SlideShell
      slug={`video-${p.id}`}
      n={n}
      label={p.title}
      eager={eager}
      backdrop={false}
      wide
      art={
        <a href={`/videos#${p.id}`} aria-label={`Watch ${p.title}`} className="group relative block -rotate-[0.8deg]">
          <span aria-hidden className="tape -top-3 left-[8%] -rotate-[5deg]" />
          <span aria-hidden className="tape -top-3 right-[8%] rotate-[4deg]" />
          <Pic
            img={p.images[0]}
            eager={eager}
            sizes="(min-width: 1024px) 64vw, 92vw"
            className="block h-auto w-full bg-white p-2 shadow-[0_30px_50px_-30px_rgb(27_7_48/0.6),0_2px_6px_rgb(27_7_48/0.15)] transition-transform duration-700 group-hover:scale-[1.012] sm:p-3"
          />
          <span aria-hidden className="btn-ghost btn-icon !absolute top-1/2 left-1/2 !h-20 !w-20 -translate-x-1/2 -translate-y-1/2 !text-white drop-shadow-[0_2px_8px_rgb(10_4_20/0.6)]">
            <InkPlay className="ml-1 h-8 w-8" />
          </span>
        </a>
      }
      text={() => (
        <ProjectText
          n={n}
          total={total}
          meta={[p.year ?? "", p.duration ?? ""]}
          title={p.title}
          tagline={p.role}
          body={p.description ?? ""}
          clamp
          tools={p.tools}
          palette={palettes[`video-${p.id}`]}
          actions={
            <a href={`/videos#${p.id}`} className="btn inline-flex min-h-[44px] items-center gap-2 px-5">
              Watch it <span aria-hidden>→</span>
            </a>
          }
        />
      )}
    />
  );
}
