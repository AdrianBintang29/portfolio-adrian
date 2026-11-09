import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Adrian Bintang | Portfolio',
  description: 'Portfolio Adrian Bintang.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
