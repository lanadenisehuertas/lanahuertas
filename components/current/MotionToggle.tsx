"use client";

import { useSyncExternalStore } from "react";
import { isStill, onStill, setStill } from "@/lib/motion";

/** The site-wide switch for ambient movement: the drifting light, the scroll-linked scenes and the reveals. */
export default function MotionToggle({ className = "link" }: { className?: string }) {
  const still = useSyncExternalStore(onStill, isStill, () => false);
  return (
    <button type="button" data-nosfx aria-pressed={still} onClick={() => setStill(!still)} className={className}>
      Pause motion
    </button>
  );
}
