import type { Metadata, Viewport } from "next";
import { Archivo, Cormorant_Garamond, DM_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { profile, socials } from "@/lib/content";
import Nav from "@/components/Nav";
import PointerFX from "@/components/PointerFX";
import { BotanicalDefs } from "@/components/Botanicals";

/*
 * Archivo — one grotesk family for everything set in words. Its width axis
 *     gives two voices from one file: tight at 100% for flim-style
 *     headlines, and fully extended at 125% for the Y2K-tech name.
 * DM Mono — small uppercase labels, readouts, and buttons.
 * Redaction (OFL, MCKL) — the morph target. Its cuts degrade the same
 *     letterforms step by step and share metrics, so the hero name can decay
 *     through them on hover.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const redaction = localFont({
  variable: "--font-redaction",
  display: "swap",
  src: [
    { path: "./fonts/redaction/Redaction-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/redaction/Redaction-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/redaction/Redaction-Bold.woff2", weight: "700", style: "normal" },
  ],
});

const r10 = localFont({
  variable: "--font-r10",
  display: "swap",
  // Hover-only cut: fetched on first use, not preloaded with the page.
  preload: false,
  src: [
    { path: "./fonts/redaction/Redaction10-Regular.woff2", style: "normal" },
    { path: "./fonts/redaction/Redaction10-Italic.woff2", style: "italic" },
  ],
});

const r35 = localFont({
  variable: "--font-r35",
  display: "swap",
  // Hover-only cut: fetched on first use, not preloaded with the page.
  preload: false,
  src: [
    { path: "./fonts/redaction/Redaction35-Regular.woff2", style: "normal" },
    { path: "./fonts/redaction/Redaction35-Italic.woff2", style: "italic" },
  ],
});

const r70 = localFont({
  variable: "--font-r70",
  display: "swap",
  // Hover-only cut: fetched on first use, not preloaded with the page.
  preload: false,
  src: [
    { path: "./fonts/redaction/Redaction70-Regular.woff2", style: "normal" },
    { path: "./fonts/redaction/Redaction70-Italic.woff2", style: "italic" },
  ],
});

// No italic exists at 100 — italic letters stop at the 70 cut.
const r100 = localFont({
  variable: "--font-r100",
  display: "swap",
  // Hover-only cut: fetched on first use, not preloaded with the page.
  preload: false,
  src: "./fonts/redaction/Redaction100-Regular.woff2",
});

const mono = DM_Mono({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/*
 * Absolute URLs are required for share previews — a relative /og.png resolves
 * against the scraper's own host, not this site, and the preview comes back
 * blank. Vercel injects VERCEL_URL per deployment; set NEXT_PUBLIC_SITE_URL
 * once a custom domain is attached so previews point at the real address.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "lana denise huertas",
  description: profile.welcome,
  applicationName: "Lana Denise Huertas — Portfolio",
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    "graphic design",
    "video editing",
    "UI/UX design",
    "software engineering",
    "portfolio",
    "Manila",
    "Philippines",
  ],
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: `${profile.name} — Graphic Designer, Video Editor, Software Engineer`,
    description: profile.welcome,
    url: siteUrl,
    locale: "en_PH",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${profile.name} — portfolio. ${profile.heroLead} ${profile.heroAccent}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Graphic Designer, Video Editor, Software Engineer`,
    description: profile.welcome,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f5eee2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${cormorant.variable} ${mono.variable} ${redaction.variable} ${r10.variable} ${r35.variable} ${r70.variable} ${r100.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
         * Person schema. Search engines treat `sameAs` as the link between a
         * name and the profiles that belong to it, which is what makes a search
         * for her name surface this site alongside LinkedIn and GitHub rather
         * than as an unrelated result.
         */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.name,
              jobTitle: profile.roles.join(", "),
              email: `mailto:${profile.email}`,
              url: siteUrl,
              image: `${siteUrl}/og.png`,
              address: { "@type": "PostalAddress", addressLocality: "Manila", addressCountry: "PH" },
              alumniOf: { "@type": "CollegeOrUniversity", name: "FEU Institute of Technology" },
              sameAs: socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
            }),
          }}
        />
        <div className="graph-ground" aria-hidden />
        <BotanicalDefs />
        <PointerFX />
        <Nav />
        {children}
        <div className="grain-plate" aria-hidden />
      </body>
    </html>
  );
}
