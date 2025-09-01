
'use client';

import { useState } from 'react';
import type { Submission } from './page';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Loader2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import { deleteSubmission } from './actions';
import { useToast } from '@/hooks/use-toast';

export function SubmissionList({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (submissionId: string) => {
    setIsDeleting(submissionId);
    const result = await deleteSubmission(submissionId);
    
    if (result.success) {
      setSubmissions(submissions.filter(s => s.id !== submissionId));
      toast({
        title: 'Success',
        description: 'Submission deleted successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.message || 'Failed to delete submission.',
        variant: 'destructive',
      });
    }
    setIsDeleting(null);
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>When users submit the contact form, their messages will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {submissions.map((submission, index) => (
        <div key={submission.id}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{submission.name}</p>
              <a href={`mailto:${submission.email}`} className="text-sm text-primary hover:underline">
                {submission.email}
              </a>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" disabled={isDeleting === submission.id}>
                  {isDeleting === submission.id ? (
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
                    This action cannot be undone. This will permanently delete this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(submission.id)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p className="mt-4 text-muted-foreground">{submission.message}</p>
          {index < submissions.length - 1 && <Separator className="mt-6" />}
        </div>
      ))}
    </div>
  );
}
