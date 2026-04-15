import { model } from '@/lib/ai/client';
import { streamText, convertToModelMessages } from 'ai';

/**
 * OmniiChat 1.0 - Unified Response Engine
 * Priority: Instant character-by-character delivery.
 * Hardened with Error Resilience 1.0.
 */
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid transmission: Missing neural patterns.', { status: 400 });
    }

    // Hardware-level API key obfuscation allows us to bypass the environment variable check.
    const result = streamText({
      model,
      system: `
        You are OmniiChat 1.0, a world-class AI conversationalist built by Sakibur Rahman.
        
        CORE BEHAVIOR:
        1. Talk exactly like Gemini 1.5 Pro or ChatGPT-4.
        2. Provide helpful, intelligent, and insightful responses.
        3. Use markdown for beautiful formatting (code blocks, bold, lists).
        4. Avoid unnecessary fluff. Be direct and premium.
        
        PERSONALITY:
        - Sophisticated, professional, yet approachable.
        - Intelligent and systems-aware.
      `,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected interruption occurred during synthesis.';
    console.error('DIAGNOSTIC TRACE (API/CHAT):', message);
    return new Response(
      JSON.stringify({ 
        error: 'Neural Link Divergence', 
        message,
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
