import { Twitter, Linkedin, Github } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row">
        <div className="text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Chohan Space. All rights reserved.</p>
          <p>In collaboration with <a href="https://buttnetworks.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">Butt Networks</a>.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
