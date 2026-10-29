"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ProjectImage } from "@/lib/content";
import { pad } from "./tone";

export type LightboxItem = { img: ProjectImage; caption: string };

/**
 * A piece at full size in a modal <dialog>: Esc or a click outside closes it,
 * ←/→ and the arrow buttons step through the set, and focus goes back to
 * whatever opened it. Mount it to open, unmount to close.
 */
export default function Lightbox({
  items,
  index,
  label,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  /** The set's name, for the dialog's accessible name. */
  label: string;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const n = items.length;
  const item = items[index];
  const go = (by: number) => onIndex((((index + by) % n) + n) % n);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    if (!dlg.open) dlg.showModal();
    return () => {
      root.style.overflow = overflow;
      if (dlg.open) dlg.close();
      opener?.focus({ preventScroll: true });
    };
  }, []);

  if (!item) return null;

  return createPortal(
    <dialog
      ref={ref}
      className="lb"
      aria-label={`${label}: ${item.caption}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (n < 2) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(-1);
        }
      }}
    >
      <figure className="lb-fig" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={item.img.src} src={item.img.src} width={item.img.w} height={item.img.h} alt={item.caption} decoding="async" />
        <figcaption>
          {item.caption}
          {n > 1 && <span className="lb-n"> · {pad(index + 1)} / {pad(n)}</span>}
        </figcaption>
      </figure>
      {n > 1 && (
        <>
          <button type="button" className="lb-btn lb-prev" aria-label="Previous piece" onClick={() => go(-1)}>
            <span aria-hidden>←</span>
          </button>
          <button type="button" className="lb-btn lb-next" aria-label="Next piece" onClick={() => go(1)}>
            <span aria-hidden>→</span>
          </button>
        </>
      )}
      <button type="button" className="lb-btn lb-close" aria-label="Close" onClick={onClose} autoFocus>
        <span aria-hidden>×</span>
      </button>
    </dialog>,
    document.body
  );
}
