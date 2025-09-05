
'use server';

/**
 * @fileOverview An AI agent for personalizing website content.
 *
 * - personalizeContent - A function that handles the content personalization process.
 * - PersonalizationInput - The input type for the personalizeContent function.
 * - PersonalizationOutput - The return type for the personalizeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizationInputSchema = z.object({
  userHistory: z.array(z.string()).describe('A list of page URLs the user has recently visited.'),
  userLocation: z.string().optional().describe('The user\'s current location (e.g., "San Francisco, CA").'),
  originalHeadline: z.string().describe('The default headline for the webpage.'),
});
export type PersonalizationInput = z.infer<typeof PersonalizationInputSchema>;

const PersonalizationOutputSchema = z.object({
  personalizedHeadline: z.string().describe('A new headline, tailored to the user\'s inferred interests.'),
  suggestedContentIds: z.array(z.string()).describe('A list of content IDs (e.g., blog post slugs or product SKUs) that would be relevant to the user.'),
  reasoning: z.string().describe('A brief explanation of why this personalization was chosen.'),
});
export type PersonalizationOutput = z.infer<typeof PersonalizationOutputSchema>;

export async function personalizeContent(input: PersonalizationInput): Promise<PersonalizationOutput> {
  return personalizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizationPrompt',
  input: {schema: PersonalizationInputSchema},
  output: {schema: PersonalizationOutputSchema},
  prompt: `You are an AI-powered Website Personalization Engine, a collaboration between Chohan Space and Butt Networks.
Your goal is to analyze user data and suggest personalized content to increase engagement.

Analyze the user's browsing history and optional location to infer their primary interest.
Based on this interest, rewrite the headline to be more engaging for them and suggest relevant content.

User Browsing History:
{{#each userHistory}}
- {{{this}}}
{{/each}}

User Location: {{{userLocation}}}
Original Headline: {{{originalHeadline}}}

Generate a personalized headline, a list of suggested content IDs, and provide your reasoning.
`,
});

const personalizationFlow = ai.defineFlow(
  {
    name: 'personalizationFlow',
    inputSchema: PersonalizationInputSchema,
    outputSchema: PersonalizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
