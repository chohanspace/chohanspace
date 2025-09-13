
import { database } from '@/lib/firebase';
import { ref, get } from "firebase/database";
import type { Ticket } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketCancellationForm } from './TicketCancellationForm';
import { XCircle, Ban } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type TicketCancelPageProps = {
    params: { ticketId: string };
};

async function getTicket(ticketId: string): Promise<Ticket | null> {
    if (!database) return null;
    const ticketRef = ref(database, `tickets/${ticketId}`);
    const snapshot = await get(ticketRef);
    if (snapshot.exists()) {
        return snapshot.val() as Ticket;
    }
    return null;
}

export default async function TicketCancelPage({ params }: TicketCancelPageProps) {
    const { ticketId } = params;
    const ticket = await getTicket(ticketId);

    if (!ticket) {
        notFound();
    }

    let statusContent;

    switch (ticket.status) {
        case 'Pending':
        case 'Verified':
            statusContent = (
                <>
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 text-destructive rounded-full h-16 w-16 flex items-center justify-center mb-4">
                            <Ban size={32} />
                        </div>
                        <CardTitle className="text-center">Cancel Ticket</CardTitle>
                        <CardDescription className="text-center">Please provide the details below to cancel ticket <span className="font-mono">{ticket.id}</span>.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TicketCancellationForm ticketId={ticket.id} status={ticket.status} />
                    </CardContent>
                </>
            );
            break;
        case 'Cancelled':
            statusContent = (
                <CardContent className="text-center py-10">
                    <div className="mx-auto bg-destructive/10 text-destructive rounded-full h-20 w-20 flex items-center justify-center mb-6">
                        <XCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Ticket Already Cancelled</h2>
                    <p className="text-muted-foreground mb-4">This ticket (<span className="font-mono">{ticket.id}</span>) has already been cancelled.</p>
                </CardContent>
            );
            break;
        default:
             statusContent = <p>Unknown status</p>
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] animate-fadeIn">
            <div className="w-full max-w-md">
                 <Card>
                    {statusContent}
                </Card>
                 <div className="text-center mt-4">
                    <Button variant="link" asChild>
                       <Link href={`/ticket/${ticket.id}`}>Back to ticket status</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Disable static generation for ticket pages as they are dynamic
export const dynamic = 'force-dynamic';
