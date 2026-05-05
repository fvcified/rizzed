import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
// @ts-expect-error: allow importing global CSS without type declarations
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "rizzed",
  description: "A rizzed kid",
  authors: [{ name: "xli" }],
  keywords: ["rizzed"],
  icons: {
    icon: "/images/cook13.webp",
  },
  openGraph: {
    title: "rizzed",
    description: "A rizzed kid",
    url: "https://fvkid.xyz/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "rizzed",
    description: "rizzed",
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
        className={`${outfit.variable} ${inter.variable} bg-[#efefef] min-h-screen w-full flex items-center justify-center overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}