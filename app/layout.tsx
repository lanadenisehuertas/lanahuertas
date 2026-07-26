import type { Metadata } from "next";
import { Poppins, Bodoni_Moda, Silkscreen } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import AuroraField from "@/components/AuroraField";

/*
 * Three voices, deliberately paired.
 *
 *  Bodoni Moda  — high-contrast Didone. Its italic carries the swash-serif
 *                 elegance of the reference. Used large, never small: at body
 *                 size the hairlines disappear on a dark ground.
 *  Silkscreen   — pixel face. Used ONLY for tracked-out uppercase micro-type,
 *                 which is the size it was drawn for. It supplies the
 *                 mechanical counter-voice, and doubles as a nod to the
 *                 engineering half of the portfolio.
 *  Poppins      — geometric sans doing all the reading work. Neither display
 *                 face is legible in a paragraph, so body text stays neutral.
 *
 * The pairing works because the two display faces disagree on every axis —
 * contrast, resolution, era, warmth — while agreeing on being uppercase-ish and
 * geometric in the small sizes. Poppins sits between them without competing.
 */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — Graphic Designer & Video Editor`,
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
      className={`${poppins.variable} ${bodoni.variable} ${silkscreen.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuroraField />
        {children}
      </body>
    </html>
  );
}
