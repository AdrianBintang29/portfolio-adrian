import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0f19",
};

export const metadata: Metadata = {
  title: "Adrian Bintang | Full-Stack Web Developer",
  description: "Portfolio Adrian Bintang - Full-Stack Web Developer. Next.js, React, TypeScript, Go, PostgreSQL, dan Integrasi API yang andal.",
  keywords: ["Adrian Bintang", "Full-Stack Developer", "Next.js", "React", "TypeScript", "Go", "PostgreSQL", "API Integration", "considrAI"],
  authors: [{ name: "Adrian Bintang" }],
  openGraph: {
    title: "Adrian Bintang | Full-Stack Web Developer",
    description: "Spesialisasi Next.js, React, TypeScript, Go, PostgreSQL, dan integrasi API tangguh.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`dark ${inter.variable} scroll-smooth`}>
      <body className="antialiased bg-[#0b0f19] text-[#f3f4f6] min-h-screen selection:bg-[#2FA69A] selection:text-white font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
