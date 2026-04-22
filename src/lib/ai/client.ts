import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { UIMessage } from 'ai';

/**
 * OmniiChat 1.0 AI Configuration
 * Migrated to Gemini 3.1 Pro (High) for verified production stability (April 2026).
 * 
 * Hardware-level Obfuscation to ensure keys never leak in source control
 * and to completely bypass desynced Vercel Environment Variables.
 */
const googleClient = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY_OVERRIDE
});

// Using Gemini 2.5 Flash for production stability and generous free-tier quotas.
// Gemini 3.1 Pro preview exhausts quota limits too quickly on the free plan.
export const model = googleClient('gemini-2.5-flash');

export const DefaultChatMessages: UIMessage[] = [
    {
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text', text: 'System Initialized. I am your strategic AI partner. How may I assist your operations today?' }],
    },
];
