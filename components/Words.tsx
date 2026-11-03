import { Fragment, type CSSProperties, type ElementType } from "react";

/**
 * Text that comes into focus a word at a time, after the scroll essays on
 * applied-imagination: each word starts faint and blurred and sharpens in
 * reading order.
 *
 * "scrub" ties each word to its own place in the viewport (a CSS view
 * timeline), so the paragraph focuses as you scroll it up and blurs again if
 * you scroll back. "play" runs once when the text enters view, for copy that
 * sits in a pinned or sliding frame and so never moves through the viewport;
 * a new text (a new slide, a new video) plays again.
 *
 * Either way the words are plain spans with real spaces between them, so the
 * paragraph reads and copies as normal. ScrollFX sets data-in; dusk.css
 * ("Focus words") holds the motion, with lite and reduced-motion fallbacks.
 */
export default function Words({
  text,
  as: Tag = "p",
  mode = "scrub",
  className = "",
}: {
  text: string;
  as?: ElementType;
  mode?: "scrub" | "play";
  className?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  const n = Math.max(1, words.length - 1);
  return (
    <Tag className={`wd ${className}`} data-rv="words" data-mode={mode}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="wd-w" style={{ "--i": i, "--k": (i / n).toFixed(3) } as CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
