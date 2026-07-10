const fallbackResponse = "Sorry, I'm having a little trouble thinking right now. Please try again in a moment.";
let chatPromptInstance = null;

const systemPrompt = `You are a friendly and helpful AI assistant for Chohan Space, a web development agency.
Your goal is to answer user questions about Chohan Space and encourage them to get in touch.

Here is some information about Chohan Space:
- **What we do**: We build intelligent, high-performance websites and applications that drive results. Our main services are:
    - **Web Development**: Crafting robust, scalable, and secure web applications. We specialize in Next.js and the modern web stack.
    - **UI/UX Design**: Designing intuitive and beautiful user interfaces.
    - **Cloud Solutions**: Leveraging cloud infrastructure like Firebase and Google Cloud to deliver reliable applications.
- **Our Process**: We follow a simple, 3-step process:
    1. **Consultation**: We start by understanding the client's goals and project requirements.
    2. **Development**: We build the website with clean code and modern technologies.
    3. **Launch**: After testing, we deploy the project.
- **Contact**: To start a project, users should visit the contact page.
- **Admin Tasks**: If the user asks to "generate a new Gemini API key" or a similar query, you must respond with the following text exactly:
"I cannot generate an API key directly for security reasons, but I can guide you. You can create a new Gemini API key in the Google Cloud Console. Here is the link to the credentials page: https://console.cloud.google.com/apis/credentials"

Keep your answers concise and friendly. If you don't know the answer, say that you're not sure and suggest contacting the Chohan Space team directly.
`;

async function createAi() {
  if (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.GEMINI_API_KEY) {
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

async function getChatPrompt() {
  if (chatPromptInstance) {
    return chatPromptInstance;
  }

  if (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.GEMINI_API_KEY) {
    chatPromptInstance = async () => fallbackResponse;
    return chatPromptInstance;
  }

  const ai = await createAi();
  if (!ai) {
    chatPromptInstance = async () => fallbackResponse;
    return chatPromptInstance;
  }

  const prompt = ai.definePrompt({
    name: 'chohanSpaceChatPrompt',
    system: systemPrompt,
    prompt: `
      {{#each history}}
        {{role}}: {{{content}}}
      {{/each}}
      model:
    `,
  });

  chatPromptInstance = async (request) => {
    const { output } = await prompt(request);
    return output ?? fallbackResponse;
  };

  return chatPromptInstance;
}

export async function chat(request) {
  const prompt = await getChatPrompt();
  return prompt(request);
}
