"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Project } from "@/lib/content";
import Sparkle from "./Sparkle";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export default function ProjectModal({
  project,
  slotNumber,
  categoryLabel,
  onClose,
}: {
  project: Project | null;
  /** Set when an unfilled placeholder was opened. */
  slotNumber?: number | null;
  categoryLabel: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Element to hand focus back to when the dialog closes.
  const restoreRef = useRef<HTMLElement | null>(null);

  const open = project !== null || slotNumber != null;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      // Focus trap: keep Tab inside the dialog.
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
   * Focus + scroll lock depend ONLY on `open`. Keeping the key handler in this
   * effect made it re-run on every parent render (onClose is a new identity each
   * time), and the cleanup's focus-restore fired immediately — pulling focus out
   * of the dialog the moment it opened.
   */
  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();

    // Lock background scroll without the layout jump from the scrollbar.
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

  // Key handling is free to re-bind without disturbing focus.
  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, handleKey]);

  if (!open) return null;

  const isEmpty = project === null;
  const titleId = "project-modal-title";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Scrim — dark enough to isolate the sheet, click to dismiss. */}
      <button
        type="button"
        aria-label="Close project details"
        onClick={onClose}
        className="scrim-in absolute inset-0 cursor-pointer bg-ink/75 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="sheet-in relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-2 border-ink bg-maize text-ink shadow-hard"
      >
        <div className="flex items-center justify-between gap-4 border-b-2 border-ink/15 px-5 py-3">
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

        <div className="grid gap-0 overflow-y-auto md:grid-cols-[1.25fr_1fr]">
          {/* Media */}
          <div className="flex items-center justify-center bg-lavender/30 p-4 sm:p-6">
            {isEmpty ? (
              <div className="flex aspect-[3/4] w-full max-w-sm flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/30 text-center">
                <Sparkle size={26} className="text-eminence/50" />
                <p className="font-display text-sm font-bold text-ink/50">
                  Slot {String(slotNumber).padStart(2, "0")}
                </p>
                <p className="max-w-[15rem] text-xs text-ink/45">
                  No artwork here yet.
                </p>
              </div>
            ) : project.video ? (
              <video
                src={project.video}
                controls
                className="max-h-[70vh] w-full rounded-xl border-2 border-ink"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={project.image}
                alt={project.title}
                className="max-h-[70vh] w-full rounded-xl border-2 border-ink object-contain"
              />
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            <h2 id={titleId} className="font-display text-3xl font-black tracking-tight">
              {isEmpty ? "Untitled slot" : project.title}
            </h2>

            {isEmpty ? (
              <div className="mt-4 space-y-3 text-sm text-ink/70">
                <p>
                  This is a placeholder. Add the project to{" "}
                  <code className="rounded bg-ink/10 px-1.5 py-0.5 text-xs">
                    lib/content.ts
                  </code>{" "}
                  and its image, title, description, role, year, and tools will appear
                  here.
                </p>
              </div>
            ) : (
              <>
                {project.description && (
                  <p className="mt-4 text-sm leading-relaxed text-ink/80">
                    {project.description}
                  </p>
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
                    View project
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
