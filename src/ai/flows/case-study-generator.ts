'use server';

/**
 * @fileOverview An AI agent for generating project case studies.
 *
 * - generateCaseStudy - A function that handles the case study generation process.
 * - CaseStudyInput - The input type for the generateCaseStudy function.
 * - CaseStudyOutput - The return type for the generateCaseStudy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CaseStudyInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectGoals: z.string().describe('The primary goals and objectives of the project.'),
  technologiesUsed: z.string().describe('A comma-separated list of key technologies and frameworks used.'),
    outcome: z.string().describe('The final result and impact of the project.'),
});
export type CaseStudyInput = z.infer<typeof CaseStudyInputSchema>;

const CaseStudyOutputSchema = z.object({
  caseStudyTitle: z.string().describe('A compelling title for the case study.'),
    caseStudyBody: z.string().describe('A well-structured case study including sections for Introduction, Challenges, Solutions, and Results. It should be written in a professional and engaging tone.'),
});
export type CaseStudyOutput = z.infer<typeof CaseStudyOutputSchema>;

export async function generateCaseStudy(input: CaseStudyInput): Promise<CaseStudyOutput> {
  return caseStudyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'caseStudyPrompt',
  input: {schema: CaseStudyInputSchema},
  output: {schema: CaseStudyOutputSchema},
  prompt: `You are a professional copywriter specializing in creating compelling case studies for web development projects.
Your task is to generate a case study based on the provided information. The case study should be well-structured, professional, and highlight the project's success.

Structure the output with the following sections:
1.  **Introduction:** Briefly introduce the project.
2.  **The Challenge:** Describe the project's main goals and challenges.
3.  **The Solution:** Explain how the project was approached and what technologies were used to overcome the challenges.
4.  **The Outcome:** Detail the final results and the positive impact of the project.

Project Name: {{{projectName}}}
Project Goals: {{{projectGoals}}}
Technologies Used: {{{technologiesUsed}}}
Outcome: {{{outcome}}}

Generate the case study title and body.
`,
});

const caseStudyFlow = ai.defineFlow(
  {
    name: 'caseStudyFlow',
    inputSchema: CaseStudyInputSchema,
    outputSchema: CaseStudyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
