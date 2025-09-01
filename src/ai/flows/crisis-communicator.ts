'use server';

/**
 * @fileOverview An AI agent for generating crisis communication statements.
 *
 * - generateCrisisComm - A function that handles the statement generation process.
 * - CrisisCommInput - The input type for the generateCrisisComm function.
 * - CrisisCommOutput - The return type for the generateCrisisComm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrisisCommInputSchema = z.object({
  missionName: z.string().describe('The name of the mission experiencing the anomaly.'),
  anomaly: z.string().describe('A brief, technical description of the anomaly or problem.'),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The severity of the situation.'),
});
export type CrisisCommInput = z.infer<typeof CrisisCommInputSchema>;

const CrisisCommOutputSchema = z.object({
  statementTitle: z.string().describe('A clear, concise headline for the press release.'),
  statementBody: z.string().describe('A multi-paragraph press release. It should be empathetic, transparent, and professional. It should acknowledge the situation, state what is known, and outline next steps.'),
  socialMediaPost: z.string().describe('A short (under 280 characters) version of the statement for social media platforms like Twitter.')
});
export type CrisisCommOutput = z.infer<typeof CrisisCommOutputSchema>;

export async function generateCrisisComm(input: CrisisCommInput): Promise<CrisisCommOutput> {
  return crisisCommFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crisisCommPrompt',
  input: {schema: CrisisCommInputSchema},
  output: {schema: CrisisCommOutputSchema},
  prompt: `You are the Head of Public Relations for Chohan Space, an aerospace company.
You must draft a public statement regarding an anomaly on a mission.
Your tone should be professional, transparent, and reassuring, even if the situation is severe. Avoid speculation.

Mission: {{{missionName}}}
Anomaly Description: {{{anomaly}}}
Severity: {{{severity}}}

Generate a press release title, a full statement body, and a short social media post.
`,
});

const crisisCommFlow = ai.defineFlow(
  {
    name: 'crisisCommFlow',
    inputSchema: CrisisCommInputSchema,
    outputSchema: CrisisCommOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
