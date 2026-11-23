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
import Defer from "@/components/Defer";

/*
 * Each section below the first screen sits in its own deferred boundary
 * (components/Defer): its HTML is there from the first paint, and its React
 * code wakes up a screen before it is reached, or when it is touched,
 * focused or linked to. On a phone that leaves only the hero to set
 * up at load, instead of the whole page in one long block.
 * The hero stays outside: a boundary's content is held back until a small
 * inline script reveals it, which is fine below the fold and far too late
 * for the first paint.
 */
export default function Home() {
  return (
    <main id="top" data-defer-root="">
      {/* intro -> the work (branding, posters, videos, ui/ux & code) -> about -> contact */}
      {/* the first screen is plain HTML in the page itself: no boundary, so it
          paints with the first bytes instead of waiting to be revealed */}
      <Hero />
      <div id="work">
        <Defer id="branding">
          <BrandShowcase />
        </Defer>
        <Defer id="posters">
          <PosterRow />
        </Defer>
        <Defer id="videos">
          <MovingPictures />
        </Defer>
        <Defer id="code">
          <CodeShowcase />
        </Defer>
      </div>
      <Defer id="about">
        <AboutPanel />
      </Defer>
      <Defer id="contact">
        <Contact />
      </Defer>
      <ScrollFX />
      <ScrollVine />
      <GardenFX />
    </main>
  );
}
