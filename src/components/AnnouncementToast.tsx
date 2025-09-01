
'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

const ANNOUNCEMENT_KEY = 'chohangenai-announcement-seen';

export function AnnouncementToast() {
  const { toast } = useToast();

  useEffect(() => {
    // We need to check if we're on the client side before accessing sessionStorage
    if (typeof window !== 'undefined') {
        const hasSeenAnnouncement = sessionStorage.getItem(ANNOUNCEMENT_KEY);

        if (!hasSeenAnnouncement) {
        // Show the toast after a short delay to not overwhelm the user
        const timer = setTimeout(() => {
            toast({
                title: (
                    <div className="flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-primary" />
                        <span className="font-bold">New! Introducing ChohanGenAI</span>
                    </div>
                ),
                description: "Our new suite of generative AI tools is now live. Explore the future of creation.",
                duration: 10000, // Keep it on screen for 10 seconds
                action: (
                    <Button asChild size="sm">
                        <Link href="https://cga.thechohan.space" target="_blank" rel="noopener noreferrer">
                            Try Now
                        </Link>
                    </Button>
                ),
            });
            sessionStorage.setItem(ANNOUNCEMENT_KEY, 'true');
        }, 2000); // 2-second delay

        return () => clearTimeout(timer);
        }
    }
  }, [toast]);

  return null; // This component doesn't render anything itself
}
