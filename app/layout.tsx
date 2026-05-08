import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./style.css";

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

export const viewport: Viewport = {
  themeColor: 'rgb(8,7,6)',
};

export const metadata: Metadata = {
  title: "rizzed",
  description: "A rizzed kid",
  authors: [{ name: "Xiao Xli" }],
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
    <html
      lang="en"
      style={{
        colorScheme:     "dark",
        backgroundColor: "rgb(8,7,6)",
      }}
    >
      <body
        className={`${outfit.variable} ${inter.variable} min-h-screen w-full overflow-x-hidden`}
        style={{
          margin:          0,
          padding:         0,
          color:           "#fff",
          backgroundColor: "rgb(8,7,6)",
          backgroundAttachment: "fixed",
        }}
      >
        {children}
      </body>
    </html>
  );
}