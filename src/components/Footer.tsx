import { Twitter, Linkedin, Github } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="px-3 pb-4 pt-10 md:px-4">
      <div className="glass-panel mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-6 text-center sm:flex-row sm:text-left">
        <div className="space-y-1">
          <p className="text-sm font-medium">Built for ambitious brands and product teams.</p>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Chohan Space. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="#" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
