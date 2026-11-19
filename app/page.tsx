import { Suspense } from "react";
import Hero from "@/components/current/Hero";
import BrandShowcase from "@/components/showcase/BrandShowcase";
import PosterRow from "@/components/showcase/PosterRow";
import MotionReel from "@/components/current/MotionReel";
import CodeShowcase from "@/components/showcase/CodeShowcase";
import AboutPanel from "@/components/AboutPanel";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";

/*
 * Each section sits in its own Suspense boundary. Nothing here suspends and
 * the HTML is the same; the boundaries only let React hydrate the page one
 * section at a time and hand the main thread back in between, instead of in
 * one long block that a phone feels as a frozen first few seconds. A tap on
 * a section that is not hydrated yet moves it to the front of the queue.
 *
 * Every section names a scene (data-scene) for the light current behind the
 * page: see components/current/Current.tsx.
 */
export default function Home() {
  return (
    <main id="top">
      {/* opening -> branding -> posters -> motion -> ui/ux & code -> about -> contact */}
      <Suspense>
        <Hero />
      </Suspense>
      <Suspense>
        <BrandShowcase />
      </Suspense>
      <Suspense>
        <PosterRow />
      </Suspense>
      <Suspense>
        <MotionReel />
      </Suspense>
      <Suspense>
        <CodeShowcase />
      </Suspense>
      <Suspense>
        <AboutPanel />
      </Suspense>
      <Suspense>
        <Contact />
      </Suspense>
      <ScrollFX />
    </main>
  );
}
