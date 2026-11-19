import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { DM_Mono, Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
// loaded after the base sheets so that, at equal specificity, its rules win
import "./styles/bloom.css";
import { profile, socials } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import Nav from "@/components/Nav";
import PointerGlow from "@/components/current/PointerGlow";
import SiteSounds from "@/components/SiteSounds";

/*
 * The voices:
 *   Redaction (OFL, MCKL) — the display face: the name, section and project
 *       titles, the italic for the expressive word. Its worn cuts (10, 35,
 *       70, 100) share its metrics, so a letter can decay through them to
 *       coarse pixels and back when it is touched (MorphName).
 *   Inter Tight — everything you read: body, buttons, links, nav.
 *   DM Mono — project metadata and the readings on the specimens.
 */

// The hover cuts: fetched on first use, not preloaded with the page.
const r10 = localFont({
  variable: "--font-r10",
  display: "swap",
  preload: false,
  src: [
    { path: "./fonts/redaction/Redaction10-Regular.woff2", style: "normal" },
    { path: "./fonts/redaction/Redaction10-Italic.woff2", style: "italic" },
  ],
});

// No italic exists at 100: italic letters stop at the 70 cut.
const r100 = localFont({
  variable: "--font-r100",
  display: "swap",
  preload: false,
  src: "./fonts/redaction/Redaction100-Regular.woff2",
});

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

const mono = DM_Mono({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});


// Leads with both forms of their name, so a search for either matches the snippet.
const seoDescription = `${profile.short} (${profile.name}) — Manila-based UI/UX designer, graphic designer and video editor. 7+ years in Figma, Photoshop and Premiere Pro, and a Computer Science student at FEU Tech who builds what they design.`;

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
  // Added to an iPhone home screen it opens full screen under a black
  // status bar, which meets the near-black top of the sky. (A translucent
  // bar would sit over the fixed nav unless the page also ran under the
  // notch, which would push text beneath it in landscape.)
  appleWebApp: { capable: true, title: profile.short, statusBarStyle: "black" },
};

// The browser's own bar on phones takes the ground colour, so it runs straight into the page.
export const viewport: Viewport = {
  themeColor: "#0b0a12",
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
         * Before first paint: data-js marks that scripts run, so the reveal
         * styles may hide what the scripts will bring in (without it the page
         * reads in full); data-still applies a saved "pause motion" choice;
         * data-lite marks slower or touch-first devices for the few effects
         * that check it.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.setAttribute('data-js','');try{if(localStorage.getItem('lc-still'))d.setAttribute('data-still','')}catch(e){}try{var n=navigator,c=n.hardwareConcurrency||8,m=n.deviceMemory||8,s=n.connection&&n.connection.saveData;if(c<=4||m<=4||s||matchMedia('(pointer: coarse)').matches)d.setAttribute('data-lite','')}catch(e){}})();",
          }}
        />
        {/*
         * Person schema. Search engines treat `sameAs` as the link between a
         * name and the profiles that belong to it, which is what makes a search
         * for their name surface this site alongside LinkedIn and GitHub rather
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
        {/* squares fall from a quick stroke of the mouse; nothing else sits behind the page */}
        <div className="ptr-layer" aria-hidden>
          <PointerGlow />
        </div>
        {/* keyboard users can jump past the opening straight to the work */}
        <Link href="/#branding" className="skip-link">
          Skip to the work
        </Link>
        <Nav />
        {children}
        <SiteSounds />
      </body>
    </html>
  );
}
