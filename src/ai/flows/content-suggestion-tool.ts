'use server';

/**
 * @fileOverview A content suggestion AI agent.
 *
 * - suggestContent - A function that handles the content suggestion process.
 * - SuggestContentInput - The input type for the suggestContent function.
 * - SuggestContentOutput - The return type for the suggestContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestContentInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('The description of the existing project.'),
});
export type SuggestContentInput = z.infer<typeof SuggestContentInputSchema>;

const SuggestContentOutputSchema = z.object({
  suggestedTopics: z
    .array(z.string())
    .describe('An array of suggested topics related to the project.'),
  suggestedKeywords: z
    .array(z.string())
    .describe('An array of suggested keywords related to the project.'),
});
export type SuggestContentOutput = z.infer<typeof SuggestContentOutputSchema>;

export async function suggestContent(input: SuggestContentInput): Promise<SuggestContentOutput> {
  return suggestContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContentPrompt',
  input: {schema: SuggestContentInputSchema},
  output: {schema: SuggestContentOutputSchema},
  prompt: `You are an AI content suggestion tool for portfolio websites.

You will receive a project description and you will provide an array of suggested topics and keywords to expand on.

Project Description: {{{projectDescription}}}

Suggested Topics:
Suggested Keywords: `,
});

const suggestContentFlow = ai.defineFlow(
  {
    name: 'suggestContentFlow',
    inputSchema: SuggestContentInputSchema,
    outputSchema: SuggestContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
