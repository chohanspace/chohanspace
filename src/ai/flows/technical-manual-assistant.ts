'use server';

/**
 * @fileOverview A technical manual assistant AI agent.
 *
 * - answerTechnicalQuestion - A function that handles the question answering process.
 * - TechnicalQuestionInput - The input type for the answerTechnicalQuestion function.
 * - TechnicalQuestionOutput - The return type for the answerTechnicalQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TechnicalQuestionInputSchema = z.object({
  document: z.string().describe('The full text of the technical manual or document.'),
  question: z.string().describe('The user\'s question about the document.'),
});
export type TechnicalQuestionInput = z.infer<typeof TechnicalQuestionInputSchema>;

const TechnicalQuestionOutputSchema = z.object({
  answer: z.string().describe('A clear, concise answer to the user\'s question, based *only* on the provided document. If the answer is not in the document, state that clearly.'),
  confidenceScore: z.number().min(0).max(1).describe('A score from 0 to 1 indicating the confidence that the answer is correct and found within the document.'),
  relevantSection: z.string().optional().describe('A direct quote from the most relevant section of the document that supports the answer.')
});
export type TechnicalQuestionOutput = z.infer<typeof TechnicalQuestionOutputSchema>;

export async function answerTechnicalQuestion(input: TechnicalQuestionInput): Promise<TechnicalQuestionOutput> {
  return technicalQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'technicalQuestionPrompt',
  input: {schema: TechnicalQuestionInputSchema},
  output: {schema: TechnicalQuestionOutputSchema},
  prompt: `You are an AI assistant for StellarDevs engineers. Your task is to answer questions based *exclusively* on the provided technical document.
Do not use any external knowledge. If the answer cannot be found in the document, you must state that the information is not available in the provided text.

DOCUMENT:
---
{{{document}}}
---

QUESTION: {{{question}}}

Based on the document, provide a direct answer, a confidence score, and quote the most relevant section.
`,
});

const technicalQuestionFlow = ai.defineFlow(
  {
    name: 'technicalQuestionFlow',
    inputSchema: TechnicalQuestionInputSchema,
    outputSchema: TechnicalQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
