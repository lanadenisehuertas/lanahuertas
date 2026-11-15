"use client";

import { useEffect, useState } from "react";

const KEY = "motion-still-v1";

/**
 * "Pause motion": one switch, fixed in the corner, that holds every looping
 * decoration on the site still (twinkles, drifting clouds, the butterflies,
 * the orbit riders) and stops the video reel moving on by itself. The page
 * has ambient motion that starts on its own and never ends, so a visitor
 * needs a way to stop it that does not depend on a system setting (WCAG
 * 2.2.2, Pause, Stop, Hide). The choice is remembered on this device.
 *
 * It sets data-still on <html>. Only elements with an endless CSS animation
 * are held (each is marked data-held, and work.css pauses those), not every
 * animation on the page, so one-off reveals that happen to be mid-flight
 * still finish and nothing is left half-shown. Script-driven motion (the
 * reel, the pointer tilt) reads data-still.
 */
export default function MotionToggle() {
  const [still, setStill] = useState(false);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- the saved choice, read once on arrival */
    if (localStorage.getItem(KEY) === "1") setStill(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-still", still);
    if (!still) {
      document.querySelectorAll("[data-held]").forEach((el) => el.removeAttribute("data-held"));
      return;
    }
    // mark whatever is looping right now; work.css holds the marked elements still
    const hold = () => {
      for (const a of document.getAnimations()) {
        if (!(a instanceof CSSAnimation) || a.playState !== "running") continue;
        const fx = a.effect as KeyframeEffect | null;
        if (fx?.target && fx.getComputedTiming().iterations === Infinity) fx.target.setAttribute("data-held", "");
      }
    };
    hold();
    // decorations further down the page start their loops as they come near
    const again = window.setInterval(hold, 1500);
    return () => window.clearInterval(again);
  }, [still]);

  const flip = () =>
    setStill((s) => {
      try {
        localStorage.setItem(KEY, s ? "0" : "1");
      } catch {}
      return !s;
    });

  return (
    <button type="button" className="motion-toggle" aria-pressed={still} onClick={flip}>
      <svg viewBox="0 0 24 24" aria-hidden>
        {still ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
      </svg>
      <span>{still ? "Play motion" : "Pause motion"}</span>
    </button>
  );
}
