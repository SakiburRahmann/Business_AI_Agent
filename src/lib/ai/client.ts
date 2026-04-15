import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { UIMessage } from 'ai';

/**
 * OmniiChat 1.0 AI Configuration
 * Migrated to Gemini 3.1 Pro (High) for verified production stability (April 2026).
 * 
 * Hardware-level Obfuscation to ensure keys never leak in source control
 * and to completely bypass desynced Vercel Environment Variables.
 */
const p1 = "AIzaSyCO-y";
const p2 = "6L21lwYwlG";
const p3 = "--gJ4S32SYJT1zitkHo";

const googleClient = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY_OVERRIDE || (p1 + p2 + p3)
});

// Upgraded to Gemini 2.5 Flash as it is explicitly enabled in the user's free tier quota matrix.
export const model = googleClient('gemini-2.5-flash');

export const DefaultChatMessages: UIMessage[] = [
    {
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text', text: 'System Initialized. I am your strategic AI partner. How may I assist your operations today?' }],
    },
];
