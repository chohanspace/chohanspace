
'use client';

import { useState, useMemo } from 'react';
import type { Ticket } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createTicket, deleteTicket, manuallyVerifyTicket, manuallyCancelTicket, markTicketAsCompleted } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Copy, Trash2, CheckCircle, XCircle, Ban, AlertTriangle, Info, Briefcase, DollarSign, Globe, Server, CheckCheck, Link2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';


function getStatusBadge(status: Ticket['status']) {
    switch (status) {
        case 'Pending':
            return <Badge variant="secondary"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Pending</Badge>;
        case 'Verified':
            return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-1 h-3 w-3" />Verified</Badge>;
        case 'Cancelled':
            return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
        case 'Completed':
            return <Badge className="bg-blue-600 hover:bg-blue-700"><CheckCheck className="mr-1 h-3 w-3" />Completed</Badge>;
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
}

export function TicketManagement({ initialTickets, onTicketChange }: { initialTickets: Ticket[], onTicketChange: () => void }) {
    const [isCreating, setIsCreating] = useState(false);
    const [isActing, setIsActing] = useState<string | null>(null);
    const { toast } = useToast();

    const handleCreateTicket = async () => {
        setIsCreating(true);
        const result = await createTicket();
        if (result.success && result.ticketId) {
            toast({
                title: 'Ticket Created',
                description: `Ticket ${result.ticketId} created.`,
            });
            onTicketChange();
        } else {
            toast({
                title: 'Error',
                description: result.message || 'Failed to create ticket.',
                variant: 'destructive',
            });
        }
        setIsCreating(false);
    };

    const handleAction = async (action: 'delete' | 'verify' | 'cancel' | 'complete', ticketId: string) => {
        setIsActing(ticketId);
        let result;
        if (action === 'delete') {
            result = await deleteTicket(ticketId);
        } else if (action === 'verify') {
            result = await manuallyVerifyTicket(ticketId);
        } else if (action === 'cancel') {
            result = await manuallyCancelTicket(ticketId);
        } else { // complete
            result = await markTicketAsCompleted(ticketId);
        }

        if (result.success) {
            toast({
                title: 'Success',
                description: `Ticket action successful.`,
            });
            onTicketChange();
        } else {
            toast({
                title: 'Error',
                description: result.message || 'Failed to perform action.',
                variant: 'destructive',
            });
        }
        setIsActing(null);
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "The ticket link has been copied to your clipboard.",
        });
    }

    const sortedTickets = useMemo(() => {
        return [...initialTickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [initialTickets]);


    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Ticket Management</h2>
                <Button onClick={handleCreateTicket} disabled={isCreating}>
                    {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : <><PlusCircle className="mr-2 h-4 w-4" />Create New Ticket</>}
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Generated Tickets</CardTitle>
                    <CardDescription>
                        {sortedTickets.length > 0 ? `Showing ${sortedTickets.length} ticket(s).` : 'No tickets have been generated yet.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sortedTickets.length > 0 ? (
                        <div className="space-y-2">
                        {sortedTickets.map((ticket) => (
                            <Collapsible key={ticket.id} className="border p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                                        <span className="font-mono text-sm">{ticket.id}</span>
                                        {getStatusBadge(ticket.status)}
                                        {ticket.clientName && (
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{ticket.clientName}</span>
                                                <span className="text-xs text-muted-foreground">{ticket.clientEmail}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TooltipProvider>
                                            {(ticket.status === 'Verified' || ticket.status === 'Completed') && <CollapsibleTrigger asChild><Button variant="ghost" size="sm">Details</Button></CollapsibleTrigger>}
                                            {ticket.status === 'Verified' && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAction('complete', ticket.id)} disabled={isActing === ticket.id}>
                                                            {isActing === ticket.id ? <Loader2 className="animate-spin" /> : <CheckCheck className="h-4 w-4" />}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p>Mark as Completed</p></TooltipContent>
                                                </Tooltip>
                                            )}
                                             {(ticket.status === 'Pending' || ticket.status === 'Verified') && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAction('cancel', ticket.id)} disabled={isActing === ticket.id}>
                                                            {isActing === ticket.id ? <Loader2 className="animate-spin" /> : <Ban className="h-4 w-4" />}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p>Manually Cancel</p></TooltipContent>
                                                </Tooltip>
                                            )}
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(`${window.location.origin}/ticket/${ticket.id}`)}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Copy Verification Link</p></TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <Link href={`/ticket/${ticket.id}/cancel`} target="_blank">
                                                           <Link2 className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Open Client Cancellation Link</p></TooltipContent>
                                            </Tooltip>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon" className="h-8 w-8" disabled={isActing === ticket.id}>
                                                    {isActing === ticket.id ? <Loader2 className="animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Permanently delete ticket?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Back</AlertDialogCancel><AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleAction('delete', ticket.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TooltipProvider>
                                    </div>
                                </div>
                                <CollapsibleContent className="space-y-4 pt-4 mt-4 border-t">
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-muted-foreground" /><div><p className="font-semibold">Type</p><p>{ticket.websiteType || 'N/A'}</p></div></div>
                                        <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" /><div><p className="font-semibold">Budget</p><p>{ticket.budget ? `${ticket.budget} PKR` : 'N/A'}</p></div></div>
                                        <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-muted-foreground" /><div><p className="font-semibold">Domain</p><p>{ticket.hasDomain || 'N/A'}</p></div></div>
                                        <div className="flex items-center gap-2"><Server className="w-4 h-4 text-muted-foreground" /><div><p className="font-semibold">Hosting</p><p>{ticket.hasHosting || 'N/A'}</p></div></div>
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Project Details</p>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.projectDetails || 'N/A'}</p>
                                    </div>
                                     <div>
                                        <p className="font-semibold mb-1">Contact</p>
                                        <p className="text-sm text-muted-foreground">{ticket.clientPhone || 'N/A'}</p>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Click "Create New Ticket" to generate a unique link for a client.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
