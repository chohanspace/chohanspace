'use server';

import { suggestContent, type SuggestContentInput } from '@/ai/flows/content-suggestion-tool';
import { generateMissionIdea as generateMissionIdeaFlow, type MissionIdeaInput } from '@/ai/flows/mission-idea-generator';
import { answerTechnicalQuestion as answerTechnicalQuestionFlow, type TechnicalQuestionInput } from '@/ai/flows/technical-manual-assistant';
import { generateCrisisComm as generateCrisisCommFlow, type CrisisCommInput } from '@/ai/flows/crisis-communicator';
import { generateStory as generateStoryFlow, type StoryInput } from '@/ai/flows/story-writer-flow';
import { generateCaseStudy as generateCaseStudyFlow, type CaseStudyInput } from '@/ai/flows/case-study-generator';
import { predictLaunchSuccess as predictLaunchSuccessFlow, type LaunchSuccessInput } from '@/ai/flows/launch-success-predictor';
import { answerQuery as answerQueryFlow, type ChatbotInput } from '@/ai/flows/chatbot-assistant';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

const suggestionInputSchema = z.object({
    projectDescription: z.string().min(1),
});

export async function generateSuggestions(input: SuggestContentInput) {
    const parsedInput = suggestionInputSchema.safeParse(input);

    if (!parsedInput.success) {
        console.error("Invalid input for suggestions", parsedInput.error);
        return null;
    }

    try {
        const suggestions = await suggestContent(parsedInput.data);
        return suggestions;
    } catch (error) {
        console.error("Error generating suggestions:", error);
        return null;
    }
}

const missionIdeaInputSchema = z.object({
    keywords: z.string().min(1),
});

export async function generateMissionIdea(input: MissionIdeaInput) {
    const parsedInput = missionIdeaInputSchema.safeParse(input);

    if(!parsedInput.success) {
        console.error("Invalid input for mission idea", parsedInput.error);
        return null;
    }

    try {
        const missionIdea = await generateMissionIdeaFlow(parsedInput.data);
        return missionIdea;
    } catch (error) {
        console.error("Error generating mission idea:", error);
        return null;
    }
}

const technicalQuestionInputSchema = z.object({
  document: z.string().min(10, "Document must be at least 10 characters."),
  question: z.string().min(5, "Question must be at least 5 characters."),
});

export async function answerTechnicalQuestion(input: TechnicalQuestionInput) {
    const parsedInput = technicalQuestionInputSchema.safeParse(input);

    if(!parsedInput.success) {
        console.error("Invalid input for technical question", parsedInput.error);
        return null;
    }

    try {
        const result = await answerTechnicalQuestionFlow(parsedInput.data);
        return result;
    } catch (error) {
        console.error("Error answering technical question:", error);
        return null;
    }
}

const crisisCommInputSchema = z.object({
  missionName: z.string().min(3),
  anomaly: z.string().min(10),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
});


export async function generateCrisisComm(input: CrisisCommInput) {
    const parsedInput = crisisCommInputSchema.safeParse(input);

    if(!parsedInput.success) {
        console.error("Invalid input for crisis communication", parsedInput.error);
        return null;
    }

    try {
        const result = await generateCrisisCommFlow(parsedInput.data);
        return result;
    } catch (error) {
        console.error("Error generating crisis communication:", error);
        return null;
    }
}

const storyInputSchema = z.object({
    prompt: z.string().min(10),
});

export async function generateStory(input: StoryInput) {
    const parsedInput = storyInputSchema.safeParse(input);

    if(!parsedInput.success) {
        console.error("Invalid input for story generation", parsedInput.error);
        return null;
    }

    try {
        const result = await generateStoryFlow(parsedInput.data);
        return result;
    } catch (error) {
        console.error("Error generating story:", error);
        return null;
    }
}

const caseStudyInputSchema = z.object({
    projectName: z.string().min(3),
    projectGoals: z.string().min(10),
    technologiesUsed: z.string().min(3),
    outcome: z.string().min(10),
});

