import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const harmonySans = localFont({
  src: [
    {
      path: './fonts/HarmonyOS_Sans_Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/HarmonyOS_Sans_Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/HarmonyOS_Sans_Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-harmony',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Adrian Bintang | Portfolio',
  description: 'Portfolio Adrian Bintang. Web engineering, database systems, and infrastructure.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${harmonySans.variable} ${harmonySans.className} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-[100dvh] bg-bg text-ink antialiased selection:bg-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}
