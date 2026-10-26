import Hero from "@/components/Hero";
import BrandShowcase from "@/components/showcase/BrandShowcase";
import VideoShowcase from "@/components/showcase/VideoShowcase";
import CodeShowcase from "@/components/showcase/CodeShowcase";
import AboutPanel from "@/components/AboutPanel";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";
import { brandOrgs } from "@/lib/brands";
import ScrollVine from "@/components/ScrollVine";
import GardenFX from "@/components/GardenFX";

export default function Home() {
  return (
    <main id="top">
      {/* intro -> branding -> videos -> ui/ux & code -> about -> thank you */}
      <Hero />
      <BrandShowcase />
      <VideoShowcase />
      <CodeShowcase />
      <AboutPanel orgs={brandOrgs()} />
      <Contact />
      <ScrollFX />
      <ScrollVine />
      <GardenFX />
    </main>
  );
}
