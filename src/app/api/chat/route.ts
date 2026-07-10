import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ChatMessageSchema } from '@/lib/data';

const ChatHistorySchema = z.array(ChatMessageSchema);

const ChohanSpaceChatRequestSchema = z.object({
  history: ChatHistorySchema,
});

async function loadChatModule() {
  return import('../../../../server/chatbot-flow.mjs');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = ChohanSpaceChatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
    }

    const chatModule = await loadChatModule();
    const response = await chatModule.chat(parseResult.data);
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process chat request.' }, { status: 500 });
  }
}
