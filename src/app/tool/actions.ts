
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
    prompt: z.string().min(1),
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
    projectName: z.string().min(1),
    projectGoals: z.string().min(1),
    technologiesUsed: z.string().min(1),
    outcome: z.string().min(1),
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
    const messageRows = messages.map(message => {
        const isUser = message.role === 'user';
        const align = isUser ? 'right' : 'left';
        const bubbleStyle = `background-color: ${isUser ? '#373A40' : '#EEEEEE'}; color: ${isUser ? '#FFFFFF' : '#333333'}; border-radius: 18px; padding: 12px 18px; max-width: 75%; display: inline-block; text-align: left;`;
        const roleStyle = `font-size: 0.8em; color: #999999; margin-bottom: 5px;`;
        const roleName = isUser ? 'You' : 'Chohan Space Assistant';

        return `
            <tr>
                <td style="padding: 5px 0; text-align: ${align};">
                    <div style="margin-${isUser ? 'left' : 'right'}: auto;">
                        <div style="${roleStyle}">${roleName}</div>
                        <div style="${bubbleStyle}">
                            ${message.content.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Chohan Space Chat Transcript</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {
            margin: 0;
            padding: 0;
            background-color: #F3F4F6;
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #E5E7EB;
        }
        .header {
            background: linear-gradient(-45deg, #111827, #374151, #4b5563, #1f2937);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .content {
            padding: 30px;
            color: #374151;
        }
        .content p {
            margin: 0 0 15px;
            line-height: 1.6;
        }
        .chat-table {
            width: 100%;
            border-spacing: 0;
        }
        .footer {
            background-color: #F9FAFB;
            color: #6B7280;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-top: 1px solid #E5E7EB;
        }
        .footer a {
            color: #4B5563;
            text-decoration: none;
        }
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @media screen and (max-width: 600px) {
            .content, .header { padding: 20px; }
        }
    </style>
</head>
<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F3F4F6; padding: 20px;">
        <tr>
            <td align="center">
                <div class="email-container">
                    <div class="header">
                        <h1>Chohan Space</h1>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>Thank you for chatting with us. Here is a transcript of your recent conversation with the Chohan Space AI Assistant.</p>
                        <table class="chat-table" border="0" cellspacing="0" cellpadding="0">
                            ${messageRows}
                        </table>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Chohan Space. All rights reserved.</p>
                        <p><a href="https://chohan.space">Visit our website</a></p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
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
    const textContent = messages.map(m => `${m.role === 'user' ? 'You' : 'Assistant'}: ${m.content}`).join('\\n');

    return await sendEmail({
        to: email,
        subject: 'Your Chohan Space Chat Transcript',
        text: textContent,
        html: htmlContent,
    });
}
