import type { Metadata, Viewport } from "next";
import { Archivo, Cormorant_Garamond, DM_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { profile, socials } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import Nav from "@/components/Nav";
import PointerFX from "@/components/PointerFX";
import { BotanicalDefs } from "@/components/Botanicals";
import { Starfield } from "@/components/Ethereal";
import GardenLoader from "@/components/GardenLoader";

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

// Leads with both forms of her name, so a search for either matches the snippet.
const seoDescription = `${profile.short} (${profile.name}) — Manila-based UI/UX designer, graphic designer and video editor. 7+ years in Figma, Photoshop and Premiere Pro, and a Computer Science student at FEU Tech who builds what she designs.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.name} — UI/UX Designer & Graphic Designer`,
  description: seoDescription,
  alternates: { canonical: "/" },
  applicationName: "Lana Denise Huertas — Portfolio",
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    profile.name,
    profile.short,
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
    description: seoDescription,
    url: siteUrl,
    locale: "en_PH",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${profile.name} — portfolio. ${profile.heroLead} ${profile.heroAccent}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Graphic Designer, Video Editor, Software Engineer`,
    description: seoDescription,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#e6ebfb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${archivo.variable} ${cormorant.variable} ${mono.variable} ${redaction.variable} ${r10.variable} ${r35.variable} ${r70.variable} ${r100.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
         * Lite mode, decided before first paint: few cores, little memory or
         * Save-Data get the same garden without blur and grain filters.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var n=navigator,c=n.hardwareConcurrency||8,m=n.deviceMemory||8,s=n.connection&&n.connection.saveData;if(c<=4||m<=4||s)document.documentElement.setAttribute('data-lite','')}catch(e){}",
          }}
        />
        <GardenLoader />
        {/*
         * Lift the opening screen when the page has loaded — never before
         * ~0.7s so it doesn't flash, never after 3.5s — then tell the page
         * (MorphName waits for this before its first wave). Seen once per
         * session; later loads skip straight in.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement,done=false;function go(){if(done)return;done=true;d.classList.add('garden-ready');window.__gardenReady=true;window.dispatchEvent(new Event('garden:ready'));try{sessionStorage.setItem('garden-seen','1')}catch(e){}}try{if(sessionStorage.getItem('garden-seen')){go();return}}catch(e){}var t0=performance.now();function later(){setTimeout(go,Math.max(0,700-(performance.now()-t0)))}if(document.readyState==='complete')later();else window.addEventListener('load',later);setTimeout(go,3500)})();",
          }}
        />
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
              alternateName: profile.short,
              givenName: "Lana Denise",
              familyName: "Huertas",
              jobTitle: profile.roles.join(", "),
              email: `mailto:${profile.email}`,
              url: siteUrl,
              image: `${siteUrl}/og.jpg`,
              address: { "@type": "PostalAddress", addressLocality: "Manila", addressCountry: "PH" },
              alumniOf: { "@type": "CollegeOrUniversity", name: "FEU Institute of Technology" },
              sameAs: socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
            }),
          }}
        />
        <div className="graph-ground" aria-hidden />
        <Starfield />
        <BotanicalDefs />
        <PointerFX />
        <Nav />
        {children}
      </body>
    </html>
  );
}
