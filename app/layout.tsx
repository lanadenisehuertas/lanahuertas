import type { Metadata } from "next";
import { Bricolage_Grotesque, Yellowtail, Poppins, Silkscreen } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import AuroraField from "@/components/AuroraField";
import SparkleField from "@/components/SparkleField";

/*
 * Display / script / body — the formula the reference sheets run on.
 *
 *  Bricolage Grotesque — display. A grotesque with deliberately irregular
 *      curves and tight joins, so headings have character of their own rather
 *      than reading as neutral geometry.
 *  Yellowtail — the overlapping accent word. A brush script with real stroke
 *      weight, so it holds its ground against a heavy sans instead of
 *      thinning out beside it.
 *  Poppins — body copy only. Neutral on purpose; nothing in a paragraph
 *      should compete with the lockups.
 *  Silkscreen — marginalia only. Corner labels and stamps, never above 13px.
 *
 * Two earlier attempts and why they were pulled: Bodoni read
 * editorial-elegant rather than scrapbook and its hairlines vanished against
 * the grain; Style Script was too thin and too formal to pair with a heavy
 * sans — the two never fused into one mark.
 */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const script = Yellowtail({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "lana denise huertas",
  description: profile.welcome,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${bricolage.variable} ${script.variable} ${silkscreen.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuroraField />
        <SparkleField />
        <div className="spec-grid pointer-events-none fixed inset-0 -z-10" aria-hidden />
        {children}
        <div className="grain-plate" aria-hidden />
      </body>
    </html>
  );
}
