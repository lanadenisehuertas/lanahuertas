import { Suspense } from "react";
import Hero from "@/components/Hero";
import BrandShowcase from "@/components/showcase/BrandShowcase";
import PosterRow from "@/components/showcase/PosterRow";
import MovingPictures from "@/components/work/MovingPictures";
import CodeShowcase from "@/components/showcase/CodeShowcase";
import AboutPanel from "@/components/AboutPanel";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";
import ScrollVine from "@/components/ScrollVine";
import GardenFX from "@/components/GardenFX";

/*
 * Each section below the first screen sits in its own Suspense boundary.
 * Nothing here suspends; the boundaries let React hydrate the page one
 * section at a time and hand the main thread back in between, instead of in
 * one long block that a phone feels as a frozen first few seconds. A tap on
 * a section that is not hydrated yet moves it to the front of the queue.
 * The hero stays outside: a boundary's content is held back until a small
 * inline script reveals it, which is fine below the fold and far too late
 * for the first paint.
 */
export default function Home() {
  return (
    <main id="top">
      {/* intro -> the work (branding, posters, videos, ui/ux & code) -> about -> contact */}
      {/* the first screen is plain HTML in the page itself: no boundary, so it
          paints with the first bytes instead of waiting to be revealed */}
      <Hero />
      <div id="work">
        <Suspense>
          <BrandShowcase />
        </Suspense>
        <Suspense>
          <PosterRow />
        </Suspense>
        <Suspense>
          <MovingPictures />
        </Suspense>
        <Suspense>
          <CodeShowcase />
        </Suspense>
      </div>
      <Suspense>
        <AboutPanel />
      </Suspense>
      <Suspense>
        <Contact />
      </Suspense>
      <ScrollFX />
      <ScrollVine />
      <GardenFX />
    </main>
  );
}
