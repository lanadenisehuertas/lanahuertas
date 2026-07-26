/**
 * Vector-editor selection box: dashed bounds with corner and mid-edge handles.
 *
 * Lifted from the reference portfolios, where it appears around headlines. It
 * reads as a designer's working file rather than a finished page — the visual
 * equivalent of showing your guides on.
 *
 * Decorative only; wraps content without affecting its layout.
 */
export default function SelectionBox({
  children,
  className = "",
  mid = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Include mid-edge handles as well as corners. */
  mid?: boolean;
}) {
  return (
    <span className={`selection inline-block ${className}`}>
      {children}
      <span aria-hidden>
        <span className="handle -top-[0.42em] -left-[0.7em] -translate-x-1/2 -translate-y-1/2" />
        <span className="handle -top-[0.42em] -right-[0.7em] translate-x-1/2 -translate-y-1/2" />
        <span className="handle -bottom-[0.42em] -left-[0.7em] -translate-x-1/2 translate-y-1/2" />
        <span className="handle -right-[0.7em] -bottom-[0.42em] translate-x-1/2 translate-y-1/2" />
        {mid && (
          <>
            <span className="handle -top-[0.42em] left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <span className="handle -bottom-[0.42em] left-1/2 -translate-x-1/2 translate-y-1/2" />
            <span className="handle top-1/2 -left-[0.7em] -translate-x-1/2 -translate-y-1/2" />
            <span className="handle top-1/2 -right-[0.7em] translate-x-1/2 -translate-y-1/2" />
          </>
        )}
      </span>
    </span>
  );
}
