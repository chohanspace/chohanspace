
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createBlogPost } from './actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
        </>
      ) : (
        'Publish Post'
      )}
    </Button>
  );
}

function AddBlogForm({ setOpen, onPostCreated }: { setOpen: (open: boolean) => void, onPostCreated: () => void }) {
  const [state, formAction] = useActionState(createBlogPost, { success: false, message: '' });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        formRef.current?.reset();
        setOpen(false);
        onPostCreated();
      } else {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, setOpen, onPostCreated]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Blog Title</Label>
        <Input id="title" name="title" placeholder="Your amazing blog post title" required />
      </div>
       <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" placeholder="A short, catchy summary for the blog listing page." required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" placeholder="Write your full blog post here. Markdown is not supported yet." className="min-h-[200px]" required />
      </div>
       <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input id="author" name="author" placeholder="e.g., Dr. Evelyn Reed" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" name="image" type="url" placeholder="https://picsum.photos/800/400" required />
      </div>
       <div className="space-y-2">
        <Label htmlFor="dataAiHint">AI Image Hint</Label>
        <Input id="dataAiHint" name="dataAiHint" placeholder="e.g., 'galaxy stars' (max two words)" />
      </div>
      <DialogFooter>
        <SubmitButton />
      </DialogFooter>
    </form>
  );
}


export function AddNewPost({ onPostCreated }: { onPostCreated: () => void }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Post
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Create a New Blog Post</DialogTitle>
                    <DialogDescription>
                        Fill out the details below to publish a new article to your blog.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] md:h-auto">
                    <div className="py-4 pr-6">
                        <AddBlogForm setOpen={setOpen} onPostCreated={onPostCreated} />
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
