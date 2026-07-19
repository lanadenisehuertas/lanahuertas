import Hero from "@/components/Hero";
import ShortAbout from "@/components/ShortAbout";
import FolderStack from "@/components/FolderStack";
import AboutPanel from "@/components/AboutPanel";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      {/* title -> short about -> projects -> extended about -> contact */}
      <Hero />
      <Reveal>
        <ShortAbout />
      </Reveal>
      <Reveal delay={60}>
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
