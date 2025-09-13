
'use client';

import { useState, useMemo } from 'react';
import type { Ticket } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createTicket, deleteTicket, manuallyVerifyTicket, manuallyCancelTicket } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Copy, Trash2, CheckCircle, XCircle, Ban, AlertTriangle, Info } from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


function getStatusBadge(status: Ticket['status']) {
    switch (status) {
        case 'Pending':
            return <Badge variant="secondary"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Pending</Badge>;
        case 'Verified':
            return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-1 h-3 w-3" />Verified</Badge>;
        case 'Cancelled':
            return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
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

    const handleAction = async (action: 'delete' | 'verify' | 'cancel', ticketId: string) => {
        setIsActing(ticketId);
        let result;
        if (action === 'delete') {
            result = await deleteTicket(ticketId);
        } else if (action === 'verify') {
            result = await manuallyVerifyTicket(ticketId);
        } else { // cancel
            result = await manuallyCancelTicket(ticketId);
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ticket ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedTickets.map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell className="font-mono">
                                            {ticket.id}
                                            <Button variant="ghost" size="icon" className="ml-2 h-7 w-7" onClick={() => copyToClipboard(`${window.location.origin}/ticket/${ticket.id}`)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                        <TableCell>
                                            {ticket.clientName ? (
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{ticket.clientName}</span>
                                                    <span className="text-xs text-muted-foreground">{ticket.clientEmail}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                             <div className="flex flex-col text-xs text-muted-foreground">
                                                <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                                                {ticket.verifiedAt && <span>Verified: {new Date(ticket.verifiedAt).toLocaleString()}</span>}
                                                {ticket.cancelledAt && <span>Cancelled: {new Date(ticket.cancelledAt).toLocaleString()}</span>}
                                                {ticket.cancellationReason && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="flex items-center text-amber-600 cursor-pointer"><Info className="mr-1 h-3 w-3" />Reason</span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{ticket.cancellationReason}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                             <TooltipProvider>
                                                <div className="flex gap-1 justify-end">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="ghost" size="icon" disabled={isActing === ticket.id || ticket.status === 'Verified'}>
                                                                        <CheckCircle className="text-green-600" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader><AlertDialogTitle>Manually verify ticket?</AlertDialogTitle><AlertDialogDescription>This will mark the ticket as verified without client input.</AlertDialogDescription></AlertDialogHeader>
                                                                    <AlertDialogFooter><AlertDialogCancel>Back</AlertDialogCancel><AlertDialogAction onClick={() => handleAction('verify', ticket.id)}>Verify</AlertDialogAction></AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </TooltipTrigger>
                                                        <TooltipContent><p>Manually Verify</p></TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                     <Button variant="ghost" size="icon" disabled={isActing === ticket.id || ticket.status === 'Cancelled'}>
                                                                        <Ban className="text-amber-600" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader><AlertDialogTitle>Manually cancel ticket?</AlertDialogTitle><AlertDialogDescription>This will mark the ticket as cancelled.</AlertDialogDescription></AlertDialogHeader>
                                                                    <AlertDialogFooter><AlertDialogCancel>Back</AlertDialogCancel><AlertDialogAction onClick={() => handleAction('cancel', ticket.id)}>Cancel</AlertDialogAction></AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </TooltipTrigger>
                                                        <TooltipContent><p>Manually Cancel</p></TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                             <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                     <Button variant="ghost" size="icon" disabled={isActing === ticket.id}>
                                                                        {isActing === ticket.id ? <Loader2 className="animate-spin" /> : <Trash2 className="text-destructive" />}
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader><AlertDialogTitle>Permanently delete ticket?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. The ticket and its link will be gone forever.</AlertDialogDescription></AlertDialogHeader>
                                                                    <AlertDialogFooter><AlertDialogCancel>Back</AlertDialogCancel><AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleAction('delete', ticket.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </TooltipTrigger>
                                                        <TooltipContent><p>Delete Ticket</p></TooltipContent>
                                                    </Tooltip>
                                                </div>
                                             </TooltipProvider>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
