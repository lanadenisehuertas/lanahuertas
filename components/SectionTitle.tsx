import Sparkle from "./Sparkle";

/**
 * The lockup every reference uses: a heavy sans word with a script word
 * overlapping it from below-right ("post"+"folio", "design"+"de posts").
 *
 * The overlap is the whole point — set as two lines they read as a subtitle;
 * overlapped they read as one drawn mark.
 */
export default function SectionTitle({
  lead,
  accent,
  id,
  className = "",
}: {
  lead: string;
  accent: string;
  id?: string;
  className?: string;
}) {
  return (
    <h2 id={id} className={`relative mb-8 pl-1 ${className}`}>
      <span className="relative inline-block">
        <span className="type-display block text-5xl text-maize sm:text-7xl">{lead}</span>
        <span className="type-script type-fringe absolute -right-4 -bottom-5 text-5xl whitespace-nowrap text-fawn sm:-right-10 sm:-bottom-8 sm:text-7xl">
          {accent}
        </span>
        <Sparkle
          size={16}
          className="absolute -top-2 -right-6 text-fawn/70 sm:-right-12 sm:size-6"
        />
      </span>
    </h2>
  );
}
