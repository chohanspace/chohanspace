
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function ScrollProgress() {
  const [scrollTop, setScrollTop] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      setScrollTop(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-3 top-0 z-[60] hidden h-full w-5 md:block">
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border/50" />
      <div className="absolute left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border border-white/50 bg-white/80 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40" style={{ top: `calc(${Math.min(scrollTop, 100)}% - 12px)` }} />
      <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-400/0 via-sky-400/80 to-sky-400/0" style={{ height: `${Math.min(scrollTop, 100)}%` }} />
    </div>
  );
}
