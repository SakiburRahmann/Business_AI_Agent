import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { UIMessage } from 'ai';

/**
 * OmniiChat 2.0 - AI Configuration
 */

const googleClient = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY_OVERRIDE
});

// Using Gemma 4 31B because it has unlimited TPM and generous 1.5K RPD quota on the free tier.
// The user explicitly verified this in the AI Studio quota dashboard.
export const model = googleClient('gemma-4-31b-it');

export const DefaultChatMessages: UIMessage[] = [
    {
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text', text: 'Hello! I am OmniiAi. How can I help you today?' }],
    },
];
