
import { getDb } from '@/lib/mongodb';
import type { Ticket } from '@/lib/data';
import { notFound } from 'next/navigation';
import { TicketVerificationForm } from './TicketVerificationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, Clock, CheckCheck, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type TicketPageProps = {
    params?: Promise<{ ticketId: string }>;
};

async function getTicket(ticketId: string): Promise<Ticket | null> {
    const db = await getDb();
    const ticketDoc = await db.collection('tickets').findOne({ id: ticketId });
    if (!ticketDoc) return null;

    const { _id, ...ticketData } = ticketDoc as any;
    return {
        id: ticketData.id ?? ticketId,
        createdAt: ticketData.createdAt,
        status: ticketData.status,
        clientName: ticketData.clientName,
        clientEmail: ticketData.clientEmail,
        clientPhone: ticketData.clientPhone,
        cancellationReason: ticketData.cancellationReason,
        verifiedAt: ticketData.verifiedAt,
        cancelledAt: ticketData.cancelledAt,
        completedAt: ticketData.completedAt,
        websiteType: ticketData.websiteType,
        budget: ticketData.budget,
        hasDomain: ticketData.hasDomain,
        hasHosting: ticketData.hasHosting,
        projectDetails: ticketData.projectDetails,
    };
}

export default async function TicketPage({ params }: TicketPageProps) {
    const resolved = params ? await params : undefined;
    const { ticketId } = resolved as { ticketId: string };
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
        case 'Completed':
            statusContent = (
                 <CardContent className="text-center py-10">
                    <div className="mx-auto bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 rounded-full h-20 w-20 flex items-center justify-center mb-6">
                        <Rocket size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Project Completed!</h2>
                    <p className="text-muted-foreground mb-1">Ticket ID: <span className="font-mono">{ticket.id}</span></p>
                    <p className="text-muted-foreground mb-4">We're excited to share the final product with you soon.</p>
                    <p>Thank you for collaborating with Chohan Space.</p>
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
                 {(ticket.status === 'Pending' || ticket.status === 'Verified') && (
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
