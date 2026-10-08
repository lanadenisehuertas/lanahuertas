import Hero from "@/components/Hero";
import FolderStack from "@/components/FolderStack";
import AboutPanel from "@/components/AboutPanel";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";
import ScrollVine from "@/components/ScrollVine";
import GardenFX from "@/components/GardenFX";

export default function Home() {
  return (
    <main id="top">
      {/* intro -> the work -> about -> contact */}
      <Hero />
      <FolderStack />
      <AboutPanel />
      <Contact />
      <ScrollFX />
      <ScrollVine />
      <GardenFX />
    </main>
  );
}
