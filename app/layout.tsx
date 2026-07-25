import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import AuroraField from "@/components/AuroraField";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuroraField />
        {children}
      </body>
    </html>
  );
}
