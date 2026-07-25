import Hero from "@/components/Hero";
import FolderStack from "@/components/FolderStack";
import AboutPanel from "@/components/AboutPanel";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      {/* intro -> the work -> about -> contact */}
      <Hero />
      <Reveal>
        <FolderStack />
      </Reveal>
      <Reveal delay={60}>
        <AboutPanel />
      </Reveal>
      <Reveal delay={60}>
        <Contact />
      </Reveal>
    </main>
  );
}
