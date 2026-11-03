import type { Metadata, Viewport } from "next";
import { DM_Mono, Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { profile, socials } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import Nav from "@/components/Nav";
import Butterfly from "@/components/Butterfly";
import PointerFX from "@/components/PointerFX";
import { BotanicalDefs } from "@/components/Botanicals";
import { Starfield } from "@/components/Ethereal";
import GardenLoader from "@/components/GardenLoader";
import DitherLantern from "@/components/DitherLantern";
import StarScript from "@/components/StarScript";

/*
 * Redaction (OFL, MCKL) — the display face: the name, section and project
 *     titles, italic taglines. Its degraded cuts (10/35/70/100) share metrics,
 *     so the hero name can decay through them on hover.
 * Inter Tight — body, buttons, links, nav. Neutral, so Redaction carries the
 *     personality.
 * DM Mono — small uppercase labels and readouts.
 */
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${interTight.variable} ${mono.variable} ${redaction.variable} ${r10.variable} ${r35.variable} ${r70.variable} ${r100.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
         * Lite mode, decided before first paint: few cores, little memory,
         * Save-Data or a touch-first device get the same garden held still.
         * data-js marks that scripts run at all, so CSS can lay out what the
         * scripts will drive (About's phone tabs) from the first paint.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.setAttribute('data-js','');try{var n=navigator,c=n.hardwareConcurrency||8,m=n.deviceMemory||8,s=n.connection&&n.connection.saveData;if(c<=4||m<=4||s||matchMedia('(pointer: coarse)').matches)document.documentElement.setAttribute('data-lite','')}catch(e){}",
          }}
        />
        <GardenLoader />
        {/*
         * Lift the opening screen once the page has loaded and the name has
         * finished writing in — never before ~2.6s, never after 4.5s — then
         * tell the page (MorphName waits for this before its first wave).
         * It plays on every load; reduced motion lifts it after 0.4s.
         * fly() measures everything first, then writes each word's offsets as
         * one small style rule: a custom property set on <html> itself would
         * make the browser restyle the whole page, and React's spans stay
         * untouched.
         * Once the curtain is up (1.7s) the loader leaves the page entirely
         * (garden-gone), so its paused animations stop holding GPU layers.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement,done=false,t0=performance.now(),min=matchMedia('(prefers-reduced-motion: reduce)').matches?400:2600;function fly(){try{if(min<1000)return;var L=document.querySelectorAll('#garden-loader .loader-word'),H=document.querySelectorAll('.dk-hero .hero-name');if(L.length<2||H.length<2)return;var css='';for(var j=0;j<2;j++){var a=L[j].getBoundingClientRect(),b=H[j].getBoundingClientRect();if(b.bottom<0||b.top>innerHeight||!a.width)return;var k=parseFloat(getComputedStyle(H[j]).fontSize)/parseFloat(getComputedStyle(L[j]).fontSize);css+='#garden-loader .loader-word:nth-child('+(j+1)+'){--mx:'+(b.left+b.width/2-(a.left+a.width/2))+'px;--my:'+(b.top+b.height/2-(a.top+a.height/2))+'px;--ms:'+k+'}';}var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);}catch(_){}}function go(){if(done)return;done=true;fly();d.classList.add('garden-ready');setTimeout(function(){d.classList.add('garden-gone')},1800);window.__gardenReady=true;window.dispatchEvent(new Event('garden:ready'))}function later(){setTimeout(go,Math.max(0,min-(performance.now()-t0)))}if(document.readyState==='complete')later();else window.addEventListener('load',later);setTimeout(go,4500)})();",
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
        <DitherLantern />
        <BotanicalDefs />
        <PointerFX />
        <StarScript />
        <Butterfly />
        <Nav />
        {children}
      </body>
    </html>
  );
}
