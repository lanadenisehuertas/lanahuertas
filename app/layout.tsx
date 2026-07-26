import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Yellowtail, Poppins, Silkscreen } from "next/font/google";
import "./globals.css";
import { profile, socials } from "@/lib/content";
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
  themeColor: "#330c4b",
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
        <AuroraField />
        <SparkleField />
        <div className="spec-grid pointer-events-none fixed inset-0 -z-10" aria-hidden />
        {children}
        <div className="grain-plate" aria-hidden />
      </body>
    </html>
  );
}
