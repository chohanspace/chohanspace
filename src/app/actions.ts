'use server';

import { database } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import { z } from 'zod';
import { ChatMessageSchema } from '@/lib/data';
import type { ChatMessage } from '@/lib/data';

const chatTranscriptSchema = z.object({
  transcript: z.array(ChatMessageSchema),
  createdAt: z.string().datetime(),
});

export async function saveChatTranscript(messages: ChatMessage[]) {
    if (!database) {
        console.error('Database not configured. Cannot save chat transcript.');
        return { success: false, message: 'Database not configured.' };
    }
    
    if (messages.length <= 1) { // Only initial message, no conversation
        return { success: false, message: 'No conversation to save.' };
    }

    const transcriptData = {
        transcript: messages,
        createdAt: new Date().toISOString(),
    };

    const parsed = chatTranscriptSchema.safeParse(transcriptData);
    if (!parsed.success) {
        console.error('Invalid transcript data:', parsed.error);
        return { success: false, message: 'Invalid transcript data.' };
    }
    
    try {
        const transcriptsRef = ref(database, 'chatTranscripts');
        const newTranscriptRef = push(transcriptsRef);
        await set(newTranscriptRef, parsed.data);
        return { success: true };
    } catch (error) {
        console.error('Error saving chat transcript to Firebase:', error);
        return { success: false, message: 'A server error occurred while saving the transcript.' };
    }
}
