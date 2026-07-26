/**
 * Spec-sheet furniture: corner labels, registration crosses, and an oversized
 * ghost word. Borrowed from the reference sheet, where tiny mechanical type in
 * the margins is what makes the elegant display type read as *placed* rather
 * than just large.
 *
 * Entirely decorative — aria-hidden, non-interactive, never carries meaning
 * that isn't also stated in real content.
 */

export function RegMark({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute ${className}`}>
      <svg viewBox="0 0 24 24" className="h-3 w-3 stroke-maize/40" strokeWidth="1.5">
        <path d="M12 3v18M3 12h18" />
      </svg>
    </span>
  );
}

export function CornerLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`type-pixel pointer-events-none absolute text-[8px] leading-tight text-maize/50 sm:text-[9px] ${className}`}
    >
      {children}
    </span>
  );
}

export function GhostWord({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span aria-hidden className={`ghost-word absolute select-none ${className}`}>
      {children}
    </span>
  );
}
