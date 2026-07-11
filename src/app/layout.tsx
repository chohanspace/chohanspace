
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScrollProgress } from '@/components/ScrollProgress';
import { CursorTrail } from '@/components/CursorTrail';
import { Chatbot } from '@/components/Chatbot';
import { StructuredData } from '@/components/StructuredData';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.chohanspace.com'),
  title: {
    default: 'Chohan Space | Premium Web Experiences',
    template: '%s | Chohan Space',
  },
  description: 'Chohan Space designs and builds premium websites, polished product experiences, and high-performance digital systems for ambitious brands.',
  keywords: ['web design', 'web development', 'next.js', 'product design', 'digital agency', 'premium websites'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Chohan Space | Premium Web Experiences',
    description: 'Premium web experiences designed for modern brands and ambitious products.',
    url: 'https://www.chohanspace.com',
    siteName: 'Chohan Space',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Chohan Space brand preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chohan Space | Premium Web Experiences',
    description: 'Premium websites and digital products crafted with strategy, design, and engineering.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: '/choran-space-logo.svg',
    shortcut: '/choran-space-logo.svg',
    apple: '/choran-space-logo.svg',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <body className={cn('min-h-screen flex flex-col font-sans antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CursorTrail />
          <ScrollProgress />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <StructuredData />
          <Chatbot />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
