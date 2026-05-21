import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "Escape the Rat Race | Retirement & Financial Freedom Calculator",
  description: "Plan your path to financial independence with our retirement calculator. Estimate savings, investments, passive income, and early retirement goals.",
  keywords: [
    "retirement calculator",
    "financial freedom",
    "FIRE calculator",
    "early retirement",
    "investment planning",
    "passive income",
    "retirement planning",
  ],  
  verification: 
  {google: "viqESJ_gtGlBqlasY_OVijZc1wYupPZAPlcR7B_WvZg",
  },

  openGraph: {
    title: "Escape the Rat Race",
    description:
      "Interactive retirement and financial independence calculator.",
    url: "https://escape-the-rat-race.vercel.app",
    siteName: "Escape the Rat Race",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Escape the Rat Race",
    description:
      "Calculate your journey toward financial independence and retirement.",
  },  

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
      
    </html>
  );
}
