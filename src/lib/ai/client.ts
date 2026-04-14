import { createGoogleGenerativeAI } from '@ai-sdk/google';

/**
 * OmniiChat 1.0 AI Configuration
 * Gemini 2.0 Flash - The Speed King
 */
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const model = google('gemini-1.5-flash');
