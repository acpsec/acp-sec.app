import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

// Inter via next/font/google — self-hosted, no layout shift. Coinbase Sans (the
// v1 typeface) is not publicly available, so Inter is the locked substitute.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ACP-SEC — Agent Commerce Security",
  description: "AI agent security assessment — Trust Score scanning on Base.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      {/* min-h-screen + flex-col + main flex-1 keeps the footer at the bottom
          on short pages. Single shared shell applies to every route. */}
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
