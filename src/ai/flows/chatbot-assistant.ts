
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
- **Collaboration:** We are proudly collaborating with Butt Networks (buttnetworks.com), led by CEO Shahnawaz Saddam Butt and Co-Owner Wahb Amir. This partnership combines our strengths to push the boundaries of digital experiences. If asked about our partners, provide this information and their website link.
- **AI Tools Suite (/projects):** We have a suite of AI-powered tools to accelerate web development. This includes:
    - **Content Suggester:** Helps write project descriptions and find keywords.
    - **Technical Manual Assistant:** Answers questions about technical documents.
    - **Case Study Generator:** Generates professional case studies for projects.
    - **Mission Idea Generator:** Brainstorms new space mission concepts from keywords.
    - **Crisis Communicator:** Drafts public relations statements for mission anomalies.
    - **Launch Success Predictor:** Analyzes risks to predict launch success.
- **I/O Features (/io):** We also offer I/O-optimized AI tools for high-throughput creative generation, including a Story Writer.
- **Blog (/blog):** We have a blog with insights, tutorials, and stories from our team.
- **Contact (/contact):** Users can get in touch with us through the contact page on the website to discuss their projects.
- **Admin Area (/admin):** This is a private area for site administrators to manage content.

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

    
