import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { UIMessage } from 'ai';

/**
 * OmniiChat 2.0 - Multi-Model AI Engine
 * Implements automatic model fallback when quota limits are hit.
 * 
 * Model Priority Chain:
 * 1. Gemma 4 31B (Primary - Unlimited TPM, 1.5K RPD)
 * 2. Gemini 2.5 Flash Lite (Backup - 10 RPM, 250K TPM)
 * 3. Gemini 2.5 Flash (Fallback - 5 RPM, 250K TPM)
 * 4. Gemini 3.1 Flash Lite (Last Resort - 15 RPM, 250K TPM)
 */

const googleClient = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY_OVERRIDE
});

// Ordered by preference: best available free-tier quota first
export const MODEL_CASCADE = [
  { id: 'gemma-4-31b-it',               name: 'Gemma 4 31B' },
  { id: 'gemini-2.5-flash-lite',        name: 'Gemini 2.5 Flash Lite' },
  { id: 'gemini-2.5-flash',             name: 'Gemini 2.5 Flash' },
  { id: 'gemini-3.1-flash-lite-preview', name: 'Gemini 3.1 Flash Lite' },
] as const;

// Helper to create a model instance by cascade index
export function getModel(index: number = 0) {
  const safeIndex = Math.min(index, MODEL_CASCADE.length - 1);
  return googleClient(MODEL_CASCADE[safeIndex].id);
}

// Default model (first in cascade)
export const model = googleClient(MODEL_CASCADE[0].id);

export const DefaultChatMessages: UIMessage[] = [
    {
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text', text: 'System Initialized. I am your strategic AI partner. How may I assist your operations today?' }],
    },
];
