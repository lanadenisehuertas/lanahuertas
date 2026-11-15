import { Suspense } from "react";
import OriginalHero from "@/components/pastel/OriginalHero";
import BrandShowcase from "@/components/showcase/BrandShowcase";
import PosterRow from "@/components/showcase/PosterRow";
import DuskVideos from "@/components/dusk/DuskVideos";
import CodeShowcase from "@/components/showcase/CodeShowcase";
import AboutPanel from "@/components/AboutPanel";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";
import GardenFX from "@/components/GardenFX";
import SiteSounds from "@/components/SiteSounds";
import PauseOffscreen from "@/components/PauseOffscreen";
import { Chapter, type ChapterInfo } from "@/components/pastel/variants/Chapter";
import { brands, posters, videos } from "@/lib/brands";
import { engineeringProjects } from "@/lib/content";

// the chapter bands: one entry per section, in page order
const CH: ChapterInfo[] = [
  { n: 1, slug: "branding", word: "identity", meta: [`${brands.length} brands`, "Illustrator", "Photoshop"] },
  { n: 2, slug: "posters", word: "print", meta: [`${posters.length} posters`, "Photoshop"] },
  { n: 3, slug: "videos", word: "motion", meta: [`${videos.length} edits`, "Premiere Pro", "After Effects"] },
  { n: 4, slug: "code", word: "interfaces", meta: [`${engineeringProjects.length} products`, "Figma", "Next.js"] },
  { n: 5, slug: "about", word: "hello", meta: ["Manila, PH", "FEU Tech"] },
  { n: 6, slug: "contact", word: "say hi", meta: ["open to work", "freelance"] },
];
const chap = (slug: string) => <Chapter c={CH.find((c) => c.slug === slug)!} />;

/*
 * Each section sits in its own Suspense boundary. Nothing here suspends and
 * the HTML is the same; the boundaries only let React hydrate the page one
 * section at a time and hand the main thread back in between, instead of in
 * one long block that a phone feels as a frozen first few seconds. A tap on
 * a section that is not hydrated yet moves it to the front of the queue.
 */
export default function Home() {
  return (
    <main id="top">
      {/* intro -> branding -> posters -> videos -> ui/ux & code -> about -> contact */}
      <Suspense>
        <OriginalHero />
      </Suspense>
      <Suspense>
        {chap("branding")}
        <BrandShowcase />
      </Suspense>
      <Suspense>
        {chap("posters")}
        <PosterRow />
      </Suspense>
      <Suspense>
        {chap("videos")}
        <DuskVideos />
      </Suspense>
      <Suspense>
        {chap("code")}
        <CodeShowcase />
      </Suspense>
      <Suspense>
        {chap("about")}
        <AboutPanel />
      </Suspense>
      <Suspense>
        {chap("contact")}
        <Contact />
      </Suspense>
      <ScrollFX />
      <GardenFX />
      <SiteSounds />
      <PauseOffscreen />
    </main>
  );
}
