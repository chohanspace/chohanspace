
'use server';

import { getDb, idQuery } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { BlogPost, Ticket } from '@/lib/data';
import { sendEmail } from '@/lib/email';

const ADMIN_EMAIL = process.env.EMAIL_FROM || 'fallback-email@example.com';

export async function deleteSubmission(submissionId: string) {
    if (!submissionId) {
        return { success: false, message: 'Invalid submission ID.' };
    }

    try {
        const db = await getDb();
        const result = await db.collection('submissions').deleteOne(idQuery(submissionId));

        if (result.deletedCount === 0) {
            return { success: false, message: 'Submission not found.' };
        }

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete submission from MongoDB:', error);
        return { success: false, message: 'A server error occurred while deleting the submission.' };
    }
}

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title must be at least 1 character.'),
  summary: z.string().min(1, 'Summary must be at least 1 character.'),
  content: z.string().min(1, 'Content must be at least 1 character.'),
  author: z.string().min(1, 'Author name must be at least 1 character.'),
  image: z.string().min(1, 'Please enter a valid image URL.'),
  dataAiHint: z.string().optional(),
});

function slugify(text: string) {
    return text.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export async function createBlogPost(prevState: { success: boolean; message: string; }, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = blogPostSchema.safeParse(data);

    if (!parsed.success) {
        const errorMessages = parsed.error.issues.map(issue => issue.message).join(' ');
        return { success: false, message: `Invalid form data: ${errorMessages}` };
    }

    const blogData = parsed.data;
    const slug = slugify(blogData.title);
    const newPost: BlogPost = {
        ...blogData,
        id: slug,
        slug,
        date: new Date().toISOString(),
    };

    try {
        const db = await getDb();
        await db.collection('blogPosts').insertOne(newPost);

        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);
        revalidatePath('/admin');
        return { success: true, message: 'Blog post created successfully!' };
    } catch (error) {
        console.error('Error creating blog post:', error);
        return { success: false, message: 'A server error occurred.' };
    }
}

export async function deleteBlogPost(postId: string) {
    if (!postId) {
        return { success: false, message: 'Invalid post ID.' };
    }

    try {
        const db = await getDb();
        const result = await db.collection('blogPosts').deleteOne(idQuery(postId));

        if (result.deletedCount === 0) {
            return { success: false, message: 'Blog post not found.' };
        }

        revalidatePath('/admin');
        revalidatePath('/blog');
        return { success: true, message: 'Blog post deleted.' };
    } catch (error) {
        console.error('Failed to delete blog post from MongoDB:', error);
        return { success: false, message: 'A server error occurred while deleting the post.' };
    }
}

function generateTicketId() {
    const randomPart = () => Math.random().toString(36).substring(2, 7);
    return `cs-${randomPart()}-${randomPart()}`;
}

export async function createTicket() {
    const ticketId = generateTicketId();
    const newTicket: Ticket = {
        id: ticketId,
        createdAt: new Date().toISOString(),
        status: 'Pending',
    };

    try {
        const db = await getDb();
        await db.collection('tickets').insertOne(newTicket);
        revalidatePath('/admin');
        
        await sendEmail({
            to: ADMIN_EMAIL,
            subject: `New Ticket Created: ${ticketId}`,
            text: `A new ticket has been created with ID: ${ticketId}.`,
            html: `<p>A new ticket has been created with ID: <strong>${ticketId}</strong>.</p><p>You can view it in the admin dashboard.</p>`,
        });

        return { success: true, message: `Ticket ${ticketId} created successfully.`, ticketId };
    } catch (error) {
        console.error('Error creating ticket:', error);
        return { success: false, message: 'A server error occurred while creating the ticket.' };
    }
}

