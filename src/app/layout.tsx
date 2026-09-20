import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adrian Bintang | Full-Stack Web Developer",
  description: "Full-Stack Web Developer specializing in Next.js, React, TypeScript, Go, PostgreSQL, and resilient API Integration.",
  keywords: ["Full-Stack Developer", "Next.js", "React", "TypeScript", "Go", "PostgreSQL", "API Integration", "considrAI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-[#f3f4f6] min-h-screen transition-colors duration-200 selection:bg-[#0d9488] dark:selection:bg-[#2FA69A] selection:text-white">
        {children}
      </body>
    </html>
  );
}
