
'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import Link from 'next/link';
import { Users } from 'lucide-react';

const ANNOUNCEMENT_KEY = 'chohan-buttnetworks-collab-seen';

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
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-bold">Celebrating Our New Collaboration!</span>
                    </div>
                ),
                description: "Chohan Space is proud to partner with Butt Networks to build the future of the web.",
                duration: 10000, // Keep it on screen for 10 seconds
                action: (
                    <Button asChild size="sm">
                        <a href="https://buttnetworks.com" target="_blank" rel="noopener noreferrer">
                            Learn More
                        </a>
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
