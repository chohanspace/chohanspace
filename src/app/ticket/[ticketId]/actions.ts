
'use server';

import { z } from 'zod';
import { database } from '@/lib/firebase';
import { ref, update, get } from 'firebase/database';
import { revalidatePath } from 'next/cache';
import type { Ticket } from '@/lib/data';
import { sendEmail } from '@/lib/email';

const verificationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  websiteType: z.string().min(1),
  budget: z.string().min(2),
  hasDomain: z.enum(['Yes', 'No']),
  hasHosting: z.enum(['Yes', 'No']),
  projectDetails: z.string().min(20),
});

function formatDetailsForEmail(data: z.infer<typeof verificationSchema>) {
    return `
        <p>Your project details have been recorded as follows:</p>
        <ul style="list-style-type: none; padding: 0; line-height: 1.8;">
            <li><strong>Website Type:</strong> ${data.websiteType}</li>
            <li><strong>Budget:</strong> ${data.budget} PKR</li>
            <li><strong>Has Domain:</strong> ${data.hasDomain}</li>
            <li><strong>Has Hosting:</strong> ${data.hasHosting}</li>
            <li><strong>Project Details:</strong><br/>${data.projectDetails.replace(/\n/g, '<br/>')}</li>
        </ul>
    `;
}

export async function verifyTicket(ticketId: string, data: unknown) {
  if (!database) return { success: false, message: 'Database not configured.' };

  const parsed = verificationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Invalid form data. Please fill out all fields correctly.' };
  }
  
  const { name, email, phone, websiteType, budget, hasDomain, hasHosting, projectDetails } = parsed.data;
  const ticketRef = ref(database, `tickets/${ticketId}`);

  try {
    const snapshot = await get(ticketRef);
    if (!snapshot.exists() || (snapshot.val() as Ticket).status !== 'Pending') {
        return { success: false, message: 'This ticket is invalid or has already been processed.' };
    }

    const updates = {
      status: 'Verified',
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      verifiedAt: new Date().toISOString(),
      websiteType,
      budget,
      hasDomain,
      hasHosting,
      projectDetails,
    };

    await update(ticketRef, updates);

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: `Your Project Details are Submitted: Ticket ${ticketId}`,
      text: `Hello ${name},\n\nThis is a confirmation that your ticket with ID ${ticketId} has been successfully verified and your project details have been submitted.\n\n${formatDetailsForEmail(parsed.data).replace(/<[^>]*>/g, '')}\nThank you,\nChohan Space`,
      html: `<p>Hello ${name},</p><p>This is a confirmation that your ticket with ID <strong>${ticketId}</strong> has been successfully verified and your project details have been submitted.</p>${formatDetailsForEmail(parsed.data)}<p>Thank you,<br/>Chohan Space</p>`,
    });

    revalidatePath(`/ticket/${ticketId}`);
    revalidatePath('/admin');
    return { success: true, message: "Your project details have been submitted. You'll receive a confirmation email shortly." };
  } catch (error) {
    console.error('Error verifying ticket:', error);
    return { success: false, message: 'A server error occurred. Please try again.' };
  }
}

const cancellationSchema = z.object({
    reason: z.string().min(10, 'Please provide a reason of at least 10 characters.'),
});

export async function cancelTicket(ticketId: string, data: unknown) {
    if (!database) return { success: false, message: 'Database not configured.' };

    const parsed = cancellationSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, message: 'Invalid form data. Please provide a valid reason.' };
    }

    const { reason } = parsed.data;
    const ticketRef = ref(database, `tickets/${ticketId}`);

    try {
        const snapshot = await get(ticketRef);
        if (!snapshot.exists() || (snapshot.val() as Ticket).status !== 'Pending') {
            return { success: false, message: 'This ticket is invalid or has already been processed.' };
        }
        
        const ticketData = snapshot.val() as Ticket;

        const updates = {
            status: 'Cancelled',
            cancellationReason: reason,
            cancelledAt: new Date().toISOString(),
        };

        await update(ticketRef, updates);
        
        // Send cancellation email if the user had already provided an email
        if (ticketData.clientEmail) {
             await sendEmail({
                to: ticketData.clientEmail,
                subject: `Your Ticket has been Cancelled: ${ticketId}`,
                text: `Hello ${ticketData.clientName || 'Client'},\n\nThis is a confirmation that your ticket with ID ${ticketId} has been cancelled.\n\nReason: ${reason}\n\nThank you,\nChohan Space`,
                html: `<p>Hello ${ticketData.clientName || 'Client'},</p><p>This is a confirmation that your ticket with ID <strong>${ticketId}</strong> has been cancelled.</p><p><b>Reason:</b> ${reason}</p><p>Thank you,<br/>Chohan Space</p>`,
            });
        }

        revalidatePath(`/ticket/${ticketId}`);
        revalidatePath(`/ticket/${ticketId}/cancel`);
        revalidatePath('/admin');
        return { success: true, message: 'Your ticket has been cancelled.' };

    } catch (error) {
        console.error('Error cancelling ticket:', error);
        return { success: false, message: 'A server error occurred. Please try again.' };
    }
}
