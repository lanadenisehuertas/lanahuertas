import { profile } from "@/lib/content";
import { Sparkle4 } from "./Botanicals";
import ToolStars from "./dusk/ToolStars";
import Words from "@/components/Words";

/**
 * The "about me" tab: the pitch, then (on desktop) two more tool bubbles in
 * the space below it.
 */
export default function AboutMe() {
  return (
    <div>
      <h3 className="type-display text-[1.85rem] leading-[1.15] text-iris sm:text-[2.4rem]">{profile.aboutHeadline}</h3>
      <p className="type-display mt-3 text-[1.6rem] leading-tight text-eminence italic sm:text-[2rem]">{profile.aboutKicker}</p>
      <Words
        className="mt-6 max-w-[58ch] text-base leading-[1.7] text-ink/85 sm:text-[17px]"
        text="Publicity art, scalable templates and paced video edits for student organizations and clients, and, as a Computer Science student, the interfaces I design I can also build. Detail-obsessed and always on time."
      />

      <div className="mt-10 hidden lg:block">
        <p className="type-pixel flex items-center gap-2 text-[13px] text-ink/75">
          <Sparkle4 className="h-2.5 w-2.5 text-eminence" />
          the tools I use · tap a star
        </p>
        <ToolStars variant="meadow" />
      </div>
    </div>
  );
}
