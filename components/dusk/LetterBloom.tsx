"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { bloomLetters } from "@/lib/dusk/pixelFlowers";

/** Wraps a MorphName so touching a letter blooms pixel flowers round it, as on the hero name. */
export default function LetterBloom({ children, className = "" }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => (box.current ? bloomLetters(box.current) : undefined), []);
  return (
    <div ref={box} className={className}>
      {children}
    </div>
  );
}