export async function generateCaseStudy(input: CaseStudyInput) {
    const parsedInput = caseStudyInputSchema.safeParse(input);

    if(!parsedInput.success) {
        console.error("Invalid input for case study generation", parsedInput.error);
        return null;
    }

    try {
        const result = await generateCaseStudyFlow(parsedInput.data);
        return result;
    } catch (error) {
        console.error("Error generating case study:", error);
        return null;
    }
}

const launchSuccessInputSchema = z.object({
    weather: z.enum(['Clear', 'Light Clouds', 'Heavy Clouds', 'Rain', 'Thunderstorms']),
    rocketType: z.enum(['Falcon 9', 'Atlas V', 'Astra', 'Electron', 'New Glenn']),
    payloadWeight: z.number().min(100).max(50000),
});

export async function predictLaunchSuccess(input: LaunchSuccessInput) {
    const parsedInput = launchSuccessInputSchema.safeParse(input);

    if (!parsedInput.success) {
        console.error("Invalid input for launch success prediction", parsedInput.error);
        return null;
    }

    try {
        const result = await predictLaunchSuccessFlow(parsedInput.data);
        return result;
    } catch (error) {
        console.error("Error predicting launch success:", error);
        return null;
    }
}


const chatbotInputSchema = z.object({
    query: z.string().min(1),
});

export async function answerQuery(input: ChatbotInput) {
    const parsedInput = chatbotInputSchema.safeParse(input);

    if (!parsedInput.success) {
        console.error("Invalid input for chatbot query", parsedInput.error);
        return null;
    }

    try {
        const result = await answerQueryFlow(parsedInput.data);
        return result;
    } catch (error) {
        console.error("Error answering query:", error);
        return null;
    }
}

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

const emailTranscriptSchema = z.object({
    email: z.string().email(),
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
    })),
});

function formatTranscriptAsHtml(messages: Message[]): string {
    let html = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #333;">Your Chohan Space Chat Transcript</h2>
            <p>Here is a copy of your recent conversation with the Chohan Space assistant.</p>
            <div style="border-top: 1px solid #eee; margin: 20px 0;"></div>
    `;

    messages.forEach(message => {
        const isUser = message.role === 'user';
        const styles = {
            container: `margin-bottom: 10px; display: flex; justify-content: ${isUser ? 'flex-end' : 'flex-start'};`,
            bubble: `padding: 10px 15px; border-radius: 18px; max-width: 70%; background-color: ${isUser ? '#3b82f6' : '#e5e7eb'}; color: ${isUser ? '#ffffff' : '#1f2937'};`,
            role: `display: block; font-size: 0.9em; margin-bottom: 5px; font-weight: bold; color: ${isUser ? '#dbeafe' : '#4b5563'};`,
        };
        
        html += `
            <div style="${styles.container}">
                <div style="${styles.bubble}">
                    <strong style="${styles.role}">${isUser ? 'You' : 'Assistant'}</strong>
                    ${message.content.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
    });

    html += `
        <div style="border-top: 1px solid #eee; margin-top: 20px; padding-top: 15px; font-size: 0.8em; color: #888; text-align: center;">
            <p>This is an automated message. Visit us at <a href="https://chohan.space" style="color: #3b82f6;">chohan.space</a>.</p>
        </div>
        </div>
    `;
    return html;
}


export async function sendChatTranscript(data: { email: string; messages: Message[] }) {
    const parsed = emailTranscriptSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, message: 'Invalid data for sending transcript.' };
    }

    const { email, messages } = parsed.data;
    
    // Don't send if there's only the initial greeting
    if (messages.length <= 1) {
        return { success: true, message: 'No conversation to send.' };
    }

    const htmlContent = formatTranscriptAsHtml(messages);
    const textContent = messages.map(m => `${m.role === 'user' ? 'You' : 'Assistant'}: ${m.content}`).join('\n');

    return await sendEmail({
        to: email,
        subject: 'Your Chohan Space Chat Transcript',
        text: textContent,
        html: htmlContent,
    });
}

    