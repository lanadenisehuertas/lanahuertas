"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { palettes } from "@/lib/palettes";
import { useSlide } from "./Spread";
import SpreadCopy from "./SpreadCopy";
import { tone } from "@/lib/dusk/sound";
import PixelBloom from "../current/PixelBloom";

// The studio is its own chunk: nothing of it loads until someone opens it.
const Studio = dynamic(() => import("@/components/studio/Studio"), { ssr: false });

const KIT = ["#9f8deb", "#80dcf1", "#ee8be4", "#ffbc80", "#f5f2fa", "#231d3a", "#5b4bb5", "#0c0a17"];
const LAYERS: [string, boolean][] = [
  ["Bloom fest", true],
  ["a night of pixel flowers", false],
  ["Halftone", false],
  ["Bloom, drawn in code", false],
  ["Background", false],
];

/**
 * The carousel's last slide, after every brand: your turn. The words invite
 * you in; the stage shows a pubmat waiting with its title selected, beside
 * the swatches and the layers it is built from. Clicking either opens the
 * real studio with my palettes and art loaded.
 */
export default function YourTurnSlide({ n, total }: { n: number; total: number }) {
  const { heading } = useSlide();
  const [open, setOpen] = useState(false);
  const [remix, setRemix] = useState<string | undefined>();
  // links from the gallery: /?studio=1 opens a fresh studio, /?remix=<id> opens that pubmat's layers
  useEffect(() => {
    const q = new URLSearchParams(location.search),
      r = q.get("remix");
    if (!q.has("studio") && !r) return;
    /* eslint-disable react-hooks/set-state-in-effect -- the URL is read once, on arrival */
    if (r && /^[a-z0-9]{8,32}$/.test(r)) setRemix(r);
    setOpen(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    q.delete("studio");
    q.delete("remix");
    history.replaceState(null, "", `${location.pathname}${q.size ? `?${q}` : ""}${location.hash}`);
  }, []);
  const go = () => {
    setOpen(true);
    [659, 784, 988].forEach((f, k) => tone(f, { type: "sine", vol: 0.05, dur: 0.9, at: k * 0.06 }));
  };

  return (
    <article className="sp-slide sp-slide--studio" aria-label="Your turn: make a pubmat with me">
      <SpreadCopy
        meta={`${n} of ${total}. The studio`}
        title="Your turn"
        heading={heading}
        tagline="Make a pubmat with me, in a studio laid out like Photoshop."
        body="Photoshop is where every pubmat on this page was made, so this studio works the same way: tools down the left, layers on the right, my shortcuts. Start from one of my layouts, recolour it with any brand's palette, drop in the art, and export a PNG, or share it to the visitors’ gallery."
        palette={palettes["elysium"]}
        partsLabel="In the studio"
        parts={["Every brand palette, as swatch groups", "Type in Redaction, Inter Tight and DM Mono", "Grain, halftone and dither filters", "Layers, history, export to PNG"]}
        actions={
          <>
            <button type="button" className="btn" onClick={go}>
              Open the studio
            </button>
            <a href="/made-here#pubmats" className="link">
              See what visitors made
            </a>
          </>
        }
      />

      <div className="sp-stage sp-stage--frame">
        <button type="button" className="yt-win" onClick={go} aria-label="Open the studio">
          <span className="yt-art" aria-hidden>
            <PixelBloom size={30} petals={7} turn={0.1} className="yt-bloom" />
            <span className="yt-title">
              Bloom
              <br />
              fest
              <span className="yt-box">
                <i />
                <i />
                <i />
                <i />
              </span>
            </span>
            <span className="yt-sub">a night of pixel flowers</span>
            <span className="yt-date">Nov 28, 6 pm, Manila</span>
          </span>
          <span className="yt-side" aria-hidden>
            <span className="yt-ph">Swatches</span>
            <span className="yt-sw">
              {KIT.map((c) => (
                <i key={c} style={{ background: c }} />
              ))}
            </span>
            <span className="yt-ph">Layers</span>
            {LAYERS.map(([l, on]) => (
              <span key={l} className="yt-layer" data-on={on ? "" : undefined}>
                {l}
              </span>
            ))}
            <span className="yt-cta">Open the studio</span>
          </span>
        </button>
      </div>

      {open && (
        <Studio
          remix={remix}
          onClose={() => {
            setOpen(false);
            setRemix(undefined);
          }}
        />
      )}
    </article>
  );
}
