import { videos } from "@/lib/brands";
import SectionTitle from "../SectionTitle";
import Carousel from "./Carousel";
import EndSlide from "./EndSlide";
import VideoSlide from "./VideoSlide";

export default function VideoShowcase() {
  return (
    <section id="videos" className="relative pt-16 pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionTitle id="videos-heading" index="02" lead="Moving" accent="pictures" note={`${videos.length} edits · swipe →`} />
      </div>
      <Carousel label="Videos">
        {videos.map((p, i) => (
          <VideoSlide key={p.id} p={p} n={i + 1} total={videos.length} />
        ))}
        <EndSlide note="cut in Premiere Pro, finished in After Effects" title="Watch" accent="them all" href="/videos" label="Open the video page" />
      </Carousel>
    </section>
  );
}
