import type { Metadata } from "next";
import { videos } from "@/lib/brands";
import VideoEmbed from "@/components/showcase/VideoEmbed";
import SectionTitle from "@/components/SectionTitle";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";

export const metadata: Metadata = {
  title: "Videos — Lana Denise Huertas",
  description: "Documentary essays, instructional series, trailers and music videos edited by Lana Denise Huertas.",
  alternates: { canonical: "/videos" },
};

export default function VideosPage() {
  return (
    <main id="top">
      <div className="mx-auto max-w-6xl px-4 pt-32 sm:px-8">
        <SectionTitle as="h1" id="videos-heading" index="02" lead="Moving" accent="pictures" note={`${videos.length} edits`} />
      </div>
      <div className="mx-auto max-w-6xl divide-y divide-ink/10 px-4 sm:px-8">
        {videos.map((p) => (
          <article key={p.id} id={p.id} className="grid scroll-mt-20 gap-8 py-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <VideoEmbed p={p} />
            </div>
            <div className="lg:col-span-4">
              <p className="type-pixel text-[10px] text-ink/60">
                {p.year} · {p.duration}
              </p>
              <h2 className="type-display mt-3 text-5xl text-iris">{p.title}</h2>
              <p className="type-display mt-2 text-xl text-eminence italic">{p.role}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{p.description}</p>
              <p className="type-pixel mt-3 text-[10px] text-ink/55">Tools · {p.tools?.join(" · ")}</p>
            </div>
          </article>
        ))}
      </div>
      <Contact />
      <ScrollFX />
    </main>
  );
}
