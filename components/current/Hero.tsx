"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { brands, posters, videos } from "@/lib/brands";
import { engineeringProjects } from "@/lib/content";
import { cleanTitle, decode, type Star } from "@/lib/dusk/skySong";
import SkyNotes from "../dusk/SkyNotes";
import MorphName from "../MorphName";
import PixelBloom from "./PixelBloom";

// the composer is only fetched when someone opens it (or arrives on a song link)
const SkyComposer = dynamic(() => import("../dusk/SkyComposer"), { ssr: false });

const INDEX = [
  { id: "branding", label: "Branding and pubmats", n: brands.length },
  { id: "posters", label: "Posters", n: posters.length },
  { id: "videos", label: "Motion", n: videos.length },
  { id: "code", label: "UI/UX and code", n: engineeringProjects.length },
];

/**
 * The opening is a mosaic of flat tiles, each one job:
 *   the name      black, in letters that decay to pixels under the hand
 *   the portrait  Lana's photograph as a one-ink dither (the real picture
 *                 shows through while it is hovered or focused)
 *   the role      who Lana is and the two ways on
 *   the bloom     a flower drawn in squares, in code
 *   the index     the four kinds of work, with how many of each
 * It fills the first screen at 1440×900, and at 390×844 the role and its
 * buttons are in view without scrolling.
 *
 * "Write a song in the stars" turns the mosaic into a score (SkyComposer; a
 * shared ?song= link opens with the sender's constellation, /?compose=1 with
 * an empty one), and a click on empty tile places a note (SkyNotes).
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [song, setSong] = useState<{ mode: "write" | "listen"; stars: Star[]; title: string } | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search),
      stars = decode(q.get("song"));
    /* eslint-disable react-hooks/set-state-in-effect -- read once from the URL on arrival */
    if (stars.length) setSong({ mode: "listen", stars, title: cleanTitle(q.get("title")) });
    else if (q.has("compose")) {
      setSong({ mode: "write", stars: [], title: "" });
      history.replaceState(null, "", location.pathname + location.hash);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const openSky = () => {
    setSong({ mode: "write", stars: [], title: "" });
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  };

  return (
    <section ref={root} id="hero" aria-label="Lana Denise Huertas" className="hero">
      <SkyNotes skip=".bloom,.mo-face" />
      <div className="hero-in mosaic">
        <div className="mo mo-name">
          <MorphName
            as="h1"
            label="Lana Denise Huertas"
            className="t-display hero-name"
            stacked
            words={[{ text: "Lana Denise" }, { text: "Huertas" }]}
          />
        </div>

        <div className="mo mo-face" tabIndex={0} aria-label="Portrait of Lana Denise Huertas">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mo-photo" src="/work/lana-portrait.webp" alt="" width={1136} height={1200} decoding="async" loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mo-dither" src="/art/pixel/portrait-light.png" alt="" width={284} height={300} decoding="async" />
        </div>

        <div className="mo mo-role">
          <p className="hero-role">
            UI/UX and visual designer in Manila. I design interfaces, brand systems and motion, and I build what I design.
          </p>
          <div className="hero-acts">
            <a href="#branding" className="btn">
              See the work
            </a>
            <a href="#contact" className="btn-ghost">
              Get in touch
            </a>
          </div>
        </div>

        <div className="mo mo-bloom">
          <PixelBloom size={38} />
          <button type="button" className="link" aria-expanded={!!song} onClick={openSky}>
            Write a song in the stars
          </button>
        </div>

        <nav className="mo mo-index" aria-label="The work, by kind">
          <ul>
            {INDEX.map((w) => (
              <li key={w.id}>
                <a href={`#${w.id}`}>
                  <span>{w.label}</span>
                  <b>{w.n}</b>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {song && (
        <SkyComposer
          key={song.mode + song.stars.length}
          mode={song.mode}
          initial={song.stars}
          initialTitle={song.title}
          onClose={() => {
            setSong(null);
            if (location.search) history.replaceState(null, "", location.pathname + location.hash);
          }}
        />
      )}
    </section>
  );
}
