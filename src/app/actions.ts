'use server';

import { getDb } from '@/lib/mongodb';
import { z } from 'zod';
import { ChatMessageSchema } from '@/lib/data';
import type { ChatMessage } from '@/lib/data';

const chatTranscriptSchema = z.object({
  userEmail: z.string().email().optional(),
  transcript: z.array(ChatMessageSchema),
  createdAt: z.string().datetime(),
});

export async function saveChatTranscript(messages: ChatMessage[], email?: string) {
    if (messages.length <= 1) {
        return { success: false, message: 'No conversation to save.' };
    }

    const transcriptData = {
        userEmail: email,
        transcript: messages,
        createdAt: new Date().toISOString(),
    };

    const parsed = chatTranscriptSchema.safeParse(transcriptData);
    if (!parsed.success) {
        console.error('Invalid transcript data:', parsed.error);
        return { success: false, message: 'Invalid transcript data.' };
    }
    
    try {
        const db = await getDb();
        await db.collection('chatTranscripts').insertOne(parsed.data);
        return { success: true };
    } catch (error) {
        console.error('Error saving chat transcript to MongoDB:', error);
        return { success: false, message: 'A server error occurred while saving the transcript.' };
    }
}
