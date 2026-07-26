/**
 * Physical desk objects — tape, paper clip, rubber stamp.
 *
 * All decorative and aria-hidden. They exist to make the folders read as
 * things sitting on a surface rather than rectangles on a screen.
 */

export function Tape({
  className = "",
  rotate = -4,
  width = 92,
}: {
  className?: string;
  rotate?: number;
  width?: number;
}) {
  return (
    <span
      aria-hidden
      className={`tape ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, width }}
    />
  );
}

export function PaperClip({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute z-30 ${className}`}>
      <svg viewBox="0 0 32 76" className="h-14 w-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]">
        <path
          d="M23 20v34a9 9 0 0 1-18 0V16a6 6 0 0 1 12 0v36a3.5 3.5 0 0 1-7 0V22"
          fill="none"
          stroke="url(#clip-metal)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="clip-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f2f0ee" />
            <stop offset="45%" stopColor="#9c9aa2" />
            <stop offset="100%" stopColor="#dad7dd" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

export function Stamp({
  children,
  className = "",
  rotate = -8,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden
      className={`stamp pointer-events-none absolute z-20 text-[10px] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
