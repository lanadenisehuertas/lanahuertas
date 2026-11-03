import { Suspense } from "react";
import DuskHero from "@/components/dusk/DuskHero";
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
        <DuskHero />
      </Suspense>
      <Suspense>
        <BrandShowcase />
      </Suspense>
      <Suspense>
        <PosterRow />
      </Suspense>
      <Suspense>
        <DuskVideos />
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
      <GardenFX />
      <SiteSounds />
      <PauseOffscreen />
    </main>
  );
}
