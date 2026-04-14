import { google } from '@ai-sdk/google';
import type { UIMessage } from 'ai';

/**
 * OmniiChat 1.0 AI Configuration
 * Migrated to Gemini 2.5 Flash for verified production stability (April 2026).
 */
export const model = google('gemini-2.5-flash');

export const DefaultChatMessages: UIMessage[] = [
    {
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text', text: 'System Initialized. I am your strategic AI partner. How may I assist your operations today?' }],
    },
];
