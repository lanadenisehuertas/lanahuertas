import MorphName from "../MorphName";

/**
 * A section heading: one line of Redaction in one colour, in letters that
 * decay to pixels under the hand (MorphName). Nothing rides along with it.
 *
 * `lead` and `accent` are the two halves of the title; they are joined into a
 * single line. `n` and `script` are accepted for callers written against the
 * earlier, ornamented heading and are not drawn.
 */
export function Heading({
  lead,
  accent,
  as = "h2",
  id,
  size = "head",
}: {
  n?: string;
  lead: string;
  accent: string;
  script?: string;
  as?: "h1" | "h2";
  id?: string;
  size?: "head" | "display";
}) {
  const text = `${lead} ${accent}`.replace(" & ", " and ");
  return <MorphName as={as} id={id} label={text} className={size === "display" ? "t-display" : "t-head"} words={[{ text }]} />;
}
