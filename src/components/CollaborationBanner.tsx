
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { X, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CollaborationBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasBeenDismissed = sessionStorage.getItem('collabBannerDismissed');
    if (!hasBeenDismissed) {
      setShowBanner(true);
    }
  }, []); 

  const handleDismiss = () => {
    sessionStorage.setItem('collabBannerDismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative bg-secondary text-secondary-foreground transition-all duration-500 ease-in-out overflow-hidden",
        "animate-in slide-in-from-top-full"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center text-center gap-4 py-3">
          <Users className="h-6 w-6 shrink-0 text-primary hidden sm:block" />
          <p className="text-sm font-medium">
            We are proud to be collaborating with{' '}
            <a
              href="https://buttnetworks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline hover:text-primary transition-colors"
            >
              Butt Networks
            </a>
            , led by CEO Shahnawaz Saddam Butt and Co-Owner Wahb Amir.
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
