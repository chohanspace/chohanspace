'use server';

/**
 * @fileOverview An AI assistant for the Chohan Space website.
 *
 * - answerQuery - A function that handles answering user questions.
 * - ChatbotInput - The input type for the answerQuery function.
 * - ChatbotOutput - The return type for the answerQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotInputSchema = z.object({
  query: z.string().describe('The user\'s question about Chohan Space.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The AI\'s answer to the user\'s question.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function answerQuery(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are a friendly and helpful chatbot assistant for "Chohan Space", a web development agency.
Your goal is to answer user questions about Chohan Space accurately and concisely.

Here is some information about Chohan Space:
- **What we do:** We craft intelligent, high-performance websites and applications that drive results. We specialize in Web Development, UI/UX Design, and Cloud Solutions.
- **AI Tools:** We have a suite of AI-powered tools to accelerate web development, including a Content Suggester, Technical Manual Assistant, and Case Study Generator.
- **I/O Features:** We also offer I/O-optimized AI tools for high-throughput data processing and creative generation, like a Story Writer.
- **Services:** We build sleek marketing sites and complex web applications.
- **Contact:** Users can get in touch with us through the contact page on the website to discuss their projects.

Based on this information, please answer the following user query. Be friendly and helpful.

User Query: {{{query}}}
`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
