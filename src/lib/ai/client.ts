import { google } from '@ai-sdk/google';

/**
 * OmniiChat 1.0 AI Configuration
 * Using Gemini 2.0 Flash for production stability and performance.
 */
export const model = google('gemini-2.0-flash');
