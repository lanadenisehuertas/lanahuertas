import type { CSSProperties } from "react";

/**
 * The site mark in the nav: a glossy pearl with a pastel lotus opening in
 * front of its lower half and a sparkle on its rim. Drawn in SVG so it stays
 * crisp at 42px; the petals lift and the sparkle twinkles (globals.css,
 * "Masthead").
 */
export default function NavEmblem() {
  return (
    <svg viewBox="0 0 42 42" aria-hidden className="masthead-mark">
      <defs>
        <radialGradient id="nm-pearl" cx="0.36" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#f3e8ff" />
          <stop offset="0.7" stopColor="#d9c8ff" />
          <stop offset="1" stopColor="#b9a6f2" />
        </radialGradient>
        <linearGradient id="nm-film" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5a9d8" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#ffd4b8" stopOpacity="0.25" />
          <stop offset="1" stopColor="#aeead6" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="nm-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9c6e4" />
          <stop offset="1" stopColor="#c94fa0" />
        </linearGradient>
        <linearGradient id="nm-petal-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7d9ff" />
          <stop offset="1" stopColor="#9a78e0" />
        </linearGradient>
      </defs>

      {/* The pearl */}
      <circle cx="21" cy="19" r="15" fill="url(#nm-pearl)" />
      <circle cx="21" cy="19" r="15" fill="url(#nm-film)" />
      <circle cx="21" cy="19" r="14.4" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
      <ellipse cx="15.5" cy="12.5" rx="4.2" ry="2.6" fill="#ffffff" opacity="0.85" transform="rotate(-30 15.5 12.5)" />

      {/* The lotus, in front of the pearl's lower half */}
      <path className="nm-petal" style={{ "--r": "-48deg" } as CSSProperties} d="M21 31 C 17 27 17 21 21 17 C 25 21 25 27 21 31Z" fill="url(#nm-petal-back)" />
      <path className="nm-petal" style={{ "--r": "48deg" } as CSSProperties} d="M21 31 C 17 27 17 21 21 17 C 25 21 25 27 21 31Z" fill="url(#nm-petal-back)" />
      <path className="nm-petal" style={{ "--r": "-24deg" } as CSSProperties} d="M21 31 C 16.5 26 16.5 19 21 14 C 25.5 19 25.5 26 21 31Z" fill="url(#nm-petal)" />
      <path className="nm-petal" style={{ "--r": "24deg" } as CSSProperties} d="M21 31 C 16.5 26 16.5 19 21 14 C 25.5 19 25.5 26 21 31Z" fill="url(#nm-petal)" />
      <path className="nm-petal" style={{ "--r": "0deg" } as CSSProperties} d="M21 32 C 16 26 16.5 17 21 12 C 25.5 17 26 26 21 32Z" fill="url(#nm-petal)" />
      <path d="M21 31 L21 16" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
      <path d="M12 33 C 17 36 25 36 30 33" fill="none" stroke="#4f9a78" strokeWidth="1.6" strokeLinecap="round" />

      {/* The sparkle on the rim */}
      <path
        className="nm-spark"
        d="M33 3 L34.2 7.8 L39 9 L34.2 10.2 L33 15 L31.8 10.2 L27 9 L31.8 7.8Z"
        fill="#ffffff"
        stroke="#f5a9d8"
        strokeWidth="0.6"
      />
    </svg>
  );
}
