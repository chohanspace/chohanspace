'use server';

import { z } from 'zod';
import { database } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function submitContactForm(data: unknown) {
  if (!database) {
    return { success: false, message: 'Database not configured. Cannot save submission.' };
  }

  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map(issue => issue.message).join(' ');
    return { success: false, message: `Invalid form data: ${errorMessages}` };
  }
  
  const submissionData = parsed.data;

  try {
    // Save submission to Firebase Realtime Database
    const submissionsRef = ref(database, 'submissions');
    const newSubmissionRef = push(submissionsRef);
    await set(newSubmissionRef, submissionData);
    
    return { success: true, message: "Thank you for your message! We'll be in touch soon." };

  } catch (error) {
    console.error('Error saving submission to Firebase:', error);
    return { success: false, message: "Sorry, there was an error sending your message. Please try again later." };
  }
}
