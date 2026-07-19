/**
 * Animated gradient field behind the whole page.
 *
 * Purely decorative and non-interactive. Motion is transform-only so it runs on
 * the compositor; `prefers-reduced-motion` freezes the drift but keeps the
 * colour, since this is the page background rather than an effect.
 */
export default function AuroraField() {
  return (
    <div className="aurora-field" aria-hidden>
      <div className="aurora-blob blob-1" />
      <div className="aurora-blob blob-2" />
      <div className="aurora-blob blob-3" />
      <div className="aurora-blob blob-4" />
    </div>
  );
}
