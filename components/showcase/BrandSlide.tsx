"use client";

import { useState } from "react";
import type { Brand } from "@/lib/brands";
import { palettes } from "@/lib/palettes";
import Backdrop from "./Backdrop";
import Lightbox from "./Lightbox";
import Pic from "./Pic";
import { useSlide } from "./Spread";
import SpreadCopy from "./SpreadCopy";
import { pad, washVar } from "./tone";

/**
 * One brand, one screen: its artboard edge to edge, the words on the wash,
 * the key visual large with two supporting pieces, and a filmstrip of the
 * whole set. Hovering a thumb previews it in the big frame, clicking pins it
 * (clicking the pinned one opens it); clicking a piece opens the lightbox.
 */
export default function BrandSlide({ brand, n, total, link = true }: { brand: Brand; n: number; total: number; link?: boolean }) {
  const { near, heading } = useSlide();
  const [pinned, setPinned] = useState(brand.featured[0]);
  const [preview, setPreview] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const set = brand.set;
  const big = preview ?? pinned;
  const sides = brand.featured.filter((i) => i !== pinned).slice(0, 2);
  const name = (i: number) => `${brand.name}, piece ${i + 1} of ${set.length}`;

  return (
    <article className="sp-slide sp-slide--brand" style={washVar(brand.slug)} aria-label={brand.name}>
      <Backdrop slug={brand.slug} eager={near} />

      <SpreadCopy
        meta={`${pad(n)} / ${pad(total)} · ${brand.org} · ${brand.date}`}
        title={brand.name}
        heading={heading}
        tagline={brand.tagline}
        body={brand.brief}
        palette={palettes[brand.slug]}
        parts={brand.roles}
        actions={
          <>
            {link && (
              <a href={`/design#${brand.slug}`} className="btn">
                View the full set <span aria-hidden>→</span>
              </a>
            )}
            {brand.href &&
              (link ? (
                <a href={brand.href} target="_blank" rel="noopener noreferrer" className="link sp-link">
                  See the post <span aria-hidden>↗</span>
                </a>
              ) : (
                <a href={brand.href} target="_blank" rel="noopener noreferrer" className="btn">
                  See the post <span aria-hidden>↗</span>
                </a>
              ))}
          </>
        }
      />

      <div className="sp-stage sp-stage--brand">
        <button type="button" className="sp-piece sp-big" aria-label={`Open ${name(big)}`} onClick={() => setOpen(big)}>
          <Pic img={set[big]} eager={near} sizes="(min-width: 1200px) 36vw, (min-width: 768px) 32vw, 92vw" />
        </button>
        <div className="sp-sides">
          {sides.map((i) => (
            <button key={i} type="button" className="sp-piece" aria-label={`Open ${name(i)}`} onClick={() => setOpen(i)}>
              <Pic img={set[i]} eager={near} sizes="(min-width: 768px) 22vw, 45vw" />
            </button>
          ))}
        </div>
      </div>

      <ul className="sp-strip" aria-label={`${brand.name}: the full set`}>
        {set.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              className="sp-thumb"
              aria-pressed={i === pinned}
              aria-label={i === pinned ? `Open ${name(i)}` : `Show ${name(i)}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(i)}
              onPointerLeave={() => setPreview(null)}
              onFocus={() => setPreview(i)}
              onBlur={() => setPreview(null)}
              onClick={() => {
                if (i === pinned) setOpen(i);
                else setPinned(i);
                setPreview(null);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.w > 720 ? img.src.replace("/work/", "/work/sm/") : img.src}
                width={img.w}
                height={img.h}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <Lightbox
          label={brand.name}
          items={set.map((img) => ({ img, caption: brand.name }))}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </article>
  );
}
