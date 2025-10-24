import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import Footer from "./footer";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Piggyfi - Smart Savings on Base",
  description: "Create piggy banks, set savings goals, and stay accountable with friends on Base blockchain",
  openGraph: {
    title: "Piggyfi - Smart Savings on Base",
    description: "Create piggy banks, set savings goals, and stay accountable with friends on Base blockchain",
    images: ['/blue-hero.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
