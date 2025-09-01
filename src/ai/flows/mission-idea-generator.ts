'use server';

/**
 * @fileOverview A mission idea generator AI agent.
 *
 * - generateMissionIdea - A function that handles the mission idea generation process.
 * - MissionIdeaInput - The input type for the generateMissionIdea function.
 * - MissionIdeaOutput - The return type for the generateMissionIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MissionIdeaInputSchema = z.object({
  keywords: z.string().describe('Keywords to inspire the mission idea (e.g., "Mars, colonization, robotics").'),
});
export type MissionIdeaInput = z.infer<typeof MissionIdeaInputSchema>;

const MissionIdeaOutputSchema = z.object({
  missionName: z.string().describe('A creative and inspiring name for the space mission.'),
  missionObjective: z.string().describe('A concise, one-sentence objective for the mission.'),
  missionDetails: z.string().describe('A paragraph detailing the mission concept, its goals, and significance.'),
});
export type MissionIdeaOutput = z.infer<typeof MissionIdeaOutputSchema>;

export async function generateMissionIdea(input: MissionIdeaInput): Promise<MissionIdeaOutput> {
  return missionIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'missionIdeaPrompt',
  input: {schema: MissionIdeaInputSchema},
  output: {schema: MissionIdeaOutputSchema},
  prompt: `You are an AI assistant for an aerospace company called Chohan Space. Your task is to generate a creative and plausible space mission concept based on user-provided keywords.

Generate a mission name, a primary objective, and a detailed mission description.

Keywords: {{{keywords}}}
`,
});

const missionIdeaFlow = ai.defineFlow(
  {
    name: 'missionIdeaFlow',
    inputSchema: MissionIdeaInputSchema,
    outputSchema: MissionIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
