
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code, Menu, Lock, Home, FileText, Phone, Briefcase } from 'lucide-react';
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

  // Hide header on the admin page for a cleaner look
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const NavLink = ({ href, label, icon: Icon, isMobile = false }: { href: string; label: string; icon: ElementType; isMobile?: boolean }) => {
    const isActive = (href === "/" && pathname === "/") || (href !== "/" && pathname.startsWith(href));
    return (
      <Button asChild variant={isActive ? "secondary" : "ghost"} size={isMobile ? "default" : "sm"} className={cn(isMobile && "w-full justify-start")} onClick={() => isMobile && setSheetOpen(false)}>
        <Link href={href}>
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Link>
      </Button>
    );
  };
  
  const SpecialLink = ({ href, label, icon: Icon, isMobile = false }: { href: string; label: string; icon: ElementType; isMobile?: boolean }) => {
    const isActive = pathname.startsWith(href);
    return (
      <Button asChild variant="outline" size={isMobile ? "default" : "sm"} className={cn(isMobile && "w-full justify-start", isActive && "ring-2 ring-primary")} onClick={() => isMobile && setSheetOpen(false)}>
        <Link href={href}>
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Link>
      </Button>
    );
  };
  

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold font-headline text-lg">
          <Code className="h-6 w-6 text-primary" />
          <span>Chohan Space</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
          
          <div className="flex items-center gap-2">
            <SpecialLink href="/admin" label="Admin" icon={Lock} />
            <ThemeToggle />
          </div>

        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>
                        <Link href="/" className="flex items-center gap-2 font-bold font-headline text-lg" onClick={() => setSheetOpen(false)}>
                            <Code className="h-6 w-6 text-primary" />
                            <span>Chohan Space</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex-grow flex flex-col gap-4 p-4">
                    {navLinks.map((link) => (
                      <NavLink key={link.href} {...link} isMobile />
                    ))}
                </div>
                <div className="p-4 mt-auto">
                    <SpecialLink href="/admin" label="Admin" icon={Lock} isMobile />
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
