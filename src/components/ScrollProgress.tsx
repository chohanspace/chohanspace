
'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScrollProgress() {
  const [scrollTop, setScrollTop] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / scrollableHeight) * 100;
      setScrollTop(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isMounted) {
      return null;
  }

  return (
    <div className="fixed top-0 left-0 h-full w-4 md:w-6 z-50 pointer-events-none hidden md:block">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-border/50"></div>
      
      <div
        className="absolute left-1/2 -translate-x-1/2 transition-all duration-150 ease-out"
        style={{ top: `calc(${scrollTop}% - 12px)` }}
      >
        <Settings
          className={cn(
            'h-6 w-6 text-primary',
            scrollTop > 1 && scrollTop < 99 && 'animate-spin-slow'
          )}
          style={{ transformOrigin: 'center center' }}
        />
      </div>
    </div>
  );
}
