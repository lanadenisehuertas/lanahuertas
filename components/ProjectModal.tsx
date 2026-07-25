"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Project } from "@/lib/content";

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

/** Turn a YouTube/Vimeo watch URL into its embed form. */
function toEmbed(url: string): string | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
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

  const open = project !== null;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
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
    [onClose]
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Close project details"
        onClick={onClose}
        className="scrim-in absolute inset-0 cursor-pointer bg-ink/80 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="sheet-in relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-2 border-ink bg-maize text-ink shadow-hard"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b-2 border-ink/15 px-5 py-3">
          <p className="font-display text-[11px] font-bold tracking-[0.18em] text-eminence uppercase">
            {categoryLabel}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="font-display press-sm flex min-h-[44px] cursor-pointer items-center rounded-full border-2 border-ink px-5 text-xs font-bold hover:bg-eminence hover:text-maize"
          >
            Close
          </button>
        </div>

        <div className="grid overflow-y-auto md:grid-cols-[1.3fr_1fr]">
          {/* Media */}
          <div className="flex items-start justify-center bg-lavender/25 p-4 sm:p-6">
            {embed ? (
              <div className="w-full" style={{ aspectRatio: "16 / 9" }}>
                <iframe
                  src={embed}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full rounded-xl border-2 border-ink"
                />
              </div>
            ) : (
              <figure className="w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  width={project.w}
                  height={project.h}
                  className="mx-auto block max-h-[68vh] w-auto max-w-full rounded-xl border-2 border-ink object-contain"
                />
                {project.isVideo && (
                  <figcaption className="mt-3 text-center text-xs text-ink/50">
                    Still from the edit
                    {project.duration ? ` · ${project.duration}` : ""} — full video coming soon.
                  </figcaption>
                )}
              </figure>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            <h2 id={titleId} className="font-display text-3xl font-black tracking-tight">
              {project.title}
            </h2>

            {project.description && (
              <div className="mt-4 space-y-3">
                {project.description.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-ink/80">
                    {para}
                  </p>
                ))}
              </div>
            )}

            <dl className="mt-6 space-y-3">
              {project.client && (
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-eminence uppercase">
                    Client
                  </dt>
                  <dd className="text-sm">{project.client}</dd>
                </div>
              )}
              {project.role && (
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-eminence uppercase">
                    Role
                  </dt>
                  <dd className="text-sm">{project.role}</dd>
                </div>
              )}
              {project.year && (
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-eminence uppercase">
                    Year
                  </dt>
                  <dd className="text-sm">{project.year}</dd>
                </div>
              )}
              {project.duration && (
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-eminence uppercase">
                    Runtime
                  </dt>
                  <dd className="text-sm tabular-nums">{project.duration}</dd>
                </div>
              )}
              {project.tools && project.tools.length > 0 && (
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-eminence uppercase">
                    Made with
                  </dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {project.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-ink/30 px-3 py-1 text-xs font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="font-display press mt-8 inline-flex min-h-[44px] cursor-pointer items-center rounded-full border-2 border-ink bg-fawn px-6 text-sm font-bold shadow-hard-sm hover:bg-eminence hover:text-maize"
              >
                {project.hrefLabel ?? "View project"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
