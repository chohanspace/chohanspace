
import { database } from '@/lib/firebase';
import { ref, get } from "firebase/database";
import type { Ticket } from '@/lib/data';
import { notFound } from 'next/navigation';
import { TicketVerificationForm } from './TicketVerificationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type TicketPageProps = {
    params: { ticketId: string };
};

async function getTicket(ticketId: string): Promise<Ticket | null> {
    if (!database) return null;
    const ticketRef = ref(database, `tickets/${ticketId}`);
    const snapshot = await get(ticketRef);
    if (snapshot.exists()) {
        const ticketData = snapshot.val();
        return { id: ticketId, ...ticketData };
    }
    return null;
}

export default async function TicketPage({ params }: TicketPageProps) {
    const { ticketId } = params;
    const ticket = await getTicket(ticketId);

    if (!ticket) {
        notFound();
    }

    let statusContent;

    switch (ticket.status) {
        case 'Pending':
            statusContent = (
                <>
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 text-primary rounded-full h-16 w-16 flex items-center justify-center mb-4">
                            <Clock size={32} />
                        </div>
                        <CardTitle className="text-center">Project Details Submission</CardTitle>
                        <CardDescription className="text-center">Please enter your details to verify this ticket and submit your project requirements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TicketVerificationForm ticketId={ticket.id} />
                    </CardContent>
                </>
            );
            break;
        case 'Verified':
            statusContent = (
                 <CardContent className="text-center py-10">
                    <div className="mx-auto bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 rounded-full h-20 w-20 flex items-center justify-center mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Project Details Submitted!</h2>
                    <p className="text-muted-foreground mb-1">Ticket ID: <span className="font-mono">{ticket.id}</span></p>
                    {ticket.clientName && <p className="text-muted-foreground mb-1">Name: {ticket.clientName}</p>}
                    {ticket.clientEmail && <p className="text-muted-foreground mb-4">Email: {ticket.clientEmail}</p>}
                    <p>Thank you. Your project requirements have been submitted.</p>
                 </CardContent>
            );
            break;
        case 'Cancelled':
            statusContent = (
                <CardContent className="text-center py-10">
                    <div className="mx-auto bg-destructive/10 text-destructive dark:bg-destructive/50 dark:text-destructive-foreground rounded-full h-20 w-20 flex items-center justify-center mb-6">
                        <XCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Ticket Cancelled</h2>
                    <p className="text-muted-foreground mb-4">This ticket (<span className="font-mono">{ticket.id}</span>) has been cancelled.</p>
                    {ticket.cancellationReason && (
                        <p className="text-sm italic">Reason: "{ticket.cancellationReason}"</p>
                    )}
                </CardContent>
            );
            break;
        default:
            statusContent = (
                <CardContent className="text-center py-10">
                    <div className="mx-auto bg-amber-100 text-amber-700 rounded-full h-20 w-20 flex items-center justify-center mb-6">
                        <AlertTriangle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Unknown Ticket Status</h2>
                    <p className="text-muted-foreground">Please contact support.</p>
                 </CardContent>
            );
    }


    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 animate-fadeIn">
            <div className="w-full max-w-2xl">
                <Card>
                    {statusContent}
                </Card>
                 {ticket.status === 'Pending' && (
                    <div className="text-center mt-4">
                        <Button variant="link" asChild>
                           <Link href={`/ticket/${ticket.id}/cancel`}>Need to cancel this request?</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Disable static generation for ticket pages as they are dynamic
export const dynamic = 'force-dynamic';
