"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties } from "react";
import { palettes } from "@/lib/palettes";
import { useSlide } from "./Spread";
import SpreadCopy from "./SpreadCopy";
import { pad } from "./tone";
import { tone } from "@/lib/dusk/sound";

// The studio is its own chunk: nothing of it loads until someone opens it.
const Studio = dynamic(() => import("@/components/studio/Studio"), { ssr: false });

const KIT = ["#2d3b97", "#e3a0c0", "#fdf3e1", "#ffcfe0", "#76389b", "#f99e30", "#189aa6", "#924050"];

/**
 * The carousel's last slide, after every brand: your turn. The words invite
 * you in, the stage shows the studio waiting (a small Photoshop window with
 * a pubmat open and its title selected), and clicking either opens the real
 * one with my palettes and art loaded.
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
    <article className="sp-slide sp-slide--brand sp-slide--studio" data-board="dark" style={{ "--wash": "40 38 120" } as CSSProperties} aria-label="Your turn: make a pubmat with me">
      <div aria-hidden className="sp-bg yt-bg" />
      <div aria-hidden className="sp-wash" />

      <SpreadCopy
        meta={`${pad(n)} / ${pad(total)} · Your turn · Studio`}
        title="Your turn"
        heading={heading}
        tagline="Make a pubmat with me, in a studio laid out like Photoshop."
        body="Photoshop is where every pubmat on this page was made, so this studio works the same way: tools down the left, layers on the right, my shortcuts. Start from one of my layouts, recolour it with any brand's palette, drop in the art from this garden, and export a PNG, or share it to the visitors’ gallery."
        palette={palettes["elysium"]}
        partsLabel="In the studio"
        parts={["Every brand palette, as swatch groups", "Type in Redaction, Inter Tight and DM Mono", "Grain, halftone and dither filters", "Layers, history, export to PNG"]}
        actions={
          <>
            <button type="button" className="btn" onClick={go}>
              Open the studio <span aria-hidden>→</span>
            </button>
            <a href="/made-here#pubmats" className="link sp-link">
              See what visitors made <span aria-hidden>→</span>
            </a>
          </>
        }
      />

      <div className="sp-stage sp-stage--frame">
        <button type="button" className="yt-win" onClick={go} aria-label="Open the studio">
          <span className="yt-menu" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/art/pixel-butterfly.svg" alt="" className="yt-logo" />
            {["File", "Edit", "Image", "Layer", "Filter", "View"].map((m) => (
              <i key={m}>{m}</i>
            ))}
            <b>Export PNG</b>
          </span>
          <span className="yt-opts" aria-hidden>
            <i className="yt-sel">Redaction Bold</i>
            <i className="yt-sel yt-sel--s">230 px</i>
            <i className="yt-swatch" />
          </span>
          <span className="yt-body" aria-hidden>
            <span className="yt-tools">
              {Array.from({ length: 6 }, (_, i) => (
                <i key={i} data-on={i === 0 ? "" : undefined} />
              ))}
              <i className="yt-fg" />
            </span>
            <span className="yt-doc">
              <span className="yt-art">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/art/pixel-moon.svg" alt="" className="yt-moon" />
                <span className="yt-title">
                  Dusk
                  <br />
                  Fest
                  <span className="yt-box">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
                <span className="yt-sub">a night in the garden</span>
                <span className="yt-date">NOV 28 · 6 PM · THE GARDEN</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/art/garden/lotus-cluster.webp" alt="" className="yt-lotus" loading="lazy" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/art/pixel-butterfly.svg" alt="" className="yt-bfly" />
              </span>
            </span>
            <span className="yt-panels">
              <span className="yt-ph">Swatches</span>
              <span className="yt-sw">
                {KIT.map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              <span className="yt-ph">Layers</span>
              {[
                ["T", "Dusk Fest", true],
                ["T", "a night in the garden", false],
                ["◐", "Grain", false],
                ["▣", "Lotus bed", false],
                ["", "Background", false],
              ].map(([g, l, on]) => (
                <span key={String(l)} className="yt-layer" data-on={on ? "" : undefined}>
                  <i>{g}</i>
                  {l}
                </span>
              ))}
            </span>
          </span>
          <span className="yt-cta">
            Open the studio <span aria-hidden>↗</span>
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
