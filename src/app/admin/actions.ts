
'use server';

import { database } from '@/lib/firebase';
import { ref, remove, set, push, update, get } from 'firebase/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { BlogPost, Ticket } from '@/lib/data';
import { sendEmail } from '@/lib/email';

export async function deleteSubmission(submissionId: string) {
    if (!submissionId) {
        return { success: false, message: 'Invalid submission ID.' };
    }
    if (!database) return { success: false, message: 'Database not configured.' };
    
    const submissionRef = ref(database, `submissions/${submissionId}`);
    
    try {
        await remove(submissionRef);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete submission from Firebase:', error);
        return { success: false, message: 'A server error occurred while deleting the submission.' };
    }
}

const blogPostSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character."),
  summary: z.string().min(1, "Summary must be at least 1 character."),
  content: z.string().min(1, "Content must be at least 1 character."),
  author: z.string().min(1, "Author name must be at least 1 character."),
  image: z.string().min(1, "Please enter a valid image URL."),
  dataAiHint: z.string().optional(),
});

function slugify(text: string) {
    return text.toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

export async function createBlogPost(prevState: { success: boolean; message: string; }, formData: FormData) {
    if (!database) return { success: false, message: 'Database not configured.' };

    const data = Object.fromEntries(formData.entries());
    const parsed = blogPostSchema.safeParse(data);

    if (!parsed.success) {
        const errorMessages = parsed.error.issues.map(issue => issue.message).join(' ');
        return { success: false, message: `Invalid form data: ${errorMessages}` };
    }

    const blogData = parsed.data;
    const slug = slugify(blogData.title);

    const postsRef = ref(database, 'blogPosts');
    const newPostRef = push(postsRef);
    const newPostKey = newPostRef.key;

    if (!newPostKey) {
        return { success: false, message: 'Could not generate a unique key for the new post.' };
    }

    const newPost: BlogPost = {
        id: newPostKey,
        ...blogData,
        slug,
        date: new Date().toISOString(),
    };

    try {
        await set(newPostRef, newPost);

        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);
        revalidatePath('/admin');
        return { success: true, message: 'Blog post created successfully!' };
    } catch (error) {
        console.error("Error creating blog post:", error);
        return { success: false, message: 'A server error occurred.' };
    }
}

export async function deleteBlogPost(postId: string) {
    if (!postId) {
        return { success: false, message: 'Invalid post ID.' };
    }
    if (!database) return { success: false, message: 'Database not configured.' };
    
    const postRef = ref(database, `blogPosts/${postId}`);
    
    try {
        await remove(postRef);
        revalidatePath('/admin');
        revalidatePath('/blog');
        return { success: true, message: 'Blog post deleted.' };
    } catch (error) {
        console.error('Failed to delete blog post from Firebase:', error);
        return { success: false, message: 'A server error occurred while deleting the post.' };
    }
}


// Ticketing System Actions
function generateTicketId() {
    const randomPart = () => Math.random().toString(36).substring(2, 7);
    return `cs-${randomPart()}-${randomPart()}`;
}

export async function createTicket() {
    if (!database) return { success: false, message: 'Database not configured.' };

    const ticketId = generateTicketId();
    const newTicket: Ticket = {
        id: ticketId,
        createdAt: new Date().toISOString(),
        status: 'Pending',
    };

    const ticketRef = ref(database, `tickets/${ticketId}`);

    try {
        await set(ticketRef, newTicket);
        revalidatePath('/admin');
        return { success: true, message: `Ticket ${ticketId} created successfully.`, ticketId };
    } catch (error) {
        console.error('Error creating ticket:', error);
        return { success: false, message: 'A server error occurred while creating the ticket.' };
    }
}

export async function deleteTicket(ticketId: string) {
    if (!ticketId) return { success: false, message: 'Invalid ticket ID.' };
    if (!database) return { success: false, message: 'Database not configured.' };

    const ticketRef = ref(database, `tickets/${ticketId}`);
    try {
        await remove(ticketRef);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete ticket:', error);
        return { success: false, message: 'A server error occurred while deleting the ticket.' };
    }
}

export async function manuallyVerifyTicket(ticketId: string) {
    if (!ticketId) return { success: false, message: 'Invalid ticket ID.' };
    if (!database) return { success: false, message: 'Database not configured.' };

    const ticketRef = ref(database, `tickets/${ticketId}`);
    const updates = {
        status: 'Verified',
        verifiedAt: new Date().toISOString(),
        clientName: 'Manually Verified',
        clientEmail: 'N/A',
        clientPhone: 'N/A',
    };

    try {
        await update(ticketRef, updates);
        revalidatePath('/admin');
        return { success: true, message: 'Ticket manually verified.' };
    } catch (error) {
        console.error('Failed to manually verify ticket:', error);
        return { success: false, message: 'A server error occurred.' };
    }
}

export async function manuallyCancelTicket(ticketId: string) {
    if (!ticketId) return { success: false, message: 'Invalid ticket ID.' };
    if (!database) return { success: false, message: 'Database not configured.' };

    const ticketRef = ref(database, `tickets/${ticketId}`);
    const updates = {
        status: 'Cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: 'Manually cancelled by admin.',
    };

    try {
        await update(ticketRef, updates);
        revalidatePath('/admin');
        return { success: true, message: 'Ticket manually cancelled.' };
    } catch (error) {
        console.error('Failed to manually cancel ticket:', error);
        return { success: false, message: 'A server error occurred.' };
    }
}
