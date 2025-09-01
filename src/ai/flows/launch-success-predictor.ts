'use server';

/**
 * @fileOverview An AI agent for predicting launch success probability.
 *
 * - predictLaunchSuccess - A function that handles the prediction process.
 * - LaunchSuccessInput - The input type for the predictLaunchSuccess function.
 * - LaunchSuccessOutput - The return type for the predictLaunchSuccess function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LaunchSuccessInputSchema = z.object({
  weather: z.enum(['Clear', 'Light Clouds', 'Heavy Clouds', 'Rain', 'Thunderstorms']).describe('The weather conditions at the launch site.'),
  rocketType: z.enum(['Falcon 9', 'Atlas V', 'Astra', 'Electron', 'New Glenn']).describe('The type of rocket being used.'),
  payloadWeight: z.number().min(100).max(50000).describe('The weight of the payload in kilograms.'),
});
export type LaunchSuccessInput = z.infer<typeof LaunchSuccessInputSchema>;

const LaunchSuccessOutputSchema = z.object({
  successProbability: z.number().min(0).max(1).describe('The predicted probability of a successful launch, from 0 to 1.'),
  reasoning: z.string().describe('A brief explanation of the factors influencing the prediction.'),
  recommendation: z.string().describe('A recommendation, such as "Proceed with launch" or "Delay for better conditions."')
});
export type LaunchSuccessOutput = z.infer<typeof LaunchSuccessOutputSchema>;

export async function predictLaunchSuccess(input: LaunchSuccessInput): Promise<LaunchSuccessOutput> {
  return launchSuccessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'launchSuccessPrompt',
  input: {schema: LaunchSuccessInputSchema},
  output: {schema: LaunchSuccessOutputSchema},
  prompt: `You are an AI launch director for Chohan Space. Your task is to predict the success probability of a space launch based on the provided data.
You must analyze how weather, rocket type, and payload weight interact.
- 'Clear' weather is ideal. 'Thunderstorms' are a no-go. Other conditions have intermediate impacts.
- Rocket types have different reliability records. Falcon 9 and Atlas V are very reliable. Astra and Electron are less so for heavy payloads. New Glenn is powerful but untested.
- Heavier payloads increase risk, especially for smaller rockets.

Based on these factors, calculate a success probability. Provide your reasoning and a clear recommendation.

Weather: {{{weather}}}
Rocket Type: {{{rocketType}}}
Payload Weight (kg): {{{payloadWeight}}}

Generate the prediction.
`,
});

const launchSuccessFlow = ai.defineFlow(
  {
    name: 'launchSuccessFlow',
    inputSchema: LaunchSuccessInputSchema,
    outputSchema: LaunchSuccessOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
