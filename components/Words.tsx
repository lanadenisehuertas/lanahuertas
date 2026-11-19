import type { ElementType } from "react";

/**
 * A paragraph that rises in with the rest of its block when it scrolls into
 * view (ScrollFX, `data-rv`). It used to sharpen word by word; text now stays
 * steady, so it is readable the moment it arrives. `mode` is kept so that
 * callers need no change.
 */
export default function Words({
  text,
  as: Tag = "p",
  className = "",
}: {
  text: string;
  as?: ElementType;
  mode?: "scrub" | "play";
  className?: string;
}) {
  return (
    <Tag className={className} data-rv>
      {text}
    </Tag>
  );
}
