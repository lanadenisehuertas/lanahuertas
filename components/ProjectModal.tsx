"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { Lotus, Sparkle4 } from "./Botanicals";
import { small } from "./ProjectBento";

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

/** Turn a YouTube / Vimeo / Google Drive URL into its embeddable form. */
function toEmbed(url: string): string | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;

  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;

  // Drive share links come in /file/d/<id>/view form; /preview is the
  // embeddable one. Requires the file to be link-shared, which these are.
  const gd = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (gd) return `https://drive.google.com/file/d/${gd[1]}/preview`;

  return null;
}

export default function ProjectModal({
  project,
  categoryLabel,
  onClose,
}: {
  project: Project | null;
  categoryLabel: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [sel, setSel] = useState<{ id?: string; i: number }>({ i: 0 });
  const idx = sel.id === project?.id ? sel.i : 0;
  const setIdx = useCallback((i: number) => setSel({ id: project?.id, i }), [project?.id]);

  const open = project !== null;


  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      const n = project?.images.length ?? 0;
      if (n > 1 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        setIdx((idx + (e.key === "ArrowRight" ? 1 : -1) + n) % n);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose, project, idx, setIdx]
  );

  /*
   * Focus + scroll lock depend ONLY on `open`. Keeping the key handler here made
   * the effect re-run on every parent render (onClose is a new identity each
   * time), and the cleanup's focus-restore fired immediately — pulling focus out
   * of the dialog the moment it opened.
   */
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();

    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, handleKey]);

  if (!project) return null;

  const titleId = "project-modal-title";
  const embed = project.videoUrl ? toEmbed(project.videoUrl) : null;
  const count = project.images.length;
  const shown = project.images[Math.min(idx, count - 1)];
  const file = `${project.id.replace(/-/g, "_")}.${project.isVideo ? "mov" : "png"}`;

  const meta = [
    ["Role", project.role],
    ["Year", project.year],
    ["Runtime", project.duration],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop: the paper ground, frosted, with the page's colour blooms */}
      <button
        type="button"
        aria-label="Close project details"
        onClick={onClose}
        className="scrim-in absolute inset-0 backdrop-blur-md"
        style={{
          background:
            "radial-gradient(40% 40% at 15% 20%, rgb(242 184 207 / 0.55), transparent 70%), radial-gradient(40% 40% at 85% 80%, rgb(169 182 240 / 0.55), transparent 70%), rgb(245 238 226 / 0.72)",
        }}
      />

      {/* The window */}
      <div
        ref={panelRef}
        className="sheet-in relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-[8px] border border-ink/50 bg-paper text-ink shadow-[8px_8px_0_var(--color-sky),0_30px_60px_-20px_rgb(81_1_124/0.45)]"
      >
        {/* Aero title bar — the pink bead closes it */}
        <div className="titlebar type-pixel flex h-10 shrink-0 items-center gap-3 px-3 text-[11px]">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="group flex h-8 items-center gap-2 rounded-full px-1.5"
          >
            <span className="closebox !h-4 !w-4 transition-transform duration-200 group-hover:scale-125" />
            <span className="text-ink/60 group-hover:text-ink">close</span>
          </button>
          <span className="mx-auto truncate normal-case">{file}</span>
          <span className="shrink-0 text-ink/60">
            {categoryLabel}
            {count > 1 && ` · ${idx + 1}/${count}`}
          </span>
        </div>

        <div className="grid overflow-y-auto md:grid-cols-[1.35fr_1fr]">
          {/* Media, on the garden sheet */}
          <div
            className="relative flex flex-col gap-4 p-4 sm:p-7"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 45%, #fff6ea 0%, transparent 70%), linear-gradient(160deg, #a9b6f0 0%, #c9b9ec 40%, #f2b8cf 75%, #f6d3c3 100%)",
            }}
          >
            <div aria-hidden className="band-grain pointer-events-none absolute inset-0" />

            {embed ? (
              <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                <iframe
                  src={embed}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full rounded-[4px] border border-ink/40 shadow-[5px_5px_0_var(--color-blush)]"
                />
              </div>
            ) : (
              <figure className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={shown.src}
                  src={shown.src}
                  alt={shown.caption ?? project.title}
                  width={shown.w}
                  height={shown.h}
                  className="card-in mx-auto block max-h-[60vh] w-auto max-w-full rounded-[4px] border border-ink/40 object-contain shadow-[5px_5px_0_var(--color-blush)]"
                />
                {count > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous piece"
                      onClick={() => setIdx((idx - 1 + count) % count)}
                      className="bloom-orb absolute top-1/2 left-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full"
                    >
                      <span aria-hidden className="relative">←</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Next piece"
                      onClick={() => setIdx((idx + 1) % count)}
                      className="bloom-orb absolute top-1/2 right-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full"
                    >
                      <span aria-hidden className="relative">→</span>
                    </button>
                  </>
                )}
                {(shown.caption || project.isVideo) && (
                  <figcaption className="type-display relative mt-3 text-center text-lg text-ink/75 italic">
                    {shown.caption ??
                      `Still from the edit${project.duration ? ` · ${project.duration}` : ""} — full video coming soon.`}
                  </figcaption>
                )}
              </figure>
            )}

            {!embed && count > 1 && (
              <div className="relative flex flex-wrap justify-center gap-2" role="tablist" aria-label="Pieces in this project">
                {project.images.map((im, i) => (
                  <button
                    key={im.src}
                    type="button"
                    role="tab"
                    aria-selected={i === idx}
                    aria-label={im.caption ?? `Piece ${i + 1}`}
                    onClick={() => setIdx(i)}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-[4px] border transition duration-200 ${
                      i === idx
                        ? "-translate-y-0.5 border-ink shadow-[3px_3px_0_var(--color-iris)]"
                        : "border-ink/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={small(im.src)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <Lotus className="sway pointer-events-none absolute -bottom-3 -left-2 w-16 sm:w-20" deep />
            <Sparkle4 className="spin-slow pointer-events-none absolute top-3 right-3 h-5 w-5 text-white" />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            <h2 id={titleId} className="type-display text-4xl leading-tight text-iris sm:text-5xl">
              {project.title}
            </h2>
            {project.client && (
              <p className="type-display mt-1 text-xl text-lavender italic">{project.client}</p>
            )}

            {project.description && (
              <div className="mt-5 space-y-3">
                {project.description.split("\n\n").map((para, i) => (
                  <p key={i} className="text-[14px] leading-relaxed text-ink/80">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {meta.length > 0 && (
              <dl className="mt-6 divide-y divide-dashed divide-ink/15 border-y border-dashed border-ink/15">
                {meta.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-2">
                    <dt className="type-pixel text-[10px] text-ink/55">{k}</dt>
                    <dd className="text-right text-[13px]">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {project.tools && project.tools.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Made with">
                {project.tools.map((t) => (
                  <li key={t} className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-[12px]">
                    {t}
                  </li>
                ))}
              </ul>
            )}

            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="gel mt-8 inline-flex min-h-[48px] items-center px-7"
              >
                {project.hrefLabel ?? "View project"} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
