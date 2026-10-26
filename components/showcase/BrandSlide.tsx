import type { CSSProperties } from "react";
import { backdropSrc, type Brand, type BrandLayout } from "@/lib/brands";
import { PixelArt } from "../Ethereal";
import BrandCollage from "./BrandCollage";

/*
 * Where the collage and the card sit, per layout, on large screens. Below lg
 * every layout stacks: collage first, then the card.
 */
const SHELL: Record<BrandLayout, { art: string; card: string }> = {
  spread: { art: "lg:col-span-7 lg:col-start-6 lg:row-start-1", card: "lg:col-span-5 lg:col-start-1 lg:row-start-1" },
  kit: { art: "lg:col-span-7 lg:col-start-6 lg:row-start-1", card: "lg:col-span-5 lg:col-start-1 lg:row-start-1" },
  wall: { art: "lg:col-span-7 lg:col-start-6 lg:row-start-1", card: "lg:col-span-5 lg:col-start-1 lg:row-start-1" },
  mirror: { art: "lg:col-span-7 lg:col-start-1 lg:row-start-1", card: "lg:col-span-5 lg:col-start-8 lg:row-start-1" },
  fan: { art: "lg:col-span-7 lg:col-start-1 lg:row-start-1", card: "lg:col-span-5 lg:col-start-8 lg:row-start-1" },
  cover: { art: "lg:col-span-12 lg:col-start-1 lg:row-start-1", card: "lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:mb-10 lg:self-end lg:z-10" },
  stickers: { art: "lg:col-span-12 lg:col-start-1 lg:row-start-1", card: "lg:col-span-4 lg:col-start-5 lg:row-start-1 lg:self-center lg:z-10" },
};

const pad = (n: number) => String(n).padStart(2, "0");

/** The generated scene behind a slide, with the site's grain and sparkles over it. */
export function Backdrop({ src, eager = false }: { src: string; eager?: boolean }) {
  return (
    <div aria-hidden className="bs-backdrop absolute inset-0 -z-10 overflow-hidden bg-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading={eager ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" />
      <div className="band-grain absolute inset-0" />
      <PixelArt name="sparkle" className="twinkle absolute top-[10%] right-[6%] w-6 opacity-80" />
      <PixelArt name="sparkle" className="twinkle absolute bottom-[14%] left-[46%] w-4 opacity-70 [animation-delay:-1.8s]" />
    </div>
  );
}

export function CopyCard({ brand, n, total, link = true }: { brand: Brand; n: number; total: number; link?: boolean }) {
  return (
    <div className="bs-card relative rounded-[20px] p-6 sm:p-8" style={{ "--accent": brand.accent } as CSSProperties}>
      <p className="type-pixel flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-ink/60">
        <span>
          {pad(n)} / {pad(total)}
        </span>
        <span aria-hidden>·</span>
        <span>{brand.org}</span>
        <span aria-hidden>·</span>
        <span>{brand.date}</span>
      </p>
      <h3 className="type-display mt-3 text-5xl text-iris sm:text-6xl xl:text-7xl">{brand.name}</h3>
      <p className="type-display mt-2 text-xl text-eminence italic sm:text-2xl">{brand.tagline}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{brand.brief}</p>
      <ul aria-label="Role" className="mt-5 flex flex-wrap gap-1.5">
        {brand.roles.map((r) => (
          <li key={r} className="rounded-full border border-ink/15 bg-white/60 px-2.5 py-0.5 text-xs text-ink/80">
            {r}
          </li>
        ))}
      </ul>
      <p className="type-pixel mt-3 text-[10px] text-ink/55">Tools · {brand.tools.join(" · ")}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {link && (
          <a href={`/design#${brand.slug}`} className="gel inline-flex min-h-[44px] items-center gap-2 px-5">
            View the full set <span aria-hidden>→</span>
          </a>
        )}
        {brand.href && (
          <a
            href={brand.href}
            target="_blank"
            rel="noopener noreferrer"
            className="type-pixel inline-flex min-h-[44px] items-center text-[11px] text-iris underline decoration-lavender/60 underline-offset-4"
          >
            See the post ↗
          </a>
        )}
      </div>
    </div>
  );
}

/** One brand, one screen: generated backdrop, the real pubmats, the copy. */
export default function BrandSlide({
  brand,
  n,
  total,
  eager = false,
  link = true,
}: {
  brand: Brand;
  n: number;
  total: number;
  eager?: boolean;
  link?: boolean;
}) {
  const shell = SHELL[brand.layout];
  return (
    <article
      aria-label={brand.name}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden lg:h-[100svh] lg:max-h-[960px] lg:min-h-[700px]"
    >
      <Backdrop src={backdropSrc(brand.slug)} eager={eager} />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 pt-24 pb-28 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className={shell.art}>
          <BrandCollage brand={brand} eager={eager} />
        </div>
        <div className={shell.card}>
          <CopyCard brand={brand} n={n} total={total} link={link} />
        </div>
      </div>
    </article>
  );
}
