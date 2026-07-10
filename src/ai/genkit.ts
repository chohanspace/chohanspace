export async function createAi() {
  if (!process.env.GEMINI_API_KEY || process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }

  const [{ genkit }, { googleAI }] = await Promise.all([
    import('genkit'),
    import('@genkit-ai/googleai'),
  ]);

  return genkit({
    plugins: [
      googleAI({
        apiKey: process.env.GEMINI_API_KEY,
      }),
    ],
    model: 'googleai/gemini-2.5-flash',
  });
}
