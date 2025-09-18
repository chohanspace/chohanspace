'use server';
/**
 * @fileOverview A chatbot flow for Chohan Space.
 *
 * - chat - A function that handles the chatbot conversation.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ChatMessageSchema } from '@/lib/data';
import type { ChatMessage } from '@/lib/data';

const ChatHistorySchema = z.array(ChatMessageSchema);

const ChohanSpaceChatRequestSchema = z.object({
  history: ChatHistorySchema,
});
export type ChohanSpaceChatRequest = z.infer<typeof ChohanSpaceChatRequestSchema>;

const ChohanSpaceChatResponseSchema = z.string();
export type ChohanSpaceChatResponse = z.infer<typeof ChohanSpaceChatResponseSchema>;


const systemPrompt = `You are a friendly and helpful AI assistant for Chohan Space, a web development agency.
Your goal is to answer user questions about Chohan Space and encourage them to get in touch.

Here is some information about Chohan Space:
- **What we do**: We build intelligent, high-performance websites and applications that drive results. Our main services are:
    - **Web Development**: Crafting robust, scalable, and secure web applications. We specialize in Next.js and the modern web stack.
    - **UI/UX Design**: Designing intuitive and beautiful user interfaces.
    - **Cloud Solutions**: Leveraging cloud infrastructure like Firebase and Google Cloud to deliver reliable applications.
- **Our Process**: We follow a simple, 3-step process:
    1. **Consultation**: We start by understanding the client's goals and project requirements.
    2. **Development**: We build the website with clean code and modern technologies.
    3. **Launch**: After testing, we deploy the project.
- **Contact**: To start a project, users should visit the contact page.

Keep your answers concise and friendly. If you don't know the answer, say that you're not sure and suggest contacting the Chohan Space team directly.
`;

const chatPrompt = ai.definePrompt({
  name: 'chohanSpaceChatPrompt',
  input: {schema: ChohanSpaceChatRequestSchema},
  output: {schema: ChohanSpaceChatResponseSchema},
  system: systemPrompt,
  prompt: `
    {{#each history}}
      {{#if (eq role 'user')}}
        User: {{{content}}}
      {{else}}
        Assistant: {{{content}}}
      {{/if}}
    {{/each}}
    Assistant:
  `,
});


export async function chat(request: ChohanSpaceChatRequest): Promise<ChohanSpaceChatResponse> {
    const {output} = await chatPrompt(request);
    return output || "Sorry, I'm having a little trouble thinking right now. Please try again in a moment.";
  }
