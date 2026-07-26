import type { Metadata } from "next";
import { Poppins, Style_Script, Silkscreen } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import AuroraField from "@/components/AuroraField";

/*
 * Three voices — the heavy / script / mono formula the reference sheets run on.
 *
 *  Poppins      — the workhorse. Black weight set LARGE for display, regular
 *                 for body. Carries the whole page; nothing competes with it.
 *  Style Script — one bold connected script, used for a single accent word per
 *                 lockup. It only works because it is rationed.
 *  Silkscreen   — pixel face for tracked-out uppercase marginalia: dates,
 *                 TM marks, corner labels, tab labels. Never above 13px.
 *
 * Bodoni was tried here and pulled: it read as editorial-elegant rather than
 * scrapbook, and its hairlines disappeared against the panel textures.
 */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const script = Style_Script({
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
      className={`${poppins.variable} ${script.variable} ${silkscreen.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuroraField />
        {children}
        <div className="grain-plate" aria-hidden />
      </body>
    </html>
  );
}
