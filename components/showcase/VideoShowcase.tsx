import { videos } from "@/lib/brands";
import Spread from "./Spread";
import VideoSlide from "./VideoSlide";

/** Moving pictures: one edit per screen, on the site's sky. */
export default function VideoShowcase({ mode = "carousel" }: { mode?: "carousel" | "stack" }) {
  return (
    <Spread
      id="videos"
      mode={mode}
      label="Videos"
      title={
        <>
          Moving <em>pictures</em>
        </>
      }
      slides={videos.map((p) => ({ key: p.id, name: p.title, tone: "light" as const }))}
    >
      {videos.map((p, i) => (
        <VideoSlide key={p.id} p={p} n={i + 1} total={videos.length} />
      ))}
    </Spread>
  );
}
