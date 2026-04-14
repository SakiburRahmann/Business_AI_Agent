import { google } from '@ai-sdk/google';

/**
 * OmniiChat 1.0 AI Configuration
 * Locked to Gemini 1.5 Flash for Max Stability
 */
export const model = google('gemini-1.5-flash');
