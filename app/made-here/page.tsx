import type { Metadata } from "next";
import MadeHere from "@/components/made/MadeHere";

export const metadata: Metadata = {
  title: "Made here — Lana Denise Huertas",
  description: "Pubmats, songs and flowers made by visitors to Lana Denise Huertas's portfolio, in the studio, the starry sky and the guestbook garden.",
  alternates: { canonical: "/made-here" },
};

/** The visitors' gallery: everything people made on the site. */
export default function MadeHerePage() {
  return <MadeHere />;
}
