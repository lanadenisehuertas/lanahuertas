import type { Metadata } from "next";
import VideoShowcase from "@/components/showcase/VideoShowcase";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";

export const metadata: Metadata = {
  title: "Videos — Lana Denise Huertas",
  description: "Documentary essays, instructional series, trailers and music videos edited by Lana Denise Huertas.",
  alternates: { canonical: "/videos" },
};

/** Every edit as a full spread, one after another. */
export default function VideosPage() {
  return (
    <main id="top">
      <VideoShowcase mode="stack" />
      <Contact />
      <ScrollFX />
    </main>
  );
}
