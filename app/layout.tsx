import type { Metadata } from "next";
import { EB_Garamond, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─────────────────────────────────────────────────────────────────────────
   FONT CONFIGURATION
   ───────────────────────────────────────────────────────────────────────── */
const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

/* ─────────────────────────────────────────────────────────────────────────
   METADATA
   ───────────────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Castrimaris",
    template: "%s | Castrimaris",
  },
  description:
    "Traduzioni e studi di testi latini. Un archivio accademico di pubblicazioni filologiche e letterarie.",
  keywords: ["latino", "traduzioni", "filologia", "letteratura latina", "testi antichi"],
  authors: [{ name: "Castrimaris" }],
  openGraph: {
    type: "website",
    siteName: "Castrimaris",
    title: "Castrimaris — Traduzioni dal Latino",
    description:
      "Traduzioni e studi di testi latini. Un archivio accademico di pubblicazioni filologiche.",
  },
};

/* ─────────────────────────────────────────────────────────────────────────
   ROOT LAYOUT
   ───────────────────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${ebGaramond.variable} ${lato.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-[var(--color-papyrus)] text-[var(--color-ink)] font-sans">
        {/* Navbar */}
        <Navbar />

        {/* Contenuto principale */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