export async function deleteTicket(ticketId: string) {
    if (!ticketId) return { success: false, message: 'Invalid ticket ID.' };

    try {
        const db = await getDb();
        const result = await db.collection('tickets').deleteOne(idQuery(ticketId));

        if (result.deletedCount === 0) {
            return { success: false, message: 'Ticket not found.' };
        }

        revalidatePath('/admin');
        revalidatePath(`/ticket/${ticketId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete ticket:', error);
        return { success: false, message: 'A server error occurred while deleting the ticket.' };
    }
}

export async function manuallyVerifyTicket(ticketId: string) {
    if (!ticketId) return { success: false, message: 'Invalid ticket ID.' };

    const updates = {
        status: 'Verified',
        verifiedAt: new Date().toISOString(),
        clientName: 'Manually Verified',
        clientEmail: 'N/A',
        clientPhone: 'N/A',
    };

    try {
        const db = await getDb();
        const result = await db.collection('tickets').updateOne({ id: ticketId }, { $set: updates });

        if (result.matchedCount === 0) {
            return { success: false, message: 'Ticket not found.' };
        }

        revalidatePath('/admin');
        return { success: true, message: 'Ticket manually verified.' };
    } catch (error) {
        console.error('Failed to manually verify ticket:', error);
        return { success: false, message: 'A server error occurred.' };
    }
}

export async function manuallyCancelTicket(ticketId: string) {
    if (!ticketId) return { success: false, message: 'Invalid ticket ID.' };

    try {
        const db = await getDb();
        const ticketDoc = await db.collection('tickets').findOne({ id: ticketId });

        if (!ticketDoc) {
            return { success: false, message: 'Ticket not found.' };
        }

        if (ticketDoc.status === 'Cancelled' || ticketDoc.status === 'Completed') {
            return { success: false, message: `Ticket is already ${ticketDoc.status.toLowerCase()} and cannot be cancelled.` };
        }

        const updates = {
            status: 'Cancelled',
            cancelledAt: new Date().toISOString(),
            cancellationReason: 'Manually cancelled by admin.',
        };

        await db.collection('tickets').updateOne({ id: ticketId }, { $set: updates });
        revalidatePath('/admin');
        revalidatePath(`/ticket/${ticketId}`);
        revalidatePath(`/ticket/${ticketId}/cancel`);
        
        await sendEmail({
            to: ADMIN_EMAIL,
            subject: `Ticket Cancelled by Admin: ${ticketId}`,
            text: `Ticket ${ticketId} was manually cancelled by an admin.`,
            html: `<p>Ticket <strong>${ticketId}</strong> was manually cancelled by an admin.</p>`,
        });

        return { success: true, message: 'Ticket manually cancelled.' };
    } catch (error) {
        console.error('Failed to manually cancel ticket:', error);
        return { success: false, message: 'A server error occurred.' };
    }
}

export async function markTicketAsCompleted(ticketId: string) {
    if (!ticketId) return { success: false, message: 'Invalid ticket ID.' };

    try {
        const db = await getDb();
        const ticketDoc = await db.collection('tickets').findOne({ id: ticketId });

        if (!ticketDoc || ticketDoc.status !== 'Verified') {
            return { success: false, message: 'Only verified tickets can be marked as completed.' };
        }

        const updates = {
            status: 'Completed',
            completedAt: new Date().toISOString(),
        };

        await db.collection('tickets').updateOne({ id: ticketId }, { $set: updates });
        revalidatePath('/admin');
        revalidatePath(`/ticket/${ticketId}`);

        await sendEmail({
            to: ADMIN_EMAIL,
            subject: `Ticket Marked as Completed: ${ticketId}`,
            text: `Ticket ${ticketId} has been marked as completed.`,
            html: `<p>Ticket <strong>${ticketId}</strong> has been marked as completed by an admin. You can now send the delivery email.</p>`,
        });

        return { success: true, message: 'Ticket marked as completed.' };
    } catch (error) {
        console.error('Failed to mark ticket as completed:', error);
        return { success: false, message: 'A server error occurred.' };
    }
}

export async function sendDeliveryEmail(ticketId: string) {
    if (!ticketId) return { success: false, message: 'Invalid ticket ID.' };

    try {
        const db = await getDb();
        const ticketDoc = await db.collection('tickets').findOne({ id: ticketId });

        if (!ticketDoc) {
            return { success: false, message: 'Ticket not found.' };
        }

        if (!ticketDoc.clientEmail) {
            return { success: false, message: 'No client email on file for this ticket.' };
        }

        if (ticketDoc.status !== 'Completed') {
            return { success: false, message: 'Can only send delivery email for completed tickets.' };
        }
        
        const phoneNumber = '923399663310';
        const message = `Hello, I'm ready to receive my completed project. My ticket ID is: ${ticketId}`;
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        await sendEmail({
            to: ticketDoc.clientEmail,
            subject: `Your Project is Complete! (Ticket: ${ticketId})`,
            text: `Hello ${ticketDoc.clientName},\n\nGreat news! Your project associated with ticket ID ${ticketId} has been completed. Please click the link below to receive your project deliverables on WhatsApp.\n\nReceive Your Order: ${whatsappLink}\n\nThank you for choosing Chohan Space.`,
            html: `
                <p>Hello ${ticketDoc.clientName},</p>
                <p>Great news! Your project associated with ticket ID <strong>${ticketId}</strong> has been completed.</p>
                <p>Please click the button below to get in touch with us on WhatsApp to receive your final deliverables.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${whatsappLink}" target="_blank" style="background-color: #25D366; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-weight: bold;">
                        Receive Your Order on WhatsApp
                    </a>
                </div>
                <p>Thank you for choosing Chohan Space.</p>
            `,
        });
        return { success: true, message: 'Delivery email sent successfully.' };
    } catch (error) {
        console.error('Failed to send delivery email:', error);
        return { success: false, message: 'A server error occurred while sending the email.' };
    }
}
