import Sparkle from "./Sparkle";

/**
 * Sparkles drifting slowly up through the background.
 *
 * The four-point sparkle is lifted from the reference swatch card, same as the
 * one used inline elsewhere — this just sets a lot of them loose behind the
 * page.
 *
 * Every value here is hand-placed rather than generated. Random positions would
 * differ between the server and client renders and React would throw the tree
 * away, and hand-placing also lets the field stay uneven: clusters and gaps read
 * as scattered, whereas evenly spaced sparkles read as a pattern.
 *
 * Durations are long and share no common factor, so the field never visibly
 * resets. Negative delays start each one mid-flight, so the page opens with
 * sparkles already in the air instead of an empty field that slowly fills.
 */
const SPARKLES = [
  // left, top, size, drift duration, twinkle duration, delay, x-drift, peak opacity
  { l: "6%", t: "12%", s: 14, sd: "41s", st: "6.5s", d: "-12s", sx: "3vw", so: 0.5 },
  { l: "13%", t: "62%", s: 9, sd: "53s", st: "8s", d: "-31s", sx: "-2vw", so: 0.38 },
  { l: "21%", t: "31%", s: 20, sd: "47s", st: "9.5s", d: "-5s", sx: "4vw", so: 0.42 },
  { l: "27%", t: "84%", s: 11, sd: "59s", st: "7s", d: "-22s", sx: "2vw", so: 0.45 },
  { l: "34%", t: "8%", s: 8, sd: "43s", st: "5.5s", d: "-37s", sx: "-3vw", so: 0.34 },
  { l: "42%", t: "48%", s: 16, sd: "61s", st: "10s", d: "-16s", sx: "3vw", so: 0.4 },
  { l: "49%", t: "22%", s: 10, sd: "37s", st: "6s", d: "-28s", sx: "-2vw", so: 0.46 },
  { l: "56%", t: "73%", s: 22, sd: "67s", st: "11s", d: "-9s", sx: "4vw", so: 0.36 },
  { l: "63%", t: "37%", s: 12, sd: "49s", st: "7.5s", d: "-44s", sx: "-4vw", so: 0.48 },
  { l: "71%", t: "91%", s: 9, sd: "55s", st: "8.5s", d: "-19s", sx: "2vw", so: 0.4 },
  { l: "78%", t: "17%", s: 18, sd: "63s", st: "9s", d: "-33s", sx: "-3vw", so: 0.44 },
  { l: "84%", t: "57%", s: 11, sd: "45s", st: "6.5s", d: "-7s", sx: "3vw", so: 0.5 },
  { l: "91%", t: "29%", s: 15, sd: "57s", st: "10.5s", d: "-25s", sx: "-2vw", so: 0.38 },
  { l: "95%", t: "78%", s: 8, sd: "39s", st: "7s", d: "-41s", sx: "2vw", so: 0.42 },
] as const;

export default function SparkleField() {
  return (
    <div className="sparkle-field" aria-hidden>
      {SPARKLES.map((p, i) => (
        <span
          key={i}
          className="sparkle"
          style={
            {
              left: p.l,
              top: p.t,
              animationDuration: p.sd,
              animationDelay: p.d,
              "--sx": p.sx,
              "--st": p.st,
              "--so": p.so,
            } as React.CSSProperties
          }
        >
          <Sparkle size={p.s} className="text-maize" />
        </span>
      ))}
    </div>
  );
}
