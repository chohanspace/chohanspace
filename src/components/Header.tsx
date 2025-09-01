'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code, Menu, Lock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from './ui/scroll-area';
import { ThemeToggle } from './ThemeToggle';


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const aiTools = [
    { href: '/tool/content-suggester', label: 'Content Suggester' },
    { href: '/tool/technical-manual', label: 'Technical Manual Assistant' },
    { href: '/tool/case-study-generator', label: 'Case Study Generator' },
];

const ioTools = [
    { href: '/io', label: 'Story Writer' },
]

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  // Hide header on the login page for a cleaner look
  if (pathname === '/login') {
    return null;
  }

  const NavLink = ({ href, label, isMobile = false }: { href: string; label: string; isMobile?: boolean }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => isMobile && setSheetOpen(false)}
        className={cn(
          "transition-colors hover:text-primary",
          isActive ? "text-primary font-semibold" : "text-muted-foreground",
          isMobile ? "text-lg block py-2" : "text-sm"
        )}
      >
        {label}
      </Link>
    );
  };
  
  const SpecialLink = ({ href, label, icon: Icon, isMobile = false }: { href: string; label: string; icon: React.ElementType, isMobile?: boolean }) => {
    const isActive = pathname.startsWith(href);
    return (
      <Button asChild variant={isActive ? "secondary" : "ghost"} size={isMobile ? "default" : "sm"} className={cn(isMobile && "w-full justify-start")} onClick={() => isMobile && setSheetOpen(false)}>
        <Link href={href}>
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Link>
      </Button>
    )
  }
  
  const allTools = [...aiTools, ...ioTools];
  const isAiToolsActive = pathname.startsWith('/tool') || pathname.startsWith('/io');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold font-headline text-lg">
          <Code className="h-6 w-6 text-primary" />
          <span>Chohan Space</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={cn('text-sm', isAiToolsActive ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                AI Tools <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <ScrollArea className="h-auto max-h-72 w-56">
                    <DropdownMenuLabel>Standard Tools</DropdownMenuLabel>
                    {aiTools.map((feature) => (
                        <DropdownMenuItem key={feature.href} asChild>
                            <Link href={feature.href}>{feature.label}</Link>
                        </DropdownMenuItem>
                    ))}
                     <DropdownMenuSeparator />
                    <DropdownMenuLabel>I/O Optimized</DropdownMenuLabel>
                     {ioTools.map((feature) => (
                        <DropdownMenuItem key={feature.href} asChild>
                            <Link href={feature.href}>{feature.label}</Link>
                        </DropdownMenuItem>
                    ))}
                </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

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
                    <div className="pt-4 mt-4 border-t">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">AI Tools</p>
                      <ScrollArea className="flex-grow h-48">
                        <div className="flex flex-col gap-1 pr-4">
                            {allTools.map(link => <NavLink key={link.href} {...link} isMobile />)}
                        </div>
                      </ScrollArea>
                    </div>
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
