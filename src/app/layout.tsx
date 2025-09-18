
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScrollProgress } from '@/components/ScrollProgress';
import { CursorTrail } from '@/components/CursorTrail';
import { Chatbot } from '@/components/Chatbot';

export const metadata: Metadata = {
  title: 'Chohan Space | Web Development Agency',
  description: 'Chohan Space crafts intelligent, high-performance websites and applications that drive results.',
  openGraph: {
    images: ['https://i.ibb.co/q3ktqWX1/Purple-Black-Modern-Marketing-Plan-Presentation-20250918-160326-0000.png'],
  },
  icons: {
    icon: 'https://i.ibb.co/KQ6m5Mb/file-00000000f6a861f4a4b603469532cc43.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
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
