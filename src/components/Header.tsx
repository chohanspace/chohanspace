
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Phone, Briefcase, Sparkles, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useState, type ElementType } from 'react';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/work', label: 'Our Work', icon: Briefcase },
  { href: '/blog', label: 'Blog', icon: FileText },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const NavLink = ({ href, label, icon: Icon, isMobile = false }: { href: string; label: string; icon: ElementType; isMobile?: boolean }) => {
    const isActive = (href === '/' && pathname === '/') || (href !== '/' && pathname.startsWith(href));

    return (
      <Button
        asChild
        variant={isActive ? 'secondary' : 'ghost'}
        size={isMobile ? 'default' : 'sm'}
        className={cn('rounded-full px-4', isMobile && 'w-full justify-start')}
        onClick={() => isMobile && setSheetOpen(false)}
      >
        <Link href={href} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      </Button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 md:px-4">
      <div className="glass-panel mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/70 text-primary shadow-sm dark:border-white/10 dark:bg-white/10">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-[0.95rem]">Chohan Space</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-white/40 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/30">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col border-white/30 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-black/70">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setSheetOpen(false)}>
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Chohan Space</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-grow flex-col gap-3 p-2">
                {navLinks.map((link) => (
                  <NavLink key={link.href} {...link} isMobile />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
