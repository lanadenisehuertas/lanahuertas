"use client";

import { useState } from "react";
import { meow, purr } from "@/lib/dusk/sound";

/**
 * Peanut, Lana's cat, as a small thing to find in the footer: a pixel sprite
 * that is asleep until you press it, then wakes, meows and settles again.
 */
export default function Peanut() {
  const [up, setUp] = useState(false);
  const wake = () => {
    if (up) return purr();
    setUp(true);
    meow();
    window.setTimeout(() => setUp(false), 2600);
  };
  return (
    <button type="button" data-nosfx className="peanut" aria-label={up ? "Peanut the cat is awake" : "Peanut the cat is asleep. Wake her"} onClick={wake}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={up ? "/art/peanut/awake.svg" : "/art/peanut/sleep.svg"} alt="" width={40} height={32} decoding="async" loading="lazy" />
    </button>
  );
}
