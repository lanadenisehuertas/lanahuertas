import type { CSSProperties } from "react";
import type { Brand } from "@/lib/brands";
import type { ProjectImage } from "@/lib/content";
import { LanyardID, PhoneFrame, PrintFrame, Sticker } from "./Mockups";
import Pic from "./Pic";

/** A spot in the collage box, in % of the box. `hideSm` drops it on phones. */
type Spot = { l?: string; r?: string; t?: string; b?: string; w: string; rot: number; z?: number; hideSm?: boolean };

function place(s: Spot, i: number, flip = false): CSSProperties {
  return {
    left: flip ? s.r : s.l,
    right: flip ? s.l : s.r,
    top: s.t,
    bottom: s.b,
    width: s.w,
    zIndex: s.z,
    "--r": `${flip ? -s.rot : s.rot}deg`,
    "--i": i,
  } as CSSProperties;
}

const hide = (s: Spot) => (s.hideSm ? "hidden sm:block" : "");

/* Spread: poster left, phone right, an ID and stickers around them. Mirror
   is the same arrangement flipped. */
const SPREAD = {
  print: [
    { l: "2%", t: "4%", w: "50%", rot: -4, z: 2 },
    { r: "0%", b: "0%", w: "34%", rot: 3, z: 1, hideSm: true },
    { l: "28%", b: "-2%", w: "26%", rot: -2, z: 1, hideSm: true },
  ],
  phone: [{ r: "6%", t: "4%", w: "30%", rot: 5, z: 3 }],
  id: [{ l: "42%", b: "-6%", w: "19%", rot: -8, z: 4, hideSm: true }],
  sticker: [
    { l: "-2%", b: "4%", w: "18%", rot: -10, z: 5 },
    { r: "33%", t: "-5%", w: "14%", rot: 12, z: 5, hideSm: true },
    { r: "-3%", b: "22%", w: "15%", rot: 8, z: 5, hideSm: true },
  ],
} satisfies Record<string, Spot[]>;

const FAN_PHONES: Spot[] = [
  { l: "34%", t: "0%", w: "32%", rot: 0, z: 3 },
  { l: "4%", t: "9%", w: "30%", rot: -9, z: 2 },
  { r: "4%", t: "9%", w: "30%", rot: 9, z: 2 },
];

const STICKERS = {
  print: [
    { l: "1%", t: "6%", w: "24%", rot: -5, z: 2 },
    { r: "2%", b: "2%", w: "22%", rot: 4, z: 2, hideSm: true },
  ],
  phone: [{ r: "5%", t: "0%", w: "16%", rot: 6, z: 3 }],
  sticker: [
    { l: "6%", b: "0%", w: "19%", rot: -8, z: 4 },
    { r: "27%", b: "-4%", w: "14%", rot: 10, z: 4, hideSm: true },
    { l: "28%", t: "-2%", w: "12%", rot: -12, z: 4, hideSm: true },
  ],
} satisfies Record<string, Spot[]>;

const WALL: Spot[] = [
  { l: "2%", t: "2%", w: "30%", rot: -2, z: 1 },
  { l: "35%", t: "7%", w: "30%", rot: 1, z: 1 },
  { l: "68%", t: "0%", w: "30%", rot: 2, z: 1, hideSm: true },
  { l: "16%", t: "53%", w: "30%", rot: 2, z: 1, hideSm: true },
  { l: "52%", t: "55%", w: "30%", rot: -1, z: 1, hideSm: true },
];

function Spread({ brand, eager, flip }: { brand: Brand; eager: boolean; flip: boolean }) {
  const c = brand.collage;
  let i = 0;
  return (
    <div className="relative aspect-[6/5]">
      {c.print?.slice(0, 3).map((img, k) => (
        <PrintFrame key={img.src} img={img} eager={eager && k === 0} className={hide(SPREAD.print[k])} style={place(SPREAD.print[k], i++, flip)} />
      ))}
      {c.phone?.slice(0, 1).map((img) => (
        <PhoneFrame key={img.src} img={img} handle={brand.handle} eager={eager} style={place(SPREAD.phone[0], i++, flip)} />
      ))}
      {c.id?.slice(0, 1).map((img) => (
        <LanyardID key={img.src} img={img} className={hide(SPREAD.id[0])} style={place(SPREAD.id[0], i++, flip)} />
      ))}
      {c.sticker?.slice(0, 3).map((img, k) => (
        <Sticker key={img.src} img={img} className={hide(SPREAD.sticker[k])} style={place(SPREAD.sticker[k], i++, flip)} />
      ))}
    </div>
  );
}

/* Cover: the key visual huge on the right, sized to the box height so it
   bleeds off the right edge without losing its bottom. */
