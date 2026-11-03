import type { MetadataRoute } from "next";
import { profile } from "@/lib/content";

/*
 * Web app manifest: what a phone uses when the site is added to the home
 * screen. The colours are the top of the page's dusk sky, so the splash
 * screen and the status bar run straight into the hero. The maskable icon
 * keeps the butterfly inside the safe circle, so Android can crop it to any
 * shape without clipping a wing.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — Portfolio`,
    short_name: profile.short,
    description: "UI/UX, branding and video work by Lana Denise Huertas.",
    start_url: "/",
    display: "standalone",
    background_color: "#18192d",
    theme_color: "#18192d",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
