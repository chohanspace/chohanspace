
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

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Chohan Space | Web Development Agency',
  description: 'Chohan Space crafts intelligent, high-performance websites and applications that drive results.',
  openGraph: {
    images: ['https://i.ibb.co/q3ktqWX1/Purple-Black-Modern-Marketing-Plan-Presentation-20250918-160326-0000.png'],
  },
  icons: {
    icon: 'https://i.ibb.co/C9v9V1j/file-321c2c31e21b7147b38f828555239e24.png',
  },
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
          <Chatbot />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
