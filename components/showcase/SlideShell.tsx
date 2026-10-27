import type { ReactNode } from "react";
import { backdropSrc } from "@/lib/brands";
import { tones, type Tone } from "@/lib/palettes";

/* Column placement, spelled out so Tailwind sees every class. */
const COLS = {
  normal: {
    artLeft: "lg:col-span-7 lg:col-start-1",
    artRight: "lg:col-span-7 lg:col-start-6",
    textLeft: "lg:col-span-5 lg:col-start-1",
    textRight: "lg:col-span-5 lg:col-start-8",
  },
  wide: {
    artLeft: "lg:col-span-8 lg:col-start-1",
    artRight: "lg:col-span-8 lg:col-start-5",
    textLeft: "lg:col-span-4 lg:col-start-1",
    textRight: "lg:col-span-4 lg:col-start-9",
  },
};

/**
 * The frame every showcase slide shares: the work on one side and the type
 * set straight on the ground on the other, sides alternating slide to slide.
 * With a backdrop, the project's own artwork covers the screen and the text
 * side gets a soft wash in its tone, the type switching light or dark to
 * match. Without one the slide is transparent and sits on the site's sky.
 *
 * Stacked on a phone, slides differ in height and the track grows to the
 * tallest: min-height 100% keeps every artwork filling its slide.
 */
export default function SlideShell({
  slug,
  n,
  label,
  id,
  eager = false,
  backdrop = true,
  wide = false,
  art,
  text,
}: {
  /** Key in scripts/backdrops.json. */
  slug: string;
  n: number;
  label: string;
  id?: string;
  eager?: boolean;
  /** false: no artwork, the site's own sky shows through. */
  backdrop?: boolean;
  /** Give the art eight columns instead of seven. */
  wide?: boolean;
  art: ReactNode;
  text: (tone: Tone) => ReactNode;
}) {
  const textRight = n % 2 === 0;
  const tone: Tone = backdrop ? (tones[slug]?.[textRight ? "right" : "left"] ?? "light") : "light";
  const c = COLS[wide ? "wide" : "normal"];
  return (
    <article
      id={id}
      aria-label={label}
      className="relative isolate flex min-h-[max(100svh,100%)] items-center overflow-hidden lg:h-[100svh] lg:max-h-[960px] lg:min-h-[700px]"
    >
      {backdrop && (
        <>
          <div aria-hidden className="absolute inset-0 -z-10 bg-deep">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backdropSrc(slug)}
              srcSet={`${backdropSrc(slug).replace("/backdrops/", "/backdrops/sm/")} 960w, ${backdropSrc(slug)} 1536w`}
              sizes="100vw"
              alt=""
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div aria-hidden className={`slide-wash ${tone === "dark" ? "wash-dark" : ""} ${textRight ? "wash-right" : ""}`} />
        </>
      )}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 pt-24 pb-28 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className={`lg:row-start-1 ${textRight ? c.artLeft : c.artRight}`}>{art}</div>
        <div className={`${tone === "dark" ? "on-dark" : "on-light"} lg:row-start-1 ${textRight ? c.textRight : c.textLeft}`}>{text(tone)}</div>
      </div>
    </article>
  );
}
