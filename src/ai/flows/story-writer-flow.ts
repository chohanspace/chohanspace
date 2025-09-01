'use server';

/**
 * @fileOverview A creative content writing AI agent.
 *
 * - generateStory - A function that handles the story generation process.
 * - StoryInput - The input type for the generateStory function.
 * - StoryOutput - The return type for the generateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StoryInputSchema = z.object({
  prompt: z.string().describe('The prompt for the creative content.'),
});
export type StoryInput = z.infer<typeof StoryInputSchema>;

const StoryOutputSchema = z.object({
  title: z.string().describe('The title of the content.'),
  story: z.string().describe('The generated content.'),
});
export type StoryOutput = z.infer<typeof StoryOutputSchema>;

export async function generateStory(input: StoryInput): Promise<StoryOutput> {
  return storyWriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'storyWriterPrompt',
  input: {schema: StoryInputSchema},
  output: {schema: StoryOutputSchema},
  prompt: `You are a creative writer for StellarDevs I/O. Your task is to write a short piece of creative content based on the given prompt.

The content should be engaging and well-structured.

Prompt: {{{prompt}}}
`,
});

const storyWriterFlow = ai.defineFlow(
  {
    name: 'storyWriterFlow',
    inputSchema: StoryInputSchema,
    outputSchema: StoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