function Cover({ brand, eager }: { brand: Brand; eager: boolean }) {
  const key = brand.collage.key?.[0];
  if (!key) return null;
  const ar = key.w / key.h;
  const w = Math.min(64, 95 * (9 / 16) * ar);
  return (
    <div className="relative aspect-[16/9]">
      <PrintFrame img={key} eager={eager} tape={false} sizes="(min-width: 1024px) 60vw, 90vw" style={place({ r: "-3%", t: "2%", w: `${w}%`, rot: 2, z: 1 }, 0)} />
      {brand.collage.phone?.slice(0, 1).map((img) => (
        <PhoneFrame key={img.src} img={img} handle={brand.handle} className="hidden sm:block" style={place({ l: "38%", b: "-8%", w: "16%", rot: -6, z: 3 }, 1)} />
      ))}
      {brand.collage.print?.slice(0, 1).map((img) => (
        <PrintFrame key={img.src} img={img} className="hidden lg:block" style={place({ l: "2%", t: "-2%", w: "20%", rot: -6, z: 0 }, 2)} />
      ))}
    </div>
  );
}

function Fan({ brand, eager }: { brand: Brand; eager: boolean }) {
  const key = brand.collage.key?.[0];
  return (
    <div className="relative aspect-[6/5]">
      {key && <PrintFrame img={key} tape={false} className="hidden sm:block" style={place({ l: "6%", b: "0%", w: "88%", rot: -2, z: 0 }, 0)} />}
      {brand.collage.phone?.slice(0, 3).map((img, k) => (
        <PhoneFrame key={img.src} img={img} handle={brand.handle} eager={eager && k === 0} style={place(FAN_PHONES[k], k + 1)} />
      ))}
    </div>
  );
}

function StickerSheet({ brand, eager }: { brand: Brand; eager: boolean }) {
  const c = brand.collage;
  let i = 0;
  return (
    <div className="relative aspect-[4/3] sm:aspect-[2/1]">
      {c.print?.slice(0, 2).map((img, k) => (
        <PrintFrame key={img.src} img={img} eager={eager && k === 0} className={hide(STICKERS.print[k])} style={place(STICKERS.print[k], i++)} />
      ))}
      {c.phone?.slice(0, 1).map((img) => (
        <PhoneFrame key={img.src} img={img} handle={brand.handle} style={place(STICKERS.phone[0], i++)} />
      ))}
      {c.sticker?.slice(0, 3).map((img, k) => (
        <Sticker key={img.src} img={img} className={hide(STICKERS.sticker[k])} style={place(STICKERS.sticker[k], i++)} />
      ))}
    </div>
  );
}

/* Kit: a flat-lay grid. The lead piece spans two by two. */
function Kit({ brand, eager }: { brand: Brand; eager: boolean }) {
  const lead = brand.collage.print?.[0];
  const items: ProjectImage[] = brand.collage.item ?? [];
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {lead && (
        <figure className="bs-piece print relative col-span-2 row-span-2 self-start" style={{ position: "relative", "--i": 0 } as CSSProperties}>
          <Pic img={lead} eager={eager} sizes="(min-width: 1024px) 28vw, 60vw" className="block h-auto w-full" />
          <span aria-hidden className="print-sheen" />
        </figure>
      )}
      {items.slice(0, 8).map((img, k) => (
        <figure
          key={img.src}
          className={`bs-piece kit-tile relative flex aspect-square items-center justify-center rounded-[14px] p-2 ${k >= 4 ? "hidden sm:flex" : ""}`}
          style={{ position: "relative", "--i": k + 1 } as CSSProperties}
        >
          <Pic img={img} sizes="(min-width: 1024px) 12vw, 28vw" className="max-h-full w-auto max-w-full object-contain" />
        </figure>
      ))}
    </div>
  );
}

/* Wall: framed pieces hung salon-style. */
function Wall({ brand, eager }: { brand: Brand; eager: boolean }) {
  return (
    <div className="relative aspect-[6/5]">
      {brand.collage.card?.slice(0, 5).map((img, k) => (
        <figure key={img.src} className={`bs-piece wall-frame ${hide(WALL[k])}`} style={place(WALL[k], k)}>
          <Pic img={img} eager={eager && k === 0} sizes="(min-width: 1024px) 18vw, 40vw" className="block h-auto w-full" />
        </figure>
      ))}
    </div>
  );
}

export default function BrandCollage({ brand, eager = false }: { brand: Brand; eager?: boolean }) {
  switch (brand.layout) {
    case "spread":
      return <Spread brand={brand} eager={eager} flip={false} />;
    case "mirror":
      return <Spread brand={brand} eager={eager} flip />;
    case "cover":
      return <Cover brand={brand} eager={eager} />;
    case "fan":
      return <Fan brand={brand} eager={eager} />;
    case "stickers":
      return <StickerSheet brand={brand} eager={eager} />;
    case "kit":
      return <Kit brand={brand} eager={eager} />;
    case "wall":
      return <Wall brand={brand} eager={eager} />;
  }
}
