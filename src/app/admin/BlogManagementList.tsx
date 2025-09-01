
'use client';

import { useState } from 'react';
import type { BlogPost } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, FileText, Calendar, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteBlogPost } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function BlogManagementList({ initialPosts, onPostDeleted }: { initialPosts: BlogPost[], onPostDeleted: () => void }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (postId: string) => {
    setIsDeleting(postId);
    const result = await deleteBlogPost(postId);
    
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully.',
      });
      onPostDeleted(); // Refresh the list
    } else {
      toast({
        title: 'Error',
        description: result.message || 'Failed to delete post.',
        variant: 'destructive',
      });
    }
    setIsDeleting(null);
  };

  if (initialPosts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>You haven't written any blog posts yet. Click "Add New Post" to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {initialPosts.map((post, index) => (
        <div key={post.id}>
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="font-semibold text-lg flex items-center">
                        <FileText className="mr-2 h-5 w-5" />
                        {post.title}
                    </h3>
                    <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        <span className="flex items-center"><User className="mr-1 h-4 w-4" />{post.author}</span>
                        <span className="flex items-center"><Calendar className="mr-1 h-4 w-4" />{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={isDeleting === post.id}>
                        {isDeleting === post.id ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Trash2 />
                        )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this blog post.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(post.id)}>
                            Continue
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
             {index < initialPosts.length - 1 && <Separator className="mt-6" />}
        </div>
      ))}
    </div>
  );
}
