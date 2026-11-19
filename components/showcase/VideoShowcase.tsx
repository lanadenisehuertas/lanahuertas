import { videos } from "@/lib/brands";
import Spread from "./Spread";
import VideoSlide from "./VideoSlide";

/** Moving pictures, as an archive: one edit after another (the homepage uses the viewing room, MotionReel). */
export default function VideoShowcase({ mode = "carousel" }: { mode?: "carousel" | "stack" }) {
  return (
    <Spread
      id="videos"
      mode={mode}
      label="Videos"
      title={{ lead: "Moving", accent: "pictures", n: "03", script: "motion" }}
      head={{
        meta: `${videos.length} edits, cut in Premiere Pro and After Effects`,
        lede: "Documentary essays, instructional series, trailers and music videos. Each one loads its player only when you ask for it.",
        link: mode === "stack" ? { href: "/#videos", label: "Back to the portfolio" } : { href: "/videos", label: "Every edit" },
      }}
      slides={videos.map((p) => ({ key: p.id, name: p.title }))}
    >
      {videos.map((p, i) => (
        <VideoSlide key={p.id} p={p} n={i + 1} total={videos.length} />
      ))}
    </Spread>
  );
}
