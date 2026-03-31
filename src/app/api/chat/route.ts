import { model } from '@/lib/ai/client';
import { streamText, convertToCoreMessages } from 'ai';

/**
 * OmniiChat 1.0 - Unified Response Engine
 * Priority: Instant character-by-character delivery.
 */
export const maxDuration = 60; // Max edge runtime duration

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await streamText({
    model,
    system: `
      You are OmniiChat 1.0, a world-class AI conversationalist.
      
      CORE BEHAVIOR:
      1. Talk exactly like Gemini 1.5 Pro or ChatGPT-4.
      2. provide helpful, intelligent, and insightful responses.
      3. Use markdown for beautiful formatting (code blocks, bold, lists).
      4. Avoid unnecessary fluff. Be direct and premium.
      
      PERSONALITY:
      - Sophisticated, professional, yet approachable.
      - Intelligent and systems-aware.
    `,
    messages: convertToCoreMessages(messages),
  });

  return response.toDataStreamResponse();
}
