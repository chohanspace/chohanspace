
'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Users, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

const ANNOUNCEMENT_KEY = 'chohan-buttnetworks-collab-seen-v2';

export function CollaborationCelebration() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const hasSeenAnnouncement = sessionStorage.getItem(ANNOUNCEMENT_KEY);

        if (!hasSeenAnnouncement) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem(ANNOUNCEMENT_KEY, 'true');
            }, 1500); 

            return () => clearTimeout(timer);
        }
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
            <div className="flex justify-center mb-4">
                 <div className="relative">
                    <div className="absolute -inset-2 bg-primary/20 rounded-full animate-pulse"></div>
                    <div className="relative bg-primary text-primary-foreground p-4 rounded-full">
                        <Users className="h-8 w-8" />
                    </div>
                </div>
            </div>
          <DialogTitle className="text-center text-2xl font-bold font-headline">A New Partnership!</DialogTitle>
          <DialogDescription className="text-center">
            Chohan Space is thrilled to announce our collaboration with Butt Networks, led by CEO Shahnawaz Saddam Butt and Co-Owner Wahb Amir, to forge the future of the web.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                <a href="https://buttnetworks.com" target="_blank" rel="noopener noreferrer">
                    Visit Butt Networks <ArrowRight className="ml-2" />
                </a>
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
