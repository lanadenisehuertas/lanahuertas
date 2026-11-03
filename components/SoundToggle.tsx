"use client";

import { useSyncExternalStore } from "react";
import { isMuted, onMute, setMuted } from "@/lib/dusk/sound";

/**
 * The one switch for every sound on the page (the sky notes, the bass, the
 * little interface clicks), kept in the nav so it is always in reach. A pixel
 * speaker in the site's own hand: sound waves when on, a cross when off. The
 * choice holds for the tab (sound.ts keeps it in sessionStorage).
 */
export default function SoundToggle() {
  const muted = useSyncExternalStore(onMute, isMuted, () => false);
  return (
    <button
      type="button"
      data-nosfx
      aria-pressed={!muted}
      aria-label={muted ? "Sound is off. Turn sound on" : "Sound is on. Turn sound off"}
      title={muted ? "Sound off" : "Sound on"}
      onClick={() => setMuted(!muted)}
      className="nav-sound"
    >
      <svg viewBox="0 0 16 14" width="22" height="20" shapeRendering="crispEdges" aria-hidden>
        <path fill="currentColor" d="M1 5h3v4H1zM4 4h1v6H4zM5 3h1v8H5zM6 2h1v10H6zM7 1h1v12H7z" />
        {muted ? (
          <path fill="currentColor" d="M10 4h1v1h-1zM11 5h1v1h-1zM12 6h1v1h-1zM13 7h1v1h-1zM14 8h1v1h-1zM14 4h1v1h-1zM13 5h1v1h-1zM11 7h1v1h-1zM10 8h1v1h-1z" />
        ) : (
          <path fill="currentColor" d="M10 5h1v4h-1zM12 3h1v1h-1zM13 4h1v6h-1zM12 10h1v1h-1z" />
        )}
      </svg>
    </button>
  );
}
