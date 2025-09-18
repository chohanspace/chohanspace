
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScrollProgress } from '@/components/ScrollProgress';
import { CursorTrail } from '@/components/CursorTrail';

export const metadata: Metadata = {
  title: 'Chohan Space | Web Development Agency',
  description: 'Chohan Space crafts intelligent, high-performance websites and applications that drive results.',
  openGraph: {
    images: ['https://drive.google.com/file/d/1gsl_a4HVu1fuJ1JYZJpK1xJqZJIaYeHc/view?usp=drivesdk'],
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
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
