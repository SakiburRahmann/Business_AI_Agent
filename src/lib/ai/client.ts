import { google } from '@ai-sdk/google';

/**
 * OmniiChat 1.0 AI Configuration
 * Migrated to Gemini 2.5 Flash for verified production stability (April 2026).
 */
export const model = google('gemini-2.5-flash');

export const DefaultChatMessages = [
    {
        id: 'welcome',
        role: 'assistant' as const,
        parts: [{ type: 'text', text: 'System Initialized. I am your strategic AI partner. How may I assist your operations today?' }],
    },
];
