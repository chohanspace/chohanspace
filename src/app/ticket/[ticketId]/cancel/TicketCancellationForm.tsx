
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cancelTicket } from '../actions';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import type { Ticket } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const formSchema = z.object({
    reason: z.string().min(10, 'Please provide a reason of at least 10 characters.'),
    identity: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function TicketCancellationForm({ ticketId, status }: { ticketId: string; status: Ticket['status'] }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { reason: '', identity: '' },
    });

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true);
        const result = await cancelTicket(ticketId, values);

        if (result.success) {
            toast({
                title: 'Ticket Cancelled',
                description: result.message,
            });
            router.refresh();
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
        setIsSubmitting(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {status === 'Verified' && (
                    <>
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Identity Confirmation</AlertTitle>
                            <AlertDescription>
                                To cancel a verified project, please enter the email address or phone number you used during verification.
                            </AlertDescription>
                        </Alert>
                         <FormField control={form.control} name="identity" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Your Email or Phone Number</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter the email or phone used to verify" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </>
                )}
                <FormField control={form.control} name="reason" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Reason for Cancellation</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., Project scope has changed, no longer need services..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" variant="destructive" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Confirm Cancellation'}
                </Button>
            </form>
        </Form>
    );
}
