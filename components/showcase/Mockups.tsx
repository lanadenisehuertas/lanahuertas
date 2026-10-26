import type { CSSProperties } from "react";
import type { ProjectImage } from "@/lib/content";
import Pic from "./Pic";

type Common = { img: ProjectImage; className?: string; style?: CSSProperties; eager?: boolean; sizes?: string };

/** A feed post inside a handset: header, the post at its own ratio, actions. */
export function PhoneFrame({ img, handle, className = "", style, eager, sizes = "(min-width: 1024px) 18vw, 40vw" }: Common & { handle: string }) {
  return (
    <figure className={`bs-piece phone ${className}`} style={style}>
      <div className="phone-screen flex flex-col">
        <div className="flex items-center gap-1.5 px-[7%] pt-[16%] pb-[4%]">
          <span aria-hidden className="h-[1.1em] w-[1.1em] shrink-0 rounded-full bg-linear-to-br from-sky to-blush" />
          <span className="type-pixel truncate text-[clamp(6px,0.7vw,9px)] text-ink/70 normal-case">{handle}</span>
        </div>
        <Pic img={img} sizes={sizes} eager={eager} className="block h-auto w-full" />
        <div aria-hidden className="flex gap-[6%] px-[7%] pt-[5%]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[0.9em] w-[0.9em] rounded-full border-[1.5px] border-ink/50" />
          ))}
        </div>
        <div aria-hidden className="space-y-[4%] px-[7%] pt-[5%]">
          <span className="block h-[0.35em] w-[70%] rounded-full bg-ink/15" />
          <span className="block h-[0.35em] w-[45%] rounded-full bg-ink/10" />
        </div>
      </div>
    </figure>
  );
}

/** A printed poster, taped up, with a paper sheen. */
export function PrintFrame({ img, className = "", style, eager, tape = true, sizes = "(min-width: 1024px) 30vw, 60vw" }: Common & { tape?: boolean }) {
  return (
    <figure className={`bs-piece print ${className}`} style={style}>
      {tape && <span aria-hidden className="print-tape" />}
      <Pic img={img} sizes={sizes} eager={eager} className="block h-auto w-full" />
      <span aria-hidden className="print-sheen" />
    </figure>
  );
}

/** Die-cut: the image itself with a traced white edge. */
export function Sticker({ img, className = "", style, sizes = "(min-width: 1024px) 12vw, 25vw" }: Common) {
  return (
    <figure className={`bs-piece ${className}`} style={style}>
      <Pic img={img} sizes={sizes} className="sticker block h-auto w-full" />
    </figure>
  );
}

/** Event ID on a strap — for DP frames and nameplates. */
export function LanyardID({ img, className = "", style, sizes = "(min-width: 1024px) 14vw, 30vw" }: Common) {
  return (
    <figure className={`bs-piece ${className}`} style={style}>
      <span aria-hidden className="lanyard-strap" />
      <div className="lanyard-card">
        <Pic img={img} sizes={sizes} className="block h-auto w-full rounded-[6px]" />
      </div>
    </figure>
  );
}
