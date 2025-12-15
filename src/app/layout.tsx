// src/app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import ScrollToTop from "@/components/ScrollToTop";
import { ReactNode } from "react";
import type { Metadata } from "next";

/* -----------------------------
   Global SEO Metadata
------------------------------ */
export const metadata: Metadata = {
  title: {
    default: "OpenThoughts – Share Your Thoughts",
    template: "%s | OpenThoughts",
  },
  description:
    "OpenThoughts is a platform to share Shayari, Poems, Short Stories, Quotes, and personal Thoughts in Hindi and English.",
  keywords: [
    "OpenThoughts",
    "shayari",
    "poems",
    "short stories",
    "quotes",
    "thoughts",
    "hindi writing",
    "english writing",
    "story sharing platform",
  ],
  authors: [{ name: "OpenThoughts" }],
  creator: "OpenThoughts",

  metadataBase: new URL("https://open-thoughts-pi.vercel.app"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    siteName: "OpenThoughts",
    title: "OpenThoughts – Share Your Thoughts",
    description:
      "A calm space to share Shayari, Poems, Short Stories, Quotes, and Thoughts in Hindi and English.",
    url: "https://open-thoughts-pi.vercel.app",
  },

  robots: {
    index: true,
    follow: true,
  },

  /* ✅ Google Search Console Verification */
  verification: {
    google: "HXBV4Voj-Y3T5Bmxd3iqNnt9BlPUhKrNuIRmlbz5K60",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hi">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <ScrollToTop />
        <ThemeToggle />
        <Footer />
      </body>
    </html>
  );
}
